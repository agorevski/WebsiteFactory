import type { SafeParseLike, SchemaValidationHook, ValidationIssue } from "./types.js";

export function createSafeParseSchemaHook<TSchema = unknown>(
  id: string,
  schema: SafeParseLike<TSchema>
): SchemaValidationHook<unknown> {
  return {
    id,
    validate(data) {
      const result = schema.safeParse(data);
      if (result.success) {
        return [];
      }

      const issues = result.error?.issues;
      if (issues && issues.length > 0) {
        return issues.map((issue) => ({
          ruleId: id,
          category: "schema",
          severity: "error",
          message: issue.message,
          path: issue.path?.join(".")
        }));
      }

      return [{
        ruleId: id,
        category: "schema",
        severity: "error",
        message: result.error?.message ?? "Schema validation failed."
      }];
    }
  };
}

export function validateSchemaHooks(schema: unknown, hooks: Array<SchemaValidationHook> = []): ValidationIssue[] {
  return hooks.flatMap((hook) => hook.validate(schema) ?? []);
}
