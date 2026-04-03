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

export function Saved({ userName }) {
  const navigate = useNavigate(); 
  const [savedRankings, setSavedRankings] = React.useState(() => parseSavedRankings());
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  const [pendingDeleteKey, setPendingDeleteKey] = React.useState(null);
  const [deleteButton, setDeleteButton] = React.useState(null);
  const [selectedRanking, setSelectedRanking] = React.useState(null); 
  const [border, setBorder] = React.useState(false);

  React.useEffect(() => {
    const refreshSavedRankings = () => setSavedRankings(parseSavedRankings());
    window.addEventListener('storage', refreshSavedRankings);
    return () => window.removeEventListener('storage', refreshSavedRankings);
  }, []);

  React.useEffect(() => {
    let ignore = false;

    async function loadSavedRankings() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await fetch('/api/get/rankings', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.msg || 'Unable to load saved rankings');
        }

        const rankings = await response.json();
        if (ignore) {
          return;
        }

        const nextRankings = Array.isArray(rankings) ? rankings : [];
        setSavedRankings(nextRankings);
        localStorage.setItem(SAVED_RANKINGS_STORAGE_KEY, JSON.stringify(nextRankings));
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message || 'Unable to load saved rankings');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSavedRankings();

    return () => {
      ignore = true;
    };
  }, []);

  function toShare(e) { 
    e.preventDefault();
    if (selectedRanking) {
      const rankingToShare = {
        ...selectedRanking,
        from: selectedRanking.userName || selectedRanking.from || userName || 'Unknown',
        userName: selectedRanking.userName || selectedRanking.from || userName || 'Unknown',
      };
      navigate('/share', { state: { rankingToShare } });
    } else {
      navigate('/share');
    }
  }

  async function deleteSavedRanking(targetKey) {
    const response = await fetch(`/api/rankings/${targetKey}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.msg || 'Unable to delete ranking');
    }

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

  async function confirmDelete() {
    if (!pendingDeleteKey) return;

    try {
      await deleteSavedRanking(pendingDeleteKey);
      setPendingDeleteKey(null);
      if (selectedRanking && (selectedRanking.savedId || selectedRanking.id) === pendingDeleteKey) {
        setSelectedRanking(null);
      }
    } catch (error) {
      setLoadError(error.message || 'Unable to delete ranking');
    }
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
        {isLoading ? (
          'loading saved rankings...'
        ) : loadError ? (
          loadError
        ) : savedRankings.length === 0 ? (
          'you have no saved rankings yet'
        ) : (
          [...savedRankings]
          .sort((a, b) => {
            // Use timestamp if available, otherwise fall back to savedId timestamp or date
            const getTime = (ranking) => {
              if (ranking.timestamp) return new Date(ranking.timestamp).getTime();
              if (ranking.savedId && ranking.savedId.startsWith('my-')) {
                const timestamp = ranking.savedId.split('-')[1];
                if (!isNaN(timestamp)) return parseInt(timestamp);
              }
              return new Date(ranking.date || '1970-01-01').getTime();
            };
            return getTime(b) - getTime(a);
          })
          .map((ranking) => {
            const rankingKey = ranking.savedId || ranking.id;

            return (
              <div className="saved-card" key={rankingKey}>
                <button 
                  className="save-button" 
                  type="button" 
                  onClick={() => {
                    setDeleteButton(rankingKey);
                    setSelectedRanking(ranking);
                    if (border === false) {
                      setBorder(true);
                    }
                    if (border === true) {
                      setBorder(false);
                      setDeleteButton(null);
                    }
                  }} 
                  style={{ border: selectedRanking === ranking && border ? '3px solid white' : 'none' }}
                >
                  <p style={{ color: 'white' }}>Title: {ranking.title}</p>
                  <div className="col1-container">
                    <div>
                      <ol>
                        {(ranking.orderedItems || []).map((item) => (
                          <li key={`${rankingKey}-${item}`}>
                            <input className="list-input" value={item} readOnly />
                          </li>
                        ))}
                      </ol>
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
                <p>Saved on: {ranking.date || 'Unknown Date'}</p>
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