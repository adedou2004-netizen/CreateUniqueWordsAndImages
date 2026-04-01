export const PROMPT_TEMPLATE = `Create a child-friendly illustration for a vocabulary matching game.

Style rules (must follow):
- Flat cartoon style
- Thick, clean outlines
- High contrast
- Minimal details
- No text, no letters, no numbers, no symbols

Word to illustrate: [WORD]

Concept rule:
Represent the word using ONE simple, iconic object or visual state that clearly suggests the meaning without showing a full scene.
- Do NOT show rooms, classrooms, landscapes, or multiple unrelated objects
- Do NOT show characters unless absolutely necessary
- Focus on symbolic clarity, not realism

Visual composition:
- One main object (or one clear comparison if the word requires contrast, e.g. before/after)
- Centered composition
- Plain, soft background
- Easy to recognize at very small sizes

Format:
- Square image (1:1)
- Bright, soft, kid-friendly colors

Target audience:
Children aged 4–8

Important:
The image must allow the child to guess the word visually without any written clues.

For contrast words (before / after, empty / full, old / new):
- Show a clear visual contrast using the same object in two different states.
- Keep scale, framing, and style identical.

For abstract words (art, idea, magic, luck):
- Use a universally recognizable symbol commonly associated with the concept.`;

export function generatePrompt(word: string): string {
    return PROMPT_TEMPLATE.replace('[WORD]', word.trim());
}
