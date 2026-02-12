import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './saved.css';

export function Saved() {
  const navigate = useNavigate(); 
  function toShare(e) { 
    e.preventDefault(); 
    navigate('/share'); 
  }
  return (
    <main>
      <div className="rank-info">
        <div className="select">
            <p></p>
            <div>
                <form onSubmit={toShare}>
                    <button className="share">Share</button>
                </form>
            </div>
            <p></p>
            <div className="select-txt">Select one you would like to share</div>
        </div>
        <h1>Past Rankings</h1> 
        <div className="empty"></div>
      </div>
      <br />
      <div className="container">
          <div className="col1">
              <button className="save-button">
                  <div className="col1-container">
                      <div className="col1-order">
                          <ol>
                              <li><input className="list-input" value="Moose Tracks" readonly/></li>
                              <li><input className="list-input" value="Chocolate" readonly/></li>
                              <li><input className="list-input" value="Vanilla" readonly/></li>
                              <li><input className="list-input" value="Strawberry" readonly/></li>
                          </ol>
                          <div className="title">
                              <p>Title: Ice cream flavors</p>
                          </div>
                      </div>
                      <div className="col1-tier">
                          <table border="1" cellpadding="15">
                              <tr>
                                  <td className="s-tier">S</td>
                                  <td className="row">Moose Tracks</td>
                              </tr>
                              <tr>
                                  <td className="a-tier">A</td>
                                  <td className="row">Chocolate</td>
                              </tr>
                              <tr>
                                  <td className="b-tier">B</td>
                                  <td className="row">Vanilla</td>
                              </tr>
                              <tr>
                                  <td className="c-tier">C</td>
                                  <td className="row">Strawberry</td>
                              </tr>
                              <tr>
                                  <td className="d-tier">D</td>
                                  <td className="row"></td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </button>
              Unkown User
              <button className="save-button">
                  <div className="col1-container">
                      <div className="col1-order">
                          <ol>
                              <li><input className="list-input" value="5" readonly/></li>
                              <li><input className="list-input" value="2" readonly/></li>
                              <li><input className="list-input" value="10" readonly/></li>
                              <li><input className="list-input" value="1" readonly/></li>
                              <li><input className="list-input" value="4" readonly/></li>
                              <li><input className="list-input" value="3" readonly/></li>
                              <li><input className="list-input" value="9" readonly/></li>
                              <li><input className="list-input" value="7" readonly/></li>
                              <li><input className="list-input" value="8" readonly/></li>
                              <li><input className="list-input" value="6" readonly/></li>
                          </ol>
                          <div className="title">
                              <p>Title: Numbers 1-10</p>
                          </div>
                      </div>
                      <div className="col1-tier">
                          <table border="1" cellpadding="15">
                              <tr>
                                  <td className="s-tier">S</td>
                                  <td className="row">5, 2, 10</td>
                              </tr>
                              <tr>
                                  <td className="a-tier">A</td>
                                  <td className="row">1, 4</td>
                              </tr>
                              <tr>
                                  <td className="b-tier">B</td>
                                  <td className="row">3, 9</td>
                              </tr>
                              <tr>
                                  <td className="c-tier">C</td>
                                  <td className="row">7, 8</td>
                              </tr>
                              <tr>
                                  <td className="d-tier">D</td>
                                  <td className="row">6</td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </button>
              joe
              <p></p>
          </div>
          <div className="col2">
              <button className="save-button">
                  <div className="col1-container">
                      <div className="col1-order">
                          <ol>
                              <li><input className="list-input" value="Moose Tracks" readonly/></li>
                              <li><input className="list-input" value="Chocolate" readonly/></li>
                              <li><input className="list-input" value="Vanilla" readonly/></li>
                              <li><input className="list-input" value="Strawberry" readonly/></li>
                          </ol>
                          <div className="title">
                              <p>Title: Ice cream flavors</p>
                          </div>
                      </div>
                      <div className="col1-tier">
                          <table border="1" cellpadding="15">
                              <tr>
                                  <td className="s-tier">S</td>
                                  <td className="row">Moose Tracks</td>
                              </tr>
                              <tr>
                                  <td className="a-tier">A</td>
                                  <td className="row">Chocolate</td>
                              </tr>
                              <tr>
                                  <td className="b-tier">B</td>
                                  <td className="row">Vanilla</td>
                              </tr>
                              <tr>
                                  <td className="c-tier">C</td>
                                  <td className="row">Strawberry</td>
                              </tr>
                              <tr>
                                  <td className="d-tier">D</td>
                                  <td className="row"></td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </button>
              GoldenCow@5543
          </div>
      </div>
  </main>
  );
}