import { useNavigate } from 'react-router-dom';
import { Header, Text } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import './TeaserVideoPage.css';

const TEASER_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/2JfVbt3C4Q8';

export function TeaserVideoPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="teaser-page">
      {!hideHeader && (
        <Header
          brandName="warpbnb"
          navItems={TEASER_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={(label) => (label === 'Time Travel' ? navigate('/') : undefined)}
          onLogoClick={() => navigate('/')}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
      )}

      <main className="teaser-main">
        <section className="teaser-layout" aria-label="Teaser video">
          <aside className="teaser-intro">
            <Text as="h1" variant="display" weight="semibold" color="primary" className="teaser-heading">
              Teaser video
            </Text>
          </aside>

          <div className="teaser-content">
            <div className="teaser-video-embed">
              <iframe
                src={YOUTUBE_EMBED_URL}
                title="WarpBnB teaser video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
