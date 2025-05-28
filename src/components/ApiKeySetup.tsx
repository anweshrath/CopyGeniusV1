import { useState } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { useTheme } from '../context/ThemeContext';
import styles from './ApiKeySetup.module.css';

const ApiKeySetup = () => {
  const { setApiKey, apiProvider, setApiProvider } = useApiKey();
  const { theme, toggleTheme } = useTheme();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    
    // Basic validation for OpenAI keys (starts with "sk-")
    if (apiProvider === 'openai' && !key.startsWith('sk-')) {
      setError('OpenAI API keys typically start with "sk-"');
      return;
    }
    
    setApiKey(key.trim());
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>CopyGenius</h1>
          <p className={styles.tagline}>AI-Powered Copywriting Assistant</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Welcome to CopyGenius</h2>
          <p className={styles.description}>
            To get started, please enter your API key. This key will be stored locally on your device and never sent to our servers.
          </p>
          
          <div className={styles.providerSelector}>
            <label>Select AI Provider:</label>
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
          
          <div className={styles.inputGroup}>
            <label htmlFor="apiKey">
              {apiProvider === 'openai' ? 'OpenAI API Key' : 'Gemini API Key'}:
            </label>
            <input
              type="password"
              id="apiKey"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError('');
              }}
              placeholder={`Enter your ${apiProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
              className={error ? styles.inputError : ''}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
          
          <div className={styles.helpText}>
            <p>
              {apiProvider === 'openai' ? (
                <>Don't have an OpenAI API key? <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">Get one here</a>.</>
              ) : (
                <>Don't have a Gemini API key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Get one here</a>.</>
              )}
            </p>
          </div>
          
          <button type="submit" className={styles.submitButton}>
            Get Started
          </button>
        </form>
        
        <div className={styles.themeToggle}>
          <button onClick={toggleTheme} className={styles.themeButton}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySetup;
