import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from '@mui/material';
import './Tabs.css';

const SubTabs = ({ subTabData }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Initialize ratings array based on subTabData
  const initialRatings = subTabData.map((subTab) =>
    subTab.questions.map(() => ({
      quantityAchieved: 0,
      indexKpi: 0, // Add other properties as needed
    }))
  );
  const [ratings, setRatings] = useState(initialRatings);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleRatingChange = (event, subTabIndex, questionIndex, column) => {
    const newRating = parseInt(event.target.value, 10);

    // Check if subTabIndex and questionIndex are within valid ranges
    if (
      subTabIndex < 0 ||
      subTabIndex >= subTabData.length ||
      questionIndex < 0 ||
      questionIndex >= subTabData[subTabIndex].questions.length
    ) {
      return; // Invalid index, do nothing
    }

    // Create a copy of the ratings array to update the specific rating
    const newRatings = ratings.map((subTabRatings, tabIndex) =>
      tabIndex === subTabIndex
        ? subTabRatings.map((rating, qIndex) =>
            qIndex === questionIndex
              ? { ...rating, [column]: newRating }
              : rating
          )
        : subTabRatings
    );

    setRatings(newRatings);
  };

  return (
    <div>
      <div className="sub-tabs-container">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          centered
          sx={{
            backgroundColor: '#d3e0bc',
          }}
        >
          {subTabData.map((tab, index) => (
            <Tab
              style={{ fontWeight: 'bold' }}
              key={index}
              label={tab.name}
              sx={{ backgroundColor: 'inherit' }}
            />
          ))}
        </Tabs>
      </div>
      <Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Metric</TableCell>
                <TableCell>Quantity Target</TableCell>
                <TableCell>Quantity Achieved</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Index KPI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subTabData[selectedTab].questions.map((question, questionIndex) => (
                <TableRow key={questionIndex}>
                  <TableCell>{question}</TableCell>
                  <TableCell>Quantity Target Content</TableCell>
                  <TableCell>
                    <Select
                      value={ratings[selectedTab][questionIndex].quantityAchieved}
                      onChange={(event) => handleRatingChange(event, selectedTab, questionIndex, 'quantityAchieved')}
                      sx={{ minWidth: '120px' }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Select
                      value={ratings[selectedTab][questionIndex].indexKpi}
                      onChange={(event) => handleRatingChange(event, selectedTab, questionIndex, 'indexKpi')}
                      sx={{ minWidth: '120px' }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                        <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
         <div className="navigation-buttons">
    <button
      className="navigation-button"
      onClick={() => {
        const newSelectedTab = selectedTab - 1;
        setSelectedTab(newSelectedTab >= 0 ? newSelectedTab : subTabData.length - 1);
      }}
    >
      Previous
    </button>
    <button
      className="navigation-button"
      onClick={() => {
        const newSelectedTab = selectedTab + 1;
        setSelectedTab(newSelectedTab < subTabData.length ? newSelectedTab : 0);
      }}
    >
      Next
    </button>
  </div>
      </Box>
    </div>
  );
};

export default SubTabs;
