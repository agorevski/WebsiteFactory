import type { WebsiteData } from '@website-factory/schema';
import type { ThemeMode, WebsiteTheme } from '@website-factory/themes';
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';
export type CtaVariant = 'primary' | 'secondary' | 'ghost' | 'link';
export type SectionComponentName = 'Hero' | 'Navigation' | 'Contact' | 'Services' | 'FAQ' | 'Testimonials' | 'Gallery' | 'Team' | 'Pricing' | 'Footer' | 'Breadcrumbs' | 'TrustBadges' | 'Hours' | 'EmergencyBanner';
export type SchemaSectionType = Extract<keyof WebsiteData, 'hero' | 'services' | 'pricing' | 'faq' | 'reviews' | 'testimonials' | 'gallery' | 'team' | 'hours' | 'contact'> | 'navigation' | 'breadcrumbs' | 'trustBadges' | 'footer' | 'emergencyBanner';
export interface ComponentSchemaContext<TData = unknown> {
    readonly id?: string;
    readonly type: SchemaSectionType | string;
    readonly data?: TData;
    readonly source?: keyof WebsiteData;
}
export interface ThemeAwareProps {
    readonly id?: string;
    readonly className?: string;
    readonly theme?: WebsiteTheme;
    readonly mode?: ThemeMode;
}
export interface SectionProps<TData, TVariant extends string = string> extends ThemeAwareProps {
    readonly data: TData;
    readonly variant?: TVariant;
    readonly schema?: ComponentSchemaContext<TData>;
    readonly website?: WebsiteData;
}
export interface ImageAsset {
    readonly src: string;
    readonly alt: string;
    readonly width?: number;
    readonly height?: number;
    readonly loading?: 'lazy' | 'eager';
}
export interface CallToAction {
    readonly label: string;
    readonly href: string;
    readonly variant?: CtaVariant;
    readonly ariaLabel?: string;
    readonly external?: boolean;
}
export interface LinkItem {
    readonly label: string;
    readonly href: string;
    readonly current?: boolean;
    readonly external?: boolean;
}
export interface BrandIdentity {
    readonly name: string;
    readonly href?: string;
    readonly logo?: ImageAsset;
    readonly tagline?: string;
}
export interface PostalAddress {
    readonly street?: string;
    readonly city?: string;
    readonly region?: string;
    readonly postalCode?: string;
    readonly country?: string;
}
export interface ContactMethod {
    readonly label: string;
    readonly value: string;
    readonly href?: string;
}
export interface HoursEntry {
    readonly days: string;
    readonly opens?: string;
    readonly closes?: string;
    readonly note?: string;
}
export interface SocialLink extends LinkItem {
    readonly platform?: string;
}
export interface HeroData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly subtitle?: string;
    readonly description?: string;
    readonly headingLevel?: HeadingLevel;
    readonly ctas?: readonly CallToAction[];
    readonly image?: ImageAsset;
    readonly backgroundImage?: ImageAsset;
    readonly trustBadges?: readonly string[];
}
export interface NavigationData {
    readonly brand: BrandIdentity;
    readonly links: readonly LinkItem[];
    readonly cta?: CallToAction;
    readonly utilityLinks?: readonly LinkItem[];
}
export interface ContactFormField {
    readonly name: string;
    readonly label: string;
    readonly type?: 'text' | 'email' | 'tel' | 'phone' | 'textarea';
    readonly required?: boolean;
    readonly placeholder?: string;
}
export interface ContactFormConfig {
    readonly action: string;
    readonly method?: 'get' | 'post';
    readonly submitLabel: string;
    readonly fields: readonly ContactFormField[];
}
export interface ContactData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly address?: PostalAddress;
    readonly phone?: ContactMethod;
    readonly email?: ContactMethod;
    readonly methods?: readonly ContactMethod[];
    readonly hours?: readonly HoursEntry[];
    readonly mapEmbedUrl?: string;
    readonly form?: ContactFormConfig;
}
export interface ServiceItem {
    readonly title: string;
    readonly description: string;
    readonly icon?: string;
    readonly href?: string;
    readonly features?: readonly string[];
}
export interface ServicesData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly services: readonly ServiceItem[];
}
export interface FAQItem {
    readonly question: string;
    readonly answer: string;
}
export interface FAQData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly items: readonly FAQItem[];
}
export interface TestimonialItem {
    readonly quote: string;
    readonly author: string;
    readonly role?: string;
    readonly rating?: number;
    readonly image?: ImageAsset;
}
export interface TestimonialsData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly testimonials: readonly TestimonialItem[];
}
export interface GalleryItem {
    readonly image: ImageAsset;
    readonly caption?: string;
    readonly href?: string;
}
export interface GalleryData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly items: readonly GalleryItem[];
}
export interface TeamMember {
    readonly name: string;
    readonly role: string;
    readonly bio?: string;
    readonly image?: ImageAsset;
    readonly links?: readonly SocialLink[];
}
export interface TeamData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly members: readonly TeamMember[];
}
export interface PricingPlan {
    readonly name: string;
    readonly price: string;
    readonly period?: string;
    readonly description?: string;
    readonly features: readonly string[];
    readonly cta?: CallToAction;
    readonly highlighted?: boolean;
}
export interface PricingData {
    readonly eyebrow?: string;
    readonly title: string;
    readonly description?: string;
    readonly plans: readonly PricingPlan[];
}
export interface FooterColumn {
    readonly title: string;
    readonly links: readonly LinkItem[];
}
export interface FooterData {
    readonly brand: BrandIdentity;
    readonly description?: string;
    readonly columns?: readonly FooterColumn[];
    readonly socialLinks?: readonly SocialLink[];
    readonly legalLinks?: readonly LinkItem[];
    readonly copyright?: string;
    readonly address?: PostalAddress;
    readonly phone?: ContactMethod;
    readonly email?: ContactMethod;
}
export interface BreadcrumbItem extends LinkItem {
    readonly current?: boolean;
}
export interface BreadcrumbsData {
    readonly items: readonly BreadcrumbItem[];
}
export interface TrustBadgesData {
    readonly badges: readonly string[];
}
export interface HoursData {
    readonly title?: string;
    readonly entries: readonly HoursEntry[];
}
export interface EmergencyBannerData {
    readonly message: string;
    readonly cta?: CallToAction;
    readonly tone?: 'info' | 'warning' | 'urgent';
}
//# sourceMappingURL=types.d.ts.map