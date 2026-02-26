import React from 'react';
import { useNavigate } from 'react-router-dom';
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
            S: ['Dinosaur Jedi', 'Obi-Wan Kenobi', 'Anakin Skywalker'],
            A: [],
            B: ['Mace Windu'],
            C: [],
            D: ['Pon Krell'],
        },
    },
];

export function Share() {
  const navigate = useNavigate(); 
    const [selectedId, setSelectedId] = React.useState('');
    const selectedRanking = SHARED_WITH_ME.find(ranking => ranking.id === selectedId);

    function toSaved(e) {
    e.preventDefault(); 
        if (!selectedRanking) {
            return;
        }

        const savedRaw = localStorage.getItem(SAVED_RANKINGS_STORAGE_KEY);
        let savedRankings = [];

        if (savedRaw) {
            try {
                const parsed = JSON.parse(savedRaw);
                if (Array.isArray(parsed)) {
                    savedRankings = parsed;
                }
            } catch {
                savedRankings = [];
            }
        }

        const rankingToSave = {
            ...selectedRanking,
            savedId: `${selectedRanking.id}-${Date.now()}`,
            savedAt: new Date().toISOString(),
        };

        localStorage.setItem(
            SAVED_RANKINGS_STORAGE_KEY,
            JSON.stringify([rankingToSave, ...savedRankings])
        );

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
                <button className="save" disabled={!selectedRanking}>Save</button>
            </form>
            <div className="scroll-me">
                {SHARED_WITH_ME.map((ranking) => (
                  <div key={ranking.id}>
                    <button
                      className="table-button"
                      type="button"
                      onClick={() => setSelectedId(ranking.id)}
                      aria-pressed={selectedId === ranking.id}
                    >
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
                    </button>
                    {ranking.from}
                  </div>
                ))}
            </div>
        </div>
    </div>
</main>
  );
}