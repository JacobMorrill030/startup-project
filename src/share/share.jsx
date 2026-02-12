import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './share.css';

export function Share() {
  const navigate = useNavigate(); 

  function toSaved(e) { 
    e.preventDefault(); 
    navigate('/saved'); 
  }
  return (
   <main>
    <div className="container">
        <div className="share-other">
            <h1>Share</h1>
            <div className="search-container">
                <input className="search-bar" type="search" placeholder="Search by username"/>
            </div>
            <br />
            <div className="scroll-user">
                <table className="search-user" border="1">
                    <tr>
                        <td className="search-data"><button className="search-button">GoldenCow@5543</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button className="search-button">anonymous_whale</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button className="search-button">joe</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button className="search-button">freddy_345</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button className="search-button">heehee_funnyman345</button></td>
                    </tr>
                </table>
            </div>
            <br />
            <button className="send">Send</button>
        </div>
        <div className="share-me">
            <h1>Shared with me</h1>
            <form onSubmit={toSaved}>
                <button className="save">Save</button>
            </form>
            <div className="scroll-me">
                <button className="table-button">
                    <div className="share-container">
                        <div className="share-order">
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
                        <div className="share-tier">
                            <table border="1" cellpadding="10">
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
                <button className="table-button">
                    <div className="share-container">
                        <div className="share-order">
                            <ol>
                                <li><input className="list-input" value="Dinosaur Jedi" readonly/></li>
                                <li><input className="list-input" value="Obi-Wan Kenobi" readonly/></li>
                                <li><input className="list-input" value="Anakin Skywalker" readonly/></li>
                                <li><input className="list-input" value="Mace Windu" readonly/></li>
                                <li><input className="list-input" value="Pon Krell" readonly/></li>
                            </ol>
                            <div className="title">
                                <p>Title: Star Wars Jedi</p>
                            </div>
                        </div>
                        <div className="share-tier">
                            <table border="1" cellpadding="10">
                                <tr>
                                    <td className="s-tier">S</td>
                                    <td className="row">Dinosaur Jedi, Obi</td>
                                    <tr>
                                        <td className="row">Obi Wan-Kenobi</td>
                                    </tr>
                                    <tr>
                                        <td className="row">Anakin Skywalker</td>
                                    </tr>
                                </tr>
                                <tr>
                                    <td className="a-tier">A</td>
                                    <td className="row"></td>
                                </tr>
                                <tr>
                                    <td className="b-tier">B</td>
                                    <td className="row">Mace Windu</td>
                                </tr>
                                <tr>
                                    <td className="c-tier">C</td>
                                    <td className="row"></td>
                                </tr>
                                <tr>
                                    <td className="d-tier">D</td>
                                    <td className="row">Pon Krell</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </button>
                GoldenCow@5543
            </div>
        </div>
    </div>
</main>
  );
}