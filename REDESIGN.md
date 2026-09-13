# Photography portfolio preview

This branch implements the approved September 13 HTML design using Next.js, Sanity and Vercel. It is a review build, with an isolated `redesign-preview` dataset. Production content and domain aliases are unchanged.

## Editing
Open `/studio`, sign in with the existing Sanity account, and check the title **Portfolio — isolated preview**.
- **Photographs**: each original is one reusable document. Replace its image to change it wherever referenced. Width/height come directly from the asset, so orientation changes retain the full image and adjust row proportions. Add descriptions and only confirmed locations; no capture dates are inferred.
- **Website collections**: choose a theme/project/portrait/study, its cover and optional homepage cover. Drag groups to change sequence order; reorder references within a group. Each group has one, two or three photographs. Adjust groups freely; the public layout uses the saved groups and current asset ratios.
- **Portfolio homepage**: choose the three opening collections, three secondary themes and two Moldova feature photographs.
- English and Romanian titles/descriptions have separate fields. Missing Romanian image descriptions fall back to English. The locale button updates the existing locale cookie. Book and exhibition edits remain separate from website selection.
- The retained original project documents continue serving `/work/[slug]`. New editorial collections use `/collections/[slug]`, avoiding ambiguous redirects and preserving old links and image query URLs.

## Isolation
`next.config.js` pins this review branch to project `x1g6b84l`, dataset `redesign-preview`, including automatic Git preview deployments. Studio is independently pinned to the same dataset. The seed script refuses any other dataset. This explicit preview configuration must be reviewed before any future production release.
Preview pages have noindex and a disallow-all robots file. Analytics are suppressed and valid contact requests return an explicit unavailable response; a link leads to the existing live contact form. The original Resend send path is retained for a future approved production release. No test email is sent.

## Repeatable migration
Run `NEXT_PUBLIC_SANITY_DATASET=redesign-preview node scripts/seed-preview.mjs /private/path/to/combined-website-selection.json` with an authenticated Sanity CLI or a private SANITY_API_TOKEN. The companion authoritative HTML must be next to the manifest. The script uses `createIfNotExists`; repeating it does not overwrite later editorial changes. It uploads the original computer JPEGs and references full-resolution restored CMS assets, not offline preview thumbnails. `scripts/migration-map.json` records selection identifiers and new document/asset identifiers without local source paths. Restoring the original Sanity archive into an empty isolated dataset is the prerequisite.

Run `node scripts/verify-preview.mjs /private/path/to/combined-website-selection.json` to verify counts, order, covers and dimensions.

## Validation
Use `npm run typecheck`, `npm run build`, and browser checks of desktop/mobile pages, sequence/overview, keyboard navigation and focus restoration. Full repository lint has inherited warnings for native image tags in legacy galleries and an existing `upload-portfolio.js` file containing only `404: Not Found`. New/changed redesign components are linted separately; the unrelated old upload stub is not executed or rewritten.

## Backup and restoration
The user has a separate owner-only backup folder with a verified complete Git bundle, readable source snapshot, authenticated CMS archive and assets, checksums and a BACKUP-README. It was successfully restored into this isolated dataset before the new content was added. Vercel's expired local token prevented exporting secret environment values; existing account credentials are still required for a complete deployment restore.

No approval to replace the live site is implied by this branch or draft PR.
