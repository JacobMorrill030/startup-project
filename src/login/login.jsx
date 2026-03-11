import React from 'react';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { MessageDialog } from './messageDialog';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';
import '../styles/account.css';
import '../styles/app.css';

export function Login({ userName, authState, onAuthChange}) {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showValidation, setShowValidation] = React.useState(false);
  const canSubmit = name.trim() !== '' && password !== '';
  const [displayError, setDisplayError] = React.useState(null);

  // when the auth state flips back to unauthenticated clear the fields so we
  // don't keep showing the previous credentials
  React.useEffect(() => {
    if (authState === AuthState.Unauthenticated) {
      setName('');
      setPassword('');
      setShowValidation(false);
    }
  }, [authState]);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
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
        {authState === AuthState.Authenticated && (
            <Authenticated
              userName={userName}
              onLogout={() => onAuthChange('', AuthState.Unauthenticated)}
            />
            
        )}

        {authState === AuthState.Authenticated && (
          <main>
            <p className="welcome-message">Welcome back, {userName}!</p>
          </main>
        )}

        {authState === AuthState.Unauthenticated && (
          <>
          <Unauthenticated
                userName={userName}
                onLogin={(loginUserName) => {
                    onAuthChange(loginUserName, AuthState.Authenticated);
                }}
            />
          <h1>Welcome To RankMe!</h1>
          <h2>Log In</h2>
            <div className="login-container">
                <input
                  type="login"
                  placeholder="username"
                  size="25"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (showValidation) {
                      setShowValidation(false);
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
                    if (showValidation) {
                      setShowValidation(false);
                    }
                  }}
                />
            </div>
            {showValidation && (
              <div className="login-error">Please enter a username and password.</div>
            )}
            <br />
          <>
            <div className="button-containter">
                <button
                  className="btn"
                  onClick={async e => {
                    if (!canSubmit) {
                      e.preventDefault();
                      setShowValidation(true);
                    }
                    else {
                      setShowValidation(false);
                      await loginUser();
                    }
                  }}
                >
                  Sign In
                </button>
                <button
                  className="btn"
                  onClick={async e => {
                    onAuthChange(name, AuthState.Unauthenticated);
                    navigate('/create-account');
                  }}
                >
                  Create Account
                </button>
              </div>
              <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
            </>
          </>
        )}
        </div>
    </main>
  );
}