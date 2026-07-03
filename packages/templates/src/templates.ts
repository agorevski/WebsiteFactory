import type { SectionComponentName } from '@website-factory/components';
import type { ThemeName } from '@website-factory/themes';
import type { SchemaSectionType, TemplateAudience, TemplateLayout, TemplateSectionDefinition, TemplateSlot, WebsiteTemplate } from './types';

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
  )
} satisfies Record<string, WebsiteTemplate>;

export type TemplateId = keyof typeof templates;
