import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { useTheme } from '../context/ThemeContext';
import { useCopyStore } from '../store/copyStore';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Dashboard = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { copies, removeCopy } = useCopyStore();
  const [recentCopies, setRecentCopies] = useState([]);
  
  useEffect(() => {
    // Sort copies by last modified date and take the 5 most recent
    const sorted = [...copies].sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    ).slice(0, 5);
    
    setRecentCopies(sorted);
  }, [copies]);
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'sales':
        return <ShoppingCartIcon />;
      default:
        return <DescriptionIcon />;
    }
  };
  
  const handleNewCopy = () => {
    navigate('/editor');
  };
  
  const handleEditCopy = (id) => {
    navigate(`/editor/${id}`);
  };
  
  const handleDeleteCopy = (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this copy?')) {
      removeCopy(id);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`${styles.dashboard} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button className={styles.newButton} onClick={handleNewCopy}>
          <AddIcon /> New Copy
        </button>
      </header>
      
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Total Copies</h3>
          <p className={styles.statValue}>{copies.length}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Frameworks Used</h3>
          <p className={styles.statValue}>
            {new Set(copies.map(copy => copy.framework)).size}
          </p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Copy Types</h3>
          <p className={styles.statValue}>
            {new Set(copies.map(copy => copy.type)).size}
          </p>
        </div>
      </div>
      
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Copies</h2>
          <button className={styles.viewAllButton} onClick={() => navigate('/saved')}>
            View All
          </button>
        </div>
        
        {recentCopies.length > 0 ? (
          <div className={styles.recentGrid}>
            {recentCopies.map(copy => (
              <div 
                key={copy.id} 
                className={styles.copyCard}
                onClick={() => handleEditCopy(copy.id)}
              >
                <div className={styles.copyCardHeader}>
                  <div className={styles.copyTypeIcon}>
                    {getTypeIcon(copy.type)}
                  </div>
                  <div className={styles.copyActions}>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => handleDeleteCopy(copy.id, e)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
                
                <h3 className={styles.copyTitle}>{copy.title}</h3>
                
                <div className={styles.copyMeta}>
                  <span className={styles.copyType}>{copy.type}</span>
                  <span className={styles.copyDate}>
                    {formatDate(copy.lastModified)}
                  </span>
                </div>
                
                <p className={styles.copyPreview}>
                  {copy.content.substring(0, 120)}
                  {copy.content.length > 120 ? '...' : ''}
                </p>
                
                <div className={styles.copyFooter}>
                  <span className={styles.copyFramework}>{copy.framework}</span>
                  <button className={styles.editButton}>
                    <EditIcon /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <DescriptionIcon className={styles.emptyIcon} />
            <h3>No copies yet</h3>
            <p>Create your first copy to get started</p>
            <button className={styles.createButton} onClick={handleNewCopy}>
              <AddIcon /> Create Copy
            </button>
          </div>
        )}
      </section>
      
      <section className={styles.frameworksSection}>
        <h2>Copywriting Frameworks</h2>
        <div className={styles.frameworksGrid}>
          <div className={styles.frameworkCard}>
            <h3>AIDA</h3>
            <p>Attention, Interest, Desire, Action</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>PAS</h3>
            <p>Problem, Agitation, Solution</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>4Ps</h3>
            <p>Promise, Picture, Proof, Push</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>PASTOR</h3>
            <p>Problem, Amplify, Story, Testimonial, Offer, Response</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>SLAP</h3>
            <p>Stop, Look, Act, Purchase</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>BAB</h3>
            <p>Before, After, Bridge</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>FAB</h3>
            <p>Features, Advantages, Benefits</p>
          </div>
          
          <div className={styles.frameworkCard}>
            <h3>ACCA</h3>
            <p>Awareness, Comprehension, Conviction, Action</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
