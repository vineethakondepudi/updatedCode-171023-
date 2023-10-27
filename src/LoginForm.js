import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { BASE_URL } from './config';


const LoginForm = () => {
  const [Empmail, setEmpmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangeEmail = (event) => {
    setEmpmail(event.target.value);
  };



  const navigate = useNavigate();

  const getRoleBasedRoute = () => {
    const role = localStorage.getItem('role');
    const firstname1 = localStorage.getItem('firstname');


    console.log(role);

    // Here, you can define the routes for different roles
    if (role === 'Employee') {
      return '/eview';
    } else if (role === 'HR') {
      return '/hrview';
    } else if (role === 'Manager') {
      return '/mview';
    } else if (role === 'Director') {
      return '/directorview';
    } else if (role === 'Vice President') {
      return '/VPPortal';
    }
    else {
      // Default route if the role is not recognized or if there is no role in localStorage
      return '/default';
    }
  };
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(atob(base64));
    return decodedToken;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Encode the email and password as Base64
      // Normalize the email to lowercase
  const normalizedEmail = Empmail.toLowerCase();

  // Encode the normalized email and password as Base64
  const encodedEmail = btoa(normalizedEmail);
    const encodedPassword = btoa(Password);
  
    try {
      // Create a payload with Base64-encoded values for display
      const displayPayload = {
        Empmail: encodedEmail,
        Password: encodedPassword,
      };
  
     
      const response = await fetch(`${BASE_URL}/LoginKPI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(displayPayload), // Send the payload with original values to the server
      });
    
        if (response.ok) {
          const data = await response.json();
          const { token } = data;
          localStorage.setItem('token', token);
    
          // Extract the role from the token and store it in localStorage
          const decodedToken = parseJwt(token);
          const role = decodedToken.Role;
          const firstname = decodedToken.Firstname;
          const Empid = decodedToken.Empid;
          const lastname = decodedToken.Lastname;
          const Image = decodedToken.Image;
  
          localStorage.setItem('role', role);
          localStorage.setItem('firstname', firstname);
          localStorage.setItem('Empid', Empid);
          localStorage.setItem('lastname', lastname);
          localStorage.setItem('Image', Image);
          localStorage.setItem('Empmail', Empmail);
          localStorage.setItem('Password', Password);
  
          // Use getRoleBasedRoute() to determine the appropriate route based on the role
          const route = getRoleBasedRoute();
          navigate(route); // Navigate to the appropriate component based on the role
        } else {
          setError('Please enter correct email and password.');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while logging in.');
      }
    };



  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




return (
  <div className="login-form">
    <fieldset className="login-fieldset">
      <div>
        <img
          className="miracleLogo"
          src={'https://hubble.miraclesoft.com/assets/img/miracle-logo-white.svg'}
          alt="Image Description"
        />
        <p className="loginText">Enter Your Details To Continue</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="loginform-group">
          <TextField
            className="textfield"
            placeholder="Enter your email"
            variant="outlined"
            style={{ width: '100%', maxWidth: '355px', height: '45px' }}
            value={Empmail}
            onChange={handleChangeEmail}
            required
            InputProps={{
              startAdornment: (
                <span className="material-icons">email</span>
              ),
            }}
          />
        </div>
        <br />
        <div className="loginform-group">
          <TextField
            className="textfield"
            placeholder="Enter your password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={Password}
            onChange={handleChangePassword}
            required
            style={{ width: '100%', maxWidth: '355px', height: '45px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="material-icons" style={{ color: 'black' }}>lock</span>
                </InputAdornment>
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
        <Link to='/resetpwd' className='ForgotPwd' style={{  }}>Forgot Password?</Link>
        <Button type="submit" variant="contained" >
          Login
        </Button>
        {error && <div className="error">{error}</div>}
        <p style={{ color: 'white' }} className="registering">
          Don't have an account please <Link to="/register" style={{ color: 'white' }}>REGISTER!</Link>
        </p>
        <br />
      </form>

      <footer>
        <p className="text-center">&copy; 2023 Miracle Software Systems, Inc.</p>
      </footer>
    </fieldset>
  </div>
);

};

export default LoginForm;
