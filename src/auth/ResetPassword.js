import React, { useState } from 'react';
import classes from './ResetPasswordForm.module.css';
import { resetPassword } from '../services/AuthServices';

// TODO: improve UI and UX firebase template ...
const ResetPasswordForm = ({ setForgotPassword }) => {
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetMessage = await resetPassword();
    setResetPasswordMessage(resetMessage);
  };

  return (
    <div className={classes['reset-password-form']}>
      <h1>Forgot your password?</h1>
      <p className={classes['text']}>
        No worries. Enter your registered email address below, and we'll send
        you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        {resetPasswordMessage}
        <button type="submit">Send</button>
      </form>
      <button
        className={classes['back-btn']}
        onClick={() => setForgotPassword(false)}
      >
        Go back
      </button>
    </div>
  );
};

export default ResetPasswordForm;
