import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Icon, Text } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import './FaqPage.css';

const FAQ_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const FAQ_ITEMS: { question: string; answer: ReactNode }[] = [
  {
    question: 'Is any of this real?',
    answer: (
      <>
        No. Warpbnb is a fictional side project. Time travel is not real. All listings, hosts, and
        images shown here are AI-generated and speculative. They’re used to explore visual
        consistency, storytelling, and design-engineering.
        <img
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzB1YmViZDRuNzl0eHQzMmo3eXk2eDRlZWhhYng5emFoMmcxODdpaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cUIfsYyFQgEzTQHc3G/giphy.gif"
          alt="Playful time-travel themed GIF"
          className="faq-answer-gif"
          loading="lazy"
        />
      </>
    ),
  },
  {
    question: 'Can I host my own listing?',
    answer: 'Host applications will open soon. Waiting on a minor temporal realignment.',
  },
  {
    question: 'Is this affiliated with Airbnb?',
    answer:
      'This project is not affiliated with, endorsed by, or connected to Airbnb in any way. It’s a speculative reinterpretation inspired by familiar patterns, nothing more.',
  },
  {
    question: 'How long did this take to build?',
    answer:
      'About 2–3 weeks, mostly at night, with a mix of curiosity, caffeine, and questionable sleep decisions.',
  },
  {
    question: 'How did you build this?',
    answer: (
      <>
        A mix of design craft and AI-assisted engineering.
        <br />
        <br />
        <ul className="faq-answer-list">
          <li>Figma for system thinking & layout</li>
          <li>Cursor + Claude + Codex for frontend, backend logic, and architecture</li>
          <li>Supabase for database & storage</li>
          <li>Multiple image AI models for speculative visuals</li>
        </ul>
        <br />
        Full breakdown coming soon on my{' '}
        <a href="https://nextgendesigner.substack.com/" target="_blank" rel="noreferrer" className="faq-help-link">
          newsletter
        </a>
        .
      </>
    ),
  },
  {
    question: 'Who built this?',
    answer: (
      <>
        <a href="https://kingermayank.com" target="_blank" rel="noreferrer" className="faq-help-link">
          This human being
        </a>
        .
      </>
    ),
  },
];

export function FaqPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="faq-page">
      {!hideHeader && (
        <Header
          brandName="warpbnb"
          navItems={FAQ_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={(label) => (label === 'Time Travel' ? navigate('/') : undefined)}
          onLogoClick={() => navigate('/')}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
      )}

      <main className="faq-main">
        <section className="faq-layout" aria-label="Frequently asked questions">
          <aside className="faq-static-column">
            <Text as="h1" variant="display" weight="semibold" color="primary" className="faq-heading">
              Frequently asked questions
            </Text>
            <Text as="p" variant="h4" color="secondary" className="faq-help-copy">
              For more questions, contact me at kingermayank[at]gmail.com
            </Text>
          </aside>

          <div className="faq-accordion-column">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const itemId = `faq-item-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div key={item.question} className="faq-row">
                  <button
                    type="button"
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    id={itemId}
                    onClick={() => toggleItem(index)}
                  >
                    <Text
                      as="span"
                      variant="h3"
                      weight="medium"
                      color="primary"
                      className="faq-question-text"
                    >
                      {item.question}
                    </Text>
                    <Icon
                      size="sm"
                      color="primary"
                      className={`faq-chevron ${isOpen ? 'faq-chevron-open' : ''}`}
                    >
                      <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                        <path
                          d="M4 6.5L8 10.5L12 6.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Icon>
                  </button>
                  {isOpen && (
                    <div role="region" id={panelId} aria-labelledby={itemId} className="faq-panel">
                      <Text as="p" variant="body" color="secondary" className="faq-answer-text">
                        {item.answer}
                      </Text>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
