import type { KeyboardEvent } from "react";

/**
 * Props that make a non-button element (Box, Card, Typography…) behave like a
 * button for keyboard and screen-reader users: focusable, announced as a
 * button, and activated with Enter or Space.
 *
 * Key presses that bubble up from nested controls (e.g. a "remove" button
 * inside a clickable cart row) are ignored, so they don't trigger the row.
 */
export function clickable(onActivate: () => void, label?: string) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate();
      }
    },
  };
}
