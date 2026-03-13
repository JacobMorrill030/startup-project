import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './share.css';

const SAVED_RANKINGS_STORAGE_KEY = 'savedRankings';

const SHARED_WITH_ME = [
    {
        id: 'shared-1',
        from: 'GoldenCow@5543',
        title: 'Ice cream flavors',
        orderedItems: ['Moose Tracks', 'Chocolate', 'Vanilla', 'Strawberry'],
        tiers: {
            S: ['Moose Tracks'],
            A: ['Chocolate'],
            B: ['Vanilla'],
            C: ['Strawberry'],
            D: [],
        },
    },
    {
        id: 'shared-2',
        from: 'GoldenCow@5543',
        title: 'Star Wars Jedi',
        orderedItems: ['Dinosaur Jedi', 'Obi-Wan Kenobi', 'Anakin Skywalker', 'Mace Windu', 'Pon Krell'],
        tiers: {
            S: ['Obi-Wan Kenobi'],
            A: ['Anakin Skywalker'],
            B: ['Dinosaur Jedi'],
            C: ['Mace Windu'],
            D: ['Pon Krell'],
        },
    },
];

export function Share() {
  const navigate = useNavigate();
  const location = useLocation();
  const rankingToShare = location.state?.rankingToShare;
    const rankingOwner = rankingToShare?.from || rankingToShare?.userName || 'Unknown';
  const [selectedId, setSelectedId] = React.useState('');
  const selectedRanking = SHARED_WITH_ME.find(ranking => ranking.id === selectedId);
  const [showSent, setShowSent] = React.useState(false);
  const [displayRanking, setDisplayRanking] = React.useState(true);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  const MESSAGE_TIMEOUT_MS = 2000;

    React.useEffect(() => {
        if (!showSent) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setShowSent(false);
        }, MESSAGE_TIMEOUT_MS);

        return () => clearTimeout(timeoutId);
    }, [showSent]);

    React.useEffect(() => {
        if (!sending) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setSending(false);
            setShowSent(true);
        }, MESSAGE_TIMEOUT_MS);

        return () => clearTimeout(timeoutId);
    }, [sending]);

    

    async function toSaved(e) {
        e.preventDefault(); 
        if (!selectedRanking) {
            return;
        }

        const rankingToSave = {
            ...selectedRanking,
            from: selectedRanking.from || selectedRanking.userName || 'Unknown',
            savedId: `${selectedRanking.id}-${Date.now()}`,
            savedAt: new Date().toISOString(),
        };

        const response = await fetch('/api/post/rankings', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(rankingToSave),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            return alert('Error saving ranking to server');
        } else {
            navigate('/saved'); 
        }
    }

  return (
   <main>
    <div className="container">
        <div className="share-other">
            <div className="display-ranking">
                {rankingToShare && displayRanking && (
                    <div className="ranking-display">
                        <div className="share-container">
                            <div className="share-order">
                                <ol>
                                    {(rankingToShare.orderedItems || []).map((item, index) => (
                                        <li key={index}><input className="list-input" value={item} readOnly/></li>
                                    ))}
                                </ol>
                                <div className="title">
                                    <p>Title: {rankingToShare.title}</p>
                                </div>
                            </div>
                            <div className="share-tier">
                                <table border="1" cellPadding="10">
                                    <tbody>
                                        {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                                            <tr key={tier}>
                                                <td className={`${tier.toLowerCase()}-tier`}>{tier}</td>
                                                <td className="row">{((rankingToShare.tiers && rankingToShare.tiers[tier]) || []).join(', ')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>User: {rankingOwner}</div>
                    </div>
                )}
            </div>
            <h1>Share</h1>
             <div className="search-container">
                <input className="search-bar" type="search" placeholder="Search by username"/>
            </div>
            <br />
            <div className="scroll-user">
                <table className="search-user" border="1">
                    <tr>
                        <td className="search-data"><button onClick={() => setSelectedUser('GoldenCow@5543')}  className="search-button">GoldenCow@5543</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button onClick={() => setSelectedUser('anonymous_whale')} className="search-button">anonymous_whale</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button onClick={() => setSelectedUser('joe')} className="search-button">joe</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button onClick={() => setSelectedUser('freddy_345')} className="search-button">freddy_345</button></td>
                    </tr>
                    <tr>
                        <td className="search-data"><button onClick={() => setSelectedUser('heehee_funnyman345')} className="search-button">heehee_funnyman345</button></td>
                    </tr>
                </table>
            </div>
            <br />
            {rankingToShare && displayRanking && selectedUser && (
            <button className="send" onClick={() => {
                setSending(true);
                setDisplayRanking(false);
            }}>Send</button>
                )}
            {sending && rankingToShare && selectedUser && (
                <div className="send-status">Sending...</div>
                )}
            {showSent && rankingToShare && selectedUser && (
                <div className="send-status">Ranking sent to {selectedUser}!</div>
            )}
        </div>
        <div className="share-me">
            <div></div>
            <h1>Shared with me</h1>
            {/* <div className="save-text">
                <form onSubmit={toSaved}>
                    <button className="save" disabled={!selectedRanking}>Save</button>
                </form>
                <p>Select one you would like to save</p>
            </div> */}
            <div className="scroll-me">
                {SHARED_WITH_ME.map((ranking) => (
                  <div key={ranking.id}>
                    {/* <button
                      className="table-button"
                      type="button"
                      onClick={() => setSelectedId(ranking.id)}
                      aria-pressed={selectedId === ranking.id}
                    > */}
                        <div className="share-container">
                            <div className="share-order">
                                <ol>
                                    {ranking.orderedItems.map((item) => (
                                      <li key={item}><input className="list-input" value={item} readOnly/></li>
                                    ))}
                                </ol>
                                <div className="title">
                                    <p>Title: {ranking.title}</p>
                                </div>
                            </div>
                            <div className="share-tier">
                                <table border="1" cellPadding="10">
                                    <tbody>
                                        {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                                          <tr key={`${ranking.id}-${tier}`}>
                                              <td className={`${tier.toLowerCase()}-tier`}>{tier}</td>
                                              <td className="row">{(ranking.tiers[tier] || []).join(', ')}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    {/* </button> */}
                                        User: {ranking.from || ranking.userName || 'Unknown'}
                  </div>
                ))}
            </div>
        </div>
    </div>
</main>
  );
}