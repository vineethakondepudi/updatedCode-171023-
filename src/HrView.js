import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const HrView = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [reportingHrData, setReportingHrData] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // When the component mounts, push the current state to the history
    window.history.pushState(null, null, window.location.pathname);
    window.onpopstate = () => {
      // When the user clicks the back arrow, push the current state again
      window.history.pushState(null, null, window.location.pathname);
    };
  }, []);

  useEffect(() => {
    // Fetch data from the first API
    fetch('http://172.17.15.249:8000/ManagerRatingKPI')
      .then((response) => response.json())
      .then((data) => {
        setEmployeesData(data.employees);
      })
      .catch((error) => console.error('Error fetching data:', error));
  
    // Fetch data from the second API (Replace the URL with the actual endpoint)
    fetch('http://172.17.15.249:8000/GetKPI')
      .then((response) => response.json())
      .then((data) => {
        setReportingHrData(data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const username=firstname+""+" "+lastname
  // Merge the data from both APIs based on the common field (for example, Empid)
// Merge the data from both APIs based on the common field (for example, Empid)
const mergedData = employeesData.map((employee) => {
  const reportingHr = reportingHrData.find((hr) => hr.Empid === employee.Empid);
  return {
    ...employee,
    Reportinghr: reportingHr ? reportingHr.Reportinghr : 'N/A',
  };
});

const filteredData = mergedData.filter(
  (employee) => employee.Reportinghr === username
);

  return (
    
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* <Typography variant="h6">Manager Portal</Typography> */}
          <h3 >
              Welcome:{username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Details
              </h3>
          <Button  color="inherit" onClick={handleLogout} style={{marginLeft:"40%",  marginLeft: '30%',
              background: 'linear-gradient(45deg,  #FE6B8B 30%, #FF8E53 90%)'}}>
          <span
              style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}
            >
              &#xe8ac;
            </span>&nbsp;
            Logout
          </Button>
        </Toolbar>
      </AppBar><br/><br/><br/>
      <div style={{ padding: '30px', background: 'linear-gradient(to bottom, #dbb1db, #80c7e4)', height: '84vh' }}>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Empid</TableCell>
                  <TableCell>Empname</TableCell>
                  {/* <TableCell>Reporting hr</TableCell> */}
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((employee) => (
                  <TableRow key={employee.Empid}>
                    <TableCell>{employee.Empid}</TableCell>
                    <TableCell>{employee.Empname}</TableCell>
                    {/* <TableCell>{employee.Reportinghr}</TableCell> */}
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/hrreview/${employee.Empid}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default HrView;
