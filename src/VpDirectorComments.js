import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagerCommentsPost.css';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Select, MenuItem, TextField, TableContainer } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { BASE_URL } from './config';


function CollapsibleSection({ icon, title, items, isExpanded, onItemClick, redItems, toggleExpanded }) {
    const handleTitleClick = () => {
        if (items.length > 0) {
            onItemClick(items[0]);
        }
    };

    return (
        <div className="collapsible-section">
            <div className={`sidenav-item ${isExpanded ? 'expanded' : ''}`} onClick={handleTitleClick}>
                {title}
            </div>
            {isExpanded && (
                <ul className="sub-items">
                    {items.map((item, index) => (
                        <li key={index} onClick={() => onItemClick(item)}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}


function ManagerUpdateEmpData() {
    const [sections, setSections] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [tableData, setTableData] = useState([]);
    //   const empId = localStorage.getItem('Empid');
    const firstname = localStorage.getItem('firstname');
    const [loading, setLoading] = useState(true);

    const { empId } = useParams();


    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0); // Initialize with the first section

    useEffect(() => {
        if (sections.length > 0) {
            const selectedSection = sections[selectedSectionIndex];
            if (selectedSection && selectedSection.items.length > 0) {
                handleItemClick(selectedSection.items[0]);
            }
        }
    }, [sections, selectedSectionIndex]);


    useEffect(() => {
        fetchInitialSections();
    }, []);


    const fetchInitialSections = async () => {
        try {
            const response = await axios.get('http://172.17.15.253:8080/AdminDirectorGet');
            const apiData = response.data;

            const formattedData = Object.keys(apiData).map(sectionTitle => ({
                title: sectionTitle,
                items: apiData[sectionTitle].map(subItem => subItem.Name),
                // questions: apiData[sectionTitle].map(subItem => subItem.Questions),
                questions: apiData[sectionTitle][0].Questions,
                quantityTargets: apiData[sectionTitle][0].QuantityTarget,
                isExpanded: false
            }));

            formattedData[0].isExpanded = true;

            setSections(formattedData);
        } catch (error) {
            console.error(error);
            setSections([]);
        }
    };




    // Use useEffect to validate incomplete items when moving to the next title section
    const [incompleteItems, setIncompleteItems] = useState([]);
    const [incompleteItemsDialogOpen, setIncompleteItemsDialogOpen] = useState(false);



    const handleSectionClick = async (index) => {
        // Validate incomplete items when moving to the next title section
        const incompleteItems = getIncompleteItems(index);
        setIncompleteItems(incompleteItems);

        if (incompleteItems.length > 0) {
            // Display an error message with the names of incomplete items
            setIncompleteItemsDialogOpen(true);
            return; // Prevent moving to the next section
        }


        setSelectedSectionIndex(index); // Set the selected section index
        const selectedSection = sections[index];

        const updatedSections = sections.map((section, i) => ({
            ...section,
            isExpanded: i === index ? !section.isExpanded : false,
        }));
        setSections(updatedSections);

        // Find the first item in the expanded section and trigger its click
        const firstItem = sections[index].items[0];
        setSelectedItem(firstItem);
        handleItemClick(firstItem);
    };

    const getIncompleteItems = () => {

        const incompleteItems = [];
        console.log(sections[selectedSectionIndex], "130");
        // console.log(sections[selectedSectionIndex].items,'130');
        for (const item of sections[selectedSectionIndex].items) {
            if (itemHasMissingValues(item)) {
                incompleteItems.push(item);
            }
        }
        // console.log(incompleteItems,'134');
        console.log(selectedItem, '128', itemMetricInputData);
        return incompleteItems;
    };


    //   const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const username = firstname + " " + lastname
    const handleLogout = () => {
        window.location.href = '/VPView';
    };


    const selectedTitle = sections.find((section) => section.isExpanded)?.title || '';




    const [metricInputData, setMetricInputData] = useState({});
    const [itemInputData, setItemInputData] = useState({});

    const [itemMetricInputData, setItemMetricInputData] = useState({});
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);







    const areAllItemsFilled = () => {
        for (const section of sections) {
            for (const item of section.items) {
                const itemData = itemMetricInputData[item];
                if (!itemData) {
                    return false; // If data for this item doesn't exist, it's not filled
                }
                for (const metricKey of Object.keys(itemData)) {
                    const metricData = itemData[metricKey];
                    if (
                        metricData.MRating === null ||
                        metricData.JohnVesliChComments.trim() === ''
                    ) {
                        return false; // If any field is not filled, it's not filled
                    }
                }
            }
        }
        return true; // All items are filled
    };

    useEffect(() => {
        const isSubmitEnabled = areAllItemsFilled();
        setIsSubmitEnabled(isSubmitEnabled);
    }, [itemMetricInputData]);


    const [isFetchingData, setIsFetchingData] = useState(false);

    const handleItemClick = async (item) => {

        setLoading(true);
        setSelectedItem(item);
        try {
            const response = await axios.get(`${BASE_URL}/VicePresidentDataKPIGet/${empId}/${selectedTitle}/${item}`);
            const responseData = response.data.data[0]; // Assuming there's only one item in the array



            if (responseData) {
                // Handle existing data from EmployeeManagerDataKPIGet
                const newItemMetricInputData = { ...itemMetricInputData };
                if (!newItemMetricInputData[item]) {
                    newItemMetricInputData[item] = {};
                }

                responseData.Data.forEach(metricData => {
                    if (!newItemMetricInputData[item][metricData.Metric]) {
                        newItemMetricInputData[item][metricData.Metric] = {
                            MRating: metricData.VpRating,
                            JohnVesliChComments: metricData.VpComments,
                            QuantityTarget: metricData.QuantityTarget || 0,
                            QuantityAchieved: metricData.QuantityAchieved || 0,
                            IndexKpi: metricData.IndexKpi || 0,
                            Comments: metricData.Comments || '',
                        };
                    }
                });

                setItemMetricInputData(newItemMetricInputData);
                setTableData(responseData.Data);
                setIsFetchingData(true); // Set loading state to true when the request starts
            } else {
                // Data doesn't exist in EmployeeManagerDataKPIGet, fetch from EmployeeDataKPIGet
                try {
                    const newDataResponse = await axios.get(`${BASE_URL}/DirectorDataKPIGet/${empId}/${selectedTitle}/${item}`);
                    const newData = newDataResponse.data.data[0]; // Assuming there's only one item in the array

                    if (newData) {
                        // Handle data from EmployeeDataKPIGet
                        const newItemMetricInputData = { ...itemMetricInputData };
                        if (!newItemMetricInputData[item]) {
                            newItemMetricInputData[item] = {};
                        }

                        newData.Data.forEach(metricData => {
                            if (!newItemMetricInputData[item][metricData.Metric]) {
                                newItemMetricInputData[item][metricData.Metric] = {
                                    MRating: '',
                                    JohnVesliChComments: '',
                                    QuantityTarget: metricData.QuantityTarget || 0,
                                    QuantityAchieved: metricData.QuantityAchieved || 0,
                                    IndexKpi: metricData.IndexKpi || 0,
                                    Comments: metricData.Comments || '',
                                };
                            }
                        });

                        setItemMetricInputData(newItemMetricInputData);
                        setTableData(newData.Data);
                    } else {
                        setTableData([]);
                    }
                } catch (error) {
                    console.error(error);
                    setTableData([]);
                }
            }
        } catch (error) {
            console.error(error);
            setTableData([]);
        }
        finally {
            // Delay setting loading to false by 3 seconds
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };


    const itemHasMissingValues = (item) => {
        const itemData = itemMetricInputData[item];
        if (!itemData) {
            return true; // If data for this item doesn't exist, it's missing
        }
    
        const missingItems = [];
    
        for (const metricKey of Object.keys(itemData)) {
            const metricData = itemData[metricKey];
            if (metricData.MRating === null || metricData.JohnVesliChComments.trim() === '') {
                missingItems.push({
                    childTab: item,
                    childTabDetails: itemData,
                    chilTabInputFields: metricData,
                });
            }
        }
    
        if (missingItems.length > 0) {
            console.log(missingItems, "Items with missing data");
            return true; // If any item has missing data, return true
        }
    
        return false; // All values are filled for this item
    };
    

    useEffect(() => {
        fetchData();
    }, [selectedItem]);





    const fetchData = async () => {
        if (!empId) return;

        try {
            let response;
            let responseData;

            try {
                response = await axios.get(`${BASE_URL}/VicePresidentDataKPIGet/${empId}/${selectedTitle}/${selectedItem}`);
                responseData = response.data.data[0];
            } catch (error) {

                try {
                    response = await axios.get(`${BASE_URL}/DirectorDataKPIGet/${empId}/${selectedTitle}/${selectedItem}`);
                    responseData = response.data.data[0];
                } catch (error) {
                    responseData = null;
                }
            }
            console.log(responseData, "325");
            if (responseData) {
                const newItemMetricInputData = { ...itemMetricInputData };
                if (!newItemMetricInputData[selectedItem]) {
                    newItemMetricInputData[selectedItem] = {};
                }

                responseData.Data.forEach(metricData => {
                    if (!newItemMetricInputData[selectedItem][metricData.Metric]) {
                        newItemMetricInputData[selectedItem][metricData.Metric] = {
                            MRating: metricData.VpRating || 0,
                            JohnVesliChComments: metricData.VpComments || '',
                            QuantityTarget: metricData.QuantityTarget || 0,
                            QuantityAchieved: metricData.QuantityAchieved || 0,
                            IndexKpi: metricData.IndexKpi || 0,
                            Comments: metricData.Comments || '',
                        };
                    }
                });

                setItemMetricInputData(newItemMetricInputData);
                setTableData(responseData.Data);
                console.log(tableData, "347");
            } else {
                setTableData([]);
            }
        } catch (error) {
            console.error(error);
            setTableData([]);
        }
    };


    const handleMRatingChange = (item, metric, value) => {
        setItemMetricInputData(prevData => ({
            ...prevData,
            [item]: {
                ...prevData[item],
                [metric]: {
                    ...prevData[item]?.[metric],
                    MRating: value,
                }
            }
        }));

        // Update tableData with the new MRating value
        setTableData(prevTableData => {
            const updatedTableData = prevTableData.map(row => {
                if (row.Metric === metric) {
                    return {
                        ...row,
                        VpRating: value,
                    };
                }
                return row;
            });
            return updatedTableData;
        });
    };

    const handleCommentsChange = (item, metric, value) => {
        if (!value) {
            setError('Comments cannot be empty');
        } else {
            setError(null); // Reset the error if the comment is not empty.
        }

        setItemMetricInputData(prevData => ({
            ...prevData,
            [item]: {
                ...prevData[item],
                [metric]: {
                    ...prevData[item]?.[metric],
                    JohnVesliChComments: value,
                }
            }
        }));

        // Update tableData with the new Comments value
        setTableData(prevTableData => {
            const updatedTableData = prevTableData.map(row => {
                if (row.Metric === metric) {
                    return {
                        ...row,
                        VpComments: value,
                    };
                }
                return row;
            });
            return updatedTableData;
        });
    };

    const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);

    const openConfirmationDialog = () => {
        setConfirmationDialogOpen(true);
    };
    const closeConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
    };

    const closeSuccessDialog = () => {
        setSuccessDialogOpen(false);
        window.location.reload();
    };

    const handleSubmit = async () => {
        // Close the confirmation dialog
        setConfirmationDialogOpen(false);


        if (selectedItem) {
            const postData = [{
                Empid: empId,
                Empname: firstname, // You can replace this with the actual employee name
                data: sections.map((section) => ({
                    Value: section.title,
                    valuecreater: section.items.map((item) => ({
                        name: item,
                        questions: Object.entries(itemMetricInputData[item] || {}).map(([metricKey, metricData]) => ({
                            Metric: metricKey,
                            QuantityTarget: metricData.QuantityTarget || 0,
                            QuantityAchieved: metricData.QuantityAchieved || 0,
                            IndexKpi: metricData.IndexKpi || 0,
                            Comments: metricData.Comments || '',
                            VpRating: metricData.MRating || 0,
                            VpComments: metricData.JohnVesliChComments || '',
                        })),
                    })),
                })),
            }];

            try {
                const response = await axios.post(`${BASE_URL}/VicePresidentDataKPIPost`, JSON.stringify(postData), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Data successfully posted:', response.data);
                closeConfirmationDialog(); // Open the confirmation dialog

                // You can handle success messages or other actions here
                setSuccessDialogOpen(true); // Open the success dialog
            } catch (error) {
                console.error('Error posting data:', error);
                // Handle error messages or other actions here
            }
        }

    };


    const updateApiData = async (newData) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/VicePresidentDataKPIUpdate/${empId}/${selectedTitle}/${selectedItem}`,
                {
                    Data: newData,
                }
            );
            if (response.ok) {
                setOpenDialog(true);
            }
            else {
                console.log("not updated");
            }
            console.log('Data successfully updated:', response.data);
            // Optionally, you can show a success message or perform other actions after successful update.
        } catch (error) {
            console.error('Error updating data:', error);
            // Handle error, show error message, etc.
        }
        setTableData(newData);
    };


    const [openDialog, setOpenDialog] = useState(false);
    const [updatedData, setUpdatedData] = useState(''); // Initialize with your data



    const isCommentFieldEmpty = (data) => {
        for (const row of data) {
            if (!row.VpComments) {
                return true;
            }
        }
        return false;
    };

    const handleUpdateButtonClick = () => {
        // Close the dialog

        if (isCommentFieldEmpty(tableData)) {
            setError('Empty fields cannot be updated');
        } else {
            setError(null); // Reset the error if there are no empty fields.
            updateApiData(tableData);
            setOpenDialog(true);
        }
    };


    // Function to reset the error message
    const resetError = () => {
        setError('');
    };

    // Add this state for managing the error message
    const [error, setError] = useState('');

    // Function to close the dialog
    const handleClose = () => {
        setOpenDialog(false);
    };


    return (
        <>
            <AppBar position="fixed">
                <Toolbar className="navBar-style">
                    <img className='images' src='data:image/jpeg;base64,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' alt='not found' />
                    <div className="userInfo">
                        <Typography variant="h6" className="welcome-text">
                        WELCOME
                        </Typography>
                        <h3 className="username">{username.toUpperCase()}</h3>
                    </div>
                    <Button className='logout-button' onClick={handleLogout} >
                        <span className='logout-icon'
                            style={{ fontFamily: 'Material Icons' }}
                        >
                            &#8629;
                        </span>&nbsp;
                        <b className='logout'> Goback</b>

                    </Button>
                </Toolbar>
            </AppBar>

            <div className="full-height-container">
                <div className="manager-sidenav" style={{ position: 'fixed', height: '100%', overflowY: 'auto' }}>
                    {sections.map((section, index) => (
                        <CollapsibleSection
                            key={index}
                            title={section.title}
                            items={section.items}
                            isExpanded={section.isExpanded}
                            onItemClick={section.isExpanded ? handleItemClick : () => handleSectionClick(index)}
                            style={{ color: 'white', fontWeight: 'bolder', fontSize: '40px' }}
                        />
                    ))}
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-text">Loading...</div>
                            <div className="loading-spinner"></div>
                        </div>

                    ) : (selectedItem && tableData.length > 0 ? (
                        <>
                            <TableContainer style={{ height: '60vh', overflow: 'auto' }}>
                                <Table className="metric-table" style={{ width: '60vw' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Metric</TableCell>
                                            <TableCell>Quantity Target</TableCell>
                                            <TableCell>Quantity Achieved</TableCell>
                                            <TableCell>Index KPI</TableCell>
                                            <TableCell>Comments</TableCell>
                                            <TableCell>Vice President-Rating</TableCell>
                                            <TableCell>Vice President-Comments</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tableData.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.Metric}</TableCell>
                                                <TableCell>{row.QuantityTarget}</TableCell>
                                                <TableCell>{row.QuantityAchieved}</TableCell>
                                                <TableCell>{row.IndexKpi}</TableCell>
                                                <TableCell>{row.Comments}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={itemMetricInputData[selectedItem]?.[row.Metric]?.MRating === undefined ? '' : itemMetricInputData[selectedItem]?.[row.Metric]?.MRating}

                                                        // value={
                                                        //     itemMetricInputData[selectedItem]?.[row.Metric]?.MRating || ''}
                                                        onChange={(e) => {
                                                            handleMRatingChange(selectedItem, row.Metric, e.target.value);

                                                        }

                                                        }
                                                        style={{ width: '100px' }}
                                                    >
                                                        {Array.from({ length: 11 }, (_, i) => i).map((number) => (
                                                            <MenuItem key={number} value={number}>
                                                                {number}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title={itemMetricInputData[selectedItem]?.[row.Metric]?.JohnVesliChComments || ''} classes={{ tooltip: 'custom-tooltip' }} style={{ width: '100%' }}>
                                                        <TextField
                                                            id="outlined-multiline-static"
                                                            multiline
                                                            rows={1}
                                                            value={itemMetricInputData[selectedItem]?.[row.Metric]?.JohnVesliChComments || ''}
                                                            onChange={(e) => {
                                                                handleCommentsChange(selectedItem, row.Metric, e.target.value);
                                                            }}
                                                        />
                                                    </Tooltip>

                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    {error && (
                                        <Dialog open={error} onClose={() => setError(false)}>
                                            <DialogContent style={{ width: '420px' }}>
                                                <DialogContentText style={{ fontSize: '18px', marginLeft: '10%', fontWeight: 'bold', color: 'black' }}>
                                                    {error}
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setError(false)} color="primary">
                                                    OK
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    )}


                                    <Dialog open={incompleteItemsDialogOpen} onClose={() => setIncompleteItemsDialogOpen(false)}>
                                        <DialogContent>
                                            <DialogContentText>
                                                Please fill in Manager Rating and Manager Comments for the following items: {incompleteItems.join(', ')}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setIncompleteItemsDialogOpen(false)} color="primary">
                                                OK
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                </Table>
                            </TableContainer>
                            <div className="mcomments-buttons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateButtonClick}

                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={openConfirmationDialog}
                                    style={{ marginLeft: '20px' }}
                                    disabled={!isSubmitEnabled || isFetchingData}
                                >
                                    Submit
                                </Button>
                                <Dialog
                                    open={isConfirmationDialogOpen}
                                    onClose={closeConfirmationDialog}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">Confirm Submission</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to submit the form?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={closeConfirmationDialog} color="primary">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSubmit} color="primary" autoFocus>
                                            Confirm
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog
                                    open={isSuccessDialogOpen}
                                    onClose={closeSuccessDialog}
                                >
                                    <DialogContent>
                                        <DialogContentText>
                                            Your form has been successfully submitted!
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={closeSuccessDialog} color="primary">
                                            OK
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <Dialog open={openDialog} onClose={handleClose}>
                                    <DialogContent style={{ width: '420px' }}>

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
                        </>
                    ) : (
                        <div style={{color:'#0d4166'}}>
                              No Data Found Here.
                        </div> 
                    )
                    )}
                </div>

            </div>
        </>
    );
}

export default ManagerUpdateEmpData;