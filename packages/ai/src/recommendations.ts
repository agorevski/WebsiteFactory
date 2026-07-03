import { createDeterministicId, normalizeScore } from "./common.js";

export interface RecommendationContext {
  readonly industry?: string;
  readonly audience?: string;
  readonly goals: readonly string[];
  readonly requiredCapabilities: readonly string[];
  readonly preferredMood?: string;
}

export interface TemplateOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly industries: readonly string[];
  readonly capabilities: readonly string[];
  readonly pageTypes: readonly string[];
}

export interface ThemeOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly moods: readonly string[];
  readonly colorTokens: readonly string[];
  readonly fontTokens: readonly string[];
}

export interface Recommendation<TOption> {
  readonly id: string;
  readonly option: TOption;
  readonly score: number;
  readonly reasons: readonly string[];
  readonly cautions: readonly string[];
}

export function recommendTemplates(
  context: RecommendationContext,
  options: readonly TemplateOption[],
  limit = 3
): readonly Recommendation<TemplateOption>[] {
  return rankRecommendations(
    options.map((option) => scoreTemplate(context, option)),
    limit
  );
}

export function recommendThemes(
  context: RecommendationContext,
  options: readonly ThemeOption[],
  limit = 3
): readonly Recommendation<ThemeOption>[] {
  return rankRecommendations(
    options.map((option) => scoreTheme(context, option)),
    limit
  );
}

function scoreTemplate(
  context: RecommendationContext,
  option: TemplateOption
): Recommendation<TemplateOption> {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 0.35;

  const industryMatches = keywordOverlap([context.industry], option.industries);
  if (industryMatches > 0) {
    score += 0.25;
    reasons.push("matches the requested industry");
  }

  const capabilityMatches = keywordOverlap(context.requiredCapabilities, option.capabilities);
  if (context.requiredCapabilities.length > 0) {
    score += 0.3 * capabilityMatches;
    if (capabilityMatches === 1) {
      reasons.push("covers every required capability");
    } else if (capabilityMatches > 0) {
      reasons.push("covers some required capabilities");
      cautions.push("review missing capabilities before selection");
    } else {
      cautions.push("does not advertise the required capabilities");
    }
  }

  const goalMatches = keywordOverlap(context.goals, [...option.capabilities, ...option.pageTypes, option.description]);
  if (goalMatches > 0) {
    score += 0.1 * goalMatches;
    reasons.push("aligns with stated site goals");
  }

  return createRecommendation(option, score, reasons, cautions);
}

function scoreTheme(
  context: RecommendationContext,
  option: ThemeOption
): Recommendation<ThemeOption> {
  const reasons: string[] = [];
  const cautions: string[] = [];
  let score = 0.4;

  if (context.preferredMood !== undefined && keywordOverlap([context.preferredMood], option.moods) > 0) {
    score += 0.35;
    reasons.push("matches the preferred mood");
  }

  const goalMatches = keywordOverlap(context.goals, [option.description, ...option.moods]);
  if (goalMatches > 0) {
    score += 0.15 * goalMatches;
    reasons.push("supports stated brand goals");
  }

  if (option.colorTokens.length === 0) {
    cautions.push("does not declare color tokens");
  }

  if (option.fontTokens.length === 0) {
    cautions.push("does not declare font tokens");
  }

  return createRecommendation(option, score, reasons, cautions);
}

function createRecommendation<TOption extends { readonly id: string }>(
  option: TOption,
  score: number,
  reasons: readonly string[],
  cautions: readonly string[]
): Recommendation<TOption> {
  return {
    id: createDeterministicId("recommendation", option.id, score, reasons, cautions),
    option,
    score: normalizeScore(score),
    reasons: reasons.length > 0 ? [...reasons].sort() : ["baseline deterministic fit"],
    cautions: [...cautions].sort()
  };
}

function rankRecommendations<TOption>(
  recommendations: readonly Recommendation<TOption>[],
  limit: number
): readonly Recommendation<TOption>[] {
  return [...recommendations]
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.id.localeCompare(right.id);
    })
    .slice(0, Math.max(0, limit));
}

function keywordOverlap(
  requestedValues: readonly (string | undefined)[],
  availableValues: readonly string[]
): number {
  const requested = tokenize(requestedValues.filter((value): value is string => value !== undefined).join(" "));
  const available = tokenize(availableValues.join(" "));

  if (requested.size === 0 || available.size === 0) {
    return 0;
  }

  let matches = 0;
  for (const token of requested) {
    if (available.has(token)) {
      matches += 1;
    }
  }

  return matches / requested.size;
}

function tokenize(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 1)
  );
}
