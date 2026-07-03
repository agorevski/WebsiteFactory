import type { ComponentContentSignal } from '@website-factory/components/marketplace';
import { countUniversalLegacySections, createContentInventory } from './inventory.js';
import type {
  ContentInventory,
  ContentSignalSummary,
  GenerationContentSignal,
  GenerationDiagnostic,
  GeneratorInput,
  InferContentSignalsOptions
} from './types.js';

interface SignalAccumulator {
  readonly id: ComponentContentSignal;
  score: number;
  readonly sources: Set<string>;
  readonly reasons: Set<string>;
}

function signalStrength(score: number): GenerationContentSignal['strength'] {
  if (score >= 8) {
    return 'strong';
  }

  if (score >= 4) {
    return 'medium';
  }

  return 'weak';
}

function addSignal(
  signals: Map<ComponentContentSignal, SignalAccumulator>,
  id: ComponentContentSignal,
  score: number,
  source: string,
  reason: string
): void {
  const current = signals.get(id);
  if (current) {
    current.score += score;
    current.sources.add(source);
    current.reasons.add(reason);
    return;
  }

  signals.set(id, {
    id,
    score,
    sources: new Set([source]),
    reasons: new Set([reason])
  });
}

function addMany(
  signals: Map<ComponentContentSignal, SignalAccumulator>,
  ids: readonly ComponentContentSignal[],
  score: number,
  source: string,
  reason: string
): void {
  for (const id of ids) {
    addSignal(signals, id, score, source, reason);
  }
}

function normalizeSignals(signals: Map<ComponentContentSignal, SignalAccumulator>): readonly GenerationContentSignal[] {
  return [...signals.values()]
    .map((signal) => ({
      id: signal.id,
      strength: signalStrength(signal.score),
      score: signal.score,
      sources: [...signal.sources].sort(),
      reasons: [...signal.reasons].sort()
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.id.localeCompare(right.id);
    });
}

function addDiagnostic(diagnostics: GenerationDiagnostic[], code: string, message: string, source: string): void {
  diagnostics.push({
    code,
    severity: 'info',
    message,
    source,
    path: []
  });
}

function inferTrustSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  if (inventory.credentials + inventory.awards + inventory.certifications > 0) {
    addMany(signals, ['trustCredentials', 'brandTrust', 'professionalProof'], 5, 'content.credentials', 'Credentials, awards, or certifications are available for trust-proof sections.');
  }

  if (inventory.regulatedContent) {
    addSignal(signals, 'regulatedContent', 4, 'content.compliance', 'The vertical or compliance data requires regulated-content awareness.');
  }
}

function inferCommerceSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  const pricingCount = inventory.pricingOptions + inventory.pricingGroups + inventory.memberships + inventory.subscriptions;
  const catalogCount = inventory.products + inventory.productCatalogs + inventory.menus;

  if (pricingCount > 0) {
    addMany(signals, ['pricingClarity', 'transactional'], 5, 'content.pricing', 'Pricing, plans, subscriptions, or memberships are available.');
  }

  if (pricingCount > 1) {
    addSignal(signals, 'comparison', 4, 'content.pricing', 'Multiple plans or price options can support comparison layouts.');
  }

  if (catalogCount > 0) {
    addMany(signals, ['catalog', 'commerce', 'transactional'], 5, 'content.products', 'Product, catalog, menu, or commerce-oriented data is available.');
  }
}

function inferEditorialSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  const editorialCount = inventory.articles + inventory.posts + inventory.docs;
  if (editorialCount === 0) {
    return;
  }

  addMany(signals, ['editorial', 'articleList', 'freshness'], 5, 'content.articles', 'Article, blog, news, or documentation content is available.');

  if (editorialCount > 2 || inventory.docs > 0) {
    addMany(signals, ['longCopy', 'navigationAid', 'pageHierarchy'], 4, 'content.articles', 'Long-form or nested editorial content benefits from navigation aids.');
  }
}

function inferLocalSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  if (inventory.contactPoints > 0 || inventory.hasAddress) {
    addMany(signals, ['contactIntent', 'multiChannel'], 5, 'content.contacts', 'Contact methods or address data are available.');
  }

  if (inventory.locations > 1) {
    addMany(signals, ['multiLocation', 'localDiscovery'], 6, 'content.locations', 'Multiple locations can support a location directory or discovery section.');
  } else if (inventory.locations === 1 || inventory.hasAddress) {
    addSignal(signals, 'localDiscovery', 3, 'content.locations', 'Location or address data can support local discovery.');
  }

  if (inventory.hasHours) {
    addMany(signals, ['availability', 'localDiscovery'], 4, 'content.hours', 'Hours data can support opening-hours and availability sections.');
  }
}

function inferMediaSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  if (inventory.mediaAssets + inventory.images + inventory.videos + inventory.galleries === 0) {
    return;
  }

  addSignal(signals, 'mediaAvailable', 5, 'content.media', 'Media assets are available.');

  if (inventory.images + inventory.galleries > 0) {
    addMany(signals, ['imageHeavy', 'projectShowcase'], 4, 'content.media', 'Image assets or galleries can support visual showcase sections.');
  }

  if (inventory.videos > 0) {
    addSignal(signals, 'videoAvailable', 5, 'content.media', 'Video assets are available.');
  }
}

function inferConversionSignals(signals: Map<ComponentContentSignal, SignalAccumulator>, inventory: ContentInventory): void {
  if (inventory.hasBooking || inventory.hasAppointments || inventory.hasReservations || inventory.forms > 0) {
    addMany(signals, ['primaryConversion', 'appointmentIntent', 'availability'], 5, 'content.booking', 'Booking, reservation, appointment, or form data is available.');
  }

  if (inventory.events + inventory.courses > 0) {
    addMany(signals, ['timeSensitive', 'leadCapture', 'transactional'], 4, 'content.events', 'Events or courses can support registration, newsletter, and booking flows.');
  }
}

export function inferContentSignals(input: GeneratorInput, options: InferContentSignalsOptions = {}): ContentSignalSummary {
  const inventory = createContentInventory(input);
  const signals = new Map<ComponentContentSignal, SignalAccumulator>();
  const diagnostics: GenerationDiagnostic[] = [];

  addMany(signals, ['primaryMessage', 'shortCopy'], 3, 'business', 'Business identity and hero content can support a primary message.');

  if (inventory.services > 0 || (options.includeLegacySections && countUniversalLegacySections(input, 'services') > 0)) {
    addMany(signals, ['serviceCatalog', 'featureHighlights'], 6, 'content.services', 'Service data is available.');
    if (inventory.hasBooking || inventory.hasAppointments || inventory.contactPoints > 0) {
      addSignal(signals, 'appointmentIntent', 3, 'content.services', 'Service data has appointment or contact paths.');
    }
  } else {
    addDiagnostic(diagnostics, 'generator.omit.services.missing-data', 'Services section candidates were omitted because no service data was available.', 'content.services');
  }

  const peopleCount = inventory.people + inventory.staff;
  if (peopleCount > 0) {
    addMany(signals, ['peopleProfiles', 'teamCredibility'], 6, 'content.people', 'People or staff profiles are available.');
    if (inventory.credentials + inventory.certifications + inventory.awards > 0) {
      addSignal(signals, 'trustCredentials', 3, 'content.people', 'People profiles are connected with credentials or recognition.');
    }
  } else {
    addDiagnostic(diagnostics, 'generator.omit.team.missing-data', 'Team/staff section candidates were omitted because no people data was available.', 'content.people');
  }

  if (inventory.testimonials + inventory.reviews > 0) {
    addMany(signals, ['socialProof', 'quotes'], 6, 'content.reviews', 'Testimonials or reviews are available.');
    if (inventory.reviews > 0) {
      addSignal(signals, 'ratings', 5, 'content.reviews', 'Review data can include rating summaries.');
    }
  } else {
    addDiagnostic(diagnostics, 'generator.omit.social-proof.missing-data', 'Social-proof section candidates were omitted because no testimonials or reviews were available.', 'content.reviews');
  }

  if (inventory.faq > 0) {
    addMany(signals, ['supportQuestions', 'longCopy', 'userSupport'], 5, 'content.faq', 'FAQ data is available.');
  } else {
    addDiagnostic(diagnostics, 'generator.omit.faq.missing-data', 'FAQ section candidates were omitted because no FAQ data was available.', 'content.faq');
  }

  inferTrustSignals(signals, inventory);
  inferCommerceSignals(signals, inventory);
  inferEditorialSignals(signals, inventory);
  inferLocalSignals(signals, inventory);
  inferMediaSignals(signals, inventory);
  inferConversionSignals(signals, inventory);

  if (inventory.legalNotices > 0) {
    addMany(signals, ['legalCompliance', 'privacyNotice'], 4, 'content.legal', 'Legal notices, disclaimers, or compliance copy are available.');
  }

  if (inventory.careers > 0) {
    addMany(signals, ['hiring', 'peopleProfiles', 'resourceLibrary'], 4, 'content.careers', 'Career openings can support recruiting sections.');
  }

  const normalizedSignals = normalizeSignals(signals);

  return {
    inventory,
    signals: normalizedSignals,
    signalIds: normalizedSignals.map((signal) => signal.id),
    diagnostics
  };
}
