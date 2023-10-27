import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { BASE_URL } from './config';

const RegistrationForm = () => {
  const navigate = useNavigate();

  const inputWidth = '20vw'; // Fixed width for all input fields
  const inputHeight = '48px'; // Fixed height for all input fields

  const roles = ['Employee', 'HR', 'Manager', 'Director', 'Vice President'];
  const practices = ['Digital Practice', 'Innovations', 'B2B', 'Integrations', 'Spring Boot'];
  const managers = ['John Vesli Chitri', 'Vinod Marupu', 'Ravi Ijju', 'Venkata Ram Prasad Kandregula', 'Santosh Soni', 'Prasad Venkat Lokam'];
  const hr = ['Divya Abburi', 'Sruthi Kolli', 'Lohitha Bandi', 'Ajay Duvvu', 'PadmaPriya Kamsu', 'Vasu Varupula', 'Chandini Sigireddy'];
  const location = ['Miracle City', 'Miracle Heights', 'Miracle Valley', 'Novi USA'];

  const [formData, setFormData] = useState({
    Empid: '',
    Empmail: '',
    Firstname: '',
    Lastname: '',
    Role: '',
    Practies: '',
    Reportingmanager: '',
    Password: '',
    Reportinghr: '',
    Location: '',
    Image: null,
  });

  const validateEmpId = (empId) => {
    return empId.trim() !== '';
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [fileError, setFileError] = useState('');
  const validateEmpEmail = (empEmail) => {
    const emailPattern = /^[a-zA-Z]{3,}[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return emailPattern.test(empEmail) && empEmail.endsWith('miraclesoft.com');
  };
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    const newValue = type === 'file' ? files[0] : value;

    if (name === 'Empid' && value.trim() !== '' && !validateInteger(value)) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Please enter integer values.',
      }));
    } else {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
    if (name === 'Empmail') {
      if (!/^[a-zA-Z]{3,}[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Please enter a valid email address.',
        }));
      } else if (!value.endsWith('@miraclesoft.com')) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Email must end with @miraclesoft.com',
        }));
      } else if (value.split('@').length - 1 > 1) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Only one '@' is allowed",
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '', // Clear the error when the format is correct
        }));
      }
    }
    if (name === 'Password') {
      if (value.length < 8) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must be at least 8 characters long',
        }));
      } else if (!/\d/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one digit (0-9)',
        }));
      } else if (!/[!@#$%^&*]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one special character (!@#$%^&*)',
        }));
      } else if (!/[A-Z]/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Password must contain at least one uppercase letter',
        }));
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '',
        }));
      }
    }

    if (name === 'Firstname' || name === 'Lastname') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Please enter only letters and spaces',
        }));    
      } else {
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '', // Clear the error when the input contains only letters
        }));
      }
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const { name, files } = event.target;
    const imageFile = files[0];

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: imageFile,
    }));
  };

  const handleClose = () => {
    setOpenDialog(false);
    navigate('/login');
  };

  const validateInteger = (value) => {
    return /^\d+$/.test(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!validateEmpId(formData.Empid)) {
      errors.Empid = 'Please enter a valid Emp Id';
    }

    if (!validateEmpEmail(formData.Empmail)) {
      errors.Empmail = 'Please enter a valid Emp Email';
    }


    // Add a validation check for the file upload
    if (!formData.Image) {
      setFileError('Please select an image file');
      return; // Return early to prevent further processing
    } else {
      setFileError(''); // Clear the file error if a file is selected
    }



    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const encodedPassword = btoa(formData.Password);
      const encodedEmpmail = btoa(formData.Empmail);

      const displayPayload = {
        Empid: formData.Empid,
        Empmail: encodedEmpmail,
        Firstname: formData.Firstname,
        Lastname: formData.Lastname,
        Role: formData.Role,
        Practies: formData.Practies,
        Reportingmanager: formData.Reportingmanager,
        Password: encodedPassword,
        Reportinghr: formData.Reportinghr,
        Location: formData.Location,
        Image: formData.Image,
      };

      const formDataToSend = new FormData();
      for (const key in displayPayload) {
        formDataToSend.append(key, displayPayload[key]);
      }

      const response = await axios.post(`${BASE_URL}/RegistrationKPI`, formDataToSend);

      if (response.status === 200) {
        console.log('Registration successful');
        setFormData({
          Empid: '',
          Empmail: '',
          Firstname: '',
          Lastname: '',
          Role: '',
          Practies: '',
          Reportingmanager: '',
          Password: '',
        });

        setOpenDialog(true);
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <fieldset style={{ backgroundColor: 'white' }}>
        <center>
          <h2 style={{ marginLeft: "45px" }}>REGISTRATION FORM</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <TextField
              label="Emp Id"
              variant="outlined"
              type="text"
              name="Empid"
              value={formData.Empid}
              onChange={handleChange}
              required
              error={!!validationErrors.Empid}
              helperText={validationErrors.Empid}
              className="form-field-custom-input"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '19px', padding: '8px', fontFamily: 'Material Icons' }}>
                    &#xe853;
                  </span>
                ),
              }}
            />
            <TextField
              label="Emp Email"
              variant="outlined"
              type="email"
              name="Empmail"
              value={formData.Empmail}
              onChange={handleChange}
              required
              error={!!validationErrors.Empmail}
              helperText={validationErrors.Empmail}
              className="form-field-custom-input"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '19px', padding: '8px', fontFamily: 'Material Icons' }}>
                    &#xe0be;
                  </span>
                ),
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}></div>
          <div className="form-row">
            <TextField
              label="First Name"
              variant="outlined"
              type="text"
              name="Firstname"
              error={!!validationErrors.Firstname}
              helperText={validationErrors.Firstname}
              value={formData.Firstname}
              onChange={handleChange}
              required
              className="form-field-custom-input"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '19px', padding: '6px', fontFamily: 'Material Icons' }}>
                    &#xe7fd;
                  </span>
                ),
              }}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              type="text"
              name="Lastname"
              error={!!validationErrors.Lastname}
              helperText={validationErrors.Lastname}
              value={formData.Lastname}
              onChange={handleChange}
              required
              className="form-field-custom-input"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '19px', padding: '8px', fontFamily: 'Material Icons' }}>
                    &#xe7fd;
                  </span>
                ),
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}></div>
          <div className="form-row">
            <TextField
              select
              label="Role"
              variant="outlined"
              name="Role"
              value={formData.Role || ''}
              onChange={handleChange}
              required
              error={!!validationErrors.Role}
              helperText={validationErrors.Role}
              className="form-field-custom-dropdown"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '6px', fontFamily: 'Material Icons' }}>
                    &#xe7fd;
                  </span>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select a role
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Practice"
              variant="outlined"
              name="Practies"
              value={formData.Practies || ''}
              onChange={handleChange}
              required
              error={!!validationErrors.Practies}
              helperText={validationErrors.Practies}
              className="form-field-custom-dropdown"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '6px', fontFamily: 'Material Icons' }}>
                    &#xe85d;
                  </span>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select a practice
              </MenuItem>
              {practices.map((practice) => (
                <MenuItem key={practice} value={practice}>
                  {practice}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ marginBottom: '20px' }}></div>
          <div className="form-row">
            <TextField
              select
              label="Reporting Manager"
              variant="outlined"
              name="Reportingmanager"
              value={formData.Reportingmanager || ''}
              onChange={handleChange}
              required
              error={!!validationErrors.Reportingmanager}
              helperText={validationErrors.Reportingmanager}
              className="form-field-custom-dropdown"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '2px', fontFamily: 'Material Icons' }}>
                    &#xe55c;
                  </span>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select a manager
              </MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager} value={manager}>
                  {manager}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="Password"
              error={!!validationErrors.Password}
              helperText={validationErrors.Password}
              value={formData.Password}
              onChange={handleChange}
              required
              className="form-field-custom-input"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '6px', fontFamily: 'Material Icons' }}>
                    &#xe897;
                  </span>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      style={{ width: '1px', height: '1px', background: '#a9a7a7', marginRight: '0px' }}
                    >
                      {showPassword ? <VisibilityIcon style={{ color: 'black' }} /> : <VisibilityOffIcon style={{ color: 'black' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}></div>
          <div className="form-row">
            <TextField
              select
              label="Reporting Hr"
              variant="outlined"
              name="Reportinghr"
              value={formData.Reportinghr || ''}
              onChange={handleChange}
              required
              error={!!validationErrors.Reportinghr}
              helperText={validationErrors.Reportinghr}
              className="form-field-custom-dropdown"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '2px', fontFamily: 'Material Icons' }}>
                    &#xe55c;
                  </span>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select Hr
              </MenuItem>
              {hr.map((hr) => (
                <MenuItem key={hr} value={hr}>
                  {hr}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Location"
              variant="outlined"
              name="Location"
              value={formData.Location || ''}
              onChange={handleChange}
              required
              error={!!validationErrors.Location}
              helperText={validationErrors.Location}
              className="form-field-custom-dropdown"
              style={{ width: inputWidth, height: inputHeight }}
              InputProps={{
                startAdornment: (
                  <span style={{ fontSize: '16px', padding: '2px', fontFamily: 'Material Icons' }}>
                    &#xe0c8;
                  </span>
                ),
              }}
            >
              <MenuItem value="" disabled>
                Select Location
              </MenuItem>
              {location.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div style={{ marginBottom: '20px' }}></div>
          <div>
            <TextField
              variant="outlined"
              type="file"
              name="Image"
              accept="image/*"
              onChange={handleImageChange}
              className="custom-input"
              style={{ width: inputWidth, height: inputHeight }}
            />
             <div style={{ color: 'red' }}>{fileError}</div> {/* Display file error message */}
    
          </div>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogContent style={{ width: '420px' }}>
              <img
                src="https://badge-exam.miraclesoft.com/assets/ecert/Completed-test.svg"
                alt="Your Image Alt Text"
                style={{ maxWidth: '100%', maxHeight: '200px', marginLeft: '23%' }}
              />
              <DialogContentText style={{ fontSize: '18px', marginLeft: '10%', fontWeight: 'bold', color: '#1dbb99' }}>
                Successfully Registered. Click OK to Login
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" style={{ color: 'black', backgroundColor: '#d8d6d6', fontWeight: 'bolder' }}>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className='register-button'
            style={{ width: inputWidth, height: inputHeight }}
          >
            Register
          </Button>
          <h5>Already have an account? Please <Link to="/login">LOGIN!</Link></h5>
        </form>
      </fieldset>
    </div>
  );
};

export default RegistrationForm;

