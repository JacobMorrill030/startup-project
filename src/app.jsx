import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './styles/account.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './login/login';
import { About } from './about/about';
import { Rank } from './rank/rank';
import { Saved } from './saved/saved';
import { Share } from './share/share';
import { CreateAccount } from './createAccount/createAccount';
import { AuthState } from './login/authState';

function App() {
    const navigate = useNavigate();
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    function handleLogout() {
      localStorage.removeItem('userName');
      setUserName('');
      setAuthState(AuthState.Unauthenticated);
      navigate('/');
    }

  return (
    <div>
        <header>
            <div className="header-container">
                <menu>
                    <li className="name">
                        <NavLink to ="">
                            RankMe<sup>&reg;</sup>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to ="">
                            Home
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to ="about">
                            About
                        </NavLink>
                    </li>
                    {authState == AuthState.Authenticated && (
                        <li className="nav-item">
                            <NavLink to ="rank">
                                Start Ranking
                            </NavLink>
                        </li>
                    )}
                    {authState == AuthState.Authenticated && (
                        <li className="nav-item">
                            <NavLink to ="saved">
                                View Saved Rankings
                            </NavLink>
                        </li>
                    )}
                    {authState == AuthState.Authenticated && (
                        <li className="nav-item">
                            <NavLink to ="share">
                                Messages
                            </NavLink>
                        </li>
                    )}
                    {authState == AuthState.Authenticated && (
                        <li className="nav-item" id="logout">
                            <NavLink className="nav-item" to="/" onClick={handleLogout}>
                                Logout
                            </NavLink>
                        </li>
                    )}
                </menu>
            </div>
        </header>

        <Routes>
            <Route
              path='/'
              element={
                <Login
                  userName={userName}
                  authState={authState}
                  onAuthChange={(newUser, newState) => {
                    // clear stored name when logging out
                    setUserName(newState === AuthState.Authenticated ? newUser : '');
                    setAuthState(newState);
                  }}
                />
              }
            />
            <Route path='/about' element={<About />} />
            <Route path='/rank' element={<Rank userName={userName} />} />
            <Route path='/saved' element={<Saved />} />
            <Route path='/share' element={<Share />} />
            <Route path='/createAccount' element={<CreateAccount />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
            <div className="link-container">
                <div className="author">Jacob Morrill</div>
                <div className="github">Source:</div>
                <NavLink className="github" to ="https://github.com/JacobMorrill567/startup-project">GitHub</NavLink>
            </div>
        </footer>
    </div>
    );  
}
function NotFound() {
  return <main className="body">404: Return to sender. Address unknown.</main>;
}

export default App;
