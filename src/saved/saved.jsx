import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './saved.css';

const SAVED_RANKINGS_STORAGE_KEY = 'savedRankings';

const parseSavedRankings = () => {
  const raw = localStorage.getItem(SAVED_RANKINGS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function Saved() {
  const navigate = useNavigate(); 
  const [savedRankings, setSavedRankings] = React.useState(() => parseSavedRankings());
  const [pendingDeleteKey, setPendingDeleteKey] = React.useState(null);
  const [deleteButton, setDeleteButton] = React.useState(null);
  const [selectedRanking, setSelectedRanking] = React.useState(null); 
  const [shareRanking, setShareRanking] = React.useState(false);

  React.useEffect(() => {
    const refreshSavedRankings = () => setSavedRankings(parseSavedRankings());
    window.addEventListener('storage', refreshSavedRankings);
    return () => window.removeEventListener('storage', refreshSavedRankings);
  }, []);

  function toShare(e) { 
    e.preventDefault();
    if (selectedRanking) {
      navigate('/share', { state: { rankingToShare: selectedRanking } });
    } else {
      navigate('/share');
    }
  }

  function deleteSavedRanking(targetKey) {
    const updatedRankings = savedRankings.filter(
      (ranking) => (ranking.savedId || ranking.id) !== targetKey
    );
    setSavedRankings(updatedRankings);
    localStorage.setItem(SAVED_RANKINGS_STORAGE_KEY, JSON.stringify(updatedRankings));
  }

  function requestDelete(targetKey) {
    setPendingDeleteKey(targetKey);
  }

  function cancelDelete() {
    setPendingDeleteKey(null);
  }

  function confirmDelete() {
    if (!pendingDeleteKey) return;
    deleteSavedRanking(pendingDeleteKey);
    setPendingDeleteKey(null);
  }

  return (
    <main>
      <div className="rank-info">
        <div className="select">
            <p></p>
            <div>
                <form onSubmit={toShare}>
                    <button className="share" disabled={!selectedRanking}>Share</button>
                </form>
            </div>
            <p></p>
            <div className="select-txt">Select one you would like to share</div>
        </div>
        <h1>Saved Rankings</h1> 
        <div className="empty"></div>
      </div>
      <br />
      <div className="saved-rankings">
        {savedRankings.length === 0 ? (
          'you have no saved rankings yet'
        ) : (
          savedRankings.map((ranking) => {
            const rankingKey = ranking.savedId || ranking.id;

            return (
              <div className="saved-card" key={rankingKey}>
                <button 
                  className="save-button" 
                  type="button" 
                  onClick={() => {
                    setDeleteButton(rankingKey);
                    setSelectedRanking(ranking);
                    setShareRanking(true);
                  }} 
                  onBlur={() => setDeleteButton(null)}
                  style={{ border: selectedRanking === ranking ? '3px solid white' : 'none' }}
                >
                  <div className="col1-container">
                    <div>
                      <ol>
                        {(ranking.orderedItems || []).map((item) => (
                          <li key={`${rankingKey}-${item}`}>
                            <input className="list-input" value={item} readOnly />
                          </li>
                        ))}
                      </ol>
                      <div className="title">
                        <p>Title: {ranking.title}</p>
                      </div>
                    </div>
                    <div className="saved-tier-wrap">
                      <table className="saved-tier-table" border="1" cellPadding="12">
                        <tbody>
                          {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                            <tr key={`${rankingKey}-${tier}`}>
                              <td className={`${tier.toLowerCase()}-tier`}>{tier}</td>
                              <td className="row">{((ranking.tiers && ranking.tiers[tier]) || []).join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="past-rankings">User: {ranking.from || 'Unknown'}</div>
                </button>
                {deleteButton === rankingKey && (<button
                  className="delete-saved"
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    requestDelete(rankingKey);
                  }}
                >
                  Delete
                </button>)}
                </div>
              );
            })
        )}
      </div>
      {pendingDeleteKey && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-confirm-title">
          <div className="confirm-card">
            <h2 id="delete-confirm-title">Delete saved ranking?</h2>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" type="button" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete" type="button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
  </main>
  );
}