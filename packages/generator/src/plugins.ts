import type {
  GeneratorHookContext,
  GeneratorLifecycleEvent,
  GeneratorLifecycleEventName,
  GeneratorPlugin
} from './types.js';

export const defaultGeneratorLifecycleEvents = [
  'generator:init',
  'content:signals:inferred',
  'sections:inferred',
  'template:resolved',
  'theme:resolved',
  'components:selected',
  'plan:created',
  'plan:validated'
] as const satisfies readonly GeneratorLifecycleEventName[];

export function createGeneratorPlugin(plugin: GeneratorPlugin): GeneratorPlugin {
  if (plugin.id.trim().length === 0) {
    throw new Error('Generator plugin id must be a non-empty string.');
  }

  return plugin;
}

export function appendLifecycleEvent(
  lifecycleEvents: readonly GeneratorLifecycleEvent[],
  name: GeneratorLifecycleEventName,
  summary: string
): readonly GeneratorLifecycleEvent[] {
  return [
    ...lifecycleEvents,
    {
      name,
      sequence: lifecycleEvents.length + 1,
      summary
    }
  ];
}

export function runGeneratorHooks(
  eventName: GeneratorLifecycleEventName,
  context: GeneratorHookContext,
  plugins: readonly GeneratorPlugin[] = []
): GeneratorHookContext {
  return plugins.reduce((currentContext, plugin) => {
    const hooks = plugin.hooks?.[eventName] ?? [];
    return hooks.reduce((hookContext, hook) => hook(hookContext) ?? hookContext, currentContext);
  }, context);
}
