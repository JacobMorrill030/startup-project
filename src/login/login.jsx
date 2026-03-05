import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';
import '../styles/account.css';
import '../styles/app.css';

export function Login({ userName, authState, onAuthChange}) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showValidation, setShowValidation] = React.useState(false);
  const canSubmit = name.trim() !== '' && password !== '';

  // when the auth state flips back to unauthenticated clear the fields so we
  // don't keep showing the previous credentials
  React.useEffect(() => {
    if (authState === AuthState.Unauthenticated) {
      setName('');
      setPassword('');
      setShowValidation(false);
    }
  }, [authState]);

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
            <h1 className="welcome-message">Welcome back, {userName}!</h1>
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
                <NavLink
                  to="/rank"
                  className="btn"
                  onClick={e => {
                    if (!canSubmit) {
                      e.preventDefault();
                      setShowValidation(true);
                    }
                    else {
                      setShowValidation(false);
                      onAuthChange(name, AuthState.Authenticated);
                    }
                  }}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/createAccount"
                  className="btn"
                  onClick={e => {
                    onAuthChange(name, AuthState.Unauthenticated);
                  }}
                >
                  Create Account
                </NavLink>
              </div>
            </>
          </>
        )}
        </div>
    </main>
  );
}