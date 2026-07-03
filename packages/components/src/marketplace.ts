import type { SectionComponentName } from './types';

export type ComponentCategoryId =
  | 'hero'
  | 'cta'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'faq'
  | 'contact'
  | 'services'
  | 'portfolio'
  | 'gallery'
  | 'blogPreview'
  | 'statistics'
  | 'logos'
  | 'beforeAfter'
  | 'booking'
  | 'reviews'
  | 'awards'
  | 'certifications'
  | 'process'
  | 'newsletter'
  | 'careers'
  | 'downloads'
  | 'caseStudies'
  | 'comparisonTables'
  | 'imageGrid'
  | 'videoGallery'
  | 'locations'
  | 'staffProfiles'
  | 'openingHours'
  | 'productCatalog'
  | 'ecommerceGrid'
  | 'search'
  | 'relatedArticles'
  | 'breadcrumbs'
  | 'sidebarNavigation'
  | 'tableOfContents'
  | 'cookieBanner'
  | 'announcementBar'
  | 'floatingActions'
  | 'liveChatPlaceholder';

export type ComponentContentSignal =
  | 'primaryMessage'
  | 'primaryConversion'
  | 'secondaryConversion'
  | 'shortCopy'
  | 'longCopy'
  | 'mediaAvailable'
  | 'imageHeavy'
  | 'videoAvailable'
  | 'socialProof'
  | 'quotes'
  | 'ratings'
  | 'pricingClarity'
  | 'comparison'
  | 'transactional'
  | 'teamCredibility'
  | 'peopleProfiles'
  | 'trustCredentials'
  | 'supportQuestions'
  | 'regulatedContent'
  | 'contactIntent'
  | 'multiChannel'
  | 'multiLocation'
  | 'localDiscovery'
  | 'serviceCatalog'
  | 'featureHighlights'
  | 'appointmentIntent'
  | 'projectShowcase'
  | 'caseStudyProof'
  | 'editorial'
  | 'articleList'
  | 'freshness'
  | 'metrics'
  | 'brandTrust'
  | 'partnerProof'
  | 'beforeAfterProof'
  | 'professionalProof'
  | 'processEducation'
  | 'leadCapture'
  | 'hiring'
  | 'downloadIntent'
  | 'resourceLibrary'
  | 'catalog'
  | 'commerce'
  | 'searchIntent'
  | 'navigationAid'
  | 'pageHierarchy'
  | 'legalCompliance'
  | 'privacyNotice'
  | 'globalMessage'
  | 'timeSensitive'
  | 'urgentNeed'
  | 'availability'
  | 'userSupport';

export type ComponentLayoutRole =
  | 'pageHero'
  | 'conversionBlock'
  | 'contentGrid'
  | 'socialProof'
  | 'priceComparison'
  | 'peopleDirectory'
  | 'supportContent'
  | 'contactGateway'
  | 'serviceCatalog'
  | 'mediaShowcase'
  | 'editorialPreview'
  | 'metricBand'
  | 'brandTrust'
  | 'availability'
  | 'commerce'
  | 'navigation'
  | 'utility'
  | 'legalCompliance'
  | 'engagement'
  | 'localDiscovery'
  | 'resourceLibrary'
  | 'caseStudy'
  | 'interactiveSearch'
  | 'articleContext'
  | 'aside'
  | 'globalMessage'
  | 'floatingSupport'
  | 'userSupport';

export type ComponentThemeTrait =
  | 'lightweight'
  | 'highContrast'
  | 'imageForward'
  | 'copyDense'
  | 'conversionFocused'
  | 'trustFocused'
  | 'editorial'
  | 'commerce'
  | 'local'
  | 'professional'
  | 'playful'
  | 'minimal'
  | 'immersive'
  | 'utility'
  | 'compact'
  | 'premium';

export type ComponentThemeTokenHook =
  | 'surface'
  | 'surfaceContrast'
  | 'surfaceMuted'
  | 'textPrimary'
  | 'textMuted'
  | 'accent'
  | 'accentContrast'
  | 'border'
  | 'ringFocus'
  | 'radius'
  | 'shadow'
  | 'spacingSection'
  | 'spacingGrid'
  | 'container'
  | 'mediaFrame'
  | 'badge'
  | 'overlay'
  | 'divider'
  | 'motion'
  | 'zIndexOverlay';

export type ComponentAccessibilityExpectation =
  | 'semanticHeadingStructure'
  | 'descriptiveAlternativeText'
  | 'keyboardReachable'
  | 'focusVisible'
  | 'ariaLabelledRegion'
  | 'ariaLiveForDynamicState'
  | 'formLabelsAndErrors'
  | 'reducedMotionSafe'
  | 'colorContrast'
  | 'listSemantics'
  | 'tableSemantics'
  | 'mediaCaptions'
  | 'linkPurpose'
  | 'landmarkClarity'
  | 'dismissibleControlState';

export type ComponentDataRequirement =
  | 'sectionHeading'
  | 'eyebrow'
  | 'bodyCopy'
  | 'primaryCta'
  | 'secondaryCta'
  | 'mediaAsset'
  | 'backgroundMedia'
  | 'itemCollection'
  | 'serviceItems'
  | 'testimonialQuotes'
  | 'ratingValues'
  | 'pricingPlans'
  | 'personProfiles'
  | 'faqItems'
  | 'contactMethods'
  | 'postalAddress'
  | 'openingHours'
  | 'mapEmbed'
  | 'portfolioItems'
  | 'galleryItems'
  | 'articleSummaries'
  | 'statistics'
  | 'logoAssets'
  | 'beforeAfterPairs'
  | 'bookingActions'
  | 'awardItems'
  | 'certificationItems'
  | 'processSteps'
  | 'emailCapture'
  | 'jobListings'
  | 'downloadableAssets'
  | 'caseStudySummaries'
  | 'comparisonRows'
  | 'videoAssets'
  | 'locationItems'
  | 'productItems'
  | 'searchConfiguration'
  | 'navigationLinks'
  | 'hierarchyItems'
  | 'cookieNotice'
  | 'announcementMessage'
  | 'floatingActionItems'
  | 'chatProviderPlaceholder';

export type ComponentPresentationBoundary =
  | 'contentComesFromSchemaData'
  | 'variantControlsLayoutOnly'
  | 'themeControlsVisualTokens'
  | 'noBusinessCopyInVariant';

export type ComponentImplementationType =
  | 'reactSection'
  | 'headlessSection'
  | 'navigationUtility'
  | 'complianceUtility'
  | 'floatingUtility';

export interface ComponentMarketplaceCategory {
  readonly id: ComponentCategoryId;
  readonly label: string;
  readonly description: string;
  readonly layoutRoles: readonly ComponentLayoutRole[];
  readonly defaultContentSignals: readonly ComponentContentSignal[];
  readonly dataRequirements: readonly ComponentDataRequirement[];
  readonly presentationBoundaries: readonly ComponentPresentationBoundary[];
  readonly compatibleComponents: readonly SectionComponentName[];
}

export interface ComponentImplementationDescriptor {
  readonly id: string;
  readonly categoryId: ComponentCategoryId;
  readonly variantId: string;
  readonly label: string;
  readonly description: string;
  readonly implementationType: ComponentImplementationType;
  readonly componentName?: SectionComponentName;
  readonly contentSignals: readonly ComponentContentSignal[];
  readonly accessibility: readonly ComponentAccessibilityExpectation[];
  readonly layoutRoles: readonly ComponentLayoutRole[];
  readonly themeHooks: readonly ComponentThemeTokenHook[];
  readonly themeTraits: readonly ComponentThemeTrait[];
  readonly dataRequirements: readonly ComponentDataRequirement[];
  readonly presentationBoundaries: readonly ComponentPresentationBoundary[];
}

export interface ComponentMarketplaceRegistry {
  readonly categories: readonly ComponentMarketplaceCategory[];
  readonly implementations: readonly ComponentImplementationDescriptor[];
}

export interface ComponentMarketplaceSelectionCriteria {
  readonly categoryId?: ComponentCategoryId;
  readonly contentSignals?: readonly ComponentContentSignal[];
  readonly themeTraits?: readonly ComponentThemeTrait[];
  readonly layoutRoles?: readonly ComponentLayoutRole[];
  readonly componentName?: SectionComponentName;
  readonly limit?: number;
}

export interface ComponentMarketplaceSummary {
  readonly categoryCount: number;
  readonly implementationCount: number;
}

export const componentMarketplaceCategories = [
  {
    id: 'hero',
    label: 'Hero',
    description: 'Entry-point narrative sections that introduce the page promise and primary next step.',
    layoutRoles: ['pageHero'],
    defaultContentSignals: ['primaryMessage', 'primaryConversion', 'shortCopy', 'mediaAvailable'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta', 'mediaAsset', 'backgroundMedia'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Hero'],
  },
  {
    id: 'cta',
    label: 'CTA',
    description: 'Focused conversion prompts that route visitors toward a single next action.',
    layoutRoles: ['conversionBlock'],
    defaultContentSignals: ['primaryConversion', 'urgentNeed', 'shortCopy'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'features',
    label: 'Features',
    description: 'Benefit and capability summaries that make repeated value propositions scannable.',
    layoutRoles: ['contentGrid'],
    defaultContentSignals: ['featureHighlights', 'shortCopy', 'serviceCatalog'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'itemCollection', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    description: 'Customer or patient quotes that turn qualitative proof into reusable social-proof sections.',
    layoutRoles: ['socialProof'],
    defaultContentSignals: ['socialProof', 'quotes', 'ratings'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Testimonials'],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Offer and plan displays that keep price data separate from layout choice.',
    layoutRoles: ['priceComparison'],
    defaultContentSignals: ['pricingClarity', 'comparison', 'transactional'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'pricingPlans', 'primaryCta', 'comparisonRows'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Pricing'],
  },
  {
    id: 'team',
    label: 'Team',
    description: 'People-focused sections that establish expertise without coupling profile data to visual treatment.',
    layoutRoles: ['peopleDirectory'],
    defaultContentSignals: ['teamCredibility', 'peopleProfiles', 'trustCredentials'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Team'],
  },
  {
    id: 'faq',
    label: 'FAQ',
    description: 'Question-and-answer content blocks for objections, regulated explanations, and support topics.',
    layoutRoles: ['supportContent'],
    defaultContentSignals: ['supportQuestions', 'longCopy', 'regulatedContent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'faqItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['FAQ'],
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Contact gateways that expose reachable business methods and optional form entry points.',
    layoutRoles: ['contactGateway'],
    defaultContentSignals: ['contactIntent', 'multiChannel', 'localDiscovery'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'contactMethods', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Contact'],
  },
  {
    id: 'services',
    label: 'Services',
    description: 'Service catalog sections that present offerings as interchangeable cards, lists, or featured entries.',
    layoutRoles: ['serviceCatalog'],
    defaultContentSignals: ['serviceCatalog', 'featureHighlights', 'appointmentIntent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'serviceItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Services'],
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    description: 'Project showcases that organize outcomes, imagery, and proof points independent of visual layout.',
    layoutRoles: ['mediaShowcase', 'caseStudy'],
    defaultContentSignals: ['projectShowcase', 'imageHeavy', 'caseStudyProof'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'portfolioItems', 'mediaAsset', 'caseStudySummaries'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Gallery'],
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Image collections that can render captions, grouped media, or immersive browsing surfaces.',
    layoutRoles: ['mediaShowcase'],
    defaultContentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Gallery'],
  },
  {
    id: 'blogPreview',
    label: 'Blog preview',
    description: 'Editorial preview blocks for routing visitors to current or related article content.',
    layoutRoles: ['editorialPreview'],
    defaultContentSignals: ['editorial', 'articleList', 'freshness'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'statistics',
    label: 'Statistics',
    description: 'Metric-driven proof bands that surface quantified outcomes with accessible labels.',
    layoutRoles: ['metricBand'],
    defaultContentSignals: ['metrics', 'socialProof', 'trustCredentials'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'statistics'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'logos',
    label: 'Logos',
    description: 'Logo clouds and partner strips that express brand trust using reusable image metadata.',
    layoutRoles: ['brandTrust'],
    defaultContentSignals: ['brandTrust', 'partnerProof', 'socialProof'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['TrustBadges'],
  },
  {
    id: 'beforeAfter',
    label: 'Before and after',
    description: 'Comparative visual proof sections that pair outcomes with clear captions and constraints.',
    layoutRoles: ['mediaShowcase', 'socialProof'],
    defaultContentSignals: ['beforeAfterProof', 'imageHeavy', 'regulatedContent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'beforeAfterPairs', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'booking',
    label: 'Booking',
    description: 'Appointment and reservation entry points that keep scheduling data provider-agnostic.',
    layoutRoles: ['availability', 'conversionBlock'],
    defaultContentSignals: ['appointmentIntent', 'transactional', 'availability'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'bookingActions', 'openingHours', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Contact'],
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Review summaries and excerpts that separate rating facts from social-proof presentation.',
    layoutRoles: ['socialProof'],
    defaultContentSignals: ['ratings', 'socialProof', 'quotes'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Testimonials'],
  },
  {
    id: 'awards',
    label: 'Awards',
    description: 'Award and recognition displays that emphasize proof while preserving source metadata.',
    layoutRoles: ['brandTrust'],
    defaultContentSignals: ['trustCredentials', 'brandTrust', 'regulatedContent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'awardItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['TrustBadges'],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    description: 'Credential sections for licenses, certifications, and compliance proof.',
    layoutRoles: ['brandTrust'],
    defaultContentSignals: ['trustCredentials', 'regulatedContent', 'professionalProof'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'certificationItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['TrustBadges'],
  },
  {
    id: 'process',
    label: 'Process',
    description: 'Step-by-step education sections that explain workflows or customer journeys.',
    layoutRoles: ['supportContent', 'contentGrid'],
    defaultContentSignals: ['processEducation', 'longCopy', 'serviceCatalog'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'processSteps', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    description: 'Email capture sections that pair an editorial or incentive promise with form metadata.',
    layoutRoles: ['conversionBlock', 'engagement'],
    defaultContentSignals: ['leadCapture', 'editorial', 'secondaryConversion'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'emailCapture', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'careers',
    label: 'Careers',
    description: 'Hiring sections for open roles, culture proof, and recruiting calls to action.',
    layoutRoles: ['peopleDirectory', 'resourceLibrary'],
    defaultContentSignals: ['hiring', 'peopleProfiles', 'longCopy'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'jobListings', 'mediaAsset', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    description: 'Resource download sections for files, lead magnets, and supporting documents.',
    layoutRoles: ['resourceLibrary'],
    defaultContentSignals: ['downloadIntent', 'resourceLibrary', 'leadCapture'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'downloadableAssets', 'emailCapture'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'caseStudies',
    label: 'Case studies',
    description: 'Outcome story previews that connect proof, metrics, and long-form case-study routes.',
    layoutRoles: ['caseStudy'],
    defaultContentSignals: ['caseStudyProof', 'longCopy', 'metrics'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'caseStudySummaries', 'statistics', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'comparisonTables',
    label: 'Comparison tables',
    description: 'Structured comparison layouts for packages, competitors, or feature sets.',
    layoutRoles: ['priceComparison', 'contentGrid'],
    defaultContentSignals: ['comparison', 'pricingClarity', 'featureHighlights'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'comparisonRows', 'pricingPlans'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'imageGrid',
    label: 'Image grid',
    description: 'Flexible image-grid sections for tiles, editorial mosaics, and visual category navigation.',
    layoutRoles: ['mediaShowcase'],
    defaultContentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Gallery'],
  },
  {
    id: 'videoGallery',
    label: 'Video gallery',
    description: 'Video listing and feature sections with captioning and transcript expectations.',
    layoutRoles: ['mediaShowcase'],
    defaultContentSignals: ['videoAvailable', 'mediaAvailable', 'processEducation'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'videoAssets', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'locations',
    label: 'Locations',
    description: 'Location directories that keep address, hours, and routing facts independent from maps or cards.',
    layoutRoles: ['localDiscovery', 'contactGateway'],
    defaultContentSignals: ['multiLocation', 'localDiscovery', 'contactIntent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'locationItems', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Contact'],
  },
  {
    id: 'staffProfiles',
    label: 'Staff profiles',
    description: 'Individual staff profile sections for credentials, bios, and profile navigation.',
    layoutRoles: ['peopleDirectory'],
    defaultContentSignals: ['peopleProfiles', 'teamCredibility', 'trustCredentials'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'certificationItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Team'],
  },
  {
    id: 'openingHours',
    label: 'Opening hours',
    description: 'Hours and availability displays that expose schedule data consistently across layouts.',
    layoutRoles: ['availability'],
    defaultContentSignals: ['availability', 'localDiscovery', 'contactIntent'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Hours'],
  },
  {
    id: 'productCatalog',
    label: 'Product catalog',
    description: 'Catalog browsing sections for products, services-as-products, or inventory previews.',
    layoutRoles: ['commerce', 'serviceCatalog'],
    defaultContentSignals: ['catalog', 'commerce', 'transactional'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'ecommerceGrid',
    label: 'Ecommerce grid',
    description: 'Commerce-oriented product grids with promotional, shoppable, and quick-view-ready variants.',
    layoutRoles: ['commerce'],
    defaultContentSignals: ['commerce', 'catalog', 'transactional'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Search and filtering surfaces that describe query controls and result containers.',
    layoutRoles: ['interactiveSearch'],
    defaultContentSignals: ['searchIntent', 'catalog', 'resourceLibrary'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'searchConfiguration', 'itemCollection'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'relatedArticles',
    label: 'Related articles',
    description: 'Contextual article recommendation sections for internal linking and reader continuation.',
    layoutRoles: ['articleContext'],
    defaultContentSignals: ['articleList', 'editorial', 'navigationAid'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'breadcrumbs',
    label: 'Breadcrumbs',
    description: 'Hierarchy navigation trails for page context and accessible wayfinding.',
    layoutRoles: ['navigation'],
    defaultContentSignals: ['navigationAid', 'pageHierarchy', 'searchIntent'],
    dataRequirements: ['hierarchyItems', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['Breadcrumbs'],
  },
  {
    id: 'sidebarNavigation',
    label: 'Sidebar navigation',
    description: 'Aside navigation systems for long-form, resource, or nested page structures.',
    layoutRoles: ['aside', 'navigation'],
    defaultContentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'tableOfContents',
    label: 'Table of contents',
    description: 'Anchor navigation for long pages that mirrors content hierarchy without owning copy.',
    layoutRoles: ['aside', 'navigation'],
    defaultContentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'cookieBanner',
    label: 'Cookie banner',
    description: 'Privacy notice and preference surfaces that keep compliance copy and controls explicit.',
    layoutRoles: ['legalCompliance', 'utility'],
    defaultContentSignals: ['legalCompliance', 'privacyNotice', 'globalMessage'],
    dataRequirements: ['cookieNotice', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'announcementBar',
    label: 'Announcement bar',
    description: 'Global message strips for time-sensitive updates, promos, or urgent notices.',
    layoutRoles: ['globalMessage'],
    defaultContentSignals: ['timeSensitive', 'globalMessage', 'urgentNeed'],
    dataRequirements: ['announcementMessage', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: ['EmergencyBanner'],
  },
  {
    id: 'floatingActions',
    label: 'Floating actions',
    description: 'Persistent action docks that expose high-priority contact or conversion actions.',
    layoutRoles: ['floatingSupport', 'conversionBlock'],
    defaultContentSignals: ['primaryConversion', 'contactIntent', 'urgentNeed'],
    dataRequirements: ['floatingActionItems', 'primaryCta', 'contactMethods'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
  {
    id: 'liveChatPlaceholder',
    label: 'Live chat placeholder',
    description: 'Provider-neutral chat placeholders for support availability and lead capture fallbacks.',
    layoutRoles: ['floatingSupport', 'userSupport'],
    defaultContentSignals: ['userSupport', 'contactIntent', 'availability'],
    dataRequirements: ['chatProviderPlaceholder', 'contactMethods', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
    compatibleComponents: [],
  },
] as const satisfies readonly ComponentMarketplaceCategory[];

export const componentMarketplaceImplementations = [
  {
    id: 'hero.splitStory',
    categoryId: 'hero',
    variantId: 'splitStory',
    label: 'Split story hero',
    description: 'Split story hero for hero content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hero',
    contentSignals: ['primaryMessage', 'primaryConversion', 'shortCopy', 'mediaAvailable'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['pageHero'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta', 'mediaAsset', 'backgroundMedia'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'hero.centeredConversion',
    categoryId: 'hero',
    variantId: 'centeredConversion',
    label: 'Centered conversion hero',
    description: 'Centered conversion hero for hero content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hero',
    contentSignals: ['primaryMessage', 'primaryConversion', 'shortCopy', 'mediaAvailable'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['pageHero'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta', 'mediaAsset', 'backgroundMedia'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'hero.mediaBackdrop',
    categoryId: 'hero',
    variantId: 'mediaBackdrop',
    label: 'Media backdrop hero',
    description: 'Media backdrop hero for hero content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hero',
    contentSignals: ['primaryMessage', 'primaryConversion', 'shortCopy', 'mediaAvailable'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['pageHero'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'imageForward', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta', 'mediaAsset', 'backgroundMedia'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cta.inlineBand',
    categoryId: 'cta',
    variantId: 'inlineBand',
    label: 'Inline CTA band',
    description: 'Inline CTA band for cta content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['primaryConversion', 'urgentNeed', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cta.splitPanel',
    categoryId: 'cta',
    variantId: 'splitPanel',
    label: 'Split CTA panel',
    description: 'Split CTA panel for cta content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['primaryConversion', 'urgentNeed', 'shortCopy', 'primaryMessage'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cta.stickyFooter',
    categoryId: 'cta',
    variantId: 'stickyFooter',
    label: 'Sticky footer CTA',
    description: 'Sticky footer CTA for cta content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['primaryConversion', 'urgentNeed', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'features.iconGrid',
    categoryId: 'features',
    variantId: 'iconGrid',
    label: 'Icon grid features',
    description: 'Icon grid features for features content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['featureHighlights', 'shortCopy', 'serviceCatalog'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'itemCollection', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'features.alternatingRows',
    categoryId: 'features',
    variantId: 'alternatingRows',
    label: 'Alternating row features',
    description: 'Alternating row features for features content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['featureHighlights', 'shortCopy', 'serviceCatalog'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'itemCollection', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'features.checklistCards',
    categoryId: 'features',
    variantId: 'checklistCards',
    label: 'Checklist feature cards',
    description: 'Checklist feature cards for features content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['featureHighlights', 'shortCopy', 'serviceCatalog', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'itemCollection', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'testimonials.quoteGrid',
    categoryId: 'testimonials',
    variantId: 'quoteGrid',
    label: 'Quote grid testimonials',
    description: 'Quote grid testimonials for testimonials content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['socialProof', 'quotes', 'ratings'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'testimonials.featuredQuote',
    categoryId: 'testimonials',
    variantId: 'featuredQuote',
    label: 'Featured quote testimonial',
    description: 'Featured quote testimonial for testimonials content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['socialProof', 'quotes', 'ratings'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'testimonials.carouselReady',
    categoryId: 'testimonials',
    variantId: 'carouselReady',
    label: 'Carousel-ready testimonials',
    description: 'Carousel-ready testimonials for testimonials content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['socialProof', 'quotes', 'ratings'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'pricing.tierCards',
    categoryId: 'pricing',
    variantId: 'tierCards',
    label: 'Tiered pricing cards',
    description: 'Tiered pricing cards for pricing content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Pricing',
    contentSignals: ['pricingClarity', 'comparison', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'pricingPlans', 'primaryCta', 'comparisonRows'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'pricing.comparisonMatrix',
    categoryId: 'pricing',
    variantId: 'comparisonMatrix',
    label: 'Comparison pricing matrix',
    description: 'Comparison pricing matrix for pricing content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Pricing',
    contentSignals: ['pricingClarity', 'comparison', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'pricingPlans', 'primaryCta', 'comparisonRows'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'pricing.singleOffer',
    categoryId: 'pricing',
    variantId: 'singleOffer',
    label: 'Single-offer pricing',
    description: 'Single-offer pricing for pricing content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Pricing',
    contentSignals: ['pricingClarity', 'comparison', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'pricingPlans', 'primaryCta', 'comparisonRows'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'team.profileCards',
    categoryId: 'team',
    variantId: 'profileCards',
    label: 'Team profile cards',
    description: 'Team profile cards for team content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['teamCredibility', 'peopleProfiles', 'trustCredentials', 'downloadIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'team.leadershipStrip',
    categoryId: 'team',
    variantId: 'leadershipStrip',
    label: 'Leadership strip',
    description: 'Leadership strip for team content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['teamCredibility', 'peopleProfiles', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'team.bioDirectory',
    categoryId: 'team',
    variantId: 'bioDirectory',
    label: 'Bio directory',
    description: 'Bio directory for team content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['teamCredibility', 'peopleProfiles', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'faq.accordionList',
    categoryId: 'faq',
    variantId: 'accordionList',
    label: 'Accordion FAQ list',
    description: 'Accordion FAQ list for faq content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'FAQ',
    contentSignals: ['supportQuestions', 'longCopy', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'trustFocused', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'faqItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'faq.twoColumn',
    categoryId: 'faq',
    variantId: 'twoColumn',
    label: 'Two-column FAQ',
    description: 'Two-column FAQ for faq content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'FAQ',
    contentSignals: ['supportQuestions', 'longCopy', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'faqItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'faq.compactDisclosure',
    categoryId: 'faq',
    variantId: 'compactDisclosure',
    label: 'Compact disclosure FAQ',
    description: 'Compact disclosure FAQ for faq content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'FAQ',
    contentSignals: ['supportQuestions', 'longCopy', 'regulatedContent', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused', 'copyDense', 'compact', 'minimal'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'faqItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'contact.contactCards',
    categoryId: 'contact',
    variantId: 'contactCards',
    label: 'Contact method cards',
    description: 'Contact method cards for contact content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['contactIntent', 'multiChannel', 'localDiscovery'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'contactMethods', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'contact.formFirst',
    categoryId: 'contact',
    variantId: 'formFirst',
    label: 'Form-first contact',
    description: 'Form-first contact for contact content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['contactIntent', 'multiChannel', 'localDiscovery', 'leadCapture'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'contactMethods', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'contact.mapPanel',
    categoryId: 'contact',
    variantId: 'mapPanel',
    label: 'Map panel contact',
    description: 'Map panel contact for contact content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['contactIntent', 'multiChannel', 'localDiscovery'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'contactMethods', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'services.serviceCards',
    categoryId: 'services',
    variantId: 'serviceCards',
    label: 'Service cards',
    description: 'Service cards for services content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Services',
    contentSignals: ['serviceCatalog', 'featureHighlights', 'appointmentIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'serviceItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'services.featuredService',
    categoryId: 'services',
    variantId: 'featuredService',
    label: 'Featured service spotlight',
    description: 'Featured service spotlight for services content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Services',
    contentSignals: ['serviceCatalog', 'featureHighlights', 'appointmentIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'serviceItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'services.compactList',
    categoryId: 'services',
    variantId: 'compactList',
    label: 'Compact service list',
    description: 'Compact service list for services content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Services',
    contentSignals: ['serviceCatalog', 'featureHighlights', 'appointmentIntent', 'shortCopy', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'copyDense', 'compact', 'minimal'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'serviceItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'portfolio.projectCards',
    categoryId: 'portfolio',
    variantId: 'projectCards',
    label: 'Project cards',
    description: 'Project cards for portfolio content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['projectShowcase', 'imageHeavy', 'caseStudyProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'portfolioItems', 'mediaAsset', 'caseStudySummaries'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'portfolio.masonryShowcase',
    categoryId: 'portfolio',
    variantId: 'masonryShowcase',
    label: 'Masonry portfolio showcase',
    description: 'Masonry portfolio showcase for portfolio content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['projectShowcase', 'imageHeavy', 'caseStudyProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'portfolioItems', 'mediaAsset', 'caseStudySummaries'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'portfolio.caseStudyTeasers',
    categoryId: 'portfolio',
    variantId: 'caseStudyTeasers',
    label: 'Case study portfolio teasers',
    description: 'Case study portfolio teasers for portfolio content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['projectShowcase', 'imageHeavy', 'caseStudyProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'portfolioItems', 'mediaAsset', 'caseStudySummaries'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'gallery.captionGrid',
    categoryId: 'gallery',
    variantId: 'captionGrid',
    label: 'Captioned gallery grid',
    description: 'Captioned gallery grid for gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'gallery.immersiveMasonry',
    categoryId: 'gallery',
    variantId: 'immersiveMasonry',
    label: 'Immersive masonry gallery',
    description: 'Immersive masonry gallery for gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow'],
    themeTraits: ['professional', 'imageForward', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'gallery.carouselReady',
    categoryId: 'gallery',
    variantId: 'carouselReady',
    label: 'Carousel-ready gallery',
    description: 'Carousel-ready gallery for gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase', 'socialProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow'],
    themeTraits: ['professional', 'trustFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'blogPreview.articleCards',
    categoryId: 'blogPreview',
    variantId: 'articleCards',
    label: 'Article preview cards',
    description: 'Article preview cards for blog preview content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['editorial', 'articleList', 'freshness'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['editorialPreview'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'blogPreview.editorialList',
    categoryId: 'blogPreview',
    variantId: 'editorialList',
    label: 'Editorial article list',
    description: 'Editorial article list for blog preview content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['editorial', 'articleList', 'freshness', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['editorialPreview'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'editorial', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'blogPreview.featuredPost',
    categoryId: 'blogPreview',
    variantId: 'featuredPost',
    label: 'Featured post preview',
    description: 'Featured post preview for blog preview content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['editorial', 'articleList', 'freshness'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['editorialPreview'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'editorial', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'statistics.metricBand',
    categoryId: 'statistics',
    variantId: 'metricBand',
    label: 'Metric proof band',
    description: 'Metric proof band for statistics content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['metrics', 'socialProof', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['metricBand'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'statistics'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'statistics.cardGrid',
    categoryId: 'statistics',
    variantId: 'cardGrid',
    label: 'Statistic card grid',
    description: 'Statistic card grid for statistics content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['metrics', 'socialProof', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['metricBand'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'statistics'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'statistics.narrativeStats',
    categoryId: 'statistics',
    variantId: 'narrativeStats',
    label: 'Narrative statistics',
    description: 'Narrative statistics for statistics content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['metrics', 'socialProof', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['metricBand'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'statistics'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'logos.logoCloud',
    categoryId: 'logos',
    variantId: 'logoCloud',
    label: 'Logo cloud',
    description: 'Logo cloud for logos content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['brandTrust', 'partnerProof', 'socialProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'logos.partnerGrid',
    categoryId: 'logos',
    variantId: 'partnerGrid',
    label: 'Partner logo grid',
    description: 'Partner logo grid for logos content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['brandTrust', 'partnerProof', 'socialProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'logos.trustStrip',
    categoryId: 'logos',
    variantId: 'trustStrip',
    label: 'Trust logo strip',
    description: 'Trust logo strip for logos content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['brandTrust', 'partnerProof', 'socialProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'beforeAfter.pairedCards',
    categoryId: 'beforeAfter',
    variantId: 'pairedCards',
    label: 'Before-after paired cards',
    description: 'Before-after paired cards for before and after content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['beforeAfterProof', 'imageHeavy', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'trustFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'beforeAfterPairs', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'beforeAfter.sliderReady',
    categoryId: 'beforeAfter',
    variantId: 'sliderReady',
    label: 'Before-after slider-ready',
    description: 'Before-after slider-ready for before and after content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['beforeAfterProof', 'imageHeavy', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'beforeAfterPairs', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'beforeAfter.clinicalEvidence',
    categoryId: 'beforeAfter',
    variantId: 'clinicalEvidence',
    label: 'Evidence-focused before-after',
    description: 'Evidence-focused before-after for before and after content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['beforeAfterProof', 'imageHeavy', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase', 'socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'beforeAfterPairs', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'booking.appointmentPanel',
    categoryId: 'booking',
    variantId: 'appointmentPanel',
    label: 'Appointment panel',
    description: 'Appointment panel for booking content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['appointmentIntent', 'transactional', 'availability'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'bookingActions', 'openingHours', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'booking.availabilityGrid',
    categoryId: 'booking',
    variantId: 'availabilityGrid',
    label: 'Availability grid',
    description: 'Availability grid for booking content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['appointmentIntent', 'transactional', 'availability'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'bookingActions', 'openingHours', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'booking.compactScheduler',
    categoryId: 'booking',
    variantId: 'compactScheduler',
    label: 'Compact scheduler CTA',
    description: 'Compact scheduler CTA for booking content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['appointmentIntent', 'transactional', 'availability', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local', 'compact', 'minimal'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'bookingActions', 'openingHours', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'reviews.ratingSummary',
    categoryId: 'reviews',
    variantId: 'ratingSummary',
    label: 'Rating summary',
    description: 'Rating summary for reviews content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['ratings', 'socialProof', 'quotes'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'reviews.reviewCards',
    categoryId: 'reviews',
    variantId: 'reviewCards',
    label: 'Review cards',
    description: 'Review cards for reviews content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['ratings', 'socialProof', 'quotes'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'reviews.platformHighlights',
    categoryId: 'reviews',
    variantId: 'platformHighlights',
    label: 'Review platform highlights',
    description: 'Review platform highlights for reviews content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Testimonials',
    contentSignals: ['ratings', 'socialProof', 'quotes', 'leadCapture'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['socialProof'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'testimonialQuotes', 'ratingValues'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'awards.awardTimeline',
    categoryId: 'awards',
    variantId: 'awardTimeline',
    label: 'Award timeline',
    description: 'Award timeline for awards content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'brandTrust', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'awardItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'awards.badgeGrid',
    categoryId: 'awards',
    variantId: 'badgeGrid',
    label: 'Award badge grid',
    description: 'Award badge grid for awards content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'brandTrust', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'awardItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'awards.featuredAward',
    categoryId: 'awards',
    variantId: 'featuredAward',
    label: 'Featured award',
    description: 'Featured award for awards content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'brandTrust', 'regulatedContent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'awardItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'certifications.credentialCards',
    categoryId: 'certifications',
    variantId: 'credentialCards',
    label: 'Certification credential cards',
    description: 'Certification credential cards for certifications content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'regulatedContent', 'professionalProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'certificationItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'certifications.complianceList',
    categoryId: 'certifications',
    variantId: 'complianceList',
    label: 'Compliance certification list',
    description: 'Compliance certification list for certifications content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'regulatedContent', 'professionalProof', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'certificationItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'certifications.sealStrip',
    categoryId: 'certifications',
    variantId: 'sealStrip',
    label: 'Certification seal strip',
    description: 'Certification seal strip for certifications content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'TrustBadges',
    contentSignals: ['trustCredentials', 'regulatedContent', 'professionalProof'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['brandTrust'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'certificationItems', 'logoAssets'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'process.stepTimeline',
    categoryId: 'process',
    variantId: 'stepTimeline',
    label: 'Step timeline',
    description: 'Step timeline for process content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['processEducation', 'longCopy', 'serviceCatalog'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'processSteps', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'process.numberedCards',
    categoryId: 'process',
    variantId: 'numberedCards',
    label: 'Numbered process cards',
    description: 'Numbered process cards for process content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['processEducation', 'longCopy', 'serviceCatalog'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'processSteps', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'process.visualJourney',
    categoryId: 'process',
    variantId: 'visualJourney',
    label: 'Visual process journey',
    description: 'Visual process journey for process content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['processEducation', 'longCopy', 'serviceCatalog'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['supportContent', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'processSteps', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'newsletter.emailCaptureBand',
    categoryId: 'newsletter',
    variantId: 'emailCaptureBand',
    label: 'Email capture band',
    description: 'Email capture band for newsletter content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['leadCapture', 'editorial', 'secondaryConversion'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock', 'engagement'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'emailCapture', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'newsletter.editorialSignup',
    categoryId: 'newsletter',
    variantId: 'editorialSignup',
    label: 'Editorial signup',
    description: 'Editorial signup for newsletter content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['leadCapture', 'editorial', 'secondaryConversion'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock', 'engagement'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'accentContrast', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'emailCapture', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'newsletter.incentivePanel',
    categoryId: 'newsletter',
    variantId: 'incentivePanel',
    label: 'Newsletter incentive panel',
    description: 'Newsletter incentive panel for newsletter content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['leadCapture', 'editorial', 'secondaryConversion'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['conversionBlock', 'engagement'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'emailCapture', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'careers.roleList',
    categoryId: 'careers',
    variantId: 'roleList',
    label: 'Open role list',
    description: 'Open role list for careers content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['hiring', 'peopleProfiles', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory', 'resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'jobListings', 'mediaAsset', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'careers.cultureGrid',
    categoryId: 'careers',
    variantId: 'cultureGrid',
    label: 'Careers culture grid',
    description: 'Careers culture grid for careers content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['hiring', 'peopleProfiles', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory', 'resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'jobListings', 'mediaAsset', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'careers.hiringCta',
    categoryId: 'careers',
    variantId: 'hiringCta',
    label: 'Hiring CTA',
    description: 'Hiring CTA for careers content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['hiring', 'peopleProfiles', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory', 'resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'jobListings', 'mediaAsset', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'downloads.resourceCards',
    categoryId: 'downloads',
    variantId: 'resourceCards',
    label: 'Download resource cards',
    description: 'Download resource cards for downloads content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['downloadIntent', 'resourceLibrary', 'leadCapture'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'downloadableAssets', 'emailCapture'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'downloads.gatedLeadForm',
    categoryId: 'downloads',
    variantId: 'gatedLeadForm',
    label: 'Gated download form',
    description: 'Gated download form for downloads content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['downloadIntent', 'resourceLibrary', 'leadCapture'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'downloadableAssets', 'emailCapture'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'downloads.fileList',
    categoryId: 'downloads',
    variantId: 'fileList',
    label: 'Download file list',
    description: 'Download file list for downloads content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['downloadIntent', 'resourceLibrary', 'leadCapture', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['resourceLibrary'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'downloadableAssets', 'emailCapture'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'caseStudies.outcomeCards',
    categoryId: 'caseStudies',
    variantId: 'outcomeCards',
    label: 'Outcome case-study cards',
    description: 'Outcome case-study cards for case studies content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['caseStudyProof', 'longCopy', 'metrics'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'caseStudySummaries', 'statistics', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'caseStudies.longformTeasers',
    categoryId: 'caseStudies',
    variantId: 'longformTeasers',
    label: 'Long-form case-study teasers',
    description: 'Long-form case-study teasers for case studies content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['caseStudyProof', 'longCopy', 'metrics', 'leadCapture'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'conversionFocused', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'caseStudySummaries', 'statistics', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'caseStudies.metricFocused',
    categoryId: 'caseStudies',
    variantId: 'metricFocused',
    label: 'Metric-focused case studies',
    description: 'Metric-focused case studies for case studies content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['caseStudyProof', 'longCopy', 'metrics'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['caseStudy'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'copyDense'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'caseStudySummaries', 'statistics', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'comparisonTables.featureMatrix',
    categoryId: 'comparisonTables',
    variantId: 'featureMatrix',
    label: 'Feature comparison matrix',
    description: 'Feature comparison matrix for comparison tables content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['comparison', 'pricingClarity', 'featureHighlights'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'comparisonRows', 'pricingPlans'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'comparisonTables.competitorTable',
    categoryId: 'comparisonTables',
    variantId: 'competitorTable',
    label: 'Competitor comparison table',
    description: 'Competitor comparison table for comparison tables content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['comparison', 'pricingClarity', 'featureHighlights'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'comparisonRows', 'pricingPlans'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'comparisonTables.packageComparison',
    categoryId: 'comparisonTables',
    variantId: 'packageComparison',
    label: 'Package comparison table',
    description: 'Package comparison table for comparison tables content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['comparison', 'pricingClarity', 'featureHighlights'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['priceComparison', 'contentGrid'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'comparisonRows', 'pricingPlans'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'imageGrid.squareGrid',
    categoryId: 'imageGrid',
    variantId: 'squareGrid',
    label: 'Square image grid',
    description: 'Square image grid for image grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'imageGrid.editorialMosaic',
    categoryId: 'imageGrid',
    variantId: 'editorialMosaic',
    label: 'Editorial image mosaic',
    description: 'Editorial image mosaic for image grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'imageGrid.categoryTiles',
    categoryId: 'imageGrid',
    variantId: 'categoryTiles',
    label: 'Image category tiles',
    description: 'Image category tiles for image grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Gallery',
    contentSignals: ['imageHeavy', 'mediaAvailable', 'projectShowcase'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'galleryItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'videoGallery.videoCards',
    categoryId: 'videoGallery',
    variantId: 'videoCards',
    label: 'Video cards',
    description: 'Video cards for video gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['videoAvailable', 'mediaAvailable', 'processEducation'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'mediaCaptions', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'videoAssets', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'videoGallery.featuredVideo',
    categoryId: 'videoGallery',
    variantId: 'featuredVideo',
    label: 'Featured video',
    description: 'Featured video for video gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['videoAvailable', 'mediaAvailable', 'processEducation'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'mediaCaptions', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'mediaFrame', 'overlay', 'shadow'],
    themeTraits: ['professional', 'imageForward', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'videoAssets', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'videoGallery.playlistGrid',
    categoryId: 'videoGallery',
    variantId: 'playlistGrid',
    label: 'Video playlist grid',
    description: 'Video playlist grid for video gallery content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['videoAvailable', 'mediaAvailable', 'processEducation', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'mediaCaptions', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['mediaShowcase'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'mediaFrame', 'overlay'],
    themeTraits: ['professional', 'imageForward', 'copyDense', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'videoAssets', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'locations.locationCards',
    categoryId: 'locations',
    variantId: 'locationCards',
    label: 'Location cards',
    description: 'Location cards for locations content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['multiLocation', 'localDiscovery', 'contactIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['localDiscovery', 'contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'locationItems', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'locations.mapDirectory',
    categoryId: 'locations',
    variantId: 'mapDirectory',
    label: 'Map location directory',
    description: 'Map location directory for locations content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['multiLocation', 'localDiscovery', 'contactIntent', 'peopleProfiles'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['localDiscovery', 'contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'locationItems', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'locations.regionAccordion',
    categoryId: 'locations',
    variantId: 'regionAccordion',
    label: 'Region accordion',
    description: 'Region accordion for locations content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Contact',
    contentSignals: ['multiLocation', 'localDiscovery', 'contactIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['localDiscovery', 'contactGateway'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'locationItems', 'postalAddress', 'openingHours', 'mapEmbed'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'staffProfiles.credentialCards',
    categoryId: 'staffProfiles',
    variantId: 'credentialCards',
    label: 'Staff credential cards',
    description: 'Staff credential cards for staff profiles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['peopleProfiles', 'teamCredibility', 'trustCredentials'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'certificationItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'staffProfiles.compactDirectory',
    categoryId: 'staffProfiles',
    variantId: 'compactDirectory',
    label: 'Compact staff directory',
    description: 'Compact staff directory for staff profiles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['peopleProfiles', 'teamCredibility', 'trustCredentials', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'compact', 'minimal'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'certificationItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'staffProfiles.spotlightProfiles',
    categoryId: 'staffProfiles',
    variantId: 'spotlightProfiles',
    label: 'Staff spotlight profiles',
    description: 'Staff spotlight profiles for staff profiles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Team',
    contentSignals: ['peopleProfiles', 'teamCredibility', 'trustCredentials', 'downloadIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'descriptiveAlternativeText', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['peopleDirectory'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'badge', 'divider'],
    themeTraits: ['professional', 'trustFocused', 'premium'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'personProfiles', 'certificationItems', 'mediaAsset'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'openingHours.weeklyTable',
    categoryId: 'openingHours',
    variantId: 'weeklyTable',
    label: 'Weekly hours table',
    description: 'Weekly hours table for opening hours content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hours',
    contentSignals: ['availability', 'localDiscovery', 'contactIntent', 'comparison'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'openingHours.statusBanner',
    categoryId: 'openingHours',
    variantId: 'statusBanner',
    label: 'Open-status banner',
    description: 'Open-status banner for opening hours content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hours',
    contentSignals: ['availability', 'localDiscovery', 'contactIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'local'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'openingHours.compactHours',
    categoryId: 'openingHours',
    variantId: 'compactHours',
    label: 'Compact opening hours',
    description: 'Compact opening hours for opening hours content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'Hours',
    contentSignals: ['availability', 'localDiscovery', 'contactIntent', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['availability'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'local', 'compact', 'minimal'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'productCatalog.productCards',
    categoryId: 'productCatalog',
    variantId: 'productCards',
    label: 'Product catalog cards',
    description: 'Product catalog cards for product catalog content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['catalog', 'commerce', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce', 'serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'productCatalog.categoryShelves',
    categoryId: 'productCatalog',
    variantId: 'categoryShelves',
    label: 'Product category shelves',
    description: 'Product category shelves for product catalog content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['catalog', 'commerce', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce', 'serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'productCatalog.specList',
    categoryId: 'productCatalog',
    variantId: 'specList',
    label: 'Product spec list',
    description: 'Product spec list for product catalog content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['catalog', 'commerce', 'transactional', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce', 'serviceCatalog'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'copyDense', 'commerce', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'ecommerceGrid.shoppableCards',
    categoryId: 'ecommerceGrid',
    variantId: 'shoppableCards',
    label: 'Shoppable product cards',
    description: 'Shoppable product cards for ecommerce grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['commerce', 'catalog', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'ecommerceGrid.promoGrid',
    categoryId: 'ecommerceGrid',
    variantId: 'promoGrid',
    label: 'Promotional commerce grid',
    description: 'Promotional commerce grid for ecommerce grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['commerce', 'catalog', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'ecommerceGrid.quickViewReady',
    categoryId: 'ecommerceGrid',
    variantId: 'quickViewReady',
    label: 'Quick-view-ready grid',
    description: 'Quick-view-ready grid for ecommerce grid content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['commerce', 'catalog', 'transactional'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['commerce'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'conversionFocused', 'commerce'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'productItems', 'primaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'search.searchBar',
    categoryId: 'search',
    variantId: 'searchBar',
    label: 'Search bar',
    description: 'Search bar for search content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['searchIntent', 'catalog', 'resourceLibrary'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['interactiveSearch'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'commerce', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'searchConfiguration', 'itemCollection'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'search.filterPanel',
    categoryId: 'search',
    variantId: 'filterPanel',
    label: 'Filter panel search',
    description: 'Filter panel search for search content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['searchIntent', 'catalog', 'resourceLibrary'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['interactiveSearch'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'commerce', 'utility'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'searchConfiguration', 'itemCollection'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'search.resultList',
    categoryId: 'search',
    variantId: 'resultList',
    label: 'Search result list',
    description: 'Search result list for search content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['searchIntent', 'catalog', 'resourceLibrary', 'longCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['interactiveSearch'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'commerce', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'searchConfiguration', 'itemCollection'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'relatedArticles.cardRail',
    categoryId: 'relatedArticles',
    variantId: 'cardRail',
    label: 'Related article card rail',
    description: 'Related article card rail for related articles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['articleList', 'editorial', 'navigationAid'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['articleContext'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'relatedArticles.topicCluster',
    categoryId: 'relatedArticles',
    variantId: 'topicCluster',
    label: 'Topic cluster articles',
    description: 'Topic cluster articles for related articles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['articleList', 'editorial', 'navigationAid'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['articleContext'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'relatedArticles.inlineRecommendations',
    categoryId: 'relatedArticles',
    variantId: 'inlineRecommendations',
    label: 'Inline article recommendations',
    description: 'Inline article recommendations for related articles content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'headlessSection',
    contentSignals: ['articleList', 'editorial', 'navigationAid', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['articleContext'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'editorial'],
    dataRequirements: ['sectionHeading', 'bodyCopy', 'articleSummaries', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'breadcrumbs.compactTrail',
    categoryId: 'breadcrumbs',
    variantId: 'compactTrail',
    label: 'Compact breadcrumb trail',
    description: 'Compact breadcrumb trail for breadcrumbs content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    componentName: 'Breadcrumbs',
    contentSignals: ['navigationAid', 'pageHierarchy', 'searchIntent', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'utility', 'compact', 'minimal'],
    dataRequirements: ['hierarchyItems', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'breadcrumbs.schemaTrail',
    categoryId: 'breadcrumbs',
    variantId: 'schemaTrail',
    label: 'Schema-aware breadcrumb trail',
    description: 'Schema-aware breadcrumb trail for breadcrumbs content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    componentName: 'Breadcrumbs',
    contentSignals: ['navigationAid', 'pageHierarchy', 'searchIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'utility'],
    dataRequirements: ['hierarchyItems', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'breadcrumbs.overflowTrail',
    categoryId: 'breadcrumbs',
    variantId: 'overflowTrail',
    label: 'Overflow breadcrumb trail',
    description: 'Overflow breadcrumb trail for breadcrumbs content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    componentName: 'Breadcrumbs',
    contentSignals: ['navigationAid', 'pageHierarchy', 'searchIntent'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'utility'],
    dataRequirements: ['hierarchyItems', 'navigationLinks'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'sidebarNavigation.nestedMenu',
    categoryId: 'sidebarNavigation',
    variantId: 'nestedMenu',
    label: 'Nested sidebar menu',
    description: 'Nested sidebar menu for sidebar navigation content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'copyDense', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'sidebarNavigation.stickySectionNav',
    categoryId: 'sidebarNavigation',
    variantId: 'stickySectionNav',
    label: 'Sticky section navigation',
    description: 'Sticky section navigation for sidebar navigation content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'copyDense', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'sidebarNavigation.resourceNav',
    categoryId: 'sidebarNavigation',
    variantId: 'resourceNav',
    label: 'Resource sidebar navigation',
    description: 'Resource sidebar navigation for sidebar navigation content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'copyDense', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'tableOfContents.anchoredList',
    categoryId: 'tableOfContents',
    variantId: 'anchoredList',
    label: 'Anchored table of contents',
    description: 'Anchored table of contents for table of contents content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'utility', 'compact'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'tableOfContents.stickyToc',
    categoryId: 'tableOfContents',
    variantId: 'stickyToc',
    label: 'Sticky table of contents',
    description: 'Sticky table of contents for table of contents content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'copyDense', 'utility'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'tableOfContents.progressToc',
    categoryId: 'tableOfContents',
    variantId: 'progressToc',
    label: 'Progress-aware table of contents',
    description: 'Progress-aware table of contents for table of contents content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'navigationUtility',
    contentSignals: ['navigationAid', 'longCopy', 'pageHierarchy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'tableSemantics', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['aside', 'navigation'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'radius', 'shadow', 'spacingGrid', 'container'],
    themeTraits: ['professional', 'copyDense', 'utility'],
    dataRequirements: ['sectionHeading', 'navigationLinks', 'hierarchyItems'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cookieBanner.bottomBanner',
    categoryId: 'cookieBanner',
    variantId: 'bottomBanner',
    label: 'Bottom cookie banner',
    description: 'Bottom cookie banner for cookie banner content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'complianceUtility',
    contentSignals: ['legalCompliance', 'privacyNotice', 'globalMessage'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['legalCompliance', 'utility'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'utility'],
    dataRequirements: ['cookieNotice', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cookieBanner.preferenceModal',
    categoryId: 'cookieBanner',
    variantId: 'preferenceModal',
    label: 'Cookie preference modal',
    description: 'Cookie preference modal for cookie banner content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'complianceUtility',
    contentSignals: ['legalCompliance', 'privacyNotice', 'globalMessage'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'ariaLiveForDynamicState', 'dismissibleControlState', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['legalCompliance', 'utility'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'utility'],
    dataRequirements: ['cookieNotice', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'cookieBanner.compactNotice',
    categoryId: 'cookieBanner',
    variantId: 'compactNotice',
    label: 'Compact cookie notice',
    description: 'Compact cookie notice for cookie banner content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'complianceUtility',
    contentSignals: ['legalCompliance', 'privacyNotice', 'globalMessage', 'shortCopy'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['legalCompliance', 'utility'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'utility', 'compact', 'minimal'],
    dataRequirements: ['cookieNotice', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'announcementBar.topStrip',
    categoryId: 'announcementBar',
    variantId: 'topStrip',
    label: 'Top announcement strip',
    description: 'Top announcement strip for announcement bar content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'EmergencyBanner',
    contentSignals: ['timeSensitive', 'globalMessage', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['globalMessage'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'compact'],
    dataRequirements: ['announcementMessage', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'announcementBar.promoBanner',
    categoryId: 'announcementBar',
    variantId: 'promoBanner',
    label: 'Promotional announcement banner',
    description: 'Promotional announcement banner for announcement bar content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'EmergencyBanner',
    contentSignals: ['timeSensitive', 'globalMessage', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['globalMessage'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'compact'],
    dataRequirements: ['announcementMessage', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'announcementBar.emergencyNotice',
    categoryId: 'announcementBar',
    variantId: 'emergencyNotice',
    label: 'Emergency announcement notice',
    description: 'Emergency announcement notice for announcement bar content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'reactSection',
    componentName: 'EmergencyBanner',
    contentSignals: ['timeSensitive', 'globalMessage', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['globalMessage'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'compact'],
    dataRequirements: ['announcementMessage', 'primaryCta', 'secondaryCta'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'floatingActions.contactDock',
    categoryId: 'floatingActions',
    variantId: 'contactDock',
    label: 'Floating contact dock',
    description: 'Floating contact dock for floating actions content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['primaryConversion', 'contactIntent', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local', 'utility'],
    dataRequirements: ['floatingActionItems', 'primaryCta', 'contactMethods'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'floatingActions.quickCtas',
    categoryId: 'floatingActions',
    variantId: 'quickCtas',
    label: 'Floating quick CTAs',
    description: 'Floating quick CTAs for floating actions content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['primaryConversion', 'contactIntent', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local', 'utility'],
    dataRequirements: ['floatingActionItems', 'primaryCta', 'contactMethods'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'floatingActions.mobileActionBar',
    categoryId: 'floatingActions',
    variantId: 'mobileActionBar',
    label: 'Mobile floating action bar',
    description: 'Mobile floating action bar for floating actions content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['primaryConversion', 'contactIntent', 'urgentNeed'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'ariaLiveForDynamicState', 'dismissibleControlState', 'reducedMotionSafe', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'conversionBlock'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion', 'spacingSection'],
    themeTraits: ['professional', 'conversionFocused', 'local', 'utility', 'compact'],
    dataRequirements: ['floatingActionItems', 'primaryCta', 'contactMethods'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'liveChatPlaceholder.chatButton',
    categoryId: 'liveChatPlaceholder',
    variantId: 'chatButton',
    label: 'Live chat button',
    description: 'Live chat button for live chat placeholder content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['userSupport', 'contactIntent', 'availability'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'userSupport'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'local', 'utility'],
    dataRequirements: ['chatProviderPlaceholder', 'contactMethods', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'liveChatPlaceholder.supportPanel',
    categoryId: 'liveChatPlaceholder',
    variantId: 'supportPanel',
    label: 'Support chat panel',
    description: 'Support chat panel for live chat placeholder content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['userSupport', 'contactIntent', 'availability'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'userSupport'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus', 'surfaceContrast', 'accentContrast', 'zIndexOverlay', 'motion'],
    themeTraits: ['professional', 'local', 'utility'],
    dataRequirements: ['chatProviderPlaceholder', 'contactMethods', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
  {
    id: 'liveChatPlaceholder.offlineLeadCapture',
    categoryId: 'liveChatPlaceholder',
    variantId: 'offlineLeadCapture',
    label: 'Offline chat lead capture',
    description: 'Offline chat lead capture for live chat placeholder content. The descriptor binds only data requirements, layout role, accessibility expectations, and theme-token hooks so business facts remain outside presentation choices.',
    implementationType: 'floatingUtility',
    contentSignals: ['userSupport', 'contactIntent', 'availability'],
    accessibility: ['semanticHeadingStructure', 'ariaLabelledRegion', 'colorContrast', 'focusVisible', 'linkPurpose', 'keyboardReachable', 'formLabelsAndErrors', 'tableSemantics', 'ariaLiveForDynamicState', 'dismissibleControlState', 'landmarkClarity', 'listSemantics'],
    layoutRoles: ['floatingSupport', 'userSupport'],
    themeHooks: ['surface', 'textPrimary', 'textMuted', 'accent', 'border', 'ringFocus'],
    themeTraits: ['professional', 'local', 'utility'],
    dataRequirements: ['chatProviderPlaceholder', 'contactMethods', 'openingHours'],
    presentationBoundaries: ['contentComesFromSchemaData', 'variantControlsLayoutOnly', 'themeControlsVisualTokens', 'noBusinessCopyInVariant'],
  },
] as const satisfies readonly ComponentImplementationDescriptor[];

export type ComponentImplementationId = typeof componentMarketplaceImplementations[number]['id'];
export type ComponentVariantId = typeof componentMarketplaceImplementations[number]['variantId'];

export const componentMarketplaceRegistry: ComponentMarketplaceRegistry = {
  categories: componentMarketplaceCategories,
  implementations: componentMarketplaceImplementations,
};

function countMatches<TValue extends string>(candidateValues: readonly TValue[], requestedValues: readonly TValue[] | undefined): number {
  if (!requestedValues?.length) {
    return 0;
  }

  return requestedValues.filter((value) => candidateValues.includes(value)).length;
}

function limitResults<TItem>(items: readonly TItem[], limit: number | undefined): readonly TItem[] {
  if (limit === undefined) {
    return items;
  }

  if (limit <= 0) {
    return [];
  }

  return items.slice(0, limit);
}

export function listComponentMarketplaceCategories(): readonly ComponentMarketplaceCategory[] {
  return componentMarketplaceCategories;
}

export function getComponentMarketplaceCategory(categoryId: ComponentCategoryId): ComponentMarketplaceCategory | undefined {
  return componentMarketplaceCategories.find((category) => category.id === categoryId);
}

export function listComponentMarketplaceImplementations(categoryId?: ComponentCategoryId): readonly ComponentImplementationDescriptor[] {
  if (!categoryId) {
    return componentMarketplaceImplementations;
  }

  return componentMarketplaceImplementations.filter((implementation) => implementation.categoryId === categoryId);
}

export function getComponentMarketplaceImplementation(implementationId: ComponentImplementationId | string): ComponentImplementationDescriptor | undefined {
  return componentMarketplaceImplementations.find((implementation) => implementation.id === implementationId);
}

export function getComponentMarketplaceVariant(categoryId: ComponentCategoryId, variantId: ComponentVariantId | string): ComponentImplementationDescriptor | undefined {
  return componentMarketplaceImplementations.find((implementation) => implementation.categoryId === categoryId && implementation.variantId === variantId);
}

export function selectComponentMarketplaceImplementations(criteria: ComponentMarketplaceSelectionCriteria = {}): readonly ComponentImplementationDescriptor[] {
  const candidates = listComponentMarketplaceImplementations(criteria.categoryId);
  const hasRankingCriteria = Boolean(criteria.contentSignals?.length || criteria.themeTraits?.length || criteria.layoutRoles?.length || criteria.componentName);

  if (!hasRankingCriteria) {
    return limitResults(candidates, criteria.limit);
  }

  const scoredImplementations = candidates
    .map((implementation) => {
      const contentScore = countMatches(implementation.contentSignals, criteria.contentSignals) * 4;
      const themeScore = countMatches(implementation.themeTraits, criteria.themeTraits) * 3;
      const layoutScore = countMatches(implementation.layoutRoles, criteria.layoutRoles) * 2;
      const componentScore = criteria.componentName && implementation.componentName === criteria.componentName ? 3 : 0;
      const rankingScore = contentScore + themeScore + layoutScore + componentScore;
      const categoryScore = criteria.categoryId && implementation.categoryId === criteria.categoryId ? 1 : 0;

      return {
        implementation,
        rankingScore,
        totalScore: rankingScore + categoryScore,
      };
    })
    .filter((scoredImplementation) => scoredImplementation.rankingScore > 0)
    .sort((left, right) => {
      if (right.totalScore !== left.totalScore) {
        return right.totalScore - left.totalScore;
      }

      return left.implementation.label.localeCompare(right.implementation.label);
    })
    .map((scoredImplementation) => scoredImplementation.implementation);

  return limitResults(scoredImplementations, criteria.limit);
}

export function getComponentMarketplaceSummary(): ComponentMarketplaceSummary {
  return {
    categoryCount: componentMarketplaceCategories.length,
    implementationCount: componentMarketplaceImplementations.length,
  };
}

export const listComponentCategories = listComponentMarketplaceCategories;
export const getComponentCategory = getComponentMarketplaceCategory;
export const listComponentImplementations = listComponentMarketplaceImplementations;
export const getComponentImplementation = getComponentMarketplaceImplementation;
export const selectComponentImplementations = selectComponentMarketplaceImplementations;
