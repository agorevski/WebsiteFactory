import type { GenerationDiagnostic, GenerationPlan, GenerationPlanValidationResult, GenerationPlanValidator } from './types.js';

function createDiagnostic(code: string, severity: GenerationDiagnostic['severity'], message: string, source = 'generator.validation'): GenerationDiagnostic {
  return {
    code,
    severity,
    message,
    source,
    path: []
  };
}

function validateSelectedSections(plan: GenerationPlan): readonly GenerationDiagnostic[] {
  const diagnostics: GenerationDiagnostic[] = [];

  if (plan.sections.length === 0) {
    diagnostics.push(createDiagnostic(
      'generator.plan.sections.empty',
      'warning',
      'Generation plan has no selected sections. This is valid for sparse data, but callers should confirm the content source is complete.'
    ));
  }

  for (const section of plan.sections) {
    if (section.categoryId !== section.selectedImplementation.categoryId) {
      diagnostics.push(createDiagnostic(
        'generator.plan.section.category-mismatch',
        'error',
        `Selected implementation ${section.selectedImplementation.id} does not match section category ${section.categoryId}.`,
        `sections.${section.id}`
      ));
    }

    const missingRequirements = section.dataRequirements.filter((requirement) => !section.selectedImplementation.dataRequirements.includes(requirement));
    if (missingRequirements.length > 0) {
      diagnostics.push(createDiagnostic(
        'generator.plan.section.requirement-mismatch',
        'warning',
        `Selected implementation ${section.selectedImplementation.id} does not declare all inferred data requirements: ${missingRequirements.join(', ')}.`,
        `sections.${section.id}`
      ));
    }
  }

  return diagnostics;
}

function validateStaticPlan(plan: GenerationPlan): readonly GenerationDiagnostic[] {
  const diagnostics: GenerationDiagnostic[] = [];
  const routePaths = new Set<string>();

  if (plan.staticPlan.routes.length === 0) {
    diagnostics.push(createDiagnostic('generator.plan.routes.empty', 'error', 'Generation plan must include at least one static route.'));
  }

  for (const route of plan.staticPlan.routes) {
    if (!route.path.startsWith('/')) {
      diagnostics.push(createDiagnostic('generator.plan.route.relative-path', 'error', `Route ${route.id} path must start with /.`, `routes.${route.id}`));
    }

    if (routePaths.has(route.path)) {
      diagnostics.push(createDiagnostic('generator.plan.route.duplicate-path', 'error', `Route path ${route.path} is duplicated.`, `routes.${route.id}`));
    }

    routePaths.add(route.path);
  }

  return diagnostics;
}

export function validateGenerationPlan(
  plan: GenerationPlan,
  validators: readonly GenerationPlanValidator[] = []
): GenerationPlanValidationResult {
  const diagnostics = [
    ...validateSelectedSections(plan),
    ...validateStaticPlan(plan),
    ...validators.flatMap((validator) => validator(plan))
  ];

  return {
    valid: !diagnostics.some((diagnostic) => diagnostic.severity === 'error'),
    diagnostics
  };
}
