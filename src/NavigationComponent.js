import React, { useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import Question from './Question';
import Pdquestion from './Pdquestion';
import Boquestion from './Boquestion';
import Maquestions from './Maquestions';
import Dpquestions from './Dpquestions';



const NavigationComponent = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div style={{ padding: '30px' }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        centered
        sx={{
          backgroundColor: '#d3e0bc', // Set your desired background color here
        }}
      >
        <Tab label="Value Creator" sx={{ backgroundColor: 'inherit' }} />
        <Tab label="People Developer" sx={{ backgroundColor: 'inherit' }} />
        <Tab label="Business Operator" sx={{ backgroundColor: 'inherit' }} />
        <Tab label="Management Activities" sx={{ backgroundColor: 'inherit' }} />
        <Tab label="Digital Practices" sx={{ backgroundColor: 'inherit' }} />

      </Tabs>
      <br/>  <br/>

      <Box hidden={selectedTab !== 0}>
        <Question />
      </Box>
      <Box hidden={selectedTab !== 1}>
        <Pdquestion />
      </Box>
      <Box hidden={selectedTab !== 2}>
        <Boquestion />
      </Box>
      <Box hidden={selectedTab !== 3}>
        <Maquestions />
      </Box>
      <Box hidden={selectedTab !== 4}>
        <Dpquestions />
      </Box>
    </div>
  );
};

export default NavigationComponent;
