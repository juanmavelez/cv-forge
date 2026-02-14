import { type, number, boolean, tuple, coerce, create, unknown, optional } from 'superstruct';
import { defaultStyle, type StyleConfig } from './types';

// Coerce invalid colors (e.g. null, missing) to undefined
// This allows the merge step to pick up the default color
const SafeColor = coerce(
    optional(tuple([number(), number(), number()])),
    unknown(),
    (value) => {
        if (Array.isArray(value) && value.length === 3 && value.every(n => typeof n === 'number')) {
            return value as [number, number, number];
        }
        return undefined;
    }
);

// Use 'type' to allow unknown properties (safe forward compatibility)
// We only care about validating the known fields
const SafeFontStyle = type({
    size: optional(number()),
    color: SafeColor,
    bold: optional(boolean()),
    italic: optional(boolean()),
});

const StyleSchema = type({
    title1: optional(SafeFontStyle),
    title2: optional(SafeFontStyle),
    title3: optional(SafeFontStyle),
    text1: optional(SafeFontStyle),
    text2: optional(SafeFontStyle),
    sub: optional(SafeFontStyle),
});

export function validateAndMergeStyle(input: unknown): StyleConfig {
    // 1. Sanitize input: coerces invalid types to undefined, validates structure
    const sanitized = create(input || {}, StyleSchema);
    const defaults = defaultStyle();

    // 2. Merge with defaults
    // Since 'sanitized' has validated fields (or undefined), this overrides defaults safely
    return {
        title1: { ...defaults.title1, ...sanitized.title1 },
        title2: { ...defaults.title2, ...sanitized.title2 },
        title3: { ...defaults.title3, ...sanitized.title3 },
        text1: { ...defaults.text1, ...sanitized.text1 },
        text2: { ...defaults.text2, ...sanitized.text2 },
        sub: { ...defaults.sub, ...sanitized.sub },
    };
}
