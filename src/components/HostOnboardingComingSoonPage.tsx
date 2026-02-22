import './HostOnboardingComingSoonPage.css';

const HOST_ONBOARDING_IMAGE_SRC = '/images/construction.png';

export function HostOnboardingComingSoonPage() {
  return (
    <section className="host-coming-soon" aria-label="Host onboarding coming soon">
      <img
        className="host-coming-soon__image"
        src={HOST_ONBOARDING_IMAGE_SRC}
        alt="Construction - coming soon"
        loading="lazy"
      />
      <h1 className="host-coming-soon__title">
        Host onboarding
        <br />
        coming soon
      </h1>
    </section>
  );
}
