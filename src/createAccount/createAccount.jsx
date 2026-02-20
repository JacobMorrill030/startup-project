import React from 'react';
import { NavLink } from 'react-router-dom';
import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';
import '../styles/account.css';
import '../styles/app.css';

export function CreateAccount({ userName, authState, onAuthChange }) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const canSubmit =
    name.trim() !== '' &&
    password !== '' &&
    password === confirm;

  React.useEffect(() => {
    if (authState === AuthState.Unauthenticated) {
      setName('');
      setPassword('');
      setConfirm('');
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

        <h2>Enter Login Information</h2>

        {authState === AuthState.Unauthenticated && (
          <Unauthenticated
              userName={userName}
              onLogin={(loginUserName) => {
                  onAuthChange(loginUserName, AuthState.Authenticated);
              }}
          />
        )}

        {/* {authState === AuthState.Unauthenticated && ( */}
          <>
            <div className="login-container">
              <input
                type="login"
                placeholder="username"
                size="25"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="password"
                size="25"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="confirm password"
                size="25"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>
            <br />
            <div className="button-containter">
              <NavLink
                to="/rank"
                className="btn"
                onClick={e => {
                  if (!canSubmit) e.preventDefault();
                  else onAuthChange(name, AuthState.Authenticated);
                }}
              >
                Create
              </NavLink>
            </div>
          </>
        {/* // )} */}

        {authState === AuthState.Unauthenticated && (
          <>
            <div className="login-container">
              <input
                type="login"
                placeholder="username"
                size="25"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="password"
                size="25"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="login-container">
              <input
                type="password"
                placeholder="confirm password"
                size="25"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>
            <br />
            <div className="button-containter">
              <NavLink
                to="/rank"
                className="btn"
                onClick={e => {
                  if (!canSubmit) e.preventDefault();
                  else onAuthChange(name, AuthState.Authenticated);
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