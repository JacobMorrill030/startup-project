import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import '../styles/account.css';
import '../styles/app.css';

export function CreateAccount() {
  return (
    <main>
      <div className="welcome-container">
        <h1>Create Account</h1>
        <h2>Enter Login Information</h2>
        <br />
        <div>
            <input type="login" placeholder="username" size="25"/>
        </div>
        <p></p>
        <div>
            <input type="password" placeholder="password" size="25"/>
        </div>
        <div>
            <input type="password" placeholder="confirm password" size="25"/>
        </div>
        <br /> 
        <NavLink to ="/rank" className="btn">Sign In</NavLink>
      </div>
      <br />
      <br />
    </main>
  );
}