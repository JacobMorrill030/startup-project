import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from '../login/authState';
import { MessageDialog } from '../login/messageDialog';
import '../styles/account.css';
import '../styles/app.css';

export function CreateAccount({ userName, authState, onAuthChange }) {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [validationMessage, setValidationMessage] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);
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

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({ userName: name, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response?.status === 200) {
        localStorage.setItem('userName', name);
        onAuthChange(name, AuthState.Authenticated);
        navigate('/rank');
      } else {
        const body = await response.json();
        setDisplayError(`⚠ Error: ${body.msg || 'Request failed'}`);
      }
    } catch (error) {
      setDisplayError(`⚠ Network error calling ${endpoint}: ${error.message}`);
    }
  }

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
                className="login-input"
                placeholder="username"
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
              <button
                className="btn"
                onClick={async e => {
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
                    await createUser();
                  }
                }}
              >
                Create
              </button>
            </div>
            <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
          </>
        )}
      </div>
    </main>
  );
}