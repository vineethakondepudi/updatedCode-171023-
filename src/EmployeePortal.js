import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import './EmployeePortal.css';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BASE_URL } from './config';



const RatingButton = ({ value, selectedValue, onClick }) => {
  return (
    <Button
      variant={value === selectedValue ? 'contained' : 'outlined'}
      color="primary"
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  );
};

const EmployeePortal = () => {
  
  const navigate = useNavigate();
  const questions = [
    {
      id: 1,
      question: 'Communication: How would you rate your ability to communicate ideas clearly and effectively?',
      rating: 0,
      comment: ''
    },

    {
      id: 2,
      question: 'Interpersonal Skills: How well do you actively listen during team meetings and discussions?',
      rating: 0,
      comment: ''
    },
    {
        id: 3,
        question: 'Quality of Work: Rate yourself on meeting quality standards consistently.',
        rating: 0,
        comment: ''
        },
        {
        id: 4,
        question: 'Productivity: How well do you manage time to meet project deadlines?',
        rating: 0,
        comment: ''
        },
        {
        id: 5,
        question: 'Problem Solving: How confident are you in coming up with creative solutions to challenges?',
        rating: 0,
        comment: ''
        },
        {
        id: 6,
        question: 'Teamwork: Rate yourself on working effectively with others as part of a team.',
        rating: 0,
        comment: ''
        }
  ];

  
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [ratings, setRatings] = useState(
    questions.map((question) => ({ ...question, rating: 0, comment: '' }))
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [attachment, setAttachment] = useState(null);


  const handleAttachmentChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setAttachment(selectedFile);
    }
  };


  const handleUpload = async () => {
    if (!attachment) {
      alert('Please choose a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('Empid', employeeId);
    formData.append('pdf', attachment);
    // console.log(formData[0])
  console.log(employeeId)
    try {
      const response = await fetch('http://172.17.15.249:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('File uploaded successfully.');
      } else {
        const responseData = await response.json();
        alert(`Failed to upload file: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the file. Please try again.');
    }
  };
  


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const tokenData = parseJWT(token);
      const firstName = tokenData.Firstname;
      const empId = tokenData.Empid;

      setEmployeeName(firstName);
      setEmployeeId(empId);

      fetch(`http://172.17.15.249:8000/GetRatingKPI/${empId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Data Loaded:', data);
          if (data && data.employees.length > 0) {
            const employeeData = data.employees[0];
            const updatedRatings = questions.map((question) => {
              const savedRating = employeeData.ratings.find((rating) => rating.Question === question.question);
              return {
                ...question,
                rating: savedRating ? savedRating.Rating : 0,
                comment: savedRating ? savedRating.Comment : '',
              };
            });
            setRatings(updatedRatings);
          }
        })
        .catch((error) => {
          console.error('Error loading data:', error);
        });
    }
  }, []);

  const parseJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = JSON.parse(atob(base64));
    return decodedData;
  };







 
  const handleRatingChange = (id, value) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) => (rating.id === id ? { ...rating, rating: value } : rating))
    );
  };

  const handleLogout = () => {
    navigate('/employeeview');
  };

  const handleCommentChange = (id, value) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) => (rating.id === id ? { ...rating, comment: value } : rating))
    );
  };

  const handleSave = () => {
    const dataToSubmit = {
      Empid: employeeId,
      Empname: employeeName,
      ratings: ratings.map((rating) => ({
        Question: rating.question,
        Rating: rating.rating,
        Comment: rating.comment,
      })),
    };
  
    console.log(dataToSubmit);
  
    // Check if the data for the employee already exists
    fetch(`http://172.17.15.249:8000/GetRatingKPI/${employeeId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Data Loaded:', data);
        if (data && data.employees.length > 0) {
          // Data exists, so make an update request
          fetch(`http://172.17.15.249:8000/UpdateRatingKPI/${employeeId}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
          })
            .then((response) => {
              if (response.ok) {
                alert('Data updated successfully.');
                navigate('/employeeview');
              } else {
                console.log("false");
                alert('Failed to update data. Please try again.');
              }
            })
            .catch((error) => {
              console.error(error);
              alert('An error occurred while updating data. Please try again.');
            });
        } else {
          // Data does not exist, so make a save request
          fetch('http://172.17.15.249:8000/SaveRatingKPI', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
          })
            .then((response) => {
              if (response.ok) {
                alert('Data saved successfully.');
                navigate('/employeeview');
              } else {
                console.log("false");
                alert('Failed to save data. Please try again.');
              }
            })
            .catch((error) => {
              console.error(error);
              alert('An error occurred while saving data. Please try again.');
            });
        }
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      });
  };
  
  

  const handleClear = () => {
    fetch(`http://172.17.15.249:8000/ClearRatingKPI/${employeeId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          alert('Data cleared successfully.');
          setRatings(questions.map((question) => ({ ...question, rating: 0, comment: '' })));
          setFormSubmitted(false);
        } else {
          console.log("false");
          alert('Failed to clear data. Please try again.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred while clearing data. Please try again.');
      });
  };

  const handleSubmit = async () => {
    localStorage.removeItem('form_data');
    const isAnyFieldEmpty = ratings.some(
      (rating) => rating.rating === 0 || rating.comment.trim() === ''
    );
  
    if (isAnyFieldEmpty) {
      alert('Please rate and comment on all questions before submitting.');
      return;
    }
  
    const dataToSubmit = {
      Empid: employeeId,
      Empname: employeeName,
      ratings: ratings.map((rating) => ({
        Question: rating.question,
        Rating: rating.rating,
        Comment: rating.comment,
      })),
    };
  
    // Create a new FormData object to store the file and other data
    const formData = new FormData();
    formData.append('empid', employeeId); // Add empid to the FormData
    formData.append('pdf', attachment);   // Add the PDF file to the FormData
  
    // Send the PDF file to the server
    try {
      const response = await fetch('http://172.17.15.249:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        console.log("Failed to upload PDF.");
        return;
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading the PDF. Please try again.');
      return;
    }
  
    // Submit the ratings data
    try {
      const response = await fetch('http://172.17.15.249:8000/EmpRatingKPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
  
      if (!response.ok) {
        console.log("Failed to submit ratings.");
        return;
      }
  
      setFormSubmitted(true);
      setOpenDialog(true);
      navigate('/employeeview');
    } catch (error) {
      console.error(error);
      alert('An error occurred while submitting ratings. Please try again.');
    }
  };
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <div className="app-bar">
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Employee Rating Portal
            </Typography>
            <Button style={{backgroundColor:"red"}} color="inherit" onClick={handleLogout}>
            <span
              style={{ fontSize: '20px', padding: '2px', fontFamily: 'Material Icons' }}
            >
              &#xe5c4;
            </span>&nbsp;
              Go Back
            </Button>
          </Toolbar>
        </AppBar>
      </div>
      <br/><br/>&nbsp;
      <div className="performance-rating">
      <div className="attachment-section">
          <label htmlFor="attachment-input">
            Attach File:&nbsp;
          </label>
          <input
            accept=".pdf,.doc,.docx"
            type="file"
            id="attachment-input"
            style={{ display: 'none' }}
            onChange={handleAttachmentChange}
          />
          <label htmlFor="attachment-input">
            <Button component="span" variant="outlined">
              Choose File
            </Button>
          </label>
          {attachment && <span>{attachment.name}</span>}
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload
          </Button>
        </div>
        {!formSubmitted ? (
          <>
            <h2>Welcome, {employeeName}!</h2>
           
            <form onSubmit={handleSubmit}>
              {ratings.map((rating) => (
                <div className="question" key={rating.id}>
                  <p>{rating.question}</p>
                  <div className="rating">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <RatingButton
                        key={value}
                        value={value}
                        selectedValue={rating.rating}
                        onClick={(value) => handleRatingChange(rating.id, value)}
                      />
                    ))}
                  </div>
                  <div className="comment">
                    <input
                      type="text"
                      placeholder="Enter your comments..."
                      value={rating.comment}
                      onChange={(e) => handleCommentChange(rating.id, e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  style={{ width: '25%', height: "45px", marginTop: "15px" }}
                >
                  Save
                </Button>&nbsp;&nbsp;&nbsp;
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleClear}
                  style={{ width: '25%', height: "45px", marginTop: "15px" }}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={ratings.some((rating) => rating.rating === 0 || rating.comment.trim() === '')}
                  style={{ width: '45%' }}
                >
                  Submit
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
              <DialogContent>
                <DialogContentText align="center">Form submitted successfully!</DialogContentText>
                <DialogContentText align="center">Thank you for your time.</DialogContentText>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </>
  );
};

export default EmployeePortal;





















