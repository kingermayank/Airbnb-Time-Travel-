import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, Text, Input } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import './FeedbackPage.css';

const FEEDBACK_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

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

export function FeedbackPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const navigate = useNavigate();

  const [status, setStatus] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<(typeof TOPIC_OPTIONS)[number]>('General feedback');
  const [feedback, setFeedback] = useState('');

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
        page: '/feedback',
        source: 'WarpBnB feedback form',
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

      if (!response.ok) {
        throw new Error('Submission failed');
      }

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
    <div className="feedback-page">
      {!hideHeader && (
        <Header
          brandName="warpbnb"
          navItems={FEEDBACK_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={(label) => (label === 'Time Travel' ? navigate('/') : undefined)}
          onLogoClick={() => navigate('/')}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
      )}

      <main className="feedback-main">
        <section className="feedback-layout" aria-label="Give feedback">
          <aside className="feedback-intro">
            <Text as="h1" variant="display" weight="semibold" color="primary" className="feedback-heading">
              Give feedback
            </Text>
            <Text as="p" variant="h4" color="secondary" className="feedback-copy">
              Tell us what worked, what felt off, and what you want next. Every note helps improve
              WarpBnB.
            </Text>
            <Button variant="ghost" size="md" onClick={() => navigate('/support')} style={{ width: 'fit-content' }}>
              Go to support options
            </Button>
          </aside>

          <section className="feedback-form-panel" aria-live="polite">
            {status === 'success' ? (
              <div className="feedback-success-card">
                <Text as="h2" variant="h2" weight="semibold" color="primary" style={{ margin: 0 }}>
                  Thanks for the feedback
                </Text>
                <Text as="p" variant="body" color="secondary" style={{ margin: 0 }}>
                  Your message was sent successfully. We read every submission and use it to shape
                  the next iterations.
                </Text>
                <div className="feedback-success-actions">
                  <Button variant="secondary" size="md" onClick={() => setStatus('idle')}>
                    Send another response
                  </Button>
                  <Button variant="primary" size="md" onClick={() => navigate('/')}>
                    Back to home
                  </Button>
                </div>
              </div>
            ) : (
              <form className="feedback-form" onSubmit={handleSubmit}>
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

                <div className="feedback-field">
                  <label htmlFor="feedback-topic" className="feedback-label">
                    <Text variant="label" color="primary">
                      Topic
                    </Text>
                  </label>
                  <select
                    id="feedback-topic"
                    className="feedback-select"
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

                <div className="feedback-field">
                  <label htmlFor="feedback-textarea" className="feedback-label">
                    <Text variant="label" color="primary">
                      Your feedback
                    </Text>
                  </label>
                  <textarea
                    id="feedback-textarea"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share suggestions, issues, or ideas..."
                    style={textareaStyle}
                    rows={6}
                    aria-label="Your feedback"
                    required
                  />
                </div>

                {status === 'error' && (
                  <Text as="p" variant="bodySmall" color="primary" className="feedback-error">
                    {errorMessage}
                  </Text>
                )}

                <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send feedback'}
                </Button>
              </form>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
