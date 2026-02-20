import React from 'react';

// import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  const [userName, setUserName] = React.useState(props.userName);
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  async function createUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }
  return (
    <div>
        {/* <div className="login-container">
        <input
            type="text"
            placeholder="username"
            size="25"
            value={userName}
            onChange={e => setUserName(e.target.value)}
        />
        <input
            type="password"
            placeholder="password"
            size="25"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <button onClick={() => createUser()}>Create Account</button>
        </div> */}
    </div>
    
  );
}