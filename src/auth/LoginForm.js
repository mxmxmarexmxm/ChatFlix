import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import classes from './LoginForm.module.css';
import { FcGoogle } from 'react-icons/fc';
import { signInWithGoogle } from './AuthServices';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [doesntHaveAccount, setDoesntHaveAccount] = useState(false);

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
    if (doesntHaveAccount) {
      if (formData.password !== formData.passwordConfirm) {
        setErrorMessage('Passwords do not match, please retype');
        return;
      }
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          // ...
        })
        // TODO : HANDLE ERRROR
        .catch((error) => {
          setErrorMessage(error.message);

          // ..
        });
    } else {
      signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          setErrorMessage(error.message);
        });
    }
    // TODO : CLOSE MODAL
    console.log(formData);
  };

  return (
    <div className={classes['form-wrapper']}>
      <h2 className={classes.welcome}>WELCOME</h2>
      <button
        className={classes['continue-btn']}
        onClick={() => signInWithGoogle()}
      >
        <FcGoogle /> Continue with Google
      </button>
      <span>or</span>
      <form onSubmit={handleSubmit}>
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
          placeholder="Password"
          required
        />
        {doesntHaveAccount && (
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
          <div className={classes.xx}>
            <p className={classes['error-message']}>{errorMessage}</p>
          </div>
        }
        <button type="submit">
          {doesntHaveAccount ? 'Sign up' : 'Log in'}
        </button>
        {!doesntHaveAccount ? (
          <span className={classes['account-title']}>
            No account?{' '}
            <button
              className={classes['create-login-btn']}
              type="button"
              onClick={() => setDoesntHaveAccount(true)}
            >
              Create one
            </button>
          </span>
        ) : (
          <span className={classes['account-title']}>
            Already have an account?{' '}
            <button
              className={classes['create-login-btn']}
              type="button"
              onClick={() => setDoesntHaveAccount(false)}
            >
              Login here
            </button>
          </span>
        )}
      </form>
    </div>
  );
};

export default SignInForm;
