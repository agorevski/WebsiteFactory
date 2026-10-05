import type { ComponentContentSignal, ComponentThemeTrait } from '@website-factory/components/marketplace';
import type { ThemeMode, WebsiteTheme } from '@website-factory/themes';
import { isThemeName, listThemes, resolveTheme, resolveThemeMode } from '@website-factory/themes';
import { inferContentSignals } from './signals.js';
import { isUniversalSite } from './inventory.js';
import type { ContentSignalSummary, GeneratorInput, ThemeResolutionPlan, ThemeSelectionOptions } from './types.js';

function tagMatches(tags: readonly string[], values: readonly string[]): boolean {
  return tags.some((tag) => values.includes(tag));
}

function normalizeTags(theme: WebsiteTheme): readonly string[] {
  return theme.tags.map((tag) => tag.toLowerCase());
}

export function deriveThemeTraits(theme: WebsiteTheme): readonly ComponentThemeTrait[] {
  const tags = normalizeTags(theme);
  const traits = new Set<ComponentThemeTrait>();

  if (tagMatches(tags, ['professional', 'professional-services', 'legal', 'consulting', 'enterprise', 'b2b', 'trust'])) {
    traits.add('professional');
    traits.add('trustFocused');
  }

  if (tagMatches(tags, ['clinic', 'dental', 'medical', 'healthcare', 'wellness', 'local-business', 'local-service'])) {
    traits.add('professional');
    traits.add('trustFocused');
    traits.add('local');
  }

  if (tagMatches(tags, ['hospitality', 'restaurant', 'food', 'hotel', 'portfolio', 'photography', 'visual', 'creative', 'boutique'])) {
    traits.add('imageForward');
  }

  if (tagMatches(tags, ['ecommerce', 'retail', 'shop', 'product', 'payments', 'saas'])) {
    traits.add('commerce');
    traits.add('conversionFocused');
  }

  if (tagMatches(tags, ['documentation', 'developer', 'technical', 'editorial', 'content-first', 'blog'])) {
    traits.add('editorial');
    traits.add('copyDense');
  }

  if (tagMatches(tags, ['minimal', 'one-page'])) {
    traits.add('minimal');
    traits.add('lightweight');
  }

  if (tagMatches(tags, ['premium', 'luxury', 'fine-dining'])) {
    traits.add('premium');
  }

  if (tagMatches(tags, ['creative', 'launch', 'family', 'education', 'community'])) {
    traits.add('playful');
  }

  if (theme.defaultMode === 'highContrast' || theme.supportedModes.includes('highContrast')) {
    traits.add('highContrast');
  }

  if (theme.tokens.hero.layout === 'media' || theme.tokens.hero.layout === 'editorial' || theme.tokens.hero.mediaShape === 'bleed') {
    traits.add('imageForward');
  }

  if (theme.tokens.navigation.layout === 'sidebar' || theme.tokens.footer.density === 'compact') {
    traits.add('utility');
    traits.add('compact');
  }

  if (theme.tokens.cards.standard.shadow === 'none' && theme.tokens.hero.overlay === 'none') {
    traits.add('minimal');
  }

  if (traits.size === 0) {
    traits.add('professional');
  }

  return [...traits].sort();
}

function getRequestedTheme(input: GeneratorInput, options: ThemeSelectionOptions): string | undefined {
  if (options.themeName) {
    return options.themeName;
  }

  if (isUniversalSite(input)) {
    return input.theme.name;
  }

  return undefined;
}

function getRequestedMode(input: GeneratorInput, options: ThemeSelectionOptions): ThemeMode | undefined {
  if (options.mode) {
    return options.mode;
  }

  if (isUniversalSite(input)) {
    return input.theme.mode;
  }

  if (input.theme.mode === 'light' || input.theme.mode === 'dark') {
    return input.theme.mode;
  }

  return undefined;
}

function desiredThemeTags(summary: ContentSignalSummary): readonly string[] {
  const tags = new Set<string>(summary.inventory.verticals.map((vertical) => vertical.toLowerCase()));
  const signalIds = new Set<ComponentContentSignal>(summary.signalIds);

  if (['dentist', 'doctor', 'medical-clinic', 'veterinary'].some((vertical) => tags.has(vertical))) {
    tags.add('clinic');
    tags.add('healthcare');
  }

  if (tags.has('dentist')) {
    tags.add('dental');
  }

  if (['attorney', 'professional-services', 'agency'].some((vertical) => tags.has(vertical))) {
    tags.add('professional');
    tags.add('trust');
  }

  if (['restaurant', 'hotel'].some((vertical) => tags.has(vertical))) {
    tags.add('hospitality');
  }

  if (['landscaper', 'construction', 'hvac', 'plumber', 'home-services'].some((vertical) => tags.has(vertical))) {
    tags.add('trade');
    tags.add('local-service');
  }

  if (signalIds.has('commerce') || signalIds.has('catalog')) {
    tags.add('ecommerce');
    tags.add('product');
  }

  if (signalIds.has('editorial') || signalIds.has('articleList')) {
    tags.add('editorial');
    tags.add('content-first');
  }

  if (signalIds.has('localDiscovery')) {
    tags.add('local-business');
    tags.add('local-service');
  }

  if (signalIds.has('trustCredentials') || signalIds.has('regulatedContent')) {
    tags.add('trust');
    tags.add('professional');
  }

  return [...tags];
}

function scoreTheme(theme: WebsiteTheme, desiredTags: readonly string[]): number {
  const tags = normalizeTags(theme);
  const id = theme.id.toLowerCase();
  const displayName = theme.displayName.toLowerCase();
  const description = theme.description.toLowerCase();

  return desiredTags.reduce((score, tag) => {
    const tagScore = tags.includes(tag) ? 6 : 0;
    const idScore = id.includes(tag) ? 3 : 0;
    const nameScore = displayName.includes(tag) ? 2 : 0;
    const descriptionScore = description.includes(tag) ? 1 : 0;
    return score + tagScore + idScore + nameScore + descriptionScore;
  }, 0);
}

function selectContentMatchedTheme(summary: ContentSignalSummary): WebsiteTheme {
  const desiredTags = desiredThemeTags(summary);
  const rankedThemes = listThemes()
    .map((theme) => ({ theme, score: scoreTheme(theme, desiredTags) }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.theme.displayName.localeCompare(right.theme.displayName);
    });

  const match = rankedThemes[0];
  return match && match.score > 0 ? match.theme : resolveTheme();
}

function matchedTags(theme: WebsiteTheme, summary: ContentSignalSummary): readonly string[] {
  const themeTags = normalizeTags(theme);
  const desiredTags = desiredThemeTags(summary);
  return themeTags.filter((tag) => desiredTags.includes(tag)).sort();
}

export function selectThemeForContent(
  input: GeneratorInput,
  summary: ContentSignalSummary = inferContentSignals(input),
  options: ThemeSelectionOptions = {}
): ThemeResolutionPlan {
  const requestedThemeId = getRequestedTheme(input, options);
  const requestedMode = getRequestedMode(input, options);
  const hasExplicitTheme = Boolean(options.themeName);
  const hasSiteTheme = Boolean(requestedThemeId && !hasExplicitTheme);
  const theme = requestedThemeId && isThemeName(requestedThemeId)
    ? resolveTheme(requestedThemeId)
    : selectContentMatchedTheme(summary);
  const source = requestedThemeId && isThemeName(requestedThemeId)
    ? hasExplicitTheme ? 'explicit' : hasSiteTheme ? 'site-theme' : 'default'
    : theme.id === resolveTheme().id ? 'default' : 'content-match';
  const basePlan = {
    resolvedThemeId: theme.id,
    displayName: theme.displayName,
    mode: resolveThemeMode(theme, requestedMode),
    traits: deriveThemeTraits(theme),
    matchedTags: matchedTags(theme, summary),
    source,
    theme
  } satisfies Omit<ThemeResolutionPlan, 'requestedThemeId'>;

  if (!requestedThemeId) {
    return basePlan;
  }

  return {
    ...basePlan,
    requestedThemeId
  };
}
