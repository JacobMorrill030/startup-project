import React from 'react';
import { NavLink } from 'react-router-dom';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from '../login/authState';
import '../styles/account.css';
import '../styles/app.css';

export function CreateAccount({ userName, authState, onAuthChange }) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [validationMessage, setValidationMessage] = React.useState('');
  const canSubmit =
    name.trim() !== '' &&
    password !== '' &&
    password === confirm;

  React.useEffect(() => {
    if (authState === AuthState.Unauthenticated) {
      setName('');
      setPassword('');
      setConfirm('');
      setValidationMessage('');
    }
  }, [authState]);

  return (
    <main>
      <div className="welcome-container">
        {authState !== AuthState.Unknown && <h1>Create Account</h1>}
        {authState === AuthState.Authenticated && (
          <Authenticated
            userName={userName}
            onLogout={() => onAuthChange('', AuthState.Unauthenticated)}
          />
        )}

        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
              userName={userName}
              onLogin={(loginUserName) => {
                  onAuthChange(loginUserName, AuthState.Authenticated);
              }}
          />
        )}

        {authState !== AuthState.Unknown && (
          <>
          <h2>Enter Login Information</h2>
            <div className="login-container">
              <input
                type="login"
                placeholder="username"
                size="25"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (validationMessage) {
                    setValidationMessage('');
                  }
                }}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="password"
                size="25"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (validationMessage) {
                    setValidationMessage('');
                  }
                }}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="confirm password"
                size="25"
                value={confirm}
                onChange={e => {
                  setConfirm(e.target.value);
                  if (validationMessage) {
                    setValidationMessage('');
                  }
                }}
              />
            </div>
            {validationMessage && (
                  <div className="login-error">{validationMessage}</div>
                )}
            <br />
            <div className="button-containter">
              <NavLink
                to="/rank"
                className="btn"
                onClick={e => {
                  if (!canSubmit) {
                    if (!name.trim()) {
                      setValidationMessage('Please enter a username and password.');
                    } else if (!password || !confirm) {
                      setValidationMessage('Please enter and confirm your password.');
                    } else if (password !== confirm) {
                      setValidationMessage('Password and confirm password do not match.');
                    }
                    e.preventDefault();
                  }
                  else {
                    setValidationMessage('');
                    onAuthChange(name, AuthState.Authenticated);
                  }
                }}
              >
                Create
              </NavLink>
            </div>
          </>
        )}
      </div>
      <br />
      <br />
    </main>
  );
}