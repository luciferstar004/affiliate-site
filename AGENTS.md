# Curated Picks Repository Guidance

## Project

This is a static affiliate website built with HTML, CSS, JavaScript, and JSON.
GitHub Pages publishes the files from the repository.

## Before Editing

- Read `README.md`.
- Run `npm test`.
- Preserve the Google Analytics and Search Console verification IDs unless the user asks to change them.

## Product Rules

- Product records live in `products/products.json`.
- Never invent or copy unverified prices, ratings, review counts, availability, discounts, or specifications.
- Do not store static Amazon prices or Amazon customer ratings in the JSON file.
- Every product needs a real image path and a real affiliate link.
- Keep the Amazon disclosure visible near affiliate content.

## Page Rules

- Write valid HTML, not Markdown pasted into an `.html` file.
- Every page needs a useful title, meta description, mobile viewport, and one footer.
- Affiliate links must use `rel="nofollow sponsored noopener"` and open in a new tab.
- Update `sitemap.xml` whenever a public HTML page is added or removed.
- Keep pages responsive and keyboard accessible.

## Verification

Run:

```bash
npm test
```

For visual changes, preview the homepage and changed pages at desktop and mobile widths.