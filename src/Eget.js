import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { AppBar, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { IconButton, Box, DialogTitle, Dialog, DialogContentText, DialogContent, DialogActions, Menu, Tooltip, MenuItem, ListItemIcon, } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';


const Sidebar = () => {
    let xhr = new XMLHttpRequest();
    let data;

    xhr.open("GET", 'http://172.17.15.253:8080/AdminGet', false);
    xhr.send();

    if (xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
    } else {
        console.error("There was a problem with the request");
    }

    // Create an object to hold the transformed data
    const subTabsData = {};

    // Iterate through the fetched data
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const originalArray = data[key];

            // Create an array to hold the sub-tab data
            const subTabArray = [];

            for (const item of originalArray) {
                const subTabData = {
                    name: item.Name,
                    questions: item.Questions,
                    quantityTargets: item.QuantityTarget,
                };

                subTabArray.push(subTabData);
            }

            // Assign the sub-tab data to the corresponding key in subTabsData
            subTabsData[key] = subTabArray;
        }
    }

    console.log(subTabsData);
    let tabs = Object.keys(subTabsData)

    // const [tabsData, setTabsData] = useState({});
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [subTabKeys, setSubTabKeys] = useState([]); // New state for sub-tab keys
    // const [activeSubTab, setActiveSubTab] = useState('');

    const [tabsData, setTabsData] = useState([]);
    const [activeSubTab, setActiveSubTab] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
    const [userData, setUserData] = useState(null); // State to store user data
    const [registrations, setRegistrations] = useState([]);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);

    const [isTableVisible, setTableVisible] = useState(false);
    const [error, setError] = useState(false);


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleChangePassword = () => {
        setShowChangePassword(true);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    }

    const handleOpenProfileCard = async () => {
        const empid = localStorage.getItem('Empid'); // Make sure this contains the correct Empid
        try {
            // Fetch the user data based on empid
            const response = await fetch(`${BASE_URL}/GetKPI/${empid}`);
            const userData = await response.json();

            if (userData.message.length > 0) {
                // Assuming the API returns an array of users, use the first one
                setUserData(userData.message[0]);
                setIsProfileCardOpen(true); // Open the profile card
                handleCloseUserMenu(); // Close the settings menu
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    // Function to toggle the Change Password component
    const toggleChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    };




    const handleCloseProfileCard = () => {
        setIsProfileCardOpen(false); // Close the profile card
    };
    const fetchUserProfile = async () => {
        try {
            const empid = localStorage.getItem('Empid');
            const response = await fetch(`${BASE_URL}/GetKPI?Empid=${empid}`);
            const data = await response.json();

            // Filter the data to find the user with the matching Empid
            const userData = data.message.find(user => user.Empid === parseInt(empid, 10));

            if (userData) {
                // Now you have the user data
                console.log(userData);
                // setUserData(userData); // Set the user data in your state if needed
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleToggleImagePreview = () => {
        setShowImagePreview(!showImagePreview);
    };

    const [empIdExists, setEmpIdExists] = useState(true);
    useEffect(() => {
        if (isProfileCardOpen) {
            fetchUserProfile();
        }
    }, [isProfileCardOpen]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            const parseJWT = (token) => {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedData = JSON.parse(atob(base64));
                return decodedData;
            };

            if (token) {
                const tokenData = parseJWT(token);
                const empId = tokenData.Empid;

                try {
                    const response = await fetch(`${BASE_URL}/EmployeeDataKPIGet/${empId}/${activeTab}`);
                    const data = await response.json();
                    setTabsData(data.data);
                    const savedTabsData = localStorage.getItem('tabsData');

                    if (savedTabsData) {
                        setTabsData(JSON.parse(savedTabsData));
                    }

                    // Extract sub-tab keys from the data response
                    if (data.data) {
                        const subTabKeys = data.data.map(item => item.Name); // Use "Name" field as sub-tab key
                        console.log('Sub Tab Keys:', subTabKeys);
                        setSubTabKeys(subTabKeys);
                        setActiveSubTab(subTabKeys[0]); // Set the first sub-tab as active by default
                        handleSubTabClick(subTabKeys[0]); // Fetch and display data for the first sub-tab
                        setTableVisible(true);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [activeTab]);

    useEffect(() => {
        // Fetch the registration data from the server when the component mounts
        const fetchRegistrations = async () => {
            try {
                const response = await fetch(`${BASE_URL}/GetKPI`); // Replace with the correct URL for your backend
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                const data = await response.json();
                setRegistrations(data.message);

                // Extract Firstname from the API response
                const firstnames = data.message.map(item => item.Firstname);

            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        fetchRegistrations();
    }, []);


    const navigate = useNavigate();
    const handleClose = () => {
        setOpenDialog(false);
        // Navigate to the login page when the dialog is closed
        navigate('/eget/:empId');
    };





    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSubTabClick = async (subTab) => {

        setLoading(true);


        const token = localStorage.getItem('token');

        console.log('Active Tab:', activeTab);
        console.log('Active Sub-Tab:', subTab);

        setActiveSubTab(subTab);
        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        if (token) {
            const tokenData = parseJWT(token);
            const empId = tokenData.Empid;

            try {
                const response = await fetch(`${BASE_URL}/EmployeeDataKPIGet/${empId}/${activeTab}/${subTab}`);
                const data = await response.json();

                if (data.data && data.data.length > 0) {
                    // Use the first item's "Data" array as the tabsData
                    const mappedData = data.data[0].Data;
                    console.log('Mapped Data:', mappedData);
                    setTabsData(mappedData);
                } else {
                    console.error('Data for sub-tab not found:', subTab);
                    setTabsData([]); // Handle empty data or show an error message
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                // Delay setting loading to false by 3 seconds
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }
    };

    const hasEmptyFields = () => {
        return tabsData.some((item) =>
            !item.Metric || item.QuantityAchieved === '' || !item.Comments || item.IndexKpi === ''
        );
    };
    // Event handler for input fields to update error state
    const handleFieldChange = () => {
        setError(hasEmptyFields());
    };

    const handleSubTabUpdate = async () => {
        const token = localStorage.getItem('token');


        if (hasEmptyFields()) { // Invoke the function with ()
            setError(true); // Set the error state to true
            return; // Do not proceed with the update if there are empty fields.
        }

        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        if (token) {
            const tokenData = parseJWT(token);
            const empId = tokenData.Empid;
            try {
                const updatedData = {
                    Data: tabsData.map(item => ({
                        Metric: item.Metric,
                        QuantityTarget: item.QuantityTarget,
                        QuantityAchieved: item.QuantityAchieved,
                        IndexKpi: item.IndexKpi,
                        Comments: item.Comments,
                        ManagerRating: item.ManagerRating,
                        ManagerComments: item.ManagerComments,
                    })),
                };

                const response = await fetch(`${BASE_URL}/EmployeeDataKPIUpdate/${empId}/${activeTab}/${activeSubTab}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok) {
                    setOpenDialog(true);
                    console.log('Data updated successfully');
                } else {
                    console.error('Failed to update data');
                }
            } catch (error) {
                console.error('Error updating data:', error);
            }
        }
    };



    const handleLogout = () => {
        // localStorage.removeItem('form_data');
        // localStorage.removeItem('token');
        // Redirect to the login page (replace '/login' with your login route)
        window.location.href = '/eview';
    };


    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = firstname + " " + lastname



    const ratings = Array.from({ length: 11 }, (_, i) => i);



    const handleQuantityAchievedChange = (index, newValue) => {
        const updatedTabsData = [...tabsData];
        updatedTabsData[index].QuantityAchieved = newValue;
        setTabsData(updatedTabsData);

        // Save the updated state in localStorage
        localStorage.setItem('tabsData', JSON.stringify(updatedTabsData));
    };
    const handleIndexKpiChange = (index, newValue) => {
        const updatedTabsData = [...tabsData];
        updatedTabsData[index].IndexKpi = newValue;
        setTabsData(updatedTabsData);

        // Save the updated state in localStorage
        localStorage.setItem('tabsData', JSON.stringify(updatedTabsData));
    };

    const handleCommentsChange = (index, newValue) => {
        const updatedTabsData = [...tabsData];
        updatedTabsData[index].Comments = newValue;
        setTabsData(updatedTabsData);
    };

    return (
        <>
            <div className="page-container">
                <AppBar position="fixed">
                    <Toolbar className="navBar-style">
                        <img className='images' src='data:image/jpeg;base64,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' alt='not found' />
                        <div className="userInfo">
                            <Typography variant="h6" className="welcome-text">
                                WELCOME
                            </Typography>
                            <h3 className="username">{username.toUpperCase()}</h3>
                        </div>
                        <Box>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenUserMenu}
                                color="inherit"
                            >
                                <Tooltip title="Open settings">

                                    {registrations.map((registration) => (
                                        registration.Firstname === firstname && (
                                            <td>
                                                {registration.Image && (
                                                    <img
                                                        src={`${BASE_URL}/uploads/${registration.Image}`}
                                                        alt="Profile"
                                                        style={{
                                                            width: '60px', // Set the desired width
                                                            height: '60px', // Set the desired height
                                                            borderRadius: '50%',
                                                            marginRight: '8px',
                                                        }}

                                                    />
                                                )}
                                            </td>
                                        )
                                    ))}
                                </Tooltip>
                            </IconButton>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >

                                <MenuItem key="Profile" onClick={handleOpenProfileCard}>
                                    <ListItemIcon>
                                        <AccountCircleIcon />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>



                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <ArrowBackIcon />
                                    </ListItemIcon>
                                    GoBack
                                </MenuItem>
                            </Menu>
                        </Box>

                    </Toolbar>
                </AppBar>

                <div className="content-container">

                    <div className="sidebar ">
                        <div className="tabs">
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    className={`tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => handleTabClick(tab)}
                                >
                                    <br /><span className="star-icon">&#9733;</span>
                                    {tab}
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="sub-tabs" >
                        <Tabs className='subtabs-adjust'
                            value={activeSubTab}
                            onChange={(event, newValue) => handleSubTabClick(newValue)} centered
                            variant="scrollable" scrollButtons="auto"
                        >
                            {subTabKeys.map((subTab, index) => (
                                !loading && (
                                    <Tab className='subtabs-tabs'
                                        key={index}
                                        label={subTab}
                                        value={subTab}
                                        style={{ fontWeight: 'bold', fontSize: '100%' }} variant="scrollable" scrollButtons="auto"
                                    />
                                )
                            ))}
                        </Tabs>

                        <div className='employeetable'>
                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-text">Loading...</div>
                                    <div className="loading-spinner"></div>
                                </div>

                            ) : activeSubTab && tabsData.length > 0 ? (
                                <TableContainer component={Paper} style={{ width: '1150px', height: '35vh', overflow: 'auto' }} >
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className='tablecell-style' style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Metric</TableCell>
                                                <TableCell className='tablecell-style1' style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important', }}>Quantity Target</TableCell>
                                                <TableCell className='tablecell-style2' style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important', }}>Quantity Achieved</TableCell>
                                                <TableCell className='tablecell-style3' style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important', }}>Comments</TableCell>
                                                <TableCell className='tablecell-style4' style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important', }}>Index KPI</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {tabsData.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell style={{ fontSize: "100%", fontFamily: 'Open Sans,sans-serif!important' }}>{item.Metric}</TableCell>
                                                    <TableCell>{item.QuantityTarget}</TableCell>
                                                    <TableCell> {item.QuantityAchieved}</TableCell>
                                                    <TableCell> {item.Comments} </TableCell>
                                                    <TableCell>{item.IndexKpi} </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                        <div className='employeeupdatebutton'>

                                        </div>
                                    </Table>

                                </TableContainer>

                            ) : (
                                <div className="message-box">
                                    <div className="no-data-message">
                                        No data available.
                                    </div>
                                </div>
                            )}



                        </div>
                        <Dialog
                            open={isProfileCardOpen}
                            onClose={handleCloseProfileCard}
                            fullWidth // Makes the dialog take up the full width of its container
                            maxWidth="sm" // Sets the maximum width of the dialog
                        >
                            <DialogTitle style={{ marginLeft: '33%', fontSize: '24px', fontWeight: 'bolder' }}>Profile Details</DialogTitle>
                            <DialogContent style={{ height: '370px' }}>
                                {/* Display user profile information */}
                                {registrations.map((registration) => (
                                    registration.Firstname === firstname && (
                                        <div style={{ marginLeft: '40%' }} onClick={handleToggleImagePreview}>
                                            {registration.Image && (
                                                <img
                                                    src={`${BASE_URL}/uploads/${registration.Image}`}
                                                    alt="Profile"
                                                    style={{
                                                        maxWidth: '120px',
                                                        borderRadius: '50%',
                                                        height: '50%',
                                                        cursor: 'pointer', // Add cursor style for pointer
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )
                                ))}<br />
                                {userData && (
                                    <>


                                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '5%' }}>
                                            <div style={{ marginRight: '20px' }}>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Empid:</span> {userData.Empid}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>First Name:</span> {userData.Firstname}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Last Name:</span> {userData.Lastname}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Email:</span> {atob(userData.Empmail)}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Role:</span> {userData.Role}
                                                </p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Practice:</span> {userData.Practies}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Reporting Manager:</span> {userData.Reportingmanager}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Reporting HR:</span> {userData.Reportinghr}
                                                </p>
                                                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', fontStyle: 'initial' }}>
                                                    <span style={{ fontWeight: 'bold', color: 'Black' }}>Location:</span> {userData.Location}
                                                </p>

                                            </div>
                                        </div>


                                    </>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseProfileCard} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog open={showImagePreview} onClose={handleToggleImagePreview}>
                            <DialogContent>
                                {registrations.map((registration) => (
                                    registration.Firstname === firstname && (
                                        <div>
                                            {registration.Image && (
                                                <img
                                                    src={`${BASE_URL}/uploads/${registration.Image}`}
                                                    alt="Profile Preview"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )
                                ))}
                            </DialogContent>
                        </Dialog>
                        <div style={{ marginLeft: "114%", }}>
                            <Dialog open={openDialog} onClose={handleClose}>
                                <DialogContent style={{ width: '420px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQei9oRhpKFTpI-R1V4z01fnLWzuZRA58w2Xw&usqp=CAU' alt='not found' />
                                    </div>

                                    <DialogContentText style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', color: 'black' }}>
                                        Fields Updated Successfully.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                        OK
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Sidebar;
