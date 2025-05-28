import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  apiProvider: 'openai' | 'gemini';
  setApiProvider: (provider: 'openai' | 'gemini') => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => {
    return localStorage.getItem('apiKey');
  });
  
  const [apiProvider, setApiProviderState] = useState<'openai' | 'gemini'>(() => {
    return (localStorage.getItem('apiProvider') as 'openai' | 'gemini') || 'openai';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey);
    }
  }, [apiKey]);
  
  useEffect(() => {
    localStorage.setItem('apiProvider', apiProvider);
  }, [apiProvider]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
  };

  const clearApiKey = () => {
    localStorage.removeItem('apiKey');
    setApiKeyState(null);
  };
  
  const setApiProvider = (provider: 'openai' | 'gemini') => {
    setApiProviderState(provider);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, apiProvider, setApiProvider }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = (): ApiKeyContextType => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
};
