import React, { useState } from 'react';
import './Performance.css';
import DataTable from './DataTable';

function Performance() {
  const [selectedNavItem, setSelectedNavItem] = useState('');
  const [subItemsOpened, setSubItemsOpened] = useState(false);

  const initialNavItems = ['Value Creator', 'People Developer', 'Business operator', 'Management activities', 'Digital practice contributors'];

  const additionalItems = ['Performance ratio for blog wrting', 'Performance ratio for certification', 'Performance ratio for assets', 'Performance ratio for webinar', 'Performance ratio for Case studes'];

  const additionalItems1=['performance rating for training given', 'review','performance rating for team meetings']
  const handleNavItemSelect = (item) => {
    setSelectedNavItem(item === selectedNavItem ? '' : item);

    if (item === 'Value Creator' || item === 'People Developer') {
      setSubItemsOpened(!subItemsOpened);
    }
  };

  const isInitialItemActive = (item) => {
    if (item === 'Value Creator' || item === 'People Developer') {
      return true;
    }

    if (selectedNavItem === 'Value Creator' || selectedNavItem === 'People Developer') {
      return additionalItems.includes(item);
    }

    return true;
  };

  return (
    <div className="container">
      <div className="sidebar">
        {initialNavItems.map((item) => (
          isInitialItemActive(item) && (
            <div
              key={item}
              className={`name ${selectedNavItem === item ? 'active' : ''}`}
              onClick={() => handleNavItemSelect(item)}
            >
              {item}
            </div>
          )
        ))}
        {(selectedNavItem === 'Value Creator' || selectedNavItem === 'People Developer') && (
          <div className="sub-items">
            {additionalItems.map((item) => (
              <div
                key={item}
                className="name"
                onClick={() => handleNavItemSelect(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="content">
        {selectedNavItem === 'Performance ratio for blog wrting' ? (
          <DataTable />
        ) : (
          <div className="main-heading">Performance Ratio</div>
        )}
      </div>
    </div>
  );
}

export default Performance;
