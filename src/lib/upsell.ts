/*
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * Green-wald fork: single switch for hiding promotional / upsell presentation
 * (Enterprise trial dialog, "Try Enterprise" menu item, locked-feature teasers
 * in navigation and row menus). It never touches license checks or feature
 * gating. Defaults to hidden; build with VITE_HIDE_UPSELL=false to restore.
 */
export const UPSELL_HIDDEN: boolean = import.meta.env.VITE_HIDE_UPSELL !== 'false';
