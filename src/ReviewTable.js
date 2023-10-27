
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Select,
  Button,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';

const ReviewTable = () => {
  // const [employeesData, setEmployeesData] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { empid } = useParams(); // Get empid from the URL

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const empRatingAPI = `http://172.17.15.249:8000/EmpRatingKPI/${empid}`;
        const managerRatingAPI = `http://172.17.15.249:8000/ManagerRatingKPI/${empid}`;
  
        const responseEmp = await fetch(empRatingAPI);
        if (!responseEmp.ok) {
          throw new Error('Employee data not found');
        }
        const dataEmp = await responseEmp.json();
  
        const responseManager = await fetch(managerRatingAPI);
        const dataManager = responseManager.ok ? await responseManager.json() : { employee: null };
  
        if (dataEmp?.employee) {
          // Get the required fields from the EmpRatingKPI API
          const employeeDataFromEmpRating = {
            Empid: dataEmp.employee.Empid,
            Empname: dataEmp.employee.Empname,
            ratings: dataEmp.employee.ratings.map((rating) => ({
              Question: rating.Question,
              Rating: rating.Rating,
              Comment: rating.Comment,
            })),
          };
  
          // Merge the data from both APIs
          const mergedEmployeeData = {
            ...employeeDataFromEmpRating,
            ratings: employeeDataFromEmpRating.ratings.map((rating) => ({
              ...rating,
              Managerrating: dataManager.employee?.ratings.find(
                (r) => r.Question === rating.Question
              )?.Managerrating ?? 0,
              Managercomment: dataManager.employee?.ratings.find(
                (r) => r.Question === rating.Question
              )?.Managercomment ?? '',
            })),
          };
  
          setEmployeeData(mergedEmployeeData);
  
          const initialEditedData = {};
          mergedEmployeeData.ratings.forEach((rating) => {
            initialEditedData[rating.Question] = {
              Rating: rating.Rating,
              Comment: rating.Comment,
              Managerrating: rating.Managerrating,
              Managercomment: rating.Managercomment,
            };
          });
          setEditedData(initialEditedData);
        } else {
          setError('Employee data not found');
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching employee data.');
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [empid]);
  
  
  const handleManagerRatingChange = (question, value) => {
    setEditedData((prevState) => ({
      ...prevState,
      [question]: { ...prevState[question], Managerrating: value },
    }));
  };

  const handleManagerCommentChange = (question, value) => {
    setEditedData((prevState) => ({
      ...prevState,
      [question]: { ...prevState[question], Managercomment: value },
    }));
  };

const navigate=useNavigate()
const { empId } = useParams();


const handleViewFiles=()=>
{
  
}

const handleUpdateAndSendToHR = () => {
  if (!employeeData) {
    console.error('Employee data is null.');
    return;
  }

  const payload = {
    Empid: employeeData.Empid,
    Empname: employeeData.Empname,
    ratings: employeeData.ratings.map((rating) => ({
      Question: rating.Question,
      Rating: rating.Rating,
      Comment: rating.Comment,
      Managerrating: editedData[rating.Question]?.Managerrating ?? rating.Managerrating ,
      Managercomment: editedData[rating.Question]?.Managercomment ?? rating.Managercomment,
    })),
  };

  // Check if data already exists for the employee in the table
  fetch(`http://172.17.15.249:8000/ManagerRatingKPI/${employeeData.Empid}`) //Manager GET
    .then((response) => {
      if (response.ok) {
        // Data exists, so perform an HTTP PUT request to update the data
        return fetch(`http://172.17.15.249:8000/ManagerRatingKPI/${employeeData.Empid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Data does not exist, so perform an HTTP POST request to add the data
        return fetch('http://172.17.15.249:8000/ManagerRatingKPI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Server response:', data);
      alert("Data Updated Successfully....")
      navigate(`/manager`);
    })
    .catch((error) => {
      console.error('Error updating or storing HR table data:', error);
    });
};


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employeeData) {
    return <div>No data found for the employee with empid: {empid}</div>;
  }


  const handleLogout = () => {
   
    localStorage.removeItem('token');
    // Redirect to the login page (replace '/login' with your login route)
    window.location.href = '/manager';
  };
  
  const firstname = localStorage.getItem('firstname');

  return (
    <>


<AppBar position="fixed">
        <Toolbar>
          {/* <Typography variant="h6">Manager Portal</Typography> */}
          <h3 >
              Welcome:{firstname} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Details
              </h3>
          <Button  color="inherit" onClick={handleLogout} style={{marginLeft:"35%", backgroundColor:"red"}}>
          <span
              style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}
            >
              &#xe5c4;
            </span>&nbsp;
            GoBack
          </Button>
        </Toolbar>
      </AppBar><br/><br/><br/>

      <div style={{ padding: '30px', background: 'linear-gradient(to bottom, #dbb1db, #80c7e4)',height:'84vh' }}>
     
      <div style={{ width: '80%', margin: '0 auto' }}>  
      <Button
  variant="outlined"
  color="primary"
  onClick={handleViewFiles}
  style={{ marginBottom: '15px' }}
>
  <span
    class="material-icons"
    style={{ verticalAlign: 'middle', marginRight: '5px' }}
  >
    visibility
  </span>
  View Files
</Button>


    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Empid</TableCell>
            <TableCell>Empname</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Employee Rating</TableCell>
            <TableCell>Employee Comment</TableCell>
            <TableCell>Manager Rating</TableCell>
            <TableCell>Manager Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeeData.ratings.map((rating, index) => (
            <TableRow key={`${employeeData.Empid}-${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{employeeData.Empid}</TableCell>
              <TableCell>{employeeData.Empname}</TableCell>
              <TableCell>{rating.Question}</TableCell>
              <TableCell>{rating.Rating}</TableCell>
              <TableCell>{rating.Comment}</TableCell>
              <TableCell>
  <Select
    value={editedData[rating.Question]?.Managerrating ?? (rating.Managerrating !== undefined ? rating.Managerrating : 0)}
    onChange={(e) => handleManagerRatingChange(rating.Question, e.target.value)}
    style={{ minWidth: '120px' }} // Adjust the width as needed
  >
    {[...Array(10)].map((_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        {i + 1}
      </MenuItem>
    ))}
  </Select>
</TableCell>

<TableCell>
  <TextField
    value={editedData[rating.Question]?.Managercomment ?? (rating.Managercomment !== undefined ? rating.Managercomment : '')}
    onChange={(e) => handleManagerCommentChange(rating.Question, e.target.value)}
  />
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer><br/>
    <div>
          <Button variant="contained" color="primary" onClick={handleUpdateAndSendToHR} style={{marginLeft:'70%'}}>
            Update Values and Send to HR
          </Button>
       
       </div>
    </div>
    </div>
    </>
  );
};

export default ReviewTable;
