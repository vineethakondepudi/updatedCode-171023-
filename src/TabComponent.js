



import React, { useState } from 'react';
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SubTabs from './SubTabs';
import './Tabs.css';




const tabLabels = [
    'Management Activities',
    'Value Creator',
    'People Developer',
    'Business Operator',
    'Digital Practices'
  ];

const subTabsData = {
    'Management Activities': [
        {
            name: 'Team Performance',
            questions: [
              'Attendance',
              'Team Collaboration',
              'Effciency',
              'Work Quality',
              'Communication'
            ]
          },
          {
            name: 'Preparing Backup',
            questions: [
              'any issues',
              'issues'
              
            ]
          },
          {
            name: 'Connect with Director -1 per week ',
            questions: [
              'No of meetings with manager'
           
            ]
          },
          {
            name: 'Handle issues',
            questions: [
              'No of issues handled before it becomes escalation',
              'No of issues becomes escalation'
            ]
          },
          {
            name: 'People Utilization',
            questions: [
              'No of bench resources utilized',
              'No of bench resources unutilized'
            ]
          },
          {
            name: 'Tracking Project Health',
            questions: [
              'Health=Green',
              'Health=Amber',
              'Health=Red'
            ]
          },
          {
            name: 'Identify low performers and upskill',
            questions: [
              'Skills',
              'Not upskilled'
            ]
          },
          {
            name: 'WSR Completion',
            questions: [
              'On Time completion',
              'Delay'
            ]
          },
          {
            name: 'Team technical evalution',
            questions: [
              'Number of evaluations completed',
            ]
          },
      ],
  'Value Creator': [
    {
      name: 'blog or quarter',
      questions: [
        'Number of blogs published',
        'Review',
        'Number of blogs progress'
      ]
    },
    {
        name: 'Certification -2 per cycle 1 Cloud and 1 Management',
        questions: [
          'Got the certificate',
          'Attended for the exam',
          'Attended for training',
        ],
      },
    {
        name: 'Reusable assets creation by self or team-1 per month',
        questions: [
            'Number of reusable assets completed',
            'Number of assets in progress'
        ]
    },
    {
        name: 'Webinar 1 per 1 quater',
        questions: [
            'Number of Webinars given',
            'Webinars in progress'
        ]
    },
    {
        name: 'Case study 8 per year',
        questions: [
            'Case studies completed',
            'Case study in progress'
        ]
    },
    // ... other sub-tabs for Value Creator
  ],
  'People Developer': [
    {
        name: 'Training programme to develop others - 2 per quarter',
        questions: [
          'Training given',
          'Hierarchy',
          
        ]
      },
      {
        name: 'Code review - 1 per quarter',
        questions: [
          'No of projects code reviewed',
          
          
        ]
      },
      {
        name: 'Team Meetings',
        questions: [
          'No. of meetings with the team biweekly',
          'No. of meetings with the team <= 1 per month ',
          'Bimonthly Meet with team out of work'
        ]
      },
  ],
  'Business Operator': [
    {
        name: 'Code quality assurance per project',
        questions: [
          'No of projects code reviewed',
          'No of projects review in-progress',
        ]
      },
      {
        name: 'Deliverables - Over all projects',
        questions: [
          'Completed before the deadline',
          'Completed on the deadline',
          'Completed after the deadline',
          'Not completed',
          
        ]
      },
      {
        name: 'Client Satisfaction - Per project',
        questions: [
          'Good',
          'Average',
          'Bad'
        ]
      },
      {
        name: 'Client Escalations - Over all projects',
        questions: [
          'Escalations for unavailability on calls, messenger, mails ',
          'Escalations for missing deadlines',
          'Escalations for Prod issues',
        ]
      },
  ],
  
  'Digital Practices': [
    {
        name: 'Availability on mTalk',
        questions: [
          'Response time > 30 mins',
          'Response time > 1hr',
          'Response time > 1 day'
        ]
      },
      {
        name: 'JavaScript interviews',
        questions: [
          'Number of interviews completed',
          
          
        ]
      },
      {
        name: 'Support other projects in DP',
        questions: [
          'Number of projects supported',
         
        ]
      },
  ],
  
};

const TabsView = () => {
    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleChange = (event, newValue) => {
      setSelectedTab(newValue);
    };
  
    return (
      <div className="tabs-view">
      <div className="main-tabs-container">
        <Tabs value={selectedTab} onChange={handleChange} centered>
            {tabLabels.map((label, index) => (
              <Tab
                style={{ fontWeight: 'bold' }}
                key={label}
                label={label}
              />
            ))}
          </Tabs>
        </div>
        <div className="sub-tabs-container">
        {selectedTab >= 0 && (
          <SubTabs subTabData={subTabsData[tabLabels[selectedTab]]} />
        )}
         
        </div>
      </div>
    );
  };
  

function App() {
  return (
    <div className="App">
      <TabsView />
    </div>
  );
}

export default App;
