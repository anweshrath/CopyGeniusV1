import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <div className={`${styles.notFound} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
