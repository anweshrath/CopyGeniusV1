import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedCopies.module.css';
import { useTheme } from '../context/ThemeContext';
import { useCopyStore } from '../store/copyStore';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const SavedCopies = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { copies, removeCopy } = useCopyStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCopies, setFilteredCopies] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [filterType, setFilterType] = useState('all');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  useEffect(() => {
    let result = [...copies];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(copy => 
        copy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        copy.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        copy.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
        copy.framework.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(copy => copy.type === filterType);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
        break;
      case 'a-z':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredCopies(result);
  }, [copies, searchTerm, sortOption, filterType]);
  
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
  
  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className={`${styles.savedCopies} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <header className={styles.header}>
        <h1>Saved Copies</h1>
        <button className={styles.newButton} onClick={handleNewCopy}>
          <AddIcon /> New Copy
        </button>
      </header>
      
      <div className={styles.toolbar}>
        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search copies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <button 
            className={styles.filterButton}
            onClick={toggleFilterMenu}
          >
            <FilterListIcon /> Filter
          </button>
          
          {isFilterMenuOpen && (
            <div className={styles.filterMenu}>
              <div className={styles.filterSection}>
                <h3>Type</h3>
                <div className={styles.filterOptions}>
                  <label className={filterType === 'all' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="all"
                      checked={filterType === 'all'}
                      onChange={() => setFilterType('all')}
                    />
                    All
                  </label>
                  <label className={filterType === 'sales' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="sales"
                      checked={filterType === 'sales'}
                      onChange={() => setFilterType('sales')}
                    />
                    Sales Copy
                  </label>
                  <label className={filterType === 'email' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="email"
                      checked={filterType === 'email'}
                      onChange={() => setFilterType('email')}
                    />
                    Email
                  </label>
                  <label className={filterType === 'instagram' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="instagram"
                      checked={filterType === 'instagram'}
                      onChange={() => setFilterType('instagram')}
                    />
                    Instagram
                  </label>
                  <label className={filterType === 'facebook' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="facebook"
                      checked={filterType === 'facebook'}
                      onChange={() => setFilterType('facebook')}
                    />
                    Facebook
                  </label>
                  <label className={filterType === 'twitter' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="filterType"
                      value="twitter"
                      checked={filterType === 'twitter'}
                      onChange={() => setFilterType('twitter')}
                    />
                    Twitter
                  </label>
                </div>
              </div>
              
              <div className={styles.filterSection}>
                <h3>Sort By</h3>
                <div className={styles.filterOptions}>
                  <label className={sortOption === 'newest' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="sortOption"
                      value="newest"
                      checked={sortOption === 'newest'}
                      onChange={() => setSortOption('newest')}
                    />
                    Newest First
                  </label>
                  <label className={sortOption === 'oldest' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="sortOption"
                      value="oldest"
                      checked={sortOption === 'oldest'}
                      onChange={() => setSortOption('oldest')}
                    />
                    Oldest First
                  </label>
                  <label className={sortOption === 'a-z' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="sortOption"
                      value="a-z"
                      checked={sortOption === 'a-z'}
                      onChange={() => setSortOption('a-z')}
                    />
                    A-Z
                  </label>
                  <label className={sortOption === 'z-a' ? styles.selected : ''}>
                    <input
                      type="radio"
                      name="sortOption"
                      value="z-a"
                      checked={sortOption === 'z-a'}
                      onChange={() => setSortOption('z-a')}
                    />
                    Z-A
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <button className={styles.sortButton}>
            <SortIcon /> {sortOption === 'newest' ? 'Newest' : sortOption === 'oldest' ? 'Oldest' : sortOption === 'a-z' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>
      
      {filteredCopies.length > 0 ? (
        <div className={styles.copiesGrid}>
          {filteredCopies.map(copy => (
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
          <h3>No copies found</h3>
          {searchTerm || filterType !== 'all' ? (
            <p>Try changing your search or filter criteria</p>
          ) : (
            <p>Create your first copy to get started</p>
          )}
          <button className={styles.createButton} onClick={handleNewCopy}>
            <AddIcon /> Create Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedCopies;
