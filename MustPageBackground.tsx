import React from 'react';

export type MustBackgroundVariant =
  | 'home'
  | 'campus'
  | 'library'
  | 'academics'
  | 'default';

// NOTE: Images live, so we reference them as absolute URLs.
const backgroundByVariant: Record<MustBackgroundVariant, string> = {
  // Map variants to existing assets
  home: 'must-pic.jpg',
  campus: 'OIP.webp',
  library: 'download.webp',
  academics: 'must-pic (1).jpg',
  default: 'must-pic.jpg',
};

/**
 * Adds a consistent fixed background + MUST watermark overlay.
 * Intended to be rendered near the top of each screen.
 */
export default function MustPageBackground({
  variant = 'default',
  showWatermark = true,
}: {
  variant?: MustBackgroundVariant;
  showWatermark?: boolean;
}) {
  const backgroundImage = backgroundByVariant[variant] || backgroundByVariant.default;
  const watermark = 'must logo.jpg';

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-[0.035] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url("${backgroundImage}")` }}
      />

      {showWatermark && (
        <div
          aria-hidden
          className="fixed inset-0 -z-9 pointer-events-none"
          style={{
            backgroundImage: `url("${watermark}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 6% top 10%',
            backgroundSize: 'clamp(140px, 22vw, 260px)',
            opacity: 0.12,
            filter: 'grayscale(1) contrast(1.05)',
          }}
        />
      )}

      {/* readability layer */}
      <div aria-hidden className="fixed inset-0 -z-8 bg-[var(--must-bg)]/55 dark:bg-[var(--must-bg)]/70" />
    </>
  );
}
