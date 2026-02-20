import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, Text, Input } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import { Linkedin, Twitter, Copy, Check } from 'lucide-react';
import './SupportPage.css';

const SUPPORT_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const PROJECT_URL = 'https://warpbnb.com';
const LINKEDIN_SHARE_URL = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PROJECT_URL)}`;
const TWITTER_SHARE_URL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
  'I just explored WarpBnB, a time-travel themed product design and frontend build.',
)}&url=${encodeURIComponent(PROJECT_URL)}`;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mgollnzv';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const TOPIC_OPTIONS = [
  'General feedback',
  'Bug report',
  'Feature request',
  'Design feedback',
  'Other',
] as const;

const textareaStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--ds-text-14)',
  lineHeight: 'var(--ds-leading-18)',
  color: 'var(--ds-text-primary)',
  backgroundColor: 'var(--ds-surface)',
  border: '1px solid var(--ds-border)',
  borderRadius: 'var(--ds-radius-md)',
  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 140,
  resize: 'vertical',
};

const selectStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--ds-text-14)',
  lineHeight: 'var(--ds-leading-18)',
  color: 'var(--ds-text-primary)',
  backgroundColor: 'var(--ds-surface)',
  border: '1px solid var(--ds-border)',
  borderRadius: 'var(--ds-radius-md)',
  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
  width: '100%',
  boxSizing: 'border-box',
};

export function SupportPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<(typeof TOPIC_OPTIONS)[number]>('General feedback');
  const [feedback, setFeedback] = useState('');

  const handleCopyProjectUrl = async () => {
    try {
      await navigator.clipboard.writeText(PROJECT_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const isSubmitting = status === 'submitting';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setStatus('error');
      setErrorMessage('Please add your feedback before submitting.');
      return;
    }

    try {
      setStatus('submitting');
      setErrorMessage('');

      const payload = {
        name: name.trim() || 'Anonymous traveler',
        email: email.trim(),
        topic,
        feedback: feedback.trim(),
        page: '/support',
        source: 'WarpBnB support feedback form',
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Submission failed');

      setStatus('success');
      setName('');
      setEmail('');
      setTopic('General feedback');
      setFeedback('');
    } catch {
      setStatus('error');
      setErrorMessage('Could not send feedback right now. Please try again in a moment.');
    }
  };

  return (
    <div className="support-page">
      {!hideHeader && (
        <Header
          brandName="warpbnb"
          navItems={SUPPORT_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={(label) => (label === 'Time Travel' ? navigate('/') : undefined)}
          onLogoClick={() => navigate('/')}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
      )}

      <main className="support-main">
        <section className="support-layout" aria-label="Support WarpBnB">
          <aside className="support-intro">
            <Text as="h1" variant="display" weight="semibold" color="primary" className="support-heading">
              Support warpbnb
            </Text>
            <Text as="p" variant="h4" color="secondary" className="support-copy">
              If this project helped or inspired you, the best support is sharing it and sending
              thoughtful feedback.
            </Text>
          </aside>

          <div className="support-content">
            <section className="support-card" aria-label="Help improve our product">
              <Text as="h2" variant="h3" weight="semibold" color="primary" style={{ margin: 0 }}>
                Help improve our product
              </Text>
              <Text as="p" variant="body" color="secondary" style={{ margin: 0 }}>
                Share issues, ideas, and improvements directly here.
              </Text>
              {status === 'success' ? (
                <div className="support-success-card">
                  <Text as="p" variant="body" color="primary" style={{ margin: 0 }}>
                    Feedback sent. Thanks for helping improve WarpBnB.
                  </Text>
                  <Button variant="secondary" size="md" onClick={() => setStatus('idle')} style={{ width: 'fit-content' }}>
                    Send another response
                  </Button>
                </div>
              ) : (
                <form className="support-form" onSubmit={handleSubmit}>
                  <Input
                    label="Name (optional)"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Input
                    label="Email (optional)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                  <div className="support-field">
                    <label htmlFor="support-feedback-topic" className="support-label">
                      <Text variant="label" color="primary">
                        Topic
                      </Text>
                    </label>
                    <select
                      id="support-feedback-topic"
                      className="support-select"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as (typeof TOPIC_OPTIONS)[number])}
                      style={selectStyle}
                    >
                      {TOPIC_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="support-field">
                    <label htmlFor="support-feedback-textarea" className="support-label">
                      <Text variant="label" color="primary">
                        Your feedback
                      </Text>
                    </label>
                    <textarea
                      id="support-feedback-textarea"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share suggestions, issues, or ideas..."
                      style={textareaStyle}
                      rows={6}
                      required
                    />
                  </div>
                  {status === 'error' && (
                    <Text as="p" variant="bodySmall" color="primary" className="support-error">
                      {errorMessage}
                    </Text>
                  )}
                  <Button type="submit" variant="primary" size="md" disabled={isSubmitting} style={{ width: 'fit-content' }}>
                    {isSubmitting ? 'Sending…' : 'Send feedback'}
                  </Button>
                </form>
              )}
            </section>

            <section className="support-card" aria-label="Share WarpBnB">
              <Text as="h2" variant="h3" weight="semibold" color="primary" style={{ margin: 0 }}>
                Share this project
              </Text>
              <Text as="p" variant="body" color="secondary" style={{ margin: 0 }}>
                A quick post on LinkedIn or X helps WarpBnB reach builders, designers, and curious
                travelers.
              </Text>
              <div className="support-actions">
                <a href={LINKEDIN_SHARE_URL} target="_blank" rel="noreferrer" className="support-link-button">
                  <Linkedin size={16} aria-hidden />
                  Share on LinkedIn
                </a>
                <a href={TWITTER_SHARE_URL} target="_blank" rel="noreferrer" className="support-link-button">
                  <Twitter size={16} aria-hidden />
                  Share on X / Twitter
                </a>
                <button type="button" className="support-link-button" onClick={handleCopyProjectUrl}>
                  {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  {copied ? 'Link copied' : 'Copy project link'}
                </button>
              </div>
            </section>

            <section className="support-card" aria-label="Newsletter subscribe">
              <Text as="h2" variant="h3" weight="semibold" color="primary" style={{ margin: 0 }}>
                Subscribe for build breakdowns
              </Text>
              <Text as="p" variant="body" color="secondary" style={{ margin: 0 }}>
                I share process notes, design decisions, and implementation details on NextGen
                Designer.
              </Text>
              <div className="support-newsletter-embed">
                <iframe
                  src="https://nextgendesigner.substack.com/embed"
                  title="NextGen Designer Newsletter"
                  width="100%"
                  height="320"
                  style={{ border: '1px solid #EEE', background: 'white' }}
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </section>

          </div>
        </section>
      </main>
    </div>
  );
}
