import React, { useState } from 'react';
import { TextField, InputAdornment, Input, IconButton } from '@material-ui/core';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { BASE_URL } from './config';



function PasswordInputField({ label, value, onChange, required, fullWidth }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <TextField
            label={label}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            fullWidth={fullWidth}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
}


const PasswordResetForm = () => {
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Verify OTP and Set New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array to store OTP characters
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSentMessage, setOtpSentMessage] = useState('');
    const [otpError, setOtpError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    // const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

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

    const handleSubmitEmail = async (e) => {
        e.preventDefault();

        // Simulate sending OTP to the email using Axios (replace this with your API call)
        try {
            const response = await axios.post(`${BASE_URL}/SendOtp`, {
                Empmail: btoa(email),
            });

            if (response.status === 200) {
                // Display OTP sent message and move to the next step
                setOtpSentMessage('OTP has been sent to your email.');
                setStep(2);
            } else {
                console.error('Failed to send OTP.');
            }

            // Inside render function
            { otpSentMessage && <p style={{ color: 'green' }}>{otpSentMessage}</p> }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };



    const navigate = useNavigate();


    const handleOTPInputChange = (e, index) => {
        // Ensure the input is a single digit
        const input = e.target.value.slice(-1);

        // Update the OTP array with the new value
        const updatedOTP = [...otp];
        updatedOTP[index] = input;
        setOtp(updatedOTP);

        // Move focus to the next input field if a digit is entered
        if (input.match(/^\d$/) && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };
    const handleCloseDialogAndNavigate = () => {
        setIsDialogOpen(false);
        // Navigate to the login component using the navigate function
        navigate('/login'); // Replace with the actual path to your login component
    };

    const handleSubmitOTPAndNewPassword = async (e) => {
        e.preventDefault();

        // Reset error messages
        setOtpError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validate OTP (should contain only numbers)
        if (!otp.join('').match(/^\d{6}$/)) {
            setOtpError('Please enter a valid OTP with 6 digits.');
            return;
        }



        // Validate password (should contain characters, numbers, and special characters)
        if (!newPassword.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/)) {
            setPasswordError('Password must contain at least 8 characters including numbers and special characters.');
            return;
        }

        // Validate password and confirm password match
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            return;
        }

        const requestData = {
            Empmail: btoa(email), // Assuming your API expects email to be base64 encoded
            OTP: otp.join(''), // Join OTP array into a string
            Password: btoa(newPassword),
        };

        try {
            const response = await fetch(`${BASE_URL}/VerifyOtp`, {
                method: 'POST', // Change to the appropriate HTTP method
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                setIsDialogOpen(true);
                console.log('Password reset successful');
            } else {
                console.error('Failed to reset password.');
                setOtpError('Unable to reset your password. Please check your OTP or try again later.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            setOtpError('Sorry, we encountered a technical issue. Please try again later.');
        }
    };





    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#c4d9f5', overflow: 'auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                <div>
                    <img style={{ width: '45vw' }} src='https://cdni.iconscout.com/illustration/premium/thumb/forgot-password-4571933-3805751.png?f=webp' alt='not found' />
                </div>
                <div>
                    {step === 1 && (
                        <>
                            <h1 style={{ textAlign: 'center', fontSize: '50px', marginTop: '-40px', color: '#272773' }}>Forgot Password?</h1>
                            <p style={{ fontSize: '22px', marginTop: '6%', textAlign: 'center', color: '#272773' }}>
                                Enter the email address associated with your account
                            </p>
                            <br />
                            {otpSentMessage && <p style={{ color: 'green' }}>{otpSentMessage}</p>}

                            <form onSubmit={handleSubmitEmail} style={{ maxWidth: '300px', margin: '0 auto' }}>

                                <TextField
                                    fullWidth
                                    label="Enter Email"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    style={{ color: '#272773' }}
                                />
                                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    style={{ backgroundColor: '#272773', marginLeft: 'auto', display: 'block', padding: ' 10px 30px', borderRadius: '15px' }}
                                >
                                    Next
                                </Button>

                            </form>



                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div style={{ marginLeft: '100px' }}>
                                <h1 style={{ textAlign: 'center', color: '#272773' }}>Verify OTP and Set New Password</h1>
                                <form onSubmit={handleSubmitOTPAndNewPassword} style={{ marginLeft: '20px' }}>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '2%' }}>
                                        {otp.map((value, index) => (
                                            <input
                                                key={index}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                maxLength={1}
                                                value={value}
                                                onChange={(e) => handleOTPInputChange(e, index)}
                                                required
                                                style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    fontSize: '18px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    textAlign: 'center',
                                                    backgroundColor: '#c4d9f5'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {otpError && <p style={{ color: 'red' }}>{otpError}</p>}

                                    <PasswordInputField
                                        label="New Password"
                                        value={newPassword}
                                        onChange={setNewPassword}
                                        required
                                        fullWidth
                                    />
                                    <PasswordInputField
                                        label="Confirm Password"
                                        value={confirmPassword}
                                        onChange={setConfirmPassword}
                                        required
                                        fullWidth
                                        style={{ marginTop: '2%' }}
                                    />

                                    {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                                    {confirmPasswordError && <p style={{ color: 'red' }}>{confirmPasswordError}</p>}

                                    <Dialog open={isDialogOpen} onClose={handleCloseDialogAndNavigate}>
                                        <DialogTitle>Password Reset Successful</DialogTitle>
                                        <DialogContent>
                                            <Typography>Password has been reset successfully.</Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseDialogAndNavigate} color="primary">
                                                OK
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <Button variant="contained" color="primary" type="submit" style={{ marginLeft: 'auto', display: 'block', borderRadius: '5px', backgroundColor: '#272773' }}>
                                        Reset Password
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>

    );

};

export default PasswordResetForm;
