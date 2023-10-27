import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  AppBar,
  Toolbar
} from '@mui/material';
import { Link } from 'react-router-dom';

const ManagerPortal = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [reportingManagers, setReportingManagers] = useState({});

  useEffect(() => {
    // Fetch employee details
    fetch('http://172.17.15.249:8000/EmpRatingKPI')
      .then((response) => response.json())
      .then((data) => {
        const employeesWithPractices = data.employees;
        localStorage.setItem('practices', JSON.stringify(employeesWithPractices));

        // Set the state with the employee data
        setEmployeesData(employeesWithPractices);
      })
      .catch((error) => console.error('Error fetching data:', error));

    // Fetch reporting manager details
    fetch('http://172.17.15.249:8000/GetKPI')
      .then((response) => response.json())
      .then((data) => {
        const reportingData = data.message.reduce((acc, manager) => {
          acc[manager.Empid] = manager.Reportingmanager;
          return acc;
        }, {});
        setReportingManagers(reportingData);
      })
      .catch((error) => console.error('Error fetching reporting managers:', error));
  }, []);



  const handleLogout = () => {
   
    localStorage.removeItem('token');
    // Redirect to the login page (replace '/login' with your login route)
    window.location.href = '/login';
  };


 

  
  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const username=firstname+""+" "+lastname
  console.log(username)
  return (
    <>
     <AppBar position="fixed">
        <Toolbar>
          {/* <Typography variant="h6">Manager Portal</Typography> */}
          <h3 >
          <span style={{ fontSize: '25px', padding: '3px', fontFamily: 'Material Icons' ,marginBottom:'5%',marginTop:'5%' }}>
                &#xe7fd;
              </span>&nbsp;&n{username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Details
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
            <Table style={{ minWidth: 850 }}>
              <TableHead style={{ backgroundColor: 'voilet' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222', paddingLeft: "10%" }}>Employee ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', paddingLeft: "10%" }}>Employee Name</TableCell>
                  {/* <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', paddingLeft: "12%" }}>Reporting Manager</TableCell> */}
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', paddingLeft: "10%" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ marginLeft: "40%" }}>
                {employeesData.map((employee) => {
                  const empReportingManager = reportingManagers[employee.Empid] || "";
                  if (empReportingManager === username) {
                    return (
                      <TableRow key={employee.Empid} style={{ fontWeight: 'bold', color: '#333', paddingLeft: "10%" }}>
                        <TableCell style={{ fontSize: '16px', color: '#333', paddingLeft: "10%" }}>{employee.Empid}</TableCell>
                        <TableCell style={{ fontSize: '16px', color: '#333', paddingLeft: "10%" }}>{employee.Empname}</TableCell>
                        {/* <TableCell style={{ fontSize: '16px', color: '#333', paddingLeft: "10%" }}>
                          {empReportingManager || "N/A"}
                        </TableCell> */}
                        <TableCell style={{ color: '#333', paddingLeft: "10%" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/review/${employee.Empid}`}
                            style={{ fontWeight: 'bold', textDecoration: 'none' }}
                          >
                            View Details
                          </Button>&nbsp;&nbsp;&nbsp;
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return null; // Skip rendering rows with non-matching reporting managers
                  }
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default ManagerPortal;
