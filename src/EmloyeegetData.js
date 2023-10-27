import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  AppBar,
  Toolbar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const styles = {
  textField: {
    overflow: 'hidden',
    resize: 'none',
    lineHeight: '1.5', // You can adjust the line height to control the visible area
    height: 'auto', // Let the height grow automatically
    minHeight: '56px', // Set a minimum height to avoid shrinking too small
  },
};
export default function EmloyeegetData() {
  const [employeesData, setEmployeesData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://172.17.15.249:8000/EmpRatingKPI')
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Log the fetched data
        setEmployeesData(data.employees);

        const empid = localStorage.getItem('Empid');

        const employee = data.employees.find((employee) => employee.Empid === parseInt(empid));
        console.log('Filtered Employee:', employee); // Log the filtered employee

        if (employee) {
          const initialEditedData = {};
          employee.ratings.forEach((rating) => {
            initialEditedData[rating.Question] = {
              Rating: rating.Rating,
              Comment: rating.Comment,
            };
          });
          setEditedData(initialEditedData);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleRatingChange = (questionId, value) => {
    setEditedData((prevState) => ({
      ...prevState,
      [questionId]: { ...prevState[questionId], Rating: value },
    }));
  };

  const handleCommentChange = (questionId, value) => {
    setEditedData((prevState) => ({
      ...prevState,
      [questionId]: { ...prevState[questionId], Comment: value },
    }));
  };

  const handleBlur = () => {



    const updatedRatings = Object.keys(editedData).map((question) => ({
      Question: question,
      Rating: editedData[question]?.Rating ?? "",
      Comment: editedData[question]?.Comment ?? "",
    }));


    const requestBody = {
      ratings: updatedRatings,
    };


    const empid = localStorage.getItem('Empid')

    // Send the updated ratings to the server
    fetch(`http://172.17.15.249:8000/EmpRatingKPI/${empid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server, if needed
        console.log('Server response:', data);
        setError(null); // Reset error state if successful
      })
      .catch((error) => {
        console.error('Error updating ratings:', error);
        setError('An error occurred while updating ratings.'); // Set error state with error message
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after the request completes
      });
  };



  const handleUpdateAndSendToHR = async () => {
    await handleBlur();
    alert("Data Updated Successfully")
    navigate('/empget')
  };

  const handleLogout = () => {

    localStorage.removeItem('token');
    window.location.href = '/employeeview';
  };



  const empid = localStorage.getItem('Empid');
  const filteredData = employeesData.filter((employee) => employee.Empid === parseInt(empid));
  const firstname = localStorage.getItem('firstname');



  const TextFieldWithExpansion = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className={`text-field-container ${isExpanded ? 'expanded' : ''}`}>
        <textarea
          value={value}
          onChange={onChange}
          className="text-field"
          style={styles.textField}
          readOnly={!isExpanded}
        />
        {!isExpanded && (
          <div className="expand-button" onClick={toggleExpansion}>
            Click to see full content
          </div>
        )}
      </div>
    );
  };




  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {/* <Typography variant="h6">Manager Portal</Typography> */}
          <h3 >
            Welcome:{firstname} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Employee Ratings
          </h3>
          <Button color="inherit" onClick={handleLogout} style={{ marginLeft: "35%", backgroundColor: "red" }}>

            <span
              style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}
            >
              &#xe5c4;
            </span> GoBack
          </Button>
        </Toolbar>
      </AppBar><br /><br /><br />

      <div style={{ padding: '30px', background: 'linear-gradient(to bottom, #dbb1db, #80c7e4)', height: '90.2vh' }}>
        {/* <Typography variant="h5">Employee Ratings</Typography> */}
        <div style={{ width: '80%', margin: '0 auto' }}>
          <TableContainer component={Paper} >
            <Table style={{ Width: 850 }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>Employee ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222' }}>Employee Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222', paddingLeft: "2%" }}>Question</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222', paddingLeft: "3%" }}>Employee Rating</TableCell>
                  <TableCell style={{ fontWeight: 'bold', fontSize: '16px', color: '#222', paddingLeft: "3%" }}>Employee Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((employee) =>
                  employee.ratings.map((rating, index) => {
                    const question = rating.Question;
                    const editedRatingValue = editedData[question]?.Rating ?? rating.Rating;
                    const editedCommentValue = editedData[question]?.Comment ?? rating.Comment;



                    return (
                      <TableRow key={`${employee.Empid}-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{employee.Empid}</TableCell>
                        <TableCell>{employee.Empname}</TableCell>
                        <TableCell>{question}</TableCell>
                        <TableCell>
                          <Select
                            value={editedRatingValue}
                            onChange={(e) => handleRatingChange(question, e.target.value)}
                            style={{ width: '120px' }}
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                              <MenuItem key={value} value={value}>{value}</MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={editedCommentValue}
                            onChange={(e) => handleCommentChange(question, e.target.value)}
                            inputProps={{
                              title: editedCommentValue,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
       
        <br />
        {error && <p>{error}</p>}
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div>
            <Button variant="contained" color="primary" onClick={handleUpdateAndSendToHR} style={{ marginLeft: '80%' }}>
              Update Values
            </Button>

          </div>
        )}
         </div>
      </div>
    </>
  );
}
