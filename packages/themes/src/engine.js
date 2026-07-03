import { themes } from './themes';
export const defaultThemeName = 'modern';
export function listThemes() {
    return Object.values(themes);
}
export function isThemeName(value) {
    return Object.prototype.hasOwnProperty.call(themes, value);
}
export function getTheme(name = defaultThemeName) {
    return themes[name];
}
export function resolveTheme(name) {
    return name && isThemeName(name) ? getTheme(name) : getTheme(defaultThemeName);
}
export function resolveThemeMode(theme, requestedMode) {
    if (requestedMode && theme.supportedModes.includes(requestedMode)) {
        return requestedMode;
    }
    return theme.defaultMode;
}
export function mergeTheme(theme, overrides) {
    return {
        ...theme,
        ...overrides,
        id: theme.id,
        tokens: {
            ...theme.tokens,
            ...overrides.tokens
        }
    };
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function flattenTokens(prefix, value, target) {
    if (typeof value === 'string' || typeof value === 'number') {
        target[prefix] = String(value);
        return;
    }
    if (!isRecord(value)) {
        return;
    }
    for (const [key, nestedValue] of Object.entries(value)) {
        flattenTokens(`${prefix}-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, nestedValue, target);
    }
}
export function themeToCssVariables(theme, mode = theme.defaultMode) {
    const resolvedMode = resolveThemeMode(theme, mode);
    const variables = {};
    const tokenGroups = {
        colors: theme.tokens.modes[resolvedMode],
        typography: theme.tokens.typography,
        spacing: theme.tokens.spacing,
        radius: theme.tokens.radius,
        elevation: theme.tokens.elevation,
        buttons: theme.tokens.buttons,
        animation: theme.tokens.animation,
        navigation: theme.tokens.navigation,
        footer: theme.tokens.footer
    };
    for (const [group, value] of Object.entries(tokenGroups)) {
        flattenTokens(`--wf-${group}`, value, variables);
    }
    return variables;
}
export function themeCssText(theme, mode = theme.defaultMode) {
    return Object.entries(themeToCssVariables(theme, mode))
        .map(([property, value]) => `${property}: ${value};`)
        .join('\n');
}
export function themeClassNames(theme, mode = theme.defaultMode) {
    return [`theme-${theme.id}`, `theme-mode-${resolveThemeMode(theme, mode)}`];
}
//# sourceMappingURL=engine.js.map