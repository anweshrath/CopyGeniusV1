import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from './Editor.module.css';
import { useTheme } from '../context/ThemeContext';
import { useApiKey } from '../context/ApiKeyContext';
import { useCopyStore } from '../store/copyStore';
import { copyFrameworks } from '../utils/copyFrameworks';
import { generateCopy, suggestImprovements } from '../services/aiService';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const copyTypes = [
  { value: 'sales', label: 'Sales Copy' },
  { value: 'email', label: 'Email' },
  { value: 'instagram', label: 'Instagram Post' },
  { value: 'facebook', label: 'Facebook Post' },
  { value: 'twitter', label: 'Twitter Post' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'ad', label: 'Advertisement' },
  { value: 'product', label: 'Product Description' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'other', label: 'Other' }
];

const Editor = () => {
  const { theme } = useTheme();
  const { apiKey, apiProvider } = useApiKey();
  const navigate = useNavigate();
  const { id } = useParams();
  const { copies, addCopy, updateCopy, removeCopy } = useCopyStore();
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [niche, setNiche] = useState('');
  const [purpose, setPurpose] = useState('');
  const [framework, setFramework] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [error, setError] = useState('');
  
  const contentRef = useRef(null);
  
  // Load existing copy if editing
  useEffect(() => {
    if (id) {
      const existingCopy = copies.find(copy => copy.id === id);
      if (existingCopy) {
        setTitle(existingCopy.title);
        setType(existingCopy.type);
        setNiche(existingCopy.niche);
        setPurpose(existingCopy.purpose);
        setFramework(existingCopy.framework);
        setContent(existingCopy.content);
        setIsSetupComplete(true);
      } else {
        navigate('/editor');
      }
    }
  }, [id, copies, navigate]);
  
  const handleStartWriting = async () => {
    if (!type || !niche || !purpose || !framework) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setIsSetupComplete(true);
    
    if (!content) {
      try {
        setIsGenerating(true);
        const generatedContent = await generateCopy(
          apiKey,
          apiProvider,
          type,
          niche,
          purpose,
          framework
        );
        setContent(generatedContent);
      } catch (err) {
        console.error('Error generating copy:', err);
        setError('Failed to generate copy. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      setError('Please add a title');
      return;
    }
    
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }
    
    setError('');
    
    const copyData = {
      id: id || uuidv4(),
      title,
      type,
      niche,
      purpose,
      framework,
      content,
      lastModified: new Date().toISOString()
    };
    
    if (id) {
      updateCopy(copyData);
    } else {
      addCopy(copyData);
    }
    
    navigate('/saved');
  };
  
  const handleDelete = () => {
    if (id && confirm('Are you sure you want to delete this copy?')) {
      removeCopy(id);
      navigate('/dashboard');
    }
  };
  
  const handleGetSuggestions = async () => {
    if (!content.trim()) {
      setError('Please write some content first');
      return;
    }
    
    try {
      setIsSuggesting(true);
      setError('');
      
      const improvedContent = await suggestImprovements(
        apiKey,
        apiProvider,
        content,
        type,
        framework
      );
      
      setSuggestion(improvedContent);
    } catch (err) {
      console.error('Error getting suggestions:', err);
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const handleApplySuggestion = () => {
    if (suggestion) {
      setContent(suggestion);
      setSuggestion('');
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  
  const handleBack = () => {
    if (isSetupComplete) {
      setIsSetupComplete(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`${styles.editor} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowBackIcon />
        </button>
        
        <h1>{id ? 'Edit Copy' : 'Create New Copy'}</h1>
        
        <div className={styles.actions}>
          {id && (
            <button className={styles.deleteButton} onClick={handleDelete}>
              <DeleteIcon /> Delete
            </button>
          )}
          
          <button className={styles.saveButton} onClick={handleSave}>
            <SaveIcon /> Save
          </button>
        </div>
      </header>
      
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      
      {!isSetupComplete ? (
        <div className={styles.setupContainer}>
          <div className={styles.setupCard}>
            <h2>Let's set up your copy</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your copy a name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="type">What type of copy do you want to write?</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select a type</option>
                {copyTypes.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="niche">What's your niche or industry?</label>
              <input
                type="text"
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., Fitness, SaaS, E-commerce, Real Estate"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="purpose">What's the purpose of this copy?</label>
              <input
                type="text"
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Sell a product, Generate leads, Build awareness"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="framework">Select a copywriting framework</label>
              <select
                id="framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
              >
                <option value="">Select a framework</option>
                {Object.keys(copyFrameworks).map(key => (
                  <option key={key} value={key}>
                    {copyFrameworks[key].name} - {copyFrameworks[key].description}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={styles.frameworkInfo}>
              {framework && (
                <div className={styles.selectedFramework}>
                  <h3>{copyFrameworks[framework].name}</h3>
                  <p>{copyFrameworks[framework].description}</p>
                  <div className={styles.components}>
                    <h4>Components:</h4>
                    <ul>
                      {copyFrameworks[framework].components.map((component, index) => (
                        <li key={index}>
                          <strong>{component.name}:</strong> {component.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              className={styles.startButton} 
              onClick={handleStartWriting}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Start Writing'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.contentContainer}>
          <div className={styles.editorContainer}>
            <div className={styles.editorHeader}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Copy"
                className={styles.titleInput}
              />
              
              <div className={styles.editorMeta}>
                <span className={styles.typeBadge}>{copyTypes.find(t => t.value === type)?.label || type}</span>
                <span className={styles.frameworkBadge}>{copyFrameworks[framework]?.name}</span>
              </div>
            </div>
            
            <div className={styles.editorBody}>
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your copy here..."
                className={styles.contentTextarea}
              />
            </div>
            
            <div className={styles.editorFooter}>
              <button 
                className={styles.suggestButton} 
                onClick={handleGetSuggestions}
                disabled={isSuggesting}
              >
                <AutoFixHighIcon /> {isSuggesting ? 'Getting suggestions...' : 'Get AI Suggestions'}
              </button>
              
              <button 
                className={styles.copyButton} 
                onClick={handleCopyToClipboard}
              >
                {isCopied ? <CheckIcon /> : <ContentCopyIcon />} {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
          
          {suggestion && (
            <div className={styles.suggestionContainer}>
              <div className={styles.suggestionHeader}>
                <h3><LightbulbIcon /> AI Suggestion</h3>
                <button 
                  className={styles.applySuggestionButton}
                  onClick={handleApplySuggestion}
                >
                  Apply Suggestion
                </button>
              </div>
              
              <div className={styles.suggestionContent}>
                {suggestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Editor;
