import React, { useEffect, useState } from 'react';
import { Tabs, Tab, AppBar, Typography, Grid, Container, Table, Select, MenuItem, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField } from '@mui/material';
import './EmployeeKPIsComponent.css'; // Import your CSS file for styling
import { FormControl, InputLabel, } from '@mui/material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';


const MainTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const [apiData, setApiData] = useState({});
  const [tabNames, setTabNames] = useState([]);
  const [subTabValue, setSubTabValue] = useState(0);

  const [isAddKpiModalOpen, setIsAddKpiModalOpen] = useState(false); // State for controlling the modal
  const [quantityTargetValue, setQuantityTargetValue] = useState(); // State for quantity target value

  // Form state
  const [metric, setMetric] = useState('');
  const [question, setQuestion] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProcessKpi, setSelectedProcessKpi] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [questionOptions, setQuestionOptions] = useState([]);
  const [isAddKpiToExistingFormOpen, setAddKpiToExistingFormOpen] = useState(false);
  const [isAddNewKpiFormOpen, setAddNewKpiFormOpen] = useState(false);
  const [isDeleteKpi, setIsDeleteKpi] = useState(false);

  const openAddKpiModal = (formType) => {
    setIsAddKpiModalOpen(true);

    if (formType === 'addKpiToExisting') {
      setAddKpiToExistingFormOpen(true);
      setAddNewKpiFormOpen(false);
    } else if (formType === 'addNewKpi') {
      setAddNewKpiFormOpen(true);
      setAddKpiToExistingFormOpen(false);
    }
    else if (formType === 'deleteKpi') {
      setAddNewKpiFormOpen(false);
      setAddKpiToExistingFormOpen(false);
      setIsDeleteKpi(true)
    }
  };

  const closeAddKpiModal = () => {

    setAddKpiToExistingFormOpen(false);
    setAddNewKpiFormOpen(false);
    setIsDeleteKpi(false)
    setIsAddKpiModalOpen(false);
    setSelectedProcessKpi('');
    // setProcessKpi('')
    setMetric('');
    setQuestion('');
    setQuantityTargetValue('');
  };


  // Fetch data from the API
  useEffect(() => {
    fetch('http://172.17.15.253:8080/AdminManagerGet')
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setTabNames(Object.keys(data));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSubTabValue(0); // Reset sub-tab value when switching main tabs
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabValue(newValue);
    setSelectedSubTabName(apiData[tabNames[tabValue]][newValue]?.Name || ''); // Update selectedSubTabName
  };

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenDialog(false); // Close the dialog
    // Navigate to the login page when the dialog is closed
    navigate('/adminview');
  };


  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Create the data object in the desired format
    const token = localStorage.getItem('token');
    const parseJWT = (token) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData;
    };
    const tokenData = parseJWT(token);
    const adminId = tokenData.adminID;

    const postData = {
      adminID: adminId,
      data: [
        {
          [selectedProcessKpi]: [
            {
              "Name": metric,
              "Questions": [question],
              "QuantityTarget": [parseInt(quantityTargetValue)]
            }
          ]
        }
      ]
    };
    setSelectedProcessKpi('');
    setMetric('');
    setQuestion('');
    setQuantityTargetValue('');

    // Send the data to your API using a POST request
    fetch('http://172.17.15.253:8080/AdminManagerPost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([postData]),
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful response
          console.log('Data posted successfully');
          setOpenDialog(true);
          closeAddKpiModal();

          // Refresh data after a successful post
          fetch('http://172.17.15.253:8080/AdminManagerGet')
            .then((response) => response.json())
            .then((data) => {
              setApiData(data);
              setTabNames(Object.keys(data));
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        } else {
          // Handle error response
          console.error('Error posting data');
        }
      })
      .catch((error) => {
        // Handle network error
        console.error('Network error:', error);
      });
  };

  
  const handleDeleteKPI = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const parseJWT = (token) => {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedData = JSON.parse(atob(base64));
      return decodedData;
    };
    const tokenData = parseJWT(token);
    const adminId = tokenData.adminID;
  
    // Create the data object in the desired format
    const postData = {
      adminID: adminId,
      data: [
        {
          [selectedProcessKpi]: [
            {
              "Name": metric,
              "Questions": [question],
              "QuantityTarget": [parseInt(quantityTargetValue)]
            }
          ]
        }
      ]
    };
  
    // Determine if a Process KPI, Metric, and Question are selected
    const isProcessKpiSelected = selectedProcessKpi !== '';
    const isMetricSelected = metric !== '';
    const isQuestionSelected = question !== '';
  
    // Construct the delete URL based on your API URL template
    let adminManagerDeleteURL = `http://172.17.15.253:8080/AdminManagerDelete/${adminId}`;
  
    if (isProcessKpiSelected) {
      adminManagerDeleteURL += `/${selectedProcessKpi}`;
      if (isMetricSelected) {
        adminManagerDeleteURL += `/${metric}`;
        if (isQuestionSelected) {
          adminManagerDeleteURL += `/${question}`;
        }
      }
    }
  
    // Check if at least one option is selected
    if (isProcessKpiSelected || isMetricSelected || isQuestionSelected) {
      // Send a DELETE request to the constructed URL
      fetch(adminManagerDeleteURL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([postData]),
      })
        .then((response) => {
          if (response.ok) {
            // Handle successful delete response, show a message, and refresh data if needed
            console.log('Data deleted successfully');
            setOpenDialog(true);
            closeAddKpiModal();
            // You can also refresh the data here if required.
          } else {
            // Handle error response for delete
            console.error('Error deleting data');
          }
        })
        .catch((error) => {
          // Handle network error
          console.error('Network error:', error);
        });
    } else {
      // Handle error or show a notification if no fields are selected for delete
      console.error('Please select a Process KPI, Metric, or Question to delete.');
    }
  };
  





  const [selectedSubTabName, setSelectedSubTabName] = useState('');
  const [selectedMetricQuestions, setSelectedMetricQuestions] = useState([]);

  const handleProcessKpiChange = (_, newValue) => {
    console.log('handleProcessKpiChange called');
    setSelectedProcessKpi(newValue);
    console.log('Selected Process KPI:', newValue);

    // Update the available metrics when the "Process KPI" field changes
    if (apiData[newValue] && apiData[newValue][subTabValue]) {
      const subTabData = apiData[newValue][subTabValue];

      const newProcessKpi = subTabData.Name;
      const metricNames = [subTabData.Name];

      if (subTabData.Questions && subTabData.Questions.length > 0) {
        subTabData.Questions.forEach((question) => {
          metricNames.push(question);
        });
      }

      setMetrics(metricNames);
      setMetric('');
      setQuestionOptions(subTabData.Questions || []);
    } else {
      setMetrics([]);
    }
  };


  const handleMetricChange = (_, newValue) => {
    setMetric(newValue);

    const selectedMetricData = apiData[selectedProcessKpi]?.find((subTab) => subTab.Name === newValue);
    const selectedQuestions = selectedMetricData ? selectedMetricData.Questions || [] : [];

    setSelectedMetricQuestions(selectedQuestions);
  };

  const handleQuestionChange = (_, newValue) => {
    setQuestion(newValue);
  };


  return (
    <Container>
      <br />
      <AppBar position="static">
        <div style={{ overflowX: 'auto', width: '100%', backgroundColor: '#0d4166', height: '60px' }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            centered
            style={{ minWidth: '1250px' }}
          >
            {tabNames.map((tabName, index) => (
              <Tab key={index} label={tabName} className="Tab" style={{ color: 'White' }} />
            ))}
          </Tabs>
        </div>
      </AppBar>

      {tabNames.map((tabName, index) => (
        <div key={index} hidden={tabValue !== index} className="TabContent">
          {tabValue === index && (
            <Container >
              <Tabs value={subTabValue} onChange={handleSubTabChange} centered className="SubTabs" >
                {apiData[tabName].map((subTab, subTabIndex) => (
                  <Tab key={subTabIndex} label={subTab.Name} className="SubTab" style={{ color: 'black', }} />
                ))}
              </Tabs>
              <div className="SubTabContent">
                <TableContainer component={Paper} style={{ marginBottom: '10px' }} >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Quantity Target</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData[tabName][subTabValue]?.Questions.map((question, questionIndex) => (
                        <TableRow key={questionIndex}>
                          <TableCell>{question}</TableCell>
                          <TableCell>{apiData[tabName][subTabValue]?.QuantityTarget[questionIndex]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openAddKpiModal('addKpiToExisting')}
                      style={{ backgroundColor: '#1dbb99' }}
                      fullWidth
                    >
                      Add KPI to Existing
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openAddKpiModal('addNewKpi')}
                      style={{ backgroundColor: '#1dbb99' }}
                      fullWidth
                    >
                      Add New KPI Metric
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openAddKpiModal('deleteKpi')}
                      style={{ backgroundColor: '#1dbb99' }}
                      fullWidth
                    >
                      Delete KPI
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          )}
        </div>
      ))}

      {/* Add KPI Modal */}
      {isAddKpiModalOpen && (
        <Modal
          open={isAddKpiModalOpen}
          onClose={closeAddKpiModal}
          aria-labelledby="add-kpi-modal-title"
          aria-describedby="add-kpi-modal-description"
        >

          <Container className="AddKpiModal">
            {isAddKpiToExistingFormOpen && (
              <form onSubmit={handleFormSubmit} style={{ backgroundColor: 'white', width: '50%', marginLeft: '25%', marginTop: '8%', paddingLeft: '5%', paddingRight: '5%', paddingTop: '6%', paddingBottom: '4%' }}>

                <div>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={closeAddKpiModal}
                    style={{ marginTop: '-70px', marginLeft: '580px' }}
                  >
                    X
                  </IconButton>
                  <Typography variant="h6" id="add-kpi-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Add New KPI
                  </Typography>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="process-kpi"
                      options={tabNames}
                      getOptionLabel={(option) => option}
                      value={selectedProcessKpi}
                      onChange={handleProcessKpiChange}
                      onInputChange={(_, newInputValue) => {
                        handleProcessKpiChange(_, newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Process KPI" fullWidth required />
                      )}
                    />
                  </FormControl>


                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="metric"
                      options={apiData[selectedProcessKpi]?.map((subTab) => subTab.Name) || []}
                      value={metric}
                      onChange={(_, newValue) => handleMetricChange(_, newValue)}
                      onInputChange={(_, newInputValue) => {
                        handleMetricChange(_, newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Metric" fullWidth required />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="question"
                      options={selectedMetricQuestions}
                      value={question}
                      onChange={(_, newValue) => setQuestion(newValue)}
                      onInputChange={(_, newInputValue) => {
                        setQuestion(newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Question" fullWidth required />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel shrink={!!quantityTargetValue} htmlFor="quantity-target">
                      Quantity Target
                    </InputLabel>
                    <Select
                      id="quantity-target"
                      value={quantityTargetValue}
                      onChange={(e) => setQuantityTargetValue(e.target.value)}
                      label="Quantity Target"
                    >
                      {Array.from({ length: 11 }, (_, index) => (
                        <MenuItem key={index} value={index}>
                          {index}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Button type="submit" variant="contained" color="primary" style={{ backgroundColor: '#1dbb99' }}>
                  Submit
                </Button>

              </form>
            )}

            {isAddNewKpiFormOpen && (
              <form onSubmit={handleFormSubmit} style={{ backgroundColor: 'white', width: '50%', marginLeft: '25%', marginTop: '8%', paddingLeft: '5%', paddingRight: '5%', paddingTop: '6%', paddingBottom: '4%' }}>
                <div>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={closeAddKpiModal}
                    style={{ marginTop: '-70px', marginLeft: '580px' }}
                  >
                    X
                  </IconButton>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel shrink={!!selectedProcessKpi} htmlFor="process-kpi">
                      Process KPI
                    </InputLabel>
                    <TextField
                      id="process-kpi"
                      label=""
                      fullWidth
                      value={selectedProcessKpi}
                      onChange={(e) => setSelectedProcessKpi(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel shrink={!!metric} htmlFor="Metric">
                      Metric
                    </InputLabel>
                    <TextField
                      id="metric"
                      label=""
                      fullWidth
                      value={metric}
                      onChange={(e) => setMetric(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel shrink={!!question} htmlFor="Question">
                      Question
                    </InputLabel>
                    <TextField
                      id="question"
                      label=""
                      fullWidth
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                    />
                  </FormControl>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel shrink={!!quantityTargetValue} htmlFor="quantity-target">
                      Quantity Target
                    </InputLabel>
                    <Select
                      id="quantity-target"
                      value={quantityTargetValue}
                      onChange={(e) => setQuantityTargetValue(e.target.value)}
                      label="Quantity Target"
                    >
                      {Array.from({ length: 11 }, (_, index) => (
                        <MenuItem key={index} value={index}>
                          {index}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>


                <Button type="submit" variant="contained" color="primary" style={{ backgroundColor: '#1dbb99' }}>
                  Submit
                </Button>
              </form>
            )}

            {isDeleteKpi && (
              <form onSubmit={(e) => e.preventDefault()} style={{ backgroundColor: 'white', width: '50%', marginLeft: '25%', marginTop: '8%', paddingLeft: '5%', paddingRight: '5%', paddingTop: '6%', paddingBottom: '4%' }}>
                <div>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={closeAddKpiModal}
                    style={{ marginTop: '-70px', marginLeft: '580px' }}
                  >
                    X
                  </IconButton>
                  <Typography variant="h6" id="add-kpi-modal-title" gutterBottom style={{ textAlign: 'center' }}>
                    Delete KPI
                  </Typography>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="process-kpi"
                      options={tabNames}
                      getOptionLabel={(option) => option}
                      value={selectedProcessKpi}
                      onChange={handleProcessKpiChange}
                      onInputChange={(_, newInputValue) => {
                        handleProcessKpiChange(_, newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Process KPI" fullWidth required />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="metric"
                      options={apiData[selectedProcessKpi]?.map((subTab) => subTab.Name) || []}
                      value={metric}
                      onChange={(_, newValue) => handleMetricChange(_, newValue)}
                      onInputChange={(_, newInputValue) => {
                        handleMetricChange(_, newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Metric" fullWidth required />
                      )}
                    />
                  </FormControl>

                  <FormControl fullWidth variant="outlined" margin="normal">
                    <Autocomplete
                      id="question"
                      options={selectedMetricQuestions}
                      value={question}
                      onChange={(_, newValue) => setQuestion(newValue)}
                      onInputChange={(_, newInputValue) => {
                        setQuestion(newInputValue);
                      }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Question" fullWidth required />
                      )}
                    />
                  </FormControl>
                </div>

                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: '#FF5722' }} // Red color to indicate deletion
                  onClick={handleDeleteKPI} // Call the delete function
                >
                  Delete
                </Button>
              </form>
            )}

          </Container>

        </Modal>
      )}
    </Container>
  );
};

export default MainTabs;
