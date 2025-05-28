import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNewCopy = () => {
    navigate('/editor');
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <h1 className={styles.mobileTitle}>CopyGenius</h1>
      </div>
      
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>CopyGenius</h1>
          <button className={styles.closeButton} onClick={toggleSidebar}>
            <CloseIcon />
          </button>
        </div>
        
        <button className={styles.newButton} onClick={handleNewCopy}>
          <AddIcon /> New Copy
        </button>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? styles.active : ''}
            onClick={() => setIsOpen(false)}
          >
            <DashboardIcon /> Dashboard
          </NavLink>
          
          <NavLink 
            to="/editor" 
            className={({ isActive }) => isActive ? styles.active : ''}
            onClick={() => setIsOpen(false)}
          >
            <EditIcon /> Editor
          </NavLink>
          
          <NavLink 
            to="/saved" 
            className={({ isActive }) => isActive ? styles.active : ''}
            onClick={() => setIsOpen(false)}
          >
            <BookmarkIcon /> Saved Copies
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => isActive ? styles.active : ''}
            onClick={() => setIsOpen(false)}
          >
            <SettingsIcon /> Settings
          </NavLink>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <div className={styles.version}>
            <span>CopyGenius v0.1.0</span>
          </div>
        </div>
      </aside>
      
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
