import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { AppBar, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


const Sidebar = () => {
    const tabs = ['Project Performance', 'Client Interaction and Innovation', 'Personal Growth and Team Collaboration', 'Technical Excellence', 'Leadership and Mentoring'];

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [subTabKeys, setSubTabKeys] = useState([]);
    const [activeSubTab, setActiveSubTab] = useState('');
    
    const [tabsData, setTabsData] = useState({});
    const [subTabRatingsAndComments, setSubTabRatingsAndComments] = useState({});

  
    const [managerRatingInputs, setManagerRatingInputs] = useState(
        new Array(tabsData.length).fill() 
    );
    const [managerCommentsInput, setManagerCommentsInput] = useState(
        new Array(tabsData.length).fill('') // Initialize with empty strings
    );
    
  

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://172.17.15.249:4000/EmployeeDataKPIGet/${activeTab}`);
                const data = await response.json();

                if (data.data) {
                    const subTabKeys = Object.keys(data.data);
                    setSubTabKeys(subTabKeys);
                    setActiveSubTab(subTabKeys[0]);
                    handleSubTabClick(subTabKeys[0]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [activeTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSubTabClick = async (subTab) => {
        setActiveSubTab(subTab);

        try {
            const response = await fetch(`http://172.17.15.249:4000/EmployeeDataKPIGet/${activeTab}/${subTab}`);
            const data = await response.json();

            const mappedData = data.data[subTab];

            setTabsData(mappedData);

            // Check if ratings and comments data already exists for this sub-tab
            const existingRatingsAndComments = subTabRatingsAndComments[subTab] || mappedData.map(() => ({
                ratings: 0,
                comments: '',
            }));

            setSubTabRatingsAndComments({
                ...subTabRatingsAndComments,
                [subTab]: existingRatingsAndComments,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    
    
    const handleManagerRatingChange = (event, metricIndex) => {
        const updatedRatings = [...subTabRatingsAndComments[activeSubTab]];
        updatedRatings[metricIndex].ratings = parseInt(event.target.value, 10);
        setSubTabRatingsAndComments({
            ...subTabRatingsAndComments,
            [activeSubTab]: updatedRatings,
        });
    };
    
    const handleManagerCommentsChange = (event, metricIndex) => {
        const updatedComments = [...subTabRatingsAndComments[activeSubTab]];
        updatedComments[metricIndex].comments = event.target.value;
        setSubTabRatingsAndComments({
            ...subTabRatingsAndComments,
            [activeSubTab]: updatedComments,
        });
    };
    
    
    const handleSubmit = async () => {
        const formattedData = [];

        for (const tabIdx in subTabRatingsAndComments) {
            const subTabData = subTabRatingsAndComments[tabIdx];
            const tabInfo = {
                Value: subTabKeys[tabIdx],
                valuecreater: [],
            };

            for (const questionIdx in subTabData) {
                const questionData = subTabData[questionIdx];

                const formattedQuestion = {
                    Metric: questionData.Metric,
                    QuantityTarget: questionData.QuantityTarget,
                    QuantityAchieved: questionData.QuantityAchieved,
                    IndexKpi: questionData.IndexKpi,
                    Comments: questionData.Comments,
                    ManagerRating: questionData.ratings,
                    ManagerComments: questionData.comments,
                };

                // Add the formatted question to the tab's questions array
                tabInfo.valuecreater.push({
                    name: activeSubTab, // Name of subTab
                    questions: [formattedQuestion], // Wrap in an array
                });
            }

            // Add the formatted tab data to the main array
            formattedData.push(tabInfo);
        }

        try {
            const response = await fetch('http://172.17.15.249:4000/EmployeeManagerDataKPIPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Data posted successfully:', responseData);
            } else {
                console.error('Failed to post data:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

   

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/eview';
    };

    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = firstname + ' ' + lastname;

    return (
        <>
            <div className="page-container">
                <div className="gradient-background"></div>
                <AppBar position="fixed">
                    <Toolbar>
                        <h3 style={{ marginBottom: '1%' }}>
                            <span style={{ fontSize: '25px', padding: '3px', fontFamily: 'Material Icons', marginBottom: '3%', marginTop: '5%' }}>
                                &#xe7fd;
                            </span>
                            &nbsp;{username}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee KPI Ratings
                        </h3>
                        <Button color="inherit" onClick={handleLogout} style={{ marginLeft: '35%', background: 'linear-gradient(45deg,  #FE6B8B 30%, #FF8E53 90%)' }}>
                            <span style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}>
                                &#xe8ac;
                            </span>
                            &nbsp;Go Back
                        </Button>
                    </Toolbar>
                </AppBar>

                <div className="content-container">
                    <div className="sidebar">
                        <div className="tabs">
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sub-tabs">
                        <Tabs
                            value={activeSubTab}
                            onChange={(event, newValue) => handleSubTabClick(newValue)}
                            variant="scrollable"
                            scrollButtons="auto"
                            className="sub-tabs"
                        >
                            {subTabKeys.map((subTab, index) => (
                                <Tab
                                    key={index}
                                    label={subTab}
                                    value={subTab}
                                    style={{ fontWeight: 'bold' }}
                                />
                            ))}
                        </Tabs>

                        <div className="tab-content">
                            {activeSubTab && tabsData.length > 0 ? (
                                <TableContainer component={Paper}>
                                     <Table>
                                <TableHead>
                                    <TableRow>
                                                <TableCell>Metric</TableCell>
                                                <TableCell>Quantity Target</TableCell>
                                                <TableCell>Quantity Achieved</TableCell>
                                                <TableCell>Comments</TableCell>
                                                <TableCell>Index KPI</TableCell>
                                                <TableCell>Manager Rating</TableCell>
                                                <TableCell>Manager Comment</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
    {tabsData.map((item, questionIndex) => (
        <TableRow key={questionIndex}>
            <TableCell>{item.Metric}</TableCell>
            <TableCell>{item.QuantityTarget}</TableCell>
            <TableCell>{item.QuantityAchieved}</TableCell>
            <TableCell>{item.Comments}</TableCell>
            <TableCell>{item.IndexKpi}</TableCell>
            <TableCell>
                <Select
                    value={subTabRatingsAndComments[activeSubTab]?.[questionIndex]?.ratings || 0}
                    onChange={(event) => handleManagerRatingChange(event, questionIndex)}
                >
                    {Array.from({ length: 11 }, (_, i) => i).map((rating) => (
                        <MenuItem key={rating} value={rating}>
                            {rating}
                        </MenuItem>
                    ))}
                </Select>
            </TableCell>
            <TableCell>
                <textarea
                    value={subTabRatingsAndComments[activeSubTab]?.[questionIndex]?.comments || ''}
                    onChange={(event) => handleManagerCommentsChange(event, questionIndex)}
                />
            </TableCell>
        </TableRow>
    ))}
</TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Metric</TableCell>
                                        <TableCell>Quantity Target</TableCell>
                                        <TableCell>Quantity Achieved</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Index KPI</TableCell>
                                    </TableRow>
                                </TableHead>
                            )}
                              <div className="submit-button-container">
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;