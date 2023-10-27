import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';
import {  InputAdornment,  IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './ChangePassword.css'


const ChangePasswordForm = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const handleTogglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };

    const handleTogglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleTogglePasswordVisibility3 = () => {
        setShowPassword3(!showPassword3);
    };

    const openDialog = () => {
        setDialogOpen(true);
    };
    const navigate = useNavigate()
    const closeDialog = () => {
        setDialogOpen(false);
        navigate('/eview');
    };


    const handleEmailChange = (e) => {
        const value = e.target.value;
      
        // Use a case-insensitive regular expression for the format check
        const emailPattern = /^[a-zA-Z]{3,}[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/i;
      
        if (!emailPattern.test(value)) {
          setEmailError('Please enter a valid email address.');
        } else if (!value.toLowerCase().endsWith('@miraclesoft.com')) {
          setEmailError('Email must end with @miraclesoft.com');
        } else {
          setEmailError('');
        }
      
        setEmail(value);
      };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        const newPasswordValue = e.target.value;
        setNewPassword(newPasswordValue);

        // Custom validation for password
        if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,}$/.test(newPasswordValue)) {
            setNewPasswordError('Password must contain at least 8 characters, including numbers, letters, and special symbols.');
        } else {
            setNewPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);

        if (e.target.value !== newPassword) {
            setConfirmPasswordError('New password and confirm password must match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const Empmail = localStorage.getItem('Empmail');
        const encodedEmail = btoa(Empmail)
        console.log('encodedEmail', encodedEmail)
        const Password = localStorage.getItem('Password');
        console.log('Email from localStorage:', Empmail);
        console.log('Password from localStorage:', Password);
        console.log('Email entered:', email);
        console.log('Old Password entered:', oldPassword);
        const encodedPassword = btoa(newPassword)
        console.log('encodedPassword', encodedPassword)

        if (email === Empmail && oldPassword === Password) {
            if (newPassword === confirmPassword) {
                setEmail('');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setEmailError('');
                setNewPasswordError('');
                setConfirmPasswordError('');



                try {
                    const response = await fetch(`${BASE_URL}/UpdatePassword`, {
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            Empmail: encodedEmail,
                            Password: encodedPassword,
                        }),
                    });

                    if (response.ok) {

                        openDialog();
                    } else {

                        console.error('Failed to update password');
                    }
                } catch (error) {

                    console.error('Network error:', error);
                }
            } else {
                setNewPasswordError('New password and confirm password must match.');
            }
        } else {
            setEmailError('Invalid email or old password.');
        }
    };



    return (
        <div className="reset-pwd-container">
            <fieldset className="reset-fieldset">
                <div>
                    <h2 className='reset-text'>Reset Your Password</h2>
                </div>
                <form onSubmit={handleSubmit} >
                    <div className="input-container">
                        <TextField
                            placeholder='Email'
                            type="email"
                            fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            required
                            error={emailError !== ''}
                            helperText={emailError}
                            style={{ marginTop: '2%',  borderRadius: '5px' }}
                            InputProps={{
                                startAdornment: (
                                    <EmailIcon style={{ color: 'black', paddingRight:'5px' }} />
                                ),

                            }}
                        />
                    </div>
                    <div className="input-container">
                        <TextField
                            placeholder="Old Password"
                            type={showPassword1 ? 'text' : 'password'}
                            fullWidth
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                            required
                            style={{ marginTop: '2%',  borderRadius: '5px' }}
                            InputProps={{
                                startAdornment: (
                                    <PasswordIcon style={{ color: 'black', paddingRight:'5px' }} />
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility1}>
                                            {showPassword1 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="input-container">
                        <TextField
                            placeholder="New Password"
                            type={showPassword2 ? 'text' : 'password'}
                            fullWidth
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            error={newPasswordError !== ''}
                            helperText={newPasswordError}
                            style={{ marginTop: '2%',  borderRadius: '5px' }}
                            InputProps={{
                                startAdornment: (
                                    <PasswordIcon style={{ color: 'black', paddingRight:'5px' }} />
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility2}>
                                            {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="input-container">
                        <TextField
                            placeholder="Confirm Password"
                            type={showPassword3 ? 'text' : 'password'}
                            fullWidth
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={confirmPasswordError !== ''}
                            helperText={confirmPasswordError}
                            style={{ marginTop: '2%',  borderRadius: '5px' }}
                            InputProps={{
                                startAdornment: (
                                    <PasswordIcon style={{ color: 'black', paddingRight:'5px' }} />
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePasswordVisibility3}>
                                            {showPassword3 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <Dialog open={isDialogOpen} onClose={closeDialog}>
                        <DialogTitle>Password Updated Successfully</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Your password has been updated successfully.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button type="submit" variant="contained" fullWidth style={{ marginBottom: '5%', textAlign: 'center' }}>
                        Reset Password
                    </Button>
                </form>



            </fieldset>
        </div>
    );
};

export default ChangePasswordForm;