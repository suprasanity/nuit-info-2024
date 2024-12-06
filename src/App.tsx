import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { InteractiveModelPage } from './pages/InteractiveModelPage';
import { MediaPage } from './pages/MediaPage';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Race for water</title>
                <link rel="icon" href="/favicon.ico" />
            </Helmet>
            <Navigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/modele-interactif" element={<InteractiveModelPage />} />
                <Route path="/media" element={<MediaPage />} />
            </Routes>
        </div>
    );
}

export default App;