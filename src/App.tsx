import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Agentation } from 'agentation';
import { Container, Theme } from './settings/types';
import { AirbnbUi } from './components/generated/Component';
import { ListingDetailPage } from './components/ListingDetailPage';
import { ConfirmationPage } from './components/ConfirmationPage';
import { FaqPage } from './components/FaqPage';
import { FeedbackPage } from './components/FeedbackPage';
import { NotFoundPage } from './components/NotFoundPage';

let theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
let container: Container = 'none';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  const generatedComponent = useMemo(() => {
    // THIS IS WHERE THE TOP LEVEL GENRATED COMPONENT WILL BE RETURNED!
    return <AirbnbUi />; // %EXPORT_STATEMENT%
  }, []);

  const routes = (
    <Routes>
      <Route path="/" element={generatedComponent} />
      <Route path="/listing/:id" element={<ListingDetailPage />} />
      <Route path="/listing/:id/confirm" element={<ConfirmationPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  if (container === 'centered') {
    return (
      <>
        <div className="h-full w-full flex flex-col items-center justify-center">
          {routes}
        </div>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </>
    );
  } else {
    return (
      <>
        {routes}
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </>
    );
  }
}

export default App;