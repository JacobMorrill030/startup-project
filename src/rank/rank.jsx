import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import './rank.css';
import '../styles/app.css';

export function Rank() {
  return (
    <main className="main">
    <div className="rank-info">
        <div className="user">User: Unkown User</div>
        <div className="title-group">
            <label>Title:</label>
            <input id="title" type="text" placeholder="title" />
        </div>
        <div className="save-share">
            <NavLink to="/saved">Save</NavLink> 
            <NavLink to="/share">Share</NavLink>
        </div>
    </div>
    <br />
    <div className="container">
        <div className="column">
            <div className="list-container">
                <ol className="ranked_list">
                    <li className="ranked-item"><input type="text" value="item" readonly/></li>
                    <li className="ranked-item"><input type="text" value="item" readonly/></li>
                    <li className="ranked-item"><input type="text" value="item" readonly/></li>
                    <li className="ranked-item"><input type="text" value="item" readonly/></li>
                    <li className="ranked-item"><input type="text" value="item" readonly/></li>
                </ol>
            </div>
            <button className="item-btn">+ Add Item</button>
            <div className="drop-down">
                <h3>Use Provided Rankings</h3>
                <select className="drop-down-box">
                    <option value="option1" selected>Superheroes</option>
                    <option value="option2" selected>Fast Food Restaurants</option>
                    <option value="option3" selected>Types of Chairs</option>
                    <option value="option4" selected>Dinosaurs</option>
                    <option value="option5" selected>Star Wars Characters</option>
                </select>
            </div>
        </div>
        <div className="column">
            <br />
            <div className="table-container">
                <table border="1" className="tier-list" cellpadding="40">
                    <tr>
                        <td className="s-tier">S</td>
                        <td className="row"></td>
                    </tr>
                    <tr>
                        <td className="a-tier">A</td>
                        <td className="row"></td>
                    </tr>
                    <tr>
                        <td className="b-tier">B</td>
                        <td className="row"></td>
                    </tr>
                    <tr>
                        <td className="c-tier">C</td>
                        <td className="row"></td>
                    </tr>
                    <tr>
                        <td className="d-tier">D</td>
                        <td className="row"></td>
                    </tr>
                </table>
            </div>
            <br />
            <fieldset className="item-bank">
                <ul className="bank-list">
                    <li><input className="list-item" type="text" value="item" readonly/></li>
                    <li><input className="list-item" type="text" value="item" readonly/></li>
                    <li><input className="list-item" type="text" value="item" readonly/></li>
                    <li><input className="list-item" type="text" value="item" readonly/></li>
                    <li><input className="list-item" type="text" value="item" readonly/></li>
                </ul>
            </fieldset>
        </div>
    </div>
</main>
  );
}