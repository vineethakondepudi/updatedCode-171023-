import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import {
   
    Button,
   
    AppBar,
    Toolbar
  } from '@mui/material';
const HrPortal = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { empId } = useParams();

  console.log('empId:', empId);

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching data
    // Fetch data from the backend API
    axios.get(`http://172.17.15.249:8000/RatingKPI/${empId}`)
      .then(response => {
        console.log('API response:', response.data); // Log the API response
        setEmployees(response.data.employee); // Access 'employee' property
        setLoading(false); // Data has been fetched, set loading to false
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Data fetching failed, set loading to false
      });
  }, [empId]);

  // Show loading indicator if data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    // Perform any logout logic here, such as clearing session or token
    // For example, you can use localStorage to clear any saved data
    localStorage.removeItem('token');
    // Redirect to the login page (replace '/login' with your login route)
    window.location.href = '/login';
  };
  
  const firstname = localStorage.getItem('firstname');
  return (
    <>
    <AppBar position="fixed" style={{backgroundColor:'#318CE7'}}>
       <Toolbar>
         {/* <Typography variant="h6">Manager Portal</Typography> */}
         <h3 >
             Welcome:{firstname} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Details
             </h3>
         <Button  color="inherit" onClick={handleLogout} style={{marginLeft:"40%", backgroundColor:"red"}}>
           Logout
         </Button>
       </Toolbar>
     </AppBar><br/><br/><br/>
   <div style={{ padding: '30px', background: 'linear-gradient(to bottom, #dbb1db, #80c7e4)',height:'84.2vh' }}>

    <div style={{ width: '80%', margin: '0 auto' }}>
    <Container maxWidth="md">
      {/* <Typography variant="h4" gutterBottom>
        Employee KPI Data
      </Typography> */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.empid}</TableCell>
                <TableCell>{employee.empname}</TableCell>
                <TableCell>{employee.question}</TableCell>
                <TableCell>{employee.rating}</TableCell>
                <TableCell>{employee.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </div>
    </div>
    </>
  );
};

export default HrPortal;
