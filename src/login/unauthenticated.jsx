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
    <>
      {/* <div> */}
        {/* <div className="login-container">
                <input type="login" placeholder="username" size="25"/>
            </div>
            <div className="login-container">
                <input type="password" placeholder="password" size="25"/>
            </div>
            <br />
            <div className="button-containter">
                <NavLink to ="rank" className="btn" onClick={() => loginUser()} disabled={!userName || !password}>
                    Sign In
                </NavLink>
                <NavLink to ="createAccount" className="btn" onClick={() => createUser()} disabled={!userName || !password}>
                    Create Account
                </NavLink>
            </div>
            <br />
            <br /> */}
      {/* </div> */}

      {/* <MessageDialog message={displayError} onHide={() => setDisplayError(null)} /> */}
    </>
  );
}
