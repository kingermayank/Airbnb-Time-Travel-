import React from 'react';
import { Text } from '../../foundations/Text';
import { Search } from 'lucide-react';
import './SearchField.css';

export type SearchFieldHoverSection = 'where' | 'era' | 'who' | null;

export interface SearchFieldSectionConfig {
  label: string;
  placeholder: string;
  /** Whether placeholder is a selected value (vs default prompt). */
  isValueSelected?: boolean;
}

export interface SearchFieldProps {
  /** Optional: pin hover state for Storybook (overrides real hover). */
  pinnedHoverSection?: SearchFieldHoverSection;
  /** Which section has its dropdown open (active state). */
  activeSection?: SearchFieldHoverSection;
  /** Section labels and placeholders. Parent can pass selection display (e.g. theme name) as placeholder. */
  where?: SearchFieldSectionConfig;
  era?: SearchFieldSectionConfig;
  who?: SearchFieldSectionConfig;
  onWhereClick?: () => void;
  onEraClick?: () => void;
  onWhoClick?: () => void;
  onSearch?: () => void;
  /** Temporary: tune scroll-exit animation in realtime from parent debug controls. */
  exitAnimationConfig?: SearchFieldExitAnimationConfig;
  className?: string;
  style?: React.CSSProperties;
}

export interface SearchFieldExitAnimationConfig {
  enabled?: boolean;
  startTopPx?: number;
  deadZonePx?: number;
  /** Extra scroll distance (in px) before exit reaches 100%; lets fade continue into content. */
  flowIntoContentPx?: number;
  /** When true, keep animated wrapper above following content while gliding. */
  renderAboveContent?: boolean;
  contentZIndex?: number;
  translateYPx?: number;
  scaleEnd?: number;
  blurPx?: number;
  grayscalePercent?: number;
  progressExponent?: number;
  /** Hold full opacity until this normalized progress (0..1), then begin fading. */
  opacityDelayProgress?: number;
  pointerEventsOffProgress?: number;
}

const defaultWhere: SearchFieldSectionConfig = {
  label: 'Theme',
  placeholder: 'Select theme',
  isValueSelected: false,
};
const defaultEra: SearchFieldSectionConfig = {
  label: 'Era',
  placeholder: 'Select timeline',
  isValueSelected: false,
};
const defaultWho: SearchFieldSectionConfig = {
  label: 'Who',
  placeholder: 'Add guests',
  isValueSelected: false,
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 851,
  height: 64,
  backgroundColor: 'var(--ds-surface)',
  borderRadius: 40,
  boxShadow: '0px 0px 10px var(--ds-border), 0px 1px 2px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid var(--ds-border)',
  overflow: 'hidden',
};

const sectionBaseStyle: React.CSSProperties = {
  flex: 1,
  height: '100%',
  borderRadius: 40,
  border: 'none',
  padding: '0 var(--ds-spacing-40)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  cursor: 'pointer',
  background: 'transparent',
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 24,
  backgroundColor: 'var(--ds-border)',
  flexShrink: 0,
};

const whoZoneBaseStyle: React.CSSProperties = {
  flex: 1.16,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingRight: 'var(--ds-spacing-8)',
  position: 'relative',
};

const sectionFlexByType: Record<'where' | 'era', number> = {
  where: 0.92,
  era: 0.92,
};

const DEFAULT_EXIT_ANIMATION_CONFIG: Required<SearchFieldExitAnimationConfig> = {
  enabled: true,
  startTopPx: 130,
  deadZonePx: 6,
  flowIntoContentPx: 80,
  renderAboveContent: false,
  contentZIndex: 25,
  translateYPx: 96,
  scaleEnd: 1.04,
  blurPx: 4,
  grayscalePercent: 0,
  progressExponent: 1,
  opacityDelayProgress: 0.15,
  pointerEventsOffProgress: 0.999,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

export function SearchField({
  pinnedHoverSection,
  activeSection,
  where = defaultWhere,
  era = defaultEra,
  who = defaultWho,
  onWhereClick,
  onEraClick,
  onWhoClick,
  onSearch,
  exitAnimationConfig,
  className,
  style,
}: SearchFieldProps) {
  const magneticAnchorRef = React.useRef<HTMLDivElement>(null);
  const magneticAnimatedRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<number | null>(null);
  const initialTopRef = React.useRef<number | null>(null);
  const resolvedExitAnimationConfig = React.useMemo<Required<SearchFieldExitAnimationConfig>>(
    () => ({
      ...DEFAULT_EXIT_ANIMATION_CONFIG,
      ...exitAnimationConfig,
    }),
    [exitAnimationConfig]
  );
  const [hoveredSection, setHoveredSection] = React.useState<SearchFieldHoverSection>(null);
  const effectiveHover = pinnedHoverSection ?? hoveredSection;
  /** Hover or active: same logic for overlay and divider visibility (dividers hidden when section is hovered or active). */
  const effectiveSection = activeSection ?? effectiveHover;

  /** Hover only: gray fill. Active section fill is handled by CSS (white); don't override. */
  const getSectionStyle = (
    section: SearchFieldHoverSection,
    sectionType?: 'where' | 'era'
  ): React.CSSProperties => ({
    ...sectionBaseStyle,
    ...(sectionType ? { flex: sectionFlexByType[sectionType] } : {}),
    boxShadow: effectiveSection === section && !isActive(section) ? 'inset 0 0 0 999px var(--ds-overlay-hover)' : undefined,
  });

  const isActive = (section: SearchFieldHoverSection) => activeSection === section;

  const whoZoneStyle: React.CSSProperties = {
    ...whoZoneBaseStyle,
  };

  const showDividerAfterWhere = effectiveSection !== 'where' && effectiveSection !== 'era';
  const showDividerAfterEra = effectiveSection !== 'era' && effectiveSection !== 'who';

  const hasActiveSection = activeSection != null;

  const containerStyleWithActive = hasActiveSection
    ? { ...containerStyle, backgroundColor: 'var(--ds-surface-icon-button)' }
    : containerStyle;

  React.useEffect(() => {
    const anchor = magneticAnchorRef.current;
    const animatedWrapper = magneticAnimatedRef.current;
    if (!anchor || !animatedWrapper) return;

    const config = resolvedExitAnimationConfig;

    const resetStyles = () => {
      const currentAnchor = magneticAnchorRef.current;
      const currentAnimatedWrapper = magneticAnimatedRef.current;
      if (!currentAnchor || !currentAnimatedWrapper) return;
      currentAnchor.style.pointerEvents = 'auto';
      currentAnchor.style.overflow = '';
      currentAnchor.style.height = '';
      currentAnimatedWrapper.style.transform = '';
      currentAnimatedWrapper.style.opacity = '';
      currentAnimatedWrapper.style.filter = '';
      currentAnimatedWrapper.style.maskImage = 'none';
      currentAnimatedWrapper.style.webkitMaskImage = 'none';
    };

    if (!config.enabled) {
      resetStyles();
      return;
    }

    const getStickyHeaderBottom = () => {
      const stickyHeader = document.querySelector('header');
      if (!stickyHeader) return 0;
      return Math.max(stickyHeader.getBoundingClientRect().bottom, 0);
    };

    const applyGlideStyles = () => {
      frameRef.current = null;
      const currentAnchor = magneticAnchorRef.current;
      const currentAnimatedWrapper = magneticAnimatedRef.current;
      if (!currentAnchor || !currentAnimatedWrapper) return;

      const headerBottom = getStickyHeaderBottom();
      const top = currentAnchor.getBoundingClientRect().top;
      if (initialTopRef.current == null) {
        initialTopRef.current = top;
      }

      const endTop = headerBottom - config.flowIntoContentPx;
      // Requested window: startTopPx to sticky header bottom.
      // Guard with initial position so default render never starts pre-faded.
      const startTop = Math.max(endTop + 1, Math.min(config.startTopPx, initialTopRef.current) - config.deadZonePx);
      const distance = startTop - endTop;
      const linearProgress = clamp((startTop - top) / distance, 0, 1);
      const progress = clamp(Math.pow(linearProgress, config.progressExponent), 0, 1);
      const opacityProgress = clamp(
        (progress - config.opacityDelayProgress) / (1 - config.opacityDelayProgress),
        0,
        1
      );

      const translateY = lerp(0, config.translateYPx, progress);
      const scale = lerp(1, config.scaleEnd, progress);
      const opacity = lerp(1, 0, opacityProgress);
      const grayscale = lerp(0, config.grayscalePercent, progress);
      const blur = lerp(0, config.blurPx, progress);
      const pointerEvents = progress >= config.pointerEventsOffProgress ? 'none' : 'auto';

      currentAnchor.style.pointerEvents = pointerEvents;
      currentAnchor.style.overflow = '';
      currentAnchor.style.height = '';
      currentAnimatedWrapper.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      currentAnimatedWrapper.style.opacity = `${opacity}`;
      currentAnimatedWrapper.style.filter = `grayscale(${grayscale}%) blur(${blur}px)`;
      currentAnimatedWrapper.style.maskImage = 'none';
      currentAnimatedWrapper.style.webkitMaskImage = 'none';
    };

    const queueFrame = () => {
      if (frameRef.current != null) return;
      frameRef.current = window.requestAnimationFrame(applyGlideStyles);
    };

    queueFrame();
    window.addEventListener('scroll', queueFrame, { passive: true });
    window.addEventListener('resize', queueFrame);

    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      window.removeEventListener('scroll', queueFrame);
      window.removeEventListener('resize', queueFrame);
      resetStyles();
    };
  }, [resolvedExitAnimationConfig]);

  return (
    <div
      ref={magneticAnchorRef}
      style={{
        width: '100%',
        ...(resolvedExitAnimationConfig.renderAboveContent
          ? { position: 'relative', zIndex: resolvedExitAnimationConfig.contentZIndex }
          : {}),
      }}
    >
      <div
        ref={magneticAnimatedRef}
        style={{
          transformOrigin: '50% 0%',
          willChange: 'transform, opacity, filter',
        }}
      >
        <div
          className={['ds-search-field', className, hasActiveSection ? 'ds-search-field-has-active' : ''].filter(Boolean).join(' ')}
          style={{ ...containerStyleWithActive, ...style }}
        >
          <button
            type="button"
            className={`ds-search-field-section${isActive('where') ? ' ds-search-field-section--active' : ''}`}
            style={getSectionStyle('where', 'where')}
            onClick={onWhereClick}
            onMouseEnter={() => setHoveredSection('where')}
            onMouseLeave={() => setHoveredSection(null)}
            aria-expanded={isActive('where')}
          >
            <Text variant="label" color="primary" style={{ fontWeight: 500 }}>
              {where.label}
            </Text>
            <Text
              variant="body"
              color={where.isValueSelected ? 'primary' : 'secondary'}
              weight={where.isValueSelected ? 'medium' : 'regular'}
            >
              {where.placeholder}
            </Text>
          </button>

          <div
            className="ds-search-field-divider"
            style={{ ...dividerStyle, backgroundColor: showDividerAfterWhere ? 'var(--ds-border)' : 'transparent' }}
            aria-hidden
          />

          <button
            type="button"
            className={`ds-search-field-section${isActive('era') ? ' ds-search-field-section--active' : ''}`}
            style={{ ...getSectionStyle('era', 'era'), padding: '0 var(--ds-spacing-32)' }}
            onClick={onEraClick}
            onMouseEnter={() => setHoveredSection('era')}
            onMouseLeave={() => setHoveredSection(null)}
            aria-expanded={isActive('era')}
          >
            <Text variant="label" color="primary" style={{ fontWeight: 500 }}>
              {era.label}
            </Text>
            <Text
              variant="body"
              color={era.isValueSelected ? 'primary' : 'secondary'}
              weight={era.isValueSelected ? 'medium' : 'regular'}
            >
              {era.placeholder}
            </Text>
          </button>

          <div
            className="ds-search-field-divider"
            style={{ ...dividerStyle, backgroundColor: showDividerAfterEra ? 'var(--ds-border)' : 'transparent' }}
            aria-hidden
          />

          <div
            className={`ds-search-field-who-zone${effectiveSection === 'who' ? ' ds-search-field-who-zone--hover' : ''}${isActive('who') ? ' ds-search-field-who-zone--active' : ''}`}
            style={whoZoneStyle}
            onMouseEnter={() => setHoveredSection('who')}
            onMouseLeave={() => setHoveredSection(null)}
            role="presentation"
          >
            <button
              type="button"
              className={`ds-search-field-section${isActive('who') ? ' ds-search-field-section--active' : ''}`}
              style={{ ...sectionBaseStyle, padding: '0 var(--ds-spacing-32)' }}
              onClick={onWhoClick}
              aria-expanded={isActive('who')}
            >
              <Text variant="label" color="primary" style={{ fontWeight: 500 }}>
                {who.label}
              </Text>
              <Text
                variant="body"
                color={who.isValueSelected ? 'primary' : 'secondary'}
                weight={who.isValueSelected ? 'medium' : 'regular'}
              >
                {who.placeholder}
              </Text>
            </button>
            <button
              type="button"
              className="ds-search-field-search-btn"
              onClick={onSearch}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
