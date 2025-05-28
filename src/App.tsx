import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useApiKey } from './context/ApiKeyContext';

// Components
import Layout from './components/Layout';
import ApiKeySetup from './components/ApiKeySetup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import SavedCopies from './pages/SavedCopies';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App = () => {
  const { theme } = useTheme();
  const { apiKey } = useApiKey();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  // If API key is not set, show the API key setup screen
  if (!apiKey) {
    return <ApiKeySetup />;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="editor" element={<Editor />} />
          <Route path="editor/:id" element={<Editor />} />
          <Route path="saved" element={<SavedCopies />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
