import { useState } from 'react';
import styles from './Settings.module.css';
import { useTheme } from '../context/ThemeContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useCopyStore } from '../store/copyStore';

// Icons
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import KeyIcon from '@mui/icons-material/Key';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { apiKey, setApiKey, clearApiKey, apiProvider, setApiProvider } = useApiKey();
  const { clearAllCopies } = useCopyStore();
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleUpdateApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey.trim());
      setNewApiKey('');
      setSuccessMessage('API key updated successfully');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  const handleClearData = () => {
    if (confirmDelete) {
      clearAllCopies();
      setConfirmDelete(false);
      setSuccessMessage('All copies deleted successfully');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } else {
      setConfirmDelete(true);
      
      setTimeout(() => {
        setConfirmDelete(false);
      }, 5000);
    }
  };
  
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  
  const maskApiKey = (key) => {
    if (!key) return '';
    return key.substring(0, 3) + '•'.repeat(key.length - 6) + key.substring(key.length - 3);
  };

  return (
    <div className={`${styles.settings} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <h1>Settings</h1>
      </header>
      
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}
      
      <div className={styles.settingsGrid}>
        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <h2>Appearance</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p>Choose your preferred theme for the application.</p>
            
            <div className={styles.themeSelector}>
              <button 
                className={`${styles.themeOption} ${theme === 'light' ? styles.selected : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <LightModeIcon />
                <span>Light</span>
              </button>
              
              <button 
                className={`${styles.themeOption} ${theme === 'dark' ? styles.selected : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <DarkModeIcon />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <h2>API Configuration</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p>Manage your AI provider and API key settings.</p>
            
            <div className={styles.apiProviderSelector}>
              <h3>AI Provider</h3>
              <div className={styles.radioGroup}>
                <label className={apiProvider === 'openai' ? styles.selected : ''}>
                  <input
                    type="radio"
                    name="provider"
                    value="openai"
                    checked={apiProvider === 'openai'}
                    onChange={() => setApiProvider('openai')}
                  />
                  OpenAI
                </label>
                <label className={apiProvider === 'gemini' ? styles.selected : ''}>
                  <input
                    type="radio"
                    name="provider"
                    value="gemini"
                    checked={apiProvider === 'gemini'}
                    onChange={() => setApiProvider('gemini')}
                  />
                  Gemini
                </label>
              </div>
            </div>
            
            <div className={styles.currentApiKey}>
              <h3>Current API Key</h3>
              <div className={styles.apiKeyDisplay}>
                <KeyIcon />
                <span>{showApiKey ? apiKey : maskApiKey(apiKey)}</span>
                <button 
                  className={styles.visibilityToggle}
                  onClick={toggleApiKeyVisibility}
                >
                  {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>
            
            <div className={styles.updateApiKey}>
              <h3>Update API Key</h3>
              <div className={styles.apiKeyInput}>
                <input
                  type="password"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder={`Enter new ${apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
                />
                <button 
                  className={styles.updateButton}
                  onClick={handleUpdateApiKey}
                  disabled={!newApiKey.trim()}
                >
                  <SaveIcon /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <h2>Data Management</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p>Manage your saved copies and application data.</p>
            
            <div className={styles.dataActions}>
              <button 
                className={styles.dangerButton}
                onClick={handleClearData}
              >
                <DeleteIcon /> {confirmDelete ? 'Confirm Delete All Copies?' : 'Delete All Copies'}
              </button>
              
              <button 
                className={styles.dangerButton}
                onClick={clearApiKey}
              >
                <KeyIcon /> Clear API Key
              </button>
            </div>
            
            <div className={styles.dataInfo}>
              <p>
                <strong>Note:</strong> All data is stored locally in your browser. 
                Clearing your browser data will remove all your saved copies.
              </p>
            </div>
          </div>
        </div>
        
        <div className={styles.settingCard}>
          <div className={styles.settingHeader}>
            <h2>About CopyGenius</h2>
          </div>
          
          <div className={styles.settingContent}>
            <p>CopyGenius is an AI-powered copywriting assistant that helps you create compelling copy using proven frameworks.</p>
            
            <div className={styles.aboutInfo}>
              <div className={styles.infoItem}>
                <h3>Version</h3>
                <p>0.1.0</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3>Frameworks</h3>
                <p>AIDA, PAS, 4Ps, PASTOR, SLAP, BAB, FAB, ACCA, and more</p>
              </div>
              
              <div className={styles.infoItem}>
                <h3>Privacy</h3>
                <p>Your data stays on your device. API requests are made directly from your browser to the AI provider.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
