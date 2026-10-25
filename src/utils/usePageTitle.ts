import { useEffect } from "react";

const SITE_NAME = "Pickio";
const DEFAULT_DESCRIPTION = "Find the best products and deals, effortlessly.";

/**
 * Sets the tab title and meta description for the current page. Crawlers
 * that don't run JS get these from the prerendered HTML instead
 * (scripts/generate-static-pages.mjs).
 */
export function usePageTitle(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description?.slice(0, 160) || DEFAULT_DESCRIPTION;
  }, [title, description]);
}
