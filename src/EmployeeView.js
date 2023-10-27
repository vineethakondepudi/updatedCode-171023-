import {
  
        AppBar,
    Toolbar
  } from '@mui/material';
  
import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import './EmployeeViewStyles.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const EmployeeView = () => {
    useEffect(() => {
        // When the component mounts, push the current state to the history
        window.history.pushState(null, null, window.location.pathname);
    
        // Function to prevent navigation
        const preventNavigation = (event) => {
          event.preventDefault();
          // For modern browsers
          event.returnValue = '';
        };
    
        // Add event listener for beforeunload to prevent navigation
        window.addEventListener('beforeunload', preventNavigation);
    
        // Add event listener for popstate to prevent navigation via the back button
        window.onpopstate = () => {
          // Push a new state to the history, effectively making the current state unchangeable
          window.history.pushState(null, null, window.location.pathname);
        };
    
        // Clean up the event listeners when the component unmounts
        return () => {
          window.removeEventListener('beforeunload', preventNavigation);
          window.onpopstate = null;
        };
      }, []);


  const navigate = useNavigate();
  const empid = localStorage.getItem('Empid');

  const handleFillFormClick = async () => {
    try {
      // Fetch the data from the endpoint
      const response = await fetch('http://172.17.15.249:8000/EmpRatingKPI');
      const data = await response.json();

      // Check if empid from localStorage matches any of the Empid in the fetched data
      const isEmpidExists = data.employees.some((employee) => employee.Empid === parseInt(empid));

      if (!isEmpidExists) {
        // If empid exists, navigate to the form
        navigate('/employee');
      } else {
        // If empid does not exist, show an alert or take any other action
        alert('You are already Submitted the form.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem('form_data');
    localStorage.removeItem('token');
    // Redirect to the login page (replace '/login' with your login route)
    window.location.href = '/login';
  };


  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');
  const username=firstname+" "+lastname



  const handleViewDetailsClick = () => {
    // Logic for handling View Details button click
    navigate('/empget');
  };

  return (
    <>
    <AppBar position="fixed">
       <Toolbar>
         {/* <Typography variant="h6">Manager Portal</Typography> */}
         <h3 style={{marginBottom:'1%'}}>
        
             <span style={{ fontSize: '25px', padding: '3px', fontFamily: 'Material Icons' ,marginBottom:'5%',marginTop:'5%' }}>
                &#xe7fd;
              </span>&nbsp;{username} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Details
             </h3>
         <Button  color="inherit" onClick={handleLogout} style={{marginLeft:"30%",  marginLeft: '30%',
              background: 'linear-gradient(45deg,  #FE6B8B 30%, #FF8E53 90%)',}}>
         <span
              style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}
            >
              &#xe8ac;
            </span>&nbsp;
           Logout
         </Button>
       </Toolbar>
     </AppBar>
    <div className='mainalign'>
      <div className='align'>
        <Button
          variant="contained"
          className="fillFormButton" // Use the CSS class for the Fill Form button
          onClick={handleFillFormClick}
        >
          Fill Form
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          variant="contained"
          className="viewDetailsButton" // Use the CSS class for the View Details button
          onClick={handleViewDetailsClick}
        >
          View Details
        </Button>
      </div>
    </div>
    </>
  );
};

export default EmployeeView;
