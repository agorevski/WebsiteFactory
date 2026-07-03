import type { SectionComponentName } from '@website-factory/components';
import type { ThemeName } from '@website-factory/themes';
import type { SchemaSectionType, TemplateAudience, TemplateLayout, TemplateSectionDefinition, TemplateSlot, WebsiteTemplate } from './types.js';

interface SectionOptions {
  readonly required?: boolean;
  readonly repeatable?: boolean;
  readonly acceptsSchemaVariants?: readonly string[];
  readonly purpose?: string;
}

function section(
  id: string,
  schemaType: SchemaSectionType | string,
  component: SectionComponentName,
  variant: string,
  slot: TemplateSlot,
  order: number,
  options: SectionOptions = {}
): TemplateSectionDefinition {
  const definition: TemplateSectionDefinition = {
    id,
    schemaType,
    component,
    variant,
    slot,
    order,
    required: options.required ?? false
  };

  return {
    ...definition,
    ...(options.repeatable !== undefined ? { repeatable: options.repeatable } : {}),
    ...(options.acceptsSchemaVariants !== undefined ? { acceptsSchemaVariants: options.acceptsSchemaVariants } : {}),
    ...(options.purpose !== undefined ? { purpose: options.purpose } : {})
  };
}

function template(
  id: string,
  name: string,
  audience: TemplateAudience,
  layout: TemplateLayout,
  defaultTheme: ThemeName,
  description: string,
  sections: readonly TemplateSectionDefinition[],
  tags: readonly string[]
): WebsiteTemplate {
  return {
    id,
    name,
    audience,
    layout,
    defaultTheme,
    description,
    sections: [...sections].sort((left, right) => left.order - right.order),
    tags
  };
}

export const templates = {
  modern: template(
    'modern',
    'Modern marketing site',
    'general',
    'landing-page',
    'modern',
    'Flexible conversion-focused layout for service, SaaS, and local business websites.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true, purpose: 'Primary value proposition and CTA.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('services', 'services', 'Services', 'cards', 'main', 40, { repeatable: true }),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 50),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 60),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 90, { required: true })
    ],
    ['marketing', 'conversion', 'responsive']
  ),
  classic: template(
    'classic',
    'Classic local business',
    'local-business',
    'multi-page',
    'classic',
    'Traditional information architecture for established businesses with strong trust signals.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 30, { required: true, repeatable: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 40),
      section('reviews', 'reviews', 'Testimonials', 'quote', 'main', 50, { acceptsSchemaVariants: ['reviews', 'testimonials'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 60),
      section('contact', 'contact', 'Contact', 'card', 'main', 70, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 80, { required: true })
    ],
    ['local', 'trust', 'multi-page']
  ),
  medical: template(
    'medical',
    'Medical practice',
    'medical',
    'multi-page',
    'corporate',
    'Accessible, trust-forward layout for clinics, practices, and healthcare providers.',
    [
      section('emergency', 'emergencyBanner', 'EmergencyBanner', 'sticky', 'utility', 5),
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Treatments, specialties, and patient services.' }),
      section('team', 'team', 'Team', 'cards', 'main', 50),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 60),
      section('hours', 'hours', 'Hours', 'compact', 'main', 70, { required: true }),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 90, { required: true })
    ],
    ['healthcare', 'accessibility', 'appointments']
  ),
  restaurant: template(
    'restaurant',
    'Restaurant and hospitality',
    'restaurant',
    'single-page',
    'playful',
    'Image-led layout for restaurants, cafes, bars, and hospitality businesses.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 40, { purpose: 'Menu highlights, catering, private events, or ordering options.' }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 50),
      section('hours', 'hours', 'Hours', 'default', 'main', 60, { required: true }),
      section('contact', 'contact', 'Contact', 'split', 'main', 70, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 80, { required: true })
    ],
    ['food', 'hospitality', 'visual']
  ),
  localBusiness: template(
    'localBusiness',
    'Local service business',
    'local-business',
    'single-page',
    'modern',
    'Practical single-page service layout for trades, home services, and appointment businesses.',
    [
      section('emergency', 'emergencyBanner', 'EmergencyBanner', 'default', 'utility', 5),
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'default', 'main', 25),
      section('services', 'services', 'Services', 'cards', 'main', 30, { required: true, repeatable: true }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 40, { required: true }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 50),
      section('contact', 'contact', 'Contact', 'card', 'main', 60, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 70, { required: true })
    ],
    ['services', 'lead-generation', 'single-page']
  ),
  onePage: template(
    'onePage',
    'One page brochure',
    'one-page',
    'single-page',
    'minimal',
    'Lean brochure layout that keeps content focused and navigation simple.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10),
      section('hero', 'hero', 'Hero', 'compact', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 30),
      section('gallery', 'gallery', 'Gallery', 'grid', 'main', 40),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 50),
      section('contact', 'contact', 'Contact', 'centered', 'main', 60, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 70)
    ],
    ['minimal', 'fast', 'brochure']
  ),
  luxuryService: template(
    'luxuryService',
    'Luxury service brand',
    'hospitality',
    'landing-page',
    'luxury',
    'Premium layout for boutique hospitality, events, wellness, and high-end services.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30),
      section('services', 'services', 'Services', 'featured', 'main', 40, { required: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 50),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['premium', 'boutique', 'visual']
  ),
  emergencyService: template(
    'emergencyService',
    'Emergency service responder',
    'local-business',
    'single-page',
    'trade-pro',
    'Urgent, contact-forward layout for repair, restoration, towing, and other fast-response local services.',
    [
      section('emergency', 'emergencyBanner', 'EmergencyBanner', 'sticky', 'utility', 5, { required: true, purpose: 'Persistent urgent phone and dispatch CTA.' }),
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('hours', 'hours', 'Hours', 'compact', 'main', 50, { required: true }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['emergency', 'local-service', 'urgent-cta']
  ),
  appointmentClinic: template(
    'appointmentClinic',
    'Appointment clinic',
    'medical',
    'landing-page',
    'clinic-showcase',
    'Appointment-led clinic layout for practices that need patient trust, provider context, and booking clarity.',
    [
      section('emergency', 'emergencyBanner', 'EmergencyBanner', 'default', 'utility', 5),
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('team', 'team', 'Team', 'cards', 'main', 50, { purpose: 'Providers, clinicians, and care team profiles.' }),
      section('booking', 'contact', 'Contact', 'split', 'main', 60, { required: true, purpose: 'Scheduling, phone, and appointment intake options.' }),
      section('hours', 'hours', 'Hours', 'compact', 'main', 70),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 80),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 90, { required: true })
    ],
    ['appointments', 'clinic', 'healthcare']
  ),
  contractorPortfolio: template(
    'contractorPortfolio',
    'Contractor portfolio',
    'local-business',
    'multi-page',
    'construction',
    'Project-forward contractor layout that balances service coverage, completed work, process education, and quote requests.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('portfolio', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Completed projects, before-and-after proof, and workmanship galleries.' }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('process', 'services', 'Services', 'list', 'main', 50, { purpose: 'Estimate, planning, build, and handoff steps.' }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['contractor', 'portfolio', 'estimates']
  ),
  neighborhoodShop: template(
    'neighborhoodShop',
    'Neighborhood shop',
    'local-business',
    'single-page',
    'coffeeShop',
    'Compact local retail layout for shops, cafes, studios, and neighborhood destinations with hours and visit details.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 30, { required: true, purpose: 'Featured products, categories, or customer favorites.' }),
      section('gallery', 'gallery', 'Gallery', 'grid', 'main', 40),
      section('reviews', 'reviews', 'Testimonials', 'quote', 'main', 50, { acceptsSchemaVariants: ['testimonials'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 60, { required: true }),
      section('contact', 'contact', 'Contact', 'card', 'main', 70, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 80, { required: true })
    ],
    ['retail', 'neighborhood', 'hours']
  ),
  multiLocationService: template(
    'multiLocationService',
    'Multi-location service',
    'local-business',
    'directory-ready',
    'trade-pro',
    'Directory-ready service layout for businesses that need location discovery, coverage areas, and central lead capture.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('locations', 'contact', 'Contact', 'split', 'main', 30, { required: true, repeatable: true, purpose: 'Location cards, service areas, maps, and routing details.' }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 50),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['multi-location', 'directory', 'service-area']
  ),
  authorityPractice: template(
    'authorityPractice',
    'Authority practice',
    'professional-services',
    'multi-page',
    'lawFirm',
    'Credibility-first professional practice layout with expertise, credentials, proof, and structured consultation paths.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 50, { purpose: 'Partners, principals, credentials, and subject-matter authority.' }),
      section('proof', 'reviews', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['authority', 'professional-services', 'consultation']
  ),
  consultantLeadGen: template(
    'consultantLeadGen',
    'Consultant lead generation',
    'professional-services',
    'landing-page',
    'professional-trust',
    'Focused consulting funnel layout for explaining offers, qualifying leads, and routing prospects to consultation requests.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'default', 'main', 30),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('process', 'services', 'Services', 'list', 'main', 50, { purpose: 'Discovery, audit, strategy, and implementation steps.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 70),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 80),
      section('contact', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 100, { required: true })
    ],
    ['consulting', 'lead-generation', 'funnel']
  ),
  caseStudyFirm: template(
    'caseStudyFirm',
    'Case study firm',
    'professional-services',
    'multi-page',
    'creativeAgency',
    'Outcome-led agency or firm layout that puts case studies, capabilities, proof, and inquiry flow in a reusable structure.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('caseStudies', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Case-study teasers, project images, and outcome summaries.' }),
      section('services', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 50),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['case-studies', 'agency', 'proof']
  ),
  advisorTrust: template(
    'advisorTrust',
    'Advisor trust',
    'professional-services',
    'multi-page',
    'financialAdvisor',
    'Trust-centered advisor layout for regulated or relationship-heavy services with credentials, team, FAQs, and contact paths.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 50),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['advisor', 'trust', 'regulated']
  ),
  recruitingAgency: template(
    'recruitingAgency',
    'Recruiting agency',
    'professional-services',
    'landing-page',
    'professional-trust',
    'Recruiting and staffing layout for employer services, candidate pathways, team credibility, and contact conversion.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Hiring, staffing, placement, and advisory service paths.' }),
      section('careers', 'services', 'Services', 'list', 'main', 50, { purpose: 'Candidate resources, open-role categories, or application pathways.' }),
      section('team', 'team', 'Team', 'compact', 'main', 60),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 80),
      section('contact', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 100, { required: true })
    ],
    ['recruiting', 'staffing', 'hiring']
  ),
  chefStory: template(
    'chefStory',
    'Chef story',
    'restaurant',
    'single-page',
    'fineDining',
    'Editorial restaurant layout for chef-led concepts that need food imagery, story, menus, reviews, and reservations.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 40, { purpose: 'Menu highlights, tasting menus, catering, or private dining.' }),
      section('team', 'team', 'Team', 'profiles', 'main', 50, { purpose: 'Chef, owner, or hospitality team story.' }),
      section('reviews', 'reviews', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 70, { required: true }),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['chef-led', 'restaurant', 'story']
  ),
  eventVenue: template(
    'eventVenue',
    'Event venue',
    'hospitality',
    'landing-page',
    'hospitality-editorial',
    'Visual event venue layout for spaces, packages, testimonials, availability questions, and event inquiries.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'cards', 'main', 40, { required: true, purpose: 'Venue spaces, event types, services, and amenities.' }),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 50),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['events', 'venue', 'inquiries']
  ),
  hotelExperience: template(
    'hotelExperience',
    'Hotel experience',
    'hospitality',
    'multi-page',
    'luxuryHotel',
    'Experience-led hotel layout for rooms, amenities, dining, reviews, FAQs, and booking contact paths.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 40, { required: true, repeatable: true, purpose: 'Rooms, amenities, dining, wellness, and local experiences.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 50),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['hotel', 'experience', 'booking']
  ),
  wellnessSpa: template(
    'wellnessSpa',
    'Wellness spa',
    'hospitality',
    'landing-page',
    'elegant',
    'Calm wellness and spa layout for treatments, practitioner trust, visual atmosphere, packages, and bookings.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 30, { required: true, repeatable: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 40),
      section('team', 'team', 'Team', 'profiles', 'main', 50),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 70),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 80),
      section('contact', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 100, { required: true })
    ],
    ['wellness', 'spa', 'appointments']
  ),
  galleryFirstBrand: template(
    'galleryFirstBrand',
    'Gallery-first brand',
    'general',
    'single-page',
    'photographyPortfolio',
    'Visual-first brand layout for portfolios, makers, studios, and image-led services with lightweight conversion paths.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 40),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 50, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 60),
      section('contact', 'contact', 'Contact', 'centered', 'main', 70, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 80, { required: true })
    ],
    ['portfolio', 'gallery', 'visual']
  ),
  productLaunch: template(
    'productLaunch',
    'Product launch',
    'general',
    'landing-page',
    'startup',
    'Launch-focused layout for products and SaaS offers with features, proof, pricing, FAQs, and demo requests.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('features', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Product benefits, capabilities, integrations, and use cases.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 50, { acceptsSchemaVariants: ['reviews'] }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 60),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['product', 'launch', 'saas']
  ),
  featureComparison: template(
    'featureComparison',
    'Feature comparison',
    'general',
    'landing-page',
    'modernSaaS',
    'Comparison-driven product layout for clarifying feature groups, tiers, proof, and evaluation questions.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('features', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('comparison', 'pricing', 'Pricing', 'cards', 'main', 50, { purpose: 'Plans, packages, or feature comparisons.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['comparison', 'features', 'evaluation']
  ),
  pricingFocused: template(
    'pricingFocused',
    'Pricing-focused landing page',
    'general',
    'landing-page',
    'stripeInspired',
    'Offer-led layout for pricing transparency, plan selection, FAQs, proof, and direct purchase or sales contact paths.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 40, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 50, { purpose: 'Included features, add-ons, or package benefits.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['pricing', 'plans', 'conversion']
  ),
  docsMarketing: template(
    'docsMarketing',
    'Documentation marketing',
    'general',
    'multi-page',
    'technicalDocumentation',
    'Docs-aware marketing layout for technical products that need clear entry points, resource navigation, and support contact.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'compact', 'main', 20, { required: true }),
      section('resources', 'services', 'Services', 'list', 'main', 30, { required: true, repeatable: true, purpose: 'Documentation categories, guides, API references, or learning paths.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 40),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 50),
      section('contact', 'contact', 'Contact', 'centered', 'main', 60, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 70, { required: true })
    ],
    ['documentation', 'technical', 'resources']
  ),
  waitlistLanding: template(
    'waitlistLanding',
    'Waitlist landing page',
    'general',
    'landing-page',
    'dark',
    'Lean prelaunch layout for collecting interest, explaining benefits, showing proof, and answering early objections.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('features', 'services', 'Services', 'cards', 'main', 40, { required: true, purpose: 'Launch benefits, early-access perks, and target use cases.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 50, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 60),
      section('contact', 'contact', 'Contact', 'centered', 'main', 70, { required: true, purpose: 'Waitlist form, email signup, or launch notification CTA.' }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 80, { required: true })
    ],
    ['waitlist', 'prelaunch', 'email-capture']
  ),
  resourceHub: template(
    'resourceHub',
    'Resource hub',
    'general',
    'directory-ready',
    'technicalDocumentation',
    'Resource-library layout for hubs, guides, downloads, and knowledge centers with directory-style discovery.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'compact', 'main', 20, { required: true }),
      section('resources', 'services', 'Services', 'cards', 'main', 30, { required: true, repeatable: true, purpose: 'Resource categories, featured guides, downloads, and topic collections.' }),
      section('featured', 'gallery', 'Gallery', 'grid', 'main', 40, { purpose: 'Featured resources, article cards, or visual topic tiles.' }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 50),
      section('contact', 'contact', 'Contact', 'centered', 'main', 60, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 70, { required: true })
    ],
    ['resources', 'hub', 'directory']
  ),
  localDirectory: template(
    'localDirectory',
    'Local directory',
    'local-business',
    'directory-ready',
    'classic',
    'Local directory layout for service-area pages, neighborhood listings, hours, reviews, and location contact details.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('categories', 'services', 'Services', 'list', 'main', 30, { required: true, repeatable: true, purpose: 'Directory categories, service-area entries, or local listings.' }),
      section('locations', 'contact', 'Contact', 'split', 'main', 40, { required: true, repeatable: true }),
      section('hours', 'hours', 'Hours', 'compact', 'main', 50),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 80, { required: true })
    ],
    ['local-directory', 'locations', 'service-area']
  ),
  classSchedule: template(
    'classSchedule',
    'Class schedule',
    'one-page',
    'single-page',
    'yogaStudio',
    'Schedule-forward class layout for studios, gyms, schools, and workshops with offerings, hours, pricing, and signup.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('classes', 'services', 'Services', 'cards', 'main', 30, { required: true, repeatable: true, purpose: 'Classes, workshops, tracks, or program offerings.' }),
      section('schedule', 'hours', 'Hours', 'default', 'main', 40, { required: true }),
      section('team', 'team', 'Team', 'compact', 'main', 50),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 60),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['classes', 'schedule', 'membership']
  ),
  membershipCommunity: template(
    'membershipCommunity',
    'Membership community',
    'general',
    'landing-page',
    'playful',
    'Community layout for memberships, clubs, cohorts, and programs with benefits, tiers, proof, FAQs, and signup.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30),
      section('benefits', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 50, { purpose: 'Membership tiers, plans, or contribution levels.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 90, { required: true })
    ],
    ['membership', 'community', 'signup']
  ),
  nonprofitCampaign: template(
    'nonprofitCampaign',
    'Nonprofit campaign',
    'general',
    'landing-page',
    'nonprofit',
    'Campaign-focused nonprofit layout for mission storytelling, program impact, donations, FAQs, and volunteer contact.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true }),
      section('programs', 'services', 'Services', 'featured', 'main', 40, { required: true, repeatable: true }),
      section('impact', 'testimonials', 'Testimonials', 'quote', 'main', 50, { acceptsSchemaVariants: ['reviews'], purpose: 'Impact stories, beneficiary quotes, and campaign proof.' }),
      section('donation', 'pricing', 'Pricing', 'simple', 'main', 60, { purpose: 'Donation levels, sponsorship tiers, or campaign goals.' }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['nonprofit', 'campaign', 'donations']
  ),
  aiProductLab: template(
    'aiProductLab',
    'AI product lab',
    'general',
    'landing-page',
    'auroraGlass',
    'Immersive AI product launch layout for app positioning, integration proof, plan comparison, and demo conversion.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true, purpose: 'Interactive app value proposition with product-led CTA.' }),
      section('productTour', 'gallery', 'Gallery', 'featured', 'main', 30, { purpose: 'Screenshots, workflow previews, or model output examples.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 40),
      section('features', 'services', 'Services', 'cards', 'main', 50, { required: true, repeatable: true, purpose: 'AI capabilities, use cases, and product modules.' }),
      section('integrations', 'services', 'Services', 'list', 'main', 60, { purpose: 'Connected tools, data sources, automations, and platform ecosystem.' }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 70),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 80),
      section('demo', 'contact', 'Contact', 'centered', 'main', 90, { required: true, purpose: 'Demo request, product inquiry, or early access conversion.' }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 100, { required: true })
    ],
    ['ai', 'product-launch', 'demo']
  ),
  brutalistStudio: template(
    'brutalistStudio',
    'Brutalist studio',
    'professional-services',
    'multi-page',
    'brutalistMono',
    'Stark studio layout for creative and architecture practices that lead with work, process, and direct inquiries.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('workWall', 'gallery', 'Gallery', 'grid', 'main', 30, { required: true, purpose: 'Case-study index, project wall, or visual portfolio.' }),
      section('services', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true }),
      section('process', 'services', 'Services', 'featured', 'main', 50, { purpose: 'Research, concept, critique, documentation, and delivery rhythm.' }),
      section('team', 'team', 'Team', 'compact', 'main', 60),
      section('proof', 'testimonials', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['brutalist', 'studio', 'portfolio']
  ),
  neonNightclub: template(
    'neonNightclub',
    'Neon nightclub',
    'hospitality',
    'single-page',
    'cyberpunkNeon',
    'High-energy nightlife layout with urgent event promotion, visual atmosphere, ticket paths, hours, and guest contact.',
    [
      section('eventAlert', 'emergencyBanner', 'EmergencyBanner', 'sticky', 'utility', 5, { required: true, purpose: 'Tonight-only event, ticket, or reservation CTA.' }),
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('lineup', 'services', 'Services', 'featured', 'main', 30, { required: true, purpose: 'Upcoming events, performers, rooms, or VIP experiences.' }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 40, { required: true }),
      section('tickets', 'pricing', 'Pricing', 'cards', 'main', 50, { purpose: 'Cover, table, bottle-service, or ticket packages.' }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 70, { required: true }),
      section('contact', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['nightlife', 'events', 'tickets']
  ),
  botanicalRetreat: template(
    'botanicalRetreat',
    'Botanical retreat',
    'hospitality',
    'multi-page',
    'botanicalSerif',
    'Lush retreat layout for wellness hospitality with treatments, atmosphere, practitioners, packages, and booking flow.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'featured', 'main', 30, { required: true, repeatable: true, purpose: 'Retreat stays, treatments, classes, and seasonal experiences.' }),
      section('gallery', 'gallery', 'Gallery', 'grid', 'main', 40, { required: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 50, { purpose: 'Hosts, practitioners, guides, and hospitality team.' }),
      section('packages', 'pricing', 'Pricing', 'simple', 'main', 60),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 80),
      section('booking', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 100, { required: true })
    ],
    ['retreat', 'wellness', 'booking']
  ),
  fintechTrust: template(
    'fintechTrust',
    'Fintech trust',
    'professional-services',
    'landing-page',
    'neoBanking',
    'Regulated financial product layout that foregrounds trust, capabilities, pricing, compliance questions, and consult requests.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true, purpose: 'Security, compliance, partner, or credential proof.' }),
      section('solutions', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Financial workflows, product modules, or client segments.' }),
      section('controls', 'services', 'Services', 'list', 'main', 50, { purpose: 'Risk controls, onboarding steps, reporting, and governance details.' }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 60),
      section('proof', 'testimonials', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 80),
      section('consult', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 100, { required: true })
    ],
    ['fintech', 'trust', 'regulated']
  ),
  noirMagazine: template(
    'noirMagazine',
    'Noir magazine',
    'general',
    'directory-ready',
    'noirEditorial',
    'Editorial media layout for issue features, resource archives, visual storytelling, contributors, and newsletter signup.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'compact', 'main', 20, { required: true }),
      section('features', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Lead stories, issue covers, interviews, or visual essays.' }),
      section('archives', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Sections, columns, resource categories, or edition collections.' }),
      section('contributors', 'team', 'Team', 'compact', 'main', 50),
      section('reviews', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('newsletter', 'contact', 'Contact', 'centered', 'main', 80, { required: true, purpose: 'Newsletter signup, submissions, memberships, or media kit inquiries.' }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['editorial', 'magazine', 'newsletter']
  ),
  creatorLaunch: template(
    'creatorLaunch',
    'Creator launch',
    'one-page',
    'landing-page',
    'sunsetGradient',
    'Creator funnel layout for courses, cohorts, and communities with benefits, tiers, testimonials, and waitlist capture.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('benefits', 'services', 'Services', 'cards', 'main', 30, { required: true, repeatable: true }),
      section('curriculum', 'services', 'Services', 'list', 'main', 40, { purpose: 'Course modules, cohort schedule, community rituals, or creator resources.' }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 50, { required: true, purpose: 'Creator offers, membership levels, or course packages.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('waitlist', 'contact', 'Contact', 'centered', 'main', 80, { required: true, purpose: 'Launch waitlist, email signup, or cohort application.' }),
      section('footer', 'footer', 'Footer', 'columns', 'footer', 90, { required: true })
    ],
    ['creator', 'course', 'waitlist']
  ),
  industrialArchitect: template(
    'industrialArchitect',
    'Industrial architect',
    'professional-services',
    'multi-page',
    'industrialGrid',
    'Architecture and construction portfolio layout with structured navigation, project proof, process education, and quote requests.',
    [
      section('nav', 'navigation', 'Navigation', 'default', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('portfolio', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Built work, renderings, site studies, and project categories.' }),
      section('process', 'services', 'Services', 'list', 'main', 40, { required: true, purpose: 'Discovery, design development, approvals, construction, and handoff.' }),
      section('services', 'services', 'Services', 'cards', 'main', 50, { repeatable: true }),
      section('team', 'team', 'Team', 'profiles', 'main', 60),
      section('proof', 'reviews', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['testimonials'] }),
      section('quote', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['architecture', 'industrial', 'portfolio']
  ),
  popCommerce: template(
    'popCommerce',
    'Pop commerce',
    'local-business',
    'single-page',
    'candyPop',
    'Playful retail layout for product drops, featured collections, social proof, purchase paths, and store contact.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('drops', 'services', 'Services', 'featured', 'main', 30, { required: true, repeatable: true, purpose: 'Featured products, collections, bundles, or launch drops.' }),
      section('gallery', 'gallery', 'Gallery', 'grid', 'main', 40, { required: true }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 50, { acceptsSchemaVariants: ['testimonials'] }),
      section('offers', 'pricing', 'Pricing', 'simple', 'main', 60, { required: true, purpose: 'Product bundles, purchase options, or retail offers.' }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('contact', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['retail', 'product-drop', 'commerce']
  ),
  zenPractitioner: template(
    'zenPractitioner',
    'Zen practitioner',
    'one-page',
    'single-page',
    'zenInk',
    'Calm practitioner layout with centered positioning, service clarity, provider trust, FAQs, hours, and booking.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('services', 'services', 'Services', 'list', 'main', 30, { required: true, repeatable: true }),
      section('team', 'team', 'Team', 'compact', 'main', 40, { purpose: 'Practitioner background, credentials, and care approach.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 50),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 60),
      section('hours', 'hours', 'Hours', 'compact', 'main', 70),
      section('booking', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['practitioner', 'wellness', 'booking']
  ),
  immersiveSaasDashboard: template(
    'immersiveSaasDashboard',
    'Immersive SaaS dashboard',
    'general',
    'landing-page',
    'plasmaDashboard',
    'Product-led SaaS layout for app dashboards, technical resources, customer proof, pricing, and demo conversion.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true, purpose: 'Immersive dashboard positioning with a product demo CTA.' }),
      section('productTour', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Dashboard screenshots, workflow previews, and app states.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 40),
      section('features', 'services', 'Services', 'cards', 'main', 50, { required: true, repeatable: true, purpose: 'Dashboard modules, automation capabilities, and product use cases.' }),
      section('resources', 'services', 'Services', 'list', 'main', 60, { purpose: 'Docs, guides, integrations, templates, and technical resources.' }),
      section('proof', 'testimonials', 'Testimonials', 'cards', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('pricing', 'pricing', 'Pricing', 'cards', 'main', 80),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 90),
      section('demo', 'contact', 'Contact', 'centered', 'main', 100, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 110, { required: true })
    ],
    ['saas', 'dashboard', 'demo']
  ),
  galleryMuseum: template(
    'galleryMuseum',
    'Gallery museum',
    'general',
    'multi-page',
    'museumCanvas',
    'Exhibition-forward museum layout for visual collections, programs, visiting hours, membership, and contact paths.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('exhibitions', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Current exhibitions, collection highlights, and featured installations.' }),
      section('programs', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Tours, programs, classes, talks, and visitor experiences.' }),
      section('membership', 'pricing', 'Pricing', 'simple', 'main', 50, { purpose: 'Membership levels, admission options, or donor circles.' }),
      section('reviews', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 70, { required: true }),
      section('contact', 'contact', 'Contact', 'split', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['museum', 'gallery', 'programs']
  ),
  ecoImpactCampaign: template(
    'ecoImpactCampaign',
    'Eco impact campaign',
    'general',
    'landing-page',
    'ecoImpact',
    'Sustainability campaign layout for mission proof, programs, donation tiers, volunteer conversion, and impact storytelling.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'split', 'main', 20, { required: true }),
      section('impactProof', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true, purpose: 'Impact metrics, partner badges, certifications, or campaign milestones.' }),
      section('programs', 'services', 'Services', 'featured', 'main', 40, { required: true, repeatable: true, purpose: 'Sustainability programs, initiatives, volunteer paths, and action areas.' }),
      section('fieldGallery', 'gallery', 'Gallery', 'grid', 'main', 50, { purpose: 'Field work, community events, restoration sites, or campaign imagery.' }),
      section('donationTiers', 'pricing', 'Pricing', 'cards', 'main', 60, { purpose: 'Donation tiers, sponsorship levels, or pledge options.' }),
      section('stories', 'testimonials', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['reviews'], purpose: 'Beneficiary, volunteer, partner, or community impact stories.' }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 80),
      section('volunteer', 'contact', 'Contact', 'centered', 'main', 90, { required: true, purpose: 'Volunteer signup, donation inquiry, or campaign contact CTA.' }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 100, { required: true })
    ],
    ['sustainability', 'impact', 'donations']
  ),
  executiveSearch: template(
    'executiveSearch',
    'Executive search',
    'professional-services',
    'multi-page',
    'executiveSlate',
    'High-trust executive search layout for retained recruiting, advisory process, leadership team proof, and consultation requests.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true, purpose: 'Client logos, placement outcomes, confidentiality assurances, and credentials.' }),
      section('mandates', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true, purpose: 'Executive search, succession, assessment, and advisory service lines.' }),
      section('process', 'services', 'Services', 'featured', 'main', 50, { purpose: 'Intake, mapping, outreach, assessment, shortlist, and onboarding rhythm.' }),
      section('team', 'team', 'Team', 'profiles', 'main', 60, { required: true }),
      section('proof', 'testimonials', 'Testimonials', 'quote', 'main', 70, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 80),
      section('consult', 'contact', 'Contact', 'split', 'main', 90, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 100, { required: true })
    ],
    ['executive-search', 'recruiting', 'consultation']
  ),
  culinaryMarket: template(
    'culinaryMarket',
    'Culinary market',
    'restaurant',
    'single-page',
    'culinaryMarket',
    'Food hall and market layout for vendors, menu highlights, visual atmosphere, hours, events, and visit details.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('vendors', 'services', 'Services', 'featured', 'main', 30, { required: true, repeatable: true, purpose: 'Vendor stalls, menu highlights, specialties, and market favorites.' }),
      section('marketGallery', 'gallery', 'Gallery', 'grid', 'main', 40, { required: true }),
      section('events', 'services', 'Services', 'cards', 'main', 50, { purpose: 'Tastings, pop-ups, seasonal markets, classes, or private food hall events.' }),
      section('reviews', 'reviews', 'Testimonials', 'cards', 'main', 60, { acceptsSchemaVariants: ['testimonials'] }),
      section('hours', 'hours', 'Hours', 'default', 'main', 70, { required: true }),
      section('visit', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['food-hall', 'market', 'vendors']
  ),
  medSpaGlow: template(
    'medSpaGlow',
    'Med spa glow',
    'medical',
    'landing-page',
    'glowMedspa',
    'Premium med spa layout for aesthetic services, provider trust, treatment imagery, packages, and booking conversion.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 30, { required: true, purpose: 'Licensure, safety, results, and patient-care proof.' }),
      section('treatments', 'services', 'Services', 'featured', 'main', 40, { required: true, repeatable: true, purpose: 'Injectables, skin, laser, body, and wellness treatment paths.' }),
      section('team', 'team', 'Team', 'profiles', 'main', 50, { purpose: 'Providers, injectors, estheticians, and clinical credentials.' }),
      section('gallery', 'gallery', 'Gallery', 'featured', 'main', 60, { purpose: 'Treatment rooms, results-safe imagery, products, and brand atmosphere.' }),
      section('packages', 'pricing', 'Pricing', 'simple', 'main', 70),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 80, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 90),
      section('booking', 'contact', 'Contact', 'split', 'main', 100, { required: true }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 110, { required: true })
    ],
    ['med-spa', 'aesthetics', 'booking']
  ),
  devtoolConsole: template(
    'devtoolConsole',
    'Devtool console',
    'general',
    'directory-ready',
    'terminalDocs',
    'Developer tool layout for compact docs navigation, technical resources, product capabilities, FAQs, and support contact.',
    [
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('breadcrumbs', 'breadcrumbs', 'Breadcrumbs', 'default', 'utility', 15),
      section('hero', 'hero', 'Hero', 'compact', 'main', 20, { required: true, purpose: 'CLI, API, SDK, or infrastructure product positioning.' }),
      section('resources', 'services', 'Services', 'list', 'main', 30, { required: true, repeatable: true, purpose: 'Docs, quickstarts, API references, SDKs, recipes, and changelogs.' }),
      section('features', 'services', 'Services', 'cards', 'main', 40, { required: true, purpose: 'Core commands, workflows, integrations, and developer experience benefits.' }),
      section('trust', 'trustBadges', 'TrustBadges', 'inline', 'main', 50),
      section('pricing', 'pricing', 'Pricing', 'simple', 'main', 60),
      section('faq', 'faq', 'FAQ', 'columns', 'main', 70),
      section('support', 'contact', 'Contact', 'centered', 'main', 80, { required: true, purpose: 'Support, community, sales engineering, or technical contact path.' }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['developer-tools', 'documentation', 'support']
  ),
  luxuryRealEstate: template(
    'luxuryRealEstate',
    'Luxury real estate',
    'professional-services',
    'landing-page',
    'estatePrestige',
    'Luxury property layout for immersive listings, feature highlights, market proof, private tours, and buyer inquiries.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('propertyGallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Exterior, interior, neighborhood, and lifestyle property imagery.' }),
      section('features', 'services', 'Services', 'cards', 'main', 40, { required: true, repeatable: true, purpose: 'Property features, amenities, neighborhood advantages, and buyer highlights.' }),
      section('marketProof', 'trustBadges', 'TrustBadges', 'inline', 'main', 50, { purpose: 'Awards, market data, brokerage credentials, or sales proof.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('inquiry', 'contact', 'Contact', 'split', 'main', 80, { required: true, purpose: 'Private showing, buyer inquiry, or broker consultation CTA.' }),
      section('footer', 'footer', 'Footer', 'rich', 'footer', 90, { required: true })
    ],
    ['real-estate', 'luxury', 'property']
  ),
  festivalLineup: template(
    'festivalLineup',
    'Festival lineup',
    'hospitality',
    'single-page',
    'festivalPoster',
    'Event festival layout for lineup promotion, visual energy, ticket tiers, schedules, FAQs, and attendee contact.',
    [
      section('eventAlert', 'emergencyBanner', 'EmergencyBanner', 'sticky', 'utility', 5, { purpose: 'Ticket deadline, date announcement, or festival update CTA.' }),
      section('nav', 'navigation', 'Navigation', 'compact', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'media', 'main', 20, { required: true }),
      section('lineup', 'services', 'Services', 'featured', 'main', 30, { required: true, repeatable: true, purpose: 'Artists, speakers, stages, activities, vendors, or festival tracks.' }),
      section('gallery', 'gallery', 'Gallery', 'grid', 'main', 40, { required: true }),
      section('tickets', 'pricing', 'Pricing', 'cards', 'main', 50, { required: true, purpose: 'Passes, VIP tiers, group tickets, or early-bird options.' }),
      section('schedule', 'hours', 'Hours', 'default', 'main', 60, { required: true }),
      section('faq', 'faq', 'FAQ', 'accordion', 'main', 70),
      section('contact', 'contact', 'Contact', 'card', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['festival', 'lineup', 'tickets']
  ),
  artisanMaker: template(
    'artisanMaker',
    'Artisan maker',
    'one-page',
    'single-page',
    'artisanPaper',
    'Maker brand layout for craft storytelling, workshop imagery, product collections, social proof, and direct inquiries.',
    [
      section('nav', 'navigation', 'Navigation', 'centered', 'header', 10, { required: true }),
      section('hero', 'hero', 'Hero', 'centered', 'main', 20, { required: true }),
      section('storyGallery', 'gallery', 'Gallery', 'featured', 'main', 30, { required: true, purpose: 'Studio, materials, process, finished goods, and craft story imagery.' }),
      section('products', 'services', 'Services', 'list', 'main', 40, { required: true, repeatable: true, purpose: 'Collections, commissions, workshops, seasonal goods, or product categories.' }),
      section('process', 'services', 'Services', 'featured', 'main', 50, { purpose: 'Sourcing, making, finishing, packaging, and custom-order process.' }),
      section('testimonials', 'testimonials', 'Testimonials', 'quote', 'main', 60, { acceptsSchemaVariants: ['reviews'] }),
      section('faq', 'faq', 'FAQ', 'compact', 'main', 70),
      section('contact', 'contact', 'Contact', 'centered', 'main', 80, { required: true }),
      section('footer', 'footer', 'Footer', 'simple', 'footer', 90, { required: true })
    ],
    ['artisan', 'maker', 'craft']
  )
} satisfies Record<string, WebsiteTemplate>;

export type TemplateId = keyof typeof templates;
