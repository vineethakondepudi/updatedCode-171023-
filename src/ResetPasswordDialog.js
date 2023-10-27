import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import 'font-awesome/css/font-awesome.min.css';


const ResetPasswordDialog = ({ open, handleClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  

  const handleResetPassword = async () => {
    try {
      // Reset any previous error message
      setError(null);

      // Validate the fields (e.g., password strength, matching passwords, etc.)
      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password don't match.");
      }

      const empmail = localStorage.getItem('empMail');
      const storedPassword = localStorage.getItem('password'); // Get the stored password

      // Check if the currentPassword matches the stored password
      if (currentPassword !== storedPassword) {
        throw new Error("Current password doesn't match the your password.");
      }

      // Create a payload to send to the server
      const payload = {
        Empmail: empmail,
        Password: newPassword, // Use the new password entered by the user
      };

      // Send a POST request to update the password
      const response = await fetch('http://172.17.15.249:4000/UpdatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update password.');
      }

      // Password updated successfully, close the dialog
      handleClose();
    } catch (error) {
      console.error('Error updating password:', error.message);

      // Set the error message state to display the error
      setError(error.message);
    }
  };

  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
  };
  
  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Please fill the following to reset your password.&nbsp;
        <span
  style={{ color: '#00aae7', cursor: 'pointer' }}
  onClick={handleInfoDialogOpen}
>
  <i className="fa fa-info-circle"></i>
</span>

        </DialogContentText>
        <TextField
          margin="dense"
          label="Current Password"
          type="password"
          fullWidth
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
         {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleResetPassword} color="primary">
          Reset Password
        </Button>
      </DialogActions>
      <Dialog open={infoDialogOpen} onClose={handleInfoDialogClose}>
  <DialogTitle>Password Setup</DialogTitle>
  <DialogContent>
    <DialogContentText>
      The password should include the below:
      <ul>
        <li>At least 8 characters but not more than 20 characters</li>
        <li>At least one uppercase letter</li>
        <li>At least one or more lowercase letters</li>
        <li>At least one number</li>
        <li>At least one special character from !@#%^*=-+;.|:[]</li>
      </ul>
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleInfoDialogClose} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
    </Dialog>
  );
};

export default ResetPasswordDialog;
