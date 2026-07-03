import { createDeterministicId, normalizeScore, type SourceReference } from "./common.js";

export type ResearchPriority = "required" | "recommended" | "optional";

export interface BusinessResearchInput {
  readonly businessName: string;
  readonly websiteUrl?: string;
  readonly industry?: string;
  readonly location?: string;
  readonly targetAudiences: readonly string[];
  readonly offerings: readonly string[];
  readonly competitors: readonly string[];
  readonly differentiators: readonly string[];
  readonly goals: readonly string[];
  readonly constraints: readonly string[];
}

export interface BusinessResearchQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly rationale: string;
  readonly priority: ResearchPriority;
}

export interface BusinessResearchPlan {
  readonly id: string;
  readonly input: BusinessResearchInput;
  readonly questions: readonly BusinessResearchQuestion[];
}

export interface ResearchFinding {
  readonly topic: string;
  readonly summary: string;
  readonly confidence: number;
  readonly sources: readonly SourceReference[];
}

export interface BusinessResearchResult {
  readonly id: string;
  readonly businessName: string;
  readonly summary: string;
  readonly audienceInsights: readonly ResearchFinding[];
  readonly competitorInsights: readonly ResearchFinding[];
  readonly positioning: readonly ResearchFinding[];
  readonly contentOpportunities: readonly ResearchFinding[];
  readonly risks: readonly ResearchFinding[];
  readonly sources: readonly SourceReference[];
  readonly confidence: number;
}

export function defineBusinessResearchInput(input: BusinessResearchInput): BusinessResearchInput {
  return {
    ...input,
    targetAudiences: sortText(input.targetAudiences),
    offerings: sortText(input.offerings),
    competitors: sortText(input.competitors),
    differentiators: sortText(input.differentiators),
    goals: sortText(input.goals),
    constraints: sortText(input.constraints)
  };
}

export function createBusinessResearchPlan(input: BusinessResearchInput): BusinessResearchPlan {
  const normalizedInput = defineBusinessResearchInput(input);
  const questions = [
    createQuestion(
      normalizedInput,
      "What does the business offer, who is it for, and what outcomes should the website optimize for?",
      "Defines website positioning and conversion priorities.",
      "required"
    ),
    createQuestion(
      normalizedInput,
      "Which audience segments, objections, and buying triggers should the content address?",
      "Ensures generated content is grounded in audience needs.",
      "required"
    ),
    createQuestion(
      normalizedInput,
      "Which competitors or alternatives should influence differentiation and proof points?",
      "Prevents generic messaging and supports comparative positioning.",
      normalizedInput.competitors.length > 0 ? "required" : "recommended"
    ),
    createQuestion(
      normalizedInput,
      "Which trust signals, evidence, and calls to action should appear across the site?",
      "Improves conversion-oriented page planning.",
      "recommended"
    ),
    createQuestion(
      normalizedInput,
      "Are there regulatory, brand, accessibility, or factual constraints the generated YAML must respect?",
      "Feeds validation and repair loops with explicit constraints.",
      normalizedInput.constraints.length > 0 ? "required" : "recommended"
    )
  ];

  return {
    id: createDeterministicId("business-research-plan", normalizedInput),
    input: normalizedInput,
    questions
  };
}

export function createEmptyResearchResult(input: BusinessResearchInput): BusinessResearchResult {
  const normalizedInput = defineBusinessResearchInput(input);
  const summary = `${normalizedInput.businessName} requires provider-supplied research before website YAML is finalized.`;

  return {
    id: createDeterministicId("business-research-result", normalizedInput, "empty"),
    businessName: normalizedInput.businessName,
    summary,
    audienceInsights: [],
    competitorInsights: [],
    positioning: [],
    contentOpportunities: [],
    risks: [],
    sources: [],
    confidence: 0
  };
}

export function createResearchFinding(
  topic: string,
  summary: string,
  confidence: number,
  sources: readonly SourceReference[] = []
): ResearchFinding {
  return {
    topic,
    summary,
    confidence: normalizeScore(confidence),
    sources: [...sources].sort((left, right) => left.id.localeCompare(right.id))
  };
}

function createQuestion(
  input: BusinessResearchInput,
  prompt: string,
  rationale: string,
  priority: ResearchPriority
): BusinessResearchQuestion {
  return {
    id: createDeterministicId("research-question", input.businessName, prompt),
    prompt,
    rationale,
    priority
  };
}

function sortText(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
}
