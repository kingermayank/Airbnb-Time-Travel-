import React from 'react';
import { Text } from '../../foundations/Text';
import { Search } from 'lucide-react';
import './SearchField.css';

export type SearchFieldHoverSection = 'where' | 'era' | 'who' | null;

export interface SearchFieldSectionConfig {
  label: string;
  placeholder: string;
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
  className?: string;
  style?: React.CSSProperties;
}

const defaultWhere: SearchFieldSectionConfig = {
  label: 'Where',
  placeholder: 'Search destinations',
};
const defaultEra: SearchFieldSectionConfig = {
  label: 'Era',
  placeholder: 'Select Timeline',
};
const defaultWho: SearchFieldSectionConfig = {
  label: 'Who',
  placeholder: 'Add guests',
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
  flex: 1,
  minWidth: 0,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingRight: 'var(--ds-spacing-8)',
  position: 'relative',
};

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
  className,
  style,
}: SearchFieldProps) {
  const [hoveredSection, setHoveredSection] = React.useState<SearchFieldHoverSection>(null);
  const effectiveHover = pinnedHoverSection ?? hoveredSection;
  /** Hover or active: same logic for overlay and divider visibility (dividers hidden when section is hovered or active). */
  const effectiveSection = activeSection ?? effectiveHover;

  /** Hover only: gray fill. Active section fill is handled by CSS (white); don't override. */
  const getSectionStyle = (section: SearchFieldHoverSection): React.CSSProperties => ({
    ...sectionBaseStyle,
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

  return (
    <div
      className={[className, hasActiveSection ? 'ds-search-field-has-active' : ''].filter(Boolean).join(' ')}
      style={{ ...containerStyleWithActive, ...style }}
    >
      <button
        type="button"
        className={`ds-search-field-section${isActive('where') ? ' ds-search-field-section--active' : ''}`}
        style={getSectionStyle('where')}
        onClick={onWhereClick}
        onMouseEnter={() => setHoveredSection('where')}
        onMouseLeave={() => setHoveredSection(null)}
        aria-expanded={isActive('where')}
      >
        <Text variant="label" color="primary">
          {where.label}
        </Text>
        <Text variant="body" color="secondary">
          {where.placeholder}
        </Text>
      </button>

      {showDividerAfterWhere && <div style={dividerStyle} aria-hidden />}

      <button
        type="button"
        className={`ds-search-field-section${isActive('era') ? ' ds-search-field-section--active' : ''}`}
        style={{ ...getSectionStyle('era'), padding: '0 var(--ds-spacing-32)' }}
        onClick={onEraClick}
        onMouseEnter={() => setHoveredSection('era')}
        onMouseLeave={() => setHoveredSection(null)}
        aria-expanded={isActive('era')}
      >
        <Text variant="label" color="primary">
          {era.label}
        </Text>
        <Text variant="body" color="secondary">
          {era.placeholder}
        </Text>
      </button>

      {showDividerAfterEra && <div style={dividerStyle} aria-hidden />}

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
          <Text variant="label" color="primary">
            {who.label}
          </Text>
          <Text variant="body" color="secondary">
            {who.placeholder}
          </Text>
        </button>
        <button
          type="button"
          className="ds-search-field-search-btn"
          onClick={onSearch}
          aria-label="Search"
        >
          <Search size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
