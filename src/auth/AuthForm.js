import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import classes from './AuthForm.module.css';
import { resetPassword, signInWithGoogle } from '../services/AuthServices';
import { addUserToFirestore } from '../services/UserServices';
import { useModal } from '../context/ModalContext';
import { Google } from '../assets/icons/Google';
import ResetPasswordForm from './ResetPassword';

const AuthForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    displayName: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [haveAccount, setHaveAccount] = useState(true);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { closeModal } = useModal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    if (!haveAccount) {
      if (formData.password !== formData.passwordConfirm) {
        setErrorMessage('Passwords do not match, please retype');
        return;
      }
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formData.displayName,
          }).then(() => {
            addUserToFirestore(user);
            closeModal();
          });
          // ...
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;
          closeModal();
          console.log(user);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  const handleSignInAndAddUserToFirestore = async () => {
    try {
      const success = await signInWithGoogle();
      if (success) {
        const user = success.user;
        closeModal();
        await addUserToFirestore(user);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (forgotPassword) {
    return <ResetPasswordForm />;
  }

  return (
    <div className={classes['form-wrapper']}>
      <h2 className={classes.welcome}>WELCOME</h2>
      <button
        className={classes['continue-btn']}
        onClick={handleSignInAndAddUserToFirestore}
      >
        <Google height="20px" /> Continue with Google
      </button>
      <span>or</span>
      <form onSubmit={handleSubmit}>
        {!haveAccount && (
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        )}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          placeholder="Password"
          required
        />
        {!haveAccount && (
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />
        )}
        {
          <div>
            <p className={classes['error-message']}>{errorMessage}</p>
          </div>
        }
        <button type="submit">{haveAccount ? 'Log in' : 'Sign up'}</button>
        {haveAccount ? (
          <>
            <span className={classes['account-title']}>
              No account?{' '}
              <button
                className={classes['create-login-btn']}
                type="button"
                onClick={() => setHaveAccount(false)}
              >
                Create one
              </button>
            </span>
            {/* TODO: Improve UI */}
            <span className={classes['account-title']}>
              <button
                className={classes['create-login-btn']}
                type="button"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password ?
              </button>
            </span>
          </>
        ) : (
          <span className={classes['account-title']}>
            Already have an account?{' '}
            <button
              className={classes['create-login-btn']}
              type="button"
              onClick={() => setHaveAccount(true)}
            >
              Login here
            </button>
          </span>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
