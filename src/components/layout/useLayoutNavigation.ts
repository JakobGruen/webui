/*
 * SPDX-FileCopyrightText: 2020 Stalwart Labs LLC <hello@stalw.art>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-SEL
 */

import { useAccountStore } from '@/stores/accountStore';
import { useSchemaStore } from '@/stores/schemaStore';
import { useIsCommunity, usePermissionCheckers } from '@/hooks/usePermissions';
import { findFirstAccessibleLinkInLayout, isLinkEnterprise, isLinkVisible, visibleLayouts } from '@/lib/layout';
import { sectionLandingLink } from '@/lib/lastVisited';
import { UPSELL_HIDDEN } from '@/lib/upsell';
import type { Layout } from '@/types/schema';
import { viewPath } from './navTree';

export function useLayoutNavigation() {
  const schema = useSchemaStore((s) => s.schema);
  const edition = useAccountStore((s) => s.edition);
  const isCommunity = useIsCommunity();
  const { canGet, hasPermission } = usePermissionCheckers();

  const isLocked = (viewName: string) => isCommunity && !!schema && isLinkEnterprise(schema, viewName);
  const hideLocked = UPSELL_HIDDEN;

  let layouts = schema ? visibleLayouts(schema, canGet, hasPermission) : [];
  if (schema && hideLocked) {
    layouts = layouts.filter(
      (l) => findFirstAccessibleLinkInLayout(schema, l, edition, canGet, hasPermission) !== null,
    );
  }

  return {
    layouts,
    isVisible: (viewName: string) =>
      (!schema || isLinkVisible(schema, viewName, canGet, hasPermission)) && !(hideLocked && isLocked(viewName)),
    isLocked,
    landingPath: (layout: Layout): string | null => {
      if (!schema) return null;
      const link = sectionLandingLink(schema, layout, edition, canGet, hasPermission);
      return link ? viewPath(layout.name, link) : null;
    },
  };
}
