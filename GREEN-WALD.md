# Green-wald WebUI fork

Fork of [stalwartlabs/webui](https://github.com/stalwartlabs/webui) v2.0.0 (commit `1461b17`), used under AGPL-3.0-only.
Purpose: a personal mail server UI without Enterprise promotion. `LICENSES/` and all SPDX headers are untouched.

## What this fork changes

One switch, `UPSELL_HIDDEN` in `src/lib/upsell.ts` (true unless built with `VITE_HIDE_UPSELL=false`), checked at each surface below.

| # | Surface | Where | Why it is promo, not gating |
|---|---|---|---|
| 1 | "Unlock Enterprise Features" trial dialog (trial button to `license.stalw.art/trial`, "Why is this not free?" link) | `src/components/common/EnterpriseUpsell.tsx` (renders null; dialog is tree-shaken from the bundle) | Pure sales dialog; opened only from the surfaces below |
| 2 | "Try Enterprise" item in the user menu, plus its dialog mount | `src/components/layout/TopBar.tsx` (`showUpsell`) | Menu advert; no check depends on it |
| 3 | Locked Enterprise entries (padlock + upsell click) in the sidebar | `src/components/layout/useLayoutNavigation.ts` (`isVisible` hides locked links; sections with no accessible link drop out of the switcher), `src/components/layout/Sidebar.tsx` (sr-only "Enterprise feature" hint) | Teaser entries. `isLocked`, `isLinkEnterprise`, `isLinkAccessible` and `sectionLandingLink` are unchanged, so locked views stay unreachable |
| 4 | Locked Enterprise entries in per-row action menus (padlock + upsell dialog) | `src/components/lists/listActions.ts` (`resolveItemActions`) | Teaser menu items; the `locked` computation itself is unchanged |

Total patch: 6 modified files and 1 new file, about 30 added lines.

## Deliberately left alone

- `src/lib/layout.ts`, `src/lib/permissions.ts`, `src/stores/accountStore.ts`, `src/lib/schemaResolver.ts`: edition and enterprise gating logic. Parts carry `LicenseRef-SEL` snippets and are not touched at all.
- Locked Enterprise form fields (`FieldRow.tsx`, `formContext.ts`): rendered read-only with a padlock tooltip "This feature requires an Enterprise license." This is gating feedback, so it stays. Hiding the fields would be possible via the existing `hideEnterprise` form option, not done.
- Field widgets that reference Enterprise objects (`referencesLocked` in `FieldRow.tsx`): same reasoning.
- i18n strings (`enterprise.*`, `tryEnterprise` in `src/i18n/en.json`): kept, now unreferenced at runtime, avoids merge conflicts.
- `OtpAuthField.tsx` loads a Stalwart favicon for the QR code; `public/oauth-client.json` `client_uri`; Sievepad "Debug" button. Neither is a promotion.
- Files with a `LicenseRef-SEL`-only header (dashboard, tracing) are not modified.

## Build and release

- `build.sh` or `npm ci && npm run build`, then zip `dist/` (layout identical to upstream's `webui.zip`).
- Push a tag `gw-v<upstream>-<n>` (for example `gw-v2.0.0-1`); `.github/workflows/green-wald-release.yml` builds and attaches `webui.zip`.
- Rebase: see `docs/runbook.md` in the green-wald-mail repository.
