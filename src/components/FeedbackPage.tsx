import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, SectionTitle, Text, Input } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';

const FEEDBACK_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

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
  minHeight: 120,
  resize: 'vertical',
};

export function FeedbackPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--ds-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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

      <main
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 auto',
          padding: 'var(--ds-spacing-24) var(--ds-spacing-16) var(--ds-spacing-32)',
          boxSizing: 'border-box',
        }}
      >
        {submitted ? (
          <>
            <SectionTitle>Thank you</SectionTitle>
            <Text variant="body" color="primary" as="p">
              Thanks for sending us your feedback. We’ll use it to improve your experience.
            </Text>
          </>
        ) : (
          <>
            <SectionTitle>Give feedback</SectionTitle>
            <Text
              variant="body"
              color="secondary"
              as="p"
              style={{ marginBottom: 'var(--ds-spacing-20)' }}
            >
              Share your suggestions or feedback to help us improve the app.
            </Text>
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-spacing-16)',
              }}
            >
              <div>
                <label
                  htmlFor="feedback-textarea"
                  style={{ display: 'block', marginBottom: 'var(--ds-spacing-4)' }}
                >
                  <Text variant="label" color="primary">
                    Your feedback
                  </Text>
                </label>
                <textarea
                  id="feedback-textarea"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  style={textareaStyle}
                  rows={5}
                  aria-label="Your feedback"
                />
              </div>
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
              <Button type="submit" variant="primary" size="md">
                Send
              </Button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
