import React, { useState, useEffect } from 'react';
import { TextField, Tabs, Tab, Box, Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import './Tabs.css';
import {
    AppBar, Toolbar, Typography
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { BASE_URL } from './config';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon

const SubTabs = ({ subTabData, selectedTab, selectedSubTab, updateSelectedTabs, tabLabels, subTabsData }) => {

    const initialMainTabRatings = tabLabels.map((tabLabel) =>
    subTabsData[tabLabel].map((subTab) =>
        subTab.questions.map((question) => ({
            quantityAchieved: null,
            indexKpi: null,
            comments: '',
        }))
    )
);

const [mainTabRatings, setMainTabRatings] = useState(initialMainTabRatings);
const [openDialog, setOpenDialog] = useState(false);
const [showErrorDialog, setShowErrorDialog] = useState(false);
const [incompleteFields, setIncompleteFields] = useState([]);

    // Function to check if there are incomplete fields in the current subtab
    const checkSubTabCompletion = () => {
        const subTabData = subTabsData[tabLabels[selectedTab]][selectedSubTab];
        const incompleteFields = [];

        // Iterate through questions and check for incomplete fields
        subTabData.questions.forEach((question, questionIndex) => {
            const ratingData = mainTabRatings[selectedTab][selectedSubTab][questionIndex];
            if (ratingData.quantityAchieved === null || ratingData.indexKpi === null || ratingData.comments === "") {
                incompleteFields.push(question);
            }
        });

        return incompleteFields;
    };

 
    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);


    const openConfirmationDialog = () => {
        setConfirmationDialogOpen(true);
    };

    const closeConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
    };

    const openSuccessDialog = () => {
        setSuccessDialogOpen(true);
    };


    const selectedTabData = subTabsData[tabLabels[selectedTab]];
    console.log('selectedTab:', selectedTab);
    console.log('tabLabels:', tabLabels);
    console.log('selectedTabData:', selectedTabData);

    const handleChange = (event, newValue) => {
        updateSelectedTabs(selectedTab, newValue);
    };

    const handleRatingChange = (event, questionIndex, column) => {
        const newRating = parseInt(event.target.value, 10);
        const newMainTabRatings = [...mainTabRatings];
        newMainTabRatings[selectedTab][selectedSubTab][questionIndex][column] = newRating;
        setMainTabRatings(newMainTabRatings);
    };


    const handleCommentChange = (event, questionIndex) => {
        const newComment = event.target.value;
        const newMainTabRatings = [...mainTabRatings];
        newMainTabRatings[selectedTab][selectedSubTab][questionIndex].comments = newComment;
        setMainTabRatings(newMainTabRatings);
    };


    const navigate = useNavigate();
    const handleClose = () => {
        setOpenDialog(false);
        // Navigate to the login page when the dialog is closed
        navigate('/mview');
    };


    const handleSubmit = async () => {
        const token = localStorage.getItem('token');

        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        const empName1 = tokenData.Firstname;
        const empName2 = tokenData.Lastname;
        const fullName = empName1 + " " + empName2;


        const formattedData = [
            {
                Empid: empId,
                Empname: fullName,
                data: [], // Initialize an empty array for data
            },
        ];

        for (const tabIdx in mainTabRatings) {
            const subTabRatings = mainTabRatings[tabIdx];
            const tabData = {
                Empid: empId,
                Empname: fullName,
                Value: tabLabels[tabIdx],
                valuecreater: [],
            };

            for (const subTabIdx in subTabRatings) {
                const subTab = subTabsData[tabLabels[tabIdx]][subTabIdx];
                const subTabData = {
                    name: subTab.name,
                    questions: [],
                };

                for (let questionIndex = 0; questionIndex < subTab.questions.length; questionIndex++) {
                    const question = subTab.questions[questionIndex];
                    const quantityTarget = subTab.quantityTargets[questionIndex];
                    const ratingData = subTabRatings[subTabIdx][questionIndex];

                    const quantityAchieved = ratingData.quantityAchieved || 0;
                    const indexKpi = ratingData.indexKpi || 0;
                    const comments = ratingData.comments || '';

                    const formattedQuestion = {
                        Metric: question,
                        QuantityTarget: quantityTarget,
                        QuantityAchieved: quantityAchieved,
                        IndexKpi: indexKpi,
                        Comments: comments,
                    };

                    subTabData.questions.push(formattedQuestion);
                }

                // Add the formatted subTab data to the valuecreater array
                tabData.valuecreater.push(subTabData);
            }

            formattedData[0].data.push(tabData);
        }
        setOpenDialog(true);
        console.log('Formatted data:', formattedData); // Debug log

        try {
            const response = await fetch(`${BASE_URL}/DirectorDataKPIPost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to post data:', errorData);
            } else {
                const responseData = await response.json();
                console.log('Data posted successfully:', responseData);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        };
        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        const empName1 = tokenData.Firstname;
        const empName2 = tokenData.Lastname;
        const fullName = empName1 + " " + empName2;
        // Construct the GET URL to fetch saved data
        const getApiUrl = `${BASE_URL}/SaveDirectorDataKPIGet/${empId}`;

        fetch(getApiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch data');
                }
            })
            .then((data) => {
                // Process the fetched data and update the form fields
                // Assuming data contains the saved data in the expected format

                // Create an empty array to store the updated ratings
                const updatedMainTabRatings = [];

                // Loop through the tabLabels and subTabsData to populate the ratings
                tabLabels.forEach((tabLabel, tabIdx) => {
                    const subTabRatings = subTabsData[tabLabel].map((subTab) => {
                        return subTab.questions.map((question, questionIndex) => {
                            const metricItem = data?.employee?.ratings?.find((item) => item.Metric === question);
                            return {
                                quantityAchieved: metricItem ? metricItem.QuantityAchieved : 0,
                                indexKpi: metricItem ? metricItem.IndexKpi : 0,
                                comments: metricItem ? metricItem.Comments : '',
                            };
                        });
                    });
                    updatedMainTabRatings.push(subTabRatings);
                });

                // Set the updated ratings to the state
                setMainTabRatings(updatedMainTabRatings);
            })
            .catch((error) => {
                console.error('An error occurred while fetching data:', error);
                // Handle the error here if needed
            });
    }, []);


    const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);

    const handleSaveData = async () => {
        setSaveDialogOpen(false);
    };


    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };
        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        const empName1 = tokenData.Firstname;
        const empName2 = tokenData.Lastname;
        const fullName = empName1 + " " + empName2;
        // Construct the GET URL to check if data already exists
        const getApiUrl = `${BASE_URL}/SaveDirectorDataKPIGet/${empId}`;

        try {
            const checkResponse = await fetch(getApiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (checkResponse.ok) {
                // If the GET request is successful, fetch and handle the existing data
                const existingData = await checkResponse.json();
                console.log('Existing data:', existingData);

                // Merge the existing data with the new data to update all fields


                const updatedData =
                {
                    Data: [],
                }


                // Iterate through your data and populate the 'updatedData' array
                for (const tabIdx in mainTabRatings) {
                    const subTabRatings = mainTabRatings[tabIdx];

                    for (const subTabIdx in subTabRatings) {
                        const subTab = subTabsData[tabLabels[tabIdx]][subTabIdx];

                        for (let questionIndex = 0; questionIndex < subTab.questions.length; questionIndex++) {
                            const question = subTab.questions[questionIndex];
                            const quantityTarget = subTab.quantityTargets[questionIndex];
                            const ratingData = subTabRatings[subTabIdx][questionIndex];

                            const quantityAchieved = ratingData.quantityAchieved || 0;
                            const indexKpi = ratingData.indexKpi || 0;
                            const comments = ratingData.comments || '';

                            // Create the formatted question object
                            const formattedQuestion = {
                                Value: tabLabels[tabIdx],
                                Name: subTab.name,
                                Metric: question,
                                QuantityTarget: quantityTarget,
                                QuantityAchieved: quantityAchieved,
                                IndexKpi: indexKpi,
                                Comments: comments,
                            };

                            updatedData.Data.push(formattedQuestion);
                        }
                    }
                }

                console.log("Updated Data", updatedData);


                // Construct the update API URL
                const updateApiUrl = `${BASE_URL}/SaveDirectorDataKPIUpdate/${empId}`;
                console.log("updateApiUrl", updateApiUrl);

                const updateResponse = await fetch(updateApiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                });
                console.log('Update Response Status:', updateResponse.status);
                const updateResponseData = await updateResponse.json();
                console.log('Update Response Data:', updateResponseData);

                if (updateResponse.ok) {
                    console.log('Data updated successfully.');
                    console.log('Response Status:', checkResponse.status);
                    const checkResponseData = await checkResponse.json();
                    console.log('Response Data:', checkResponseData);

                    setSaveDialogOpen(false);
                } else {
                    const errorData = await updateResponse.json();
                    console.error('Failed to update data:', errorData);
                    // Handle the error here if the update request fails
                }

            } else if (checkResponse.status === 404) {
                // If the GET request returns a 404 error (Not Found), proceed with posting new data
                const formattedData = [
                    {
                        Empid: empId,
                        Empname: fullName,
                        data: [], // Initialize an empty array for data
                    },
                ];

                for (const tabIdx in mainTabRatings) {
                    const subTabRatings = mainTabRatings[tabIdx];
                    const tabData = {
                        Empid: empId,
                        Empname: fullName,
                        Value: tabLabels[tabIdx],
                        valuecreater: [],
                    };

                    for (const subTabIdx in subTabRatings) {
                        const subTab = subTabsData[tabLabels[tabIdx]][subTabIdx];
                        const subTabData = {
                            name: subTab.name,
                            questions: [],
                        };

                        for (let questionIndex = 0; questionIndex < subTab.questions.length; questionIndex++) {
                            const question = subTab.questions[questionIndex];
                            const quantityTarget = subTab.quantityTargets[questionIndex];
                            const ratingData = subTabRatings[subTabIdx][questionIndex];

                            const quantityAchieved = ratingData.quantityAchieved === undefined ? 0 : ratingData.quantityAchieved;
                            const indexKpi = ratingData.indexKpi === undefined ? 0 : ratingData.indexKpi;
                            const comments = ratingData.comments || '';


                            const formattedQuestion = {
                                Metric: question,
                                QuantityTarget: quantityTarget,
                                QuantityAchieved: quantityAchieved,
                                IndexKpi: indexKpi,
                                Comments: comments,
                            };

                            subTabData.questions.push(formattedQuestion);
                        }

                        // Add the formatted subTab data to the valuecreater array
                        tabData.valuecreater.push(subTabData);
                    }

                    formattedData[0].data.push(tabData);
                }


                const postApiUrl = `${BASE_URL}/SaveDirectorDataKPIPost`;

                const response = await fetch(postApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedData),
                });
                console.log('Post Response Status:', response.status);
                const responseData = await response.json();
                console.log('Post Response Data:', responseData);

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Data posted successfully:', responseData);
                    // Perform any additional actions or show a success message
                    alert('Data posted successfully.');
                } else {
                    const errorData = await response.json();
                    console.error('Failed to post data:', errorData);
                    // Handle the error here if needed
                }
            } else {
                const errorData = await checkResponse.json();
                console.error('Failed to check data:', errorData);
                // Handle the error here if needed
            }
        } catch (error) {
            console.error('An error occurred while checking, updating, or posting data:', error);
            // Handle the error here if needed
        }

        setSaveDialogOpen(true);
    };
    const [isClearConfirmationDialogOpen, setIsClearConfirmationDialogOpen] = useState(false);
    const handleOpenClearConfirmationDialog = () => {
        setIsClearConfirmationDialogOpen(true);
    };

    const handleCloseClearConfirmationDialog = () => {
        setIsClearConfirmationDialogOpen(false);
    };
    const clearDataAndCloseDialog = async () => {
        await clearData(); // Call the clearData function
        handleCloseClearConfirmationDialog(); // Close the dialog
    };

    const clearData = async () => {

        const token = localStorage.getItem('token');

        const parseJWT = (token) => {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedData = JSON.parse(atob(base64));
            return decodedData;
        };

        const tokenData = parseJWT(token);
        const empId = tokenData.Empid;
        try {
            // Construct the DELETE API URL
            const deleteApiUrl = `${BASE_URL}/SaveDirectorDataKPIDelete/${empId}`;
            console.log("deleteApiUrl", deleteApiUrl);

            // Send a DELETE request to delete data for the specified empId
            const deleteResponse = await fetch(deleteApiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Delete Response Status:', deleteResponse.status);

            if (deleteResponse.ok) {
                // Data deleted successfully
                console.log('Data deleted successfully.');

                // Clear the QuantityAchieved, Comments, and indexKPI fields in your data
                // ...
            } else {
                const errorData = await deleteResponse.json();
                console.error('Failed to delete data:', errorData);
                // Handle the error here with specific error messages
            }
        } catch (error) {
            console.error('An error occurred while deleting data:', error);
            // Handle the error here if needed
        }
    };










    const [isFormComplete, setIsFormComplete] = useState(false);
    const checkFormCompletion = () => {
        for (let i = 0; i < mainTabRatings.length; i++) {
            const mainTab = mainTabRatings[i];
            for (let j = 0; j < mainTab.length; j++) {
                const subTab = mainTab[j];
                for (let k = 0; k < subTab.length; k++) {
                    const ratingData = subTab[k];
                    if (ratingData.quantityAchieved === null || ratingData.indexKpi === null || ratingData.comments === '') {
                        return false;
                    }
                }
            }
        }
        return true;
    };


    useEffect(() => {
        const isComplete = checkFormCompletion();
        setIsFormComplete(isComplete);
    }, [selectedTab, selectedSubTab, mainTabRatings]);


    const exportToExcel = () => {
        const formattedData = [
            ['', 'Metric', 'Quantity Target', 'Quantity Achieved', 'Comments', 'Index KPI'],
        ];
        for (const tabIdx in mainTabRatings) {
            const subTabRatings = mainTabRatings[tabIdx];
            const tabLabel = tabLabels[tabIdx];
            let isFirstSubTab = true;
            formattedData.push([tabLabel]);

            for (const subTabIdx in subTabRatings) {
                const subTab = subTabsData[tabLabel][subTabIdx];


                if (!isFirstSubTab) {
                    formattedData.push(['']);
                }


                formattedData.push([subTab.name]);

                for (let questionIndex = 0; questionIndex < subTab.questions.length; questionIndex++) {
                    const question = subTab.questions[questionIndex];
                    const ratingData = subTabRatings[subTabIdx][questionIndex];


                    formattedData.push([
                        '',
                        question,
                        subTab.quantityTargets[questionIndex],
                        ratingData.quantityAchieved || 0,
                        ratingData.comments || '',
                        ratingData.indexKpi || 0,
                    ]);
                }
                isFirstSubTab = false;
            }
        }


        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, 'KPI Data');


        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, 'KPI_Data.xlsx');
    };
    const [selectedTabs, setSelectedTabs] = useState(0);

    return (
        <div>
          <Tabs
                value={selectedSubTab}
                onChange={handleChange}
                centered variant="scrollable" scrollButtons="auto"
                sx={{
                }}
            >
                {subTabData.map((subTab, index) => (
                    <Tab
                        className='empformSub-tab'
                        style={{ fontWeight: 'bold' }}
                        key={index}
                        label={subTab.name}
                        sx={{ backgroundColor: 'inherit' }}
                        variant="scrollable"
                        scrollButtons="auto"
                        onClick={() => updateSelectedTabs(selectedTab, index)}
                    />
                ))}

            </Tabs>
            <Box>
                <TableContainer component={Paper} style={{ height: '43vh', overflow: "auto" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Metric</TableCell>
                                <TableCell style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Quantity Target</TableCell>
                                <TableCell style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Quantity Achieved</TableCell>
                                <TableCell style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Comments</TableCell>
                                <TableCell style={{ fontSize: "100%", fontWeight: "bold", fontFamily: 'Open Sans,sans-serif!important' }}>Index KPI</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subTabData[selectedSubTab]?.questions.map((question, questionIndex) => (
                                <TableRow key={questionIndex}>
                                    <TableCell>{question}</TableCell>
                                    <TableCell>{subTabData[selectedSubTab]?.quantityTargets[questionIndex]}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.quantityAchieved === null ? '' : mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.quantityAchieved}
                                            onChange={(event) => handleRatingChange(event, questionIndex, 'quantityAchieved')}
                                            sx={{ minWidth: '120px' }}
                                        >
                                            <MenuItem value={null}> </MenuItem>
                                            {Array.from({ length: 11 }, (_, i) => (
                                                <MenuItem key={i} value={i}>{i}</MenuItem>
                                            ))}
                                        </Select>

                                    </TableCell>
                                    <TableCell>
                                    <Tooltip title={mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.comments || ''} classes={{ tooltip: 'custom-tooltip' }}>
                                       
                                    <TextField
                                            value={mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.comments || ''}
                                            multiline
                                            rows={1}
                                            onChange={(event) => handleCommentChange(event, questionIndex)}
                                            label="Comments"                                          
                                        />
                                           </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.indexKpi === null ? '' : mainTabRatings[selectedTab][selectedSubTab][questionIndex]?.indexKpi}
                                            onChange={(event) => handleRatingChange(event, questionIndex, 'indexKpi')}
                                            sx={{ minWidth: '120px' }}
                                        >
                                            {Array.from({ length: 11 }, (_, i) => i).map((rating) => (
                                                <MenuItem key={rating} value={rating}>{rating}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="navigationbuttons">
                    {/* <Dialog open={openDialog} onClose={handleClose}>
                        <DialogContent style={{ width: '420px' }}>
                          
                            <img
                                src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                                alt="not found"
                                style={{ maxWidth: '100%', maxHeight: '200px', marginLeft: '23%' }}
                            />
                            <DialogContentText style={{ fontSize: '18px', marginLeft: '10%', fontWeight: 'bold', color: 'black' }}>
                                You saved the Data.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary" style={{ color: 'Black', backgroundColor: '#d8d6d6', fontWeight: 'bolder' }}>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog> */}

                    <Dialog
                        open={isSaveDialogOpen}
                        onClose={() => setSaveDialogOpen(false)} // Close the dialog when needed
                    >
                        <DialogTitle>Save Data</DialogTitle>
                        <DialogContent>
                            {/* Add content for the save dialog here */}
                            <DialogContentText>
                                Are you sure you want to save the data?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSaveDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveData} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Button
                        className='getSaveButton'
                        variant="contained"
                        style={{ backgroundColor: '#1dbb99' }}
                        onClick={handleSave}
                    >
                        Save
                    </Button>&nbsp;&nbsp;&nbsp;
                    <Dialog
                        open={isClearConfirmationDialogOpen}
                        onClose={handleCloseClearConfirmationDialog}
                    >
                        <DialogTitle>Clear Confirmation</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to clear the data? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseClearConfirmationDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={clearDataAndCloseDialog} color="primary">
                                Clear
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Button
                        className='getClearButton'
                        variant="contained"
                        style={{ backgroundColor: '#1dbb99' }}
                        onClick={handleOpenClearConfirmationDialog}
                    >
                        Clear
                    </Button>&nbsp;

                    <button
                        className="navigation-button"
                        onClick={() => {
                            if (selectedSubTab > 0) {
                                // If there's a previous subtab, go to it
                                updateSelectedTabs(selectedTab, selectedSubTab - 1);
                            } else if (selectedTab > 0) {
                                // If no previous subtab, check if there's a previous main tab
                                const newSelectedTab = selectedTab - 1;
                                updateSelectedTabs(newSelectedTab, subTabsData[tabLabels[newSelectedTab]].length - 1);
                            } else {
                                // If no previous main tab, stay on the first main tab and subtab
                                updateSelectedTabs(0, 0);
                            }
                        }}
                        disabled={selectedTab === 0 && selectedSubTab === 0}
                    >
                        &lt; Previous
                    </button>
                    <button
                        className="navigation-button"
                        style={{ width: '100px', height: '50px' }}
                        onClick={() => {
                            const incompleteFields = checkSubTabCompletion();
                            if (incompleteFields.length === 0) {
                                if (selectedSubTab < subTabData.length - 1) {
                                    // If there's a next subtab, go to it
                                    updateSelectedTabs(selectedTab, selectedSubTab + 1);
                                } else if (selectedTab < tabLabels.length - 1) {
                                    // If no next subtab, check if there's a next main tab
                                    const newSelectedTab = selectedTab + 1;
                                    updateSelectedTabs(newSelectedTab, 0);
                                } else {
                                    // If no next main tab, stay on the last main tab and subtab
                                    updateSelectedTabs(tabLabels.length - 1, subTabsData[tabLabels[tabLabels.length - 1]].length - 1);
                                }
                            } else {
                                setIncompleteFields(incompleteFields);

                                // Show the error dialog for 3 seconds
                                setShowErrorDialog(true);
                              
                            }
                        }}
                        disabled={
                            selectedTab === tabLabels.length - 1 &&
                            selectedSubTab === subTabData.length - 1
                        }
                    >
                        Next &gt;
                    </button>




                    {incompleteFields.length > 0 && (

                        <Dialog open={showErrorDialog} onClose={() => setShowErrorDialog(false)}>
                            <DialogTitle>
                                Error: Incomplete fields
                                <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={() => setShowErrorDialog(false)}
                                    aria-label="close"
                                    style={{ position: 'absolute', right: '8px', top: '8px' }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent style={{ width: '420px', maxHeight: 'none', overflow: 'hidden' }}>
                                <DialogContentText style={{ fontSize: '18px', marginLeft: '10%', fontWeight: 'bold', color: 'red' }}>
                                    Please complete the following fields in the current subtab: {incompleteFields.join(', ')}
                                </DialogContentText>
                            </DialogContent>
                        </Dialog>


                    )}&nbsp;&nbsp;&nbsp;


                    <Dialog open={isSuccessDialogOpen} onClose={handleClose}>
                        <DialogContent style={{ width: '420px' }}>
                            {/* Include the <img> element for your image here */}
                            <img
                                src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                                alt="Your Image Alt Text"
                                style={{ maxWidth: '100%', maxHeight: '200px', marginLeft: '23%' }}
                            />
                            <DialogContentText style={{ fontSize: '18px', marginLeft: '10%', fontWeight: 'bold', color: 'black' }}>
                                Successfully submitted the form.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {isFormComplete && selectedTab === tabLabels.length - 1 && selectedSubTab === subTabsData[tabLabels[selectedTab]].length - 1 && (
                        <button
                            className={`submit - button ${isFormComplete ? '' : 'disabled-button'}`}
                            onClick={openConfirmationDialog} // Open the confirmation dialog
                            style={{ marginLeft: '2%', height: '50px', width: '100px', marginTop: '-0.1%', backgroundColor:'#00aaee', border:'none', borderRadius:'5px', color:'white' }}
                        >
                            Submit
                        </button>
                    )}
                    <Dialog open={isConfirmationDialogOpen} onClose={closeConfirmationDialog}>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to submit the form? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeConfirmationDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                handleSubmit();
                                exportToExcel();
                                closeConfirmationDialog();
                                openSuccessDialog();
                            }} color="primary">
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                    

                </div>



            </Box>
        </div>
    );
};


const TabsView = () => {

    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedSubTab, setSelectedSubTab] = useState(0);



    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    };


    const updateSelectedTabs = (newSelectedTab, newSelectedSubTab) => {
        setSelectedTab(newSelectedTab);
        setSelectedSubTab(newSelectedSubTab);
    };



    let xhr = new XMLHttpRequest();
    let data;

    xhr.open("GET", "http://172.17.15.253:8080/AdminDirectorGet", false);
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
    let tabLabels = Object.keys(subTabsData)



    const initialMainTabRatings = tabLabels.map((tabLabel) =>
        subTabsData[tabLabel].map((subTab) =>
            subTab.questions.map((question) => ({
                quantityAchieved: 0,
                indexKpi: 0,
                comments: '',
            }))
        )
    );

    const handleLogout = () => {
        // localStorage.removeItem('form_data');
        // localStorage.removeItem('token');
        // Redirect to the login page (replace '/login' with your login route)
        window.location.href = '/directorview';
    };

    const [mainTabRatings, setMainTabRatings] = useState(initialMainTabRatings);

    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = firstname + " " + lastname


    return (
        <>
            <AppBar position="fixed">
                <Toolbar className="navBar-style">
                    <img style={{ width: '60px', borderRadius: '50%' }} src='data:image/jpeg;base64,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' alt='not found' />

                    <div className="userInfo">
                        <Typography variant="h6" className="welcome-text">
                        WELCOME
                        </Typography>

                        <h3 className="username-style">{username}</h3>
                    </div>
                    <Button color="inherit" onClick={handleLogout} className='buttonwrapper'>
                        <span className='gobackeform'

                        >
                            &#8629;
                        </span>&nbsp;
                        <b>GoBack</b>
                    </Button>
                </Toolbar>
            </AppBar> <br /><br /><br /><br /><br />
            <div className="tabs-view">
                <div className="main-tabs-container">
                    <Tabs value={selectedTab} onChange={handleChange} centered variant="scrollable" scrollButtons="auto">
                        {tabLabels.map((label, index) => (
                            <Tab
                                style={{ fontWeight: 'bold', color: 'white' }}
                                key={label}
                                label={label}
                            />
                        )
                        )}
                    </Tabs>
                </div>
                <div className="sub-tabs-container">
                    {selectedTab >= 0 && (
                        <SubTabs
                            subTabData={subTabsData[tabLabels[selectedTab]]}
                            selectedTab={selectedTab}
                            selectedSubTab={selectedSubTab}
                            mainTabRatings={mainTabRatings}
                            setMainTabRatings={setMainTabRatings}
                            updateSelectedTabs={updateSelectedTabs}
                            tabLabels={tabLabels}
                            subTabsData={subTabsData}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

function App() {
    return (
        <div className="App" style={{ backgroundColor: '#e9ecef' }}>
            <TabsView />
        </div>
    );
}

export default App;