import { HashRouter, Route, Routes } from 'react-router-dom';
import { DBConfig } from './config/DBConfig';
import { initDB } from 'react-indexed-db-hook';
import Tooltip from './routes/Tooltips/Tooltip';
import CoachMark from './routes/CoachMarks/CoachMark';
import ProductTours from './routes/ProductTours/ProductTours';
import NotFound from './routes/NotFound/NotFound';

initDB(DBConfig);

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/tooltip" element={<Tooltip />} />
        <Route path="/coachmark" element={<CoachMark />} />
        <Route path="/producttour" element={<ProductTours />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
