import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import '../styles/account.css';
import '../styles/app.css';

export function Login() {
  return (
    <main className="main">
        <div className="welcome-container">
            <h1>Welcome to RankMe!</h1>
            <h2>Log In</h2>
            <div className="login-container">
                <input type="login" placeholder="username" size="25"/>
            </div>
            <div className="login-container">
                <input type="password" placeholder="password" size="25"/>
            </div>
            <br />
            <div className="button-containter">
                <NavLink to ="rank" className="btn">Sign In</NavLink>
                <NavLink to ="createAccount" className="btn">Create Account</NavLink>
            </div>
            <br />
            <br />
        </div>
    </main>
  );
}