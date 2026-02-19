import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';
import './styles/account.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { About } from './about/about';
import { Rank } from './rank/rank';
import { Saved } from './saved/saved';
import { Share } from './share/share';
import { CreateAccount } from './createAccount/createAccount';

export default function App() {
  return (
    <BrowserRouter>
    <div>
        <header>
            <div className="header-container">
                <menu>
                    <li className="name"><NavLink to ="">RankMe<sup>&reg;</sup></NavLink></li>
                    <li className="nav-item"><NavLink to ="">Home</NavLink></li>
                    <li className="nav-item"><NavLink to ="about">About</NavLink></li>
                    <li className="nav-item"><NavLink to ="rank">Start Ranking</NavLink></li>
                    <li className="nav-item"><NavLink to ="saved">View Saved Rankings</NavLink></li>
                    <li className="nav-item"><NavLink to ="share">Messages</NavLink></li>
                    <li className="nav-item" id="logout"><NavLink to ="">Logout</NavLink></li>
                </menu>
            </div>
        </header>

        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/about' element={<About />} />
            <Route path='/rank' element={<Rank />} />
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
    </BrowserRouter>
    );  
}
function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}