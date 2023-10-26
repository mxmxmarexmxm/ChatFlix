import React, { useState } from 'react';
import classes from './AuthForm.module.css';
import { resetPassword } from '../services/AuthServices';

// TODO: improve UI and UX, handle go back, firebase template ...
const ResetPasswordForm = () => {
  const [resetPasswordMessage, setResetPasswordMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resetMessage = await resetPassword();
    setResetPasswordMessage(resetMessage);
  };

  return (
    <div className={classes['form-wrapper']}>
      <p>
        Forgot your password? No worries. Enter your registered email address
        below, and we'll send you a link to reset your password.
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
    </div>
  );
};

export default ResetPasswordForm;
