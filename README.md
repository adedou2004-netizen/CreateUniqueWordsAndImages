# Mamie Lemonde Utility Hub

A small Next.js utility app for vocabulary-image preparation and prompt generation.

## Book Image Utility

The **Book Image Utility** is designed for the Canva workflow used for vocabulary books.

### Workflow

1. In Canva, name the vocabulary image pages simply:
   - `1`
   - `2`
   - `3`
   - and so on.
2. Download the images as PNG/JPG files to a normal folder.
3. Open **Book Images** in this app.
4. Sign in with the Supabase administrator email.
5. Choose the matching Supabase vocabulary list.
6. Select all the numbered Canva images at once.
7. Review the automatic matches.
8. Upload the batch.

The utility matches the number in the Canva filename to the vocabulary-list position.

Example:

- `1.png` + list position 1 = `flower`
- `2.png` + list position 2 = `baby`
- `10.png` + list position 10 = `spoon`

For list 241, the resulting names are:

- `241_1_flower.png`
- `241_2_baby.png`
- `241_10_spoon.png`

After upload, the utility also saves the new filename in
`vocabulary_list_items.uploaded_image_url`.

## Other Tool

- **Prompt Generator** — creates child-friendly image prompts from a single word or a vocabulary file.

## Supabase configuration

The browser must use a **publishable/anon key only**.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dbqrenlvinqheyjppxby.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never place a Supabase service-role key in a `NEXT_PUBLIC_*` variable or commit it to GitHub.

The `word-images` bucket is protected by Storage policies so authenticated administrator users can upload/update files.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
