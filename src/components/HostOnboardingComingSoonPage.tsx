import './HostOnboardingComingSoonPage.css';

const HOST_ONBOARDING_IMAGE_SRC = '/images/image-mxg7b0UfPQISIHqmg5ckgLxvhhqNM6%201.png';

export function HostOnboardingComingSoonPage() {
  return (
    <section className="host-coming-soon" aria-label="Host onboarding coming soon">
      <img
        className="host-coming-soon__image"
        src={HOST_ONBOARDING_IMAGE_SRC}
        alt="Scaffolding illustration"
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
