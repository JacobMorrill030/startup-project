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
  const canSubmit = name.trim() !== '' && password !== '';

  // when the auth state flips back to unauthenticated clear the fields so we
  // don't keep showing the previous credentials
  React.useEffect(() => {
    if (authState === AuthState.Unauthenticated) {
      setName('');
      setPassword('');
    }
  }, [authState]);

  return (
    <main className="main">
        <div className="welcome-container">
            {authState !== AuthState.Unknown && <h1>Welcome to RankMe!</h1>}
            {authState === AuthState.Authenticated && (
                <Authenticated
                  userName={userName}
                  onLogout={() => onAuthChange('', AuthState.Unauthenticated)}
                />
                
            )}

            <h2>Log In</h2>

            {authState === AuthState.Unauthenticated && (
                <Unauthenticated
                    userName={userName}
                    onLogin={(loginUserName) => {
                        onAuthChange(loginUserName, AuthState.Authenticated);
                    }}
                />
            )}

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
                <br />

            {/* when the user is unauthenticated we also show the manual form controls
                so that the Sign‑in button can be disabled until both fields have a
                value.  The <Unauthenticated> component also has its own inputs; you
                can choose to remove the duplicates or keep one of the two. */}
            {/* {authState === AuthState.Unauthenticated && ( */}
              <>
                <div className="button-containter">
                    <NavLink
                      to="rank"
                      className="btn"
                      onClick={e => {
                        if (!canSubmit) e.preventDefault();
                        else onAuthChange(name, AuthState.Authenticated);
                      }}
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/createAccount"
                      className="btn"
                      onClick={e => {
                        if (canSubmit) e.preventDefault();
                        else onAuthChange(name, AuthState.Unauthenticated);
                      }}
                    >
                      Create Account
                    </NavLink>
                </div>
                <br/>
                <br />
              </>
            {/* )} */}
        </div>
    </main>
  );
}