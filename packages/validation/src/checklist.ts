import type { PageValidationInput, ValidationIssue } from "./types.js";

export interface ChecklistItem {
  id: string;
  label: string;
  category: "a11y" | "seo" | "performance" | "responsive";
  passed: boolean;
  severity: "error" | "warning" | "info";
  help?: string;
}

export function createA11yChecklist(input: PageValidationInput): ChecklistItem[] {
  const headings = input.headings ?? [];
  const controls = input.formControls ?? [];
  const images = input.images ?? [];
  const landmarks = input.landmarks ?? [];
  const aria = input.aria ?? [];
  const motion = input.motion;

  return [
    {
      id: "one-h1",
      label: "Page has one h1",
      category: "a11y",
      severity: "error",
      passed: headings.filter((heading) => heading.level === 1).length === 1
    },
    {
      id: "alt-text",
      label: "Informative images have alt text",
      category: "a11y",
      severity: "error",
      passed: images.every((image) => image.decorative || Boolean(image.alt?.trim()))
    },
    {
      id: "form-labels",
      label: "Form controls have labels",
      category: "a11y",
      severity: "error",
      passed: controls
        .filter((control) => !control.hidden)
        .every((control) => Boolean(control.label?.trim() || control.ariaLabel?.trim() || control.ariaLabelledBy?.trim()))
    },
    {
      id: "keyboard-navigation",
      label: "Interactive elements are keyboard navigable",
      category: "a11y",
      severity: "warning",
      passed: (input.interactive ?? []).every((node) => {
        const nativeElement = node.tagName && ["button", "a", "input", "select", "textarea", "summary"].includes(node.tagName);
        return nativeElement || node.tabIndex !== undefined || node.hasKeyboardHandler;
      })
    },
    {
      id: "main-landmark",
      label: "Page exposes one main landmark",
      category: "a11y",
      severity: "warning",
      passed: landmarks.length === 0 || landmarks.filter((landmark) => landmark.role === "main").length === 1
    },
    {
      id: "aria-integrity",
      label: "ARIA references and attributes are valid",
      category: "a11y",
      severity: "error",
      passed: aria.every((node) => (node.invalidAttributes ?? []).length === 0 && (node.missingReferences ?? []).length === 0 && !(node.ariaHidden && node.focusable))
    },
    {
      id: "screen-reader-basics",
      label: "Document has screen reader basics",
      category: "a11y",
      severity: "warning",
      passed: input.screenReader
        ? input.screenReader.hasDocumentTitle !== false && input.screenReader.hasLangAttribute !== false
        : true
    },
    {
      id: "reduced-motion",
      label: "Motion honors reduced-motion preferences",
      category: "a11y",
      severity: "warning",
      passed: !motion || (motion.animatedSelectors ?? []).length === 0 || motion.honorsReducedMotion === true
    }
  ];
}

export function checklistToIssues(items: ChecklistItem[], path?: string): ValidationIssue[] {
  return items
    .filter((item) => !item.passed)
    .map((item) => ({
      ruleId: `checklist-${item.id}`,
      category: item.category,
      severity: item.severity,
      message: item.label,
      path,
      help: item.help
    }));
}
