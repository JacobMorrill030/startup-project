import React from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './share.css';

export function Share({ userName }) {
    const location = useLocation();
    const rankingToShare = location.state?.rankingToShare;
    const [showSent, setShowSent] = React.useState(false);
    const [displayRanking, setDisplayRanking] = React.useState(true);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [sending, setSending] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [notifications, setNotifications] = React.useState([]);
    const [sharedWithMe, setSharedWithMe] = React.useState([]);
    const [socketConnected, setSocketConnected] = React.useState(false);
    const [socketError, setSocketError] = React.useState('');
    const [socket, setSocket] = React.useState(null);
    const [search, setSearch] = React.useState('');
    const MESSAGE_TIMEOUT_MS = 2000;

const getDefaultColor = (tier) => {
  const defaults = {
    S: 'red',
    A: 'orange',
    B: 'yellow',
    C: 'rgb(30, 210, 30)',
    D: 'rgb(59, 59, 233)',
  };
  return defaults[tier] || 'white';
};

    const NOTIFICATIONS_KEY = `notifications-${userName}`;

    const loadNotifications = () => {
        if (!userName) return [];
        try {
            const stored = localStorage.getItem(NOTIFICATIONS_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading notifications:', error);
            return [];
        }
    };

    const saveNotifications = (nots) => {
        if (!userName) return;
        try {
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(nots));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    };

    React.useEffect(() => {
        if (!userName) return;
        const nots = loadNotifications()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 2);
        setNotifications(nots);
    }, [userName]);

    React.useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('/api/users/all', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }

        fetchUsers();
    }, []);

    React.useEffect(() => {
        async function fetchSharedRankings() {
            if (!userName) {
                return;
            }

            try {
                const response = await fetch('/api/get/shared', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                const sharedRankings = Array.isArray(data)
                    ? data.filter((ranking) => ranking.to === userName).map((item) => ({
                        ...item.ranking,
                        from: item.from,
                        to: item.to,
                        timestamp: item.timestamp,
                        message: item.message,
                        id: item.ranking.id || item._id,
                    }))
                    : [];
                setSharedWithMe(sharedRankings);
                
                // Generate notifications for shared rankings that don't have one
                const currentNotifications = loadNotifications();
                const existingTimestamps = new Set(currentNotifications.map(n => n.timestamp));
                const newNotifications = sharedRankings
                    .filter(item => item.timestamp && !existingTimestamps.has(item.timestamp))
                    .map(item => ({
                        id: `${item.timestamp}-${Math.random()}`,
                        title: item.title || 'Untitled Ranking',
                        from: item.from || 'Unknown',
                        to: item.to || 'Everyone',
                        message: item.message || `${item.from || 'Someone'} shared ranking: ${item.title || 'a ranking'}`,
                        timestamp: item.timestamp,
                    }));
                if (newNotifications.length > 0) {
                    const allNotifications = [...newNotifications, ...currentNotifications]
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .slice(0, 2);
                    setNotifications(allNotifications);
                    saveNotifications(allNotifications);
                }
            } catch (error) {
                console.error('Error fetching shared rankings:', error);
            }
        }

        fetchSharedRankings();
    }, [userName]);

    React.useEffect(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const currentPort = window.location.port;
        const socketPort = currentPort === '5173' || currentPort === '' ? '4000' : currentPort;
        const socketUrl = `${protocol}://${window.location.hostname}${socketPort ? `:${socketPort}` : ''}`;
        const websocket = new WebSocket(socketUrl);

        websocket.onopen = () => {
            setSocketConnected(true);
            setSocketError('');
            if (userName) {
                websocket.send(JSON.stringify({
                    type: 'register',
                    userName,
                }));
            }
        };

        websocket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data?.type === 'share-ranking') {
                    const incomingRanking = data.ranking || {};
                    const notificationItem = {
                        id: `${data.timestamp || new Date().toISOString()}-${Math.random()}`,
                        title: incomingRanking.title || 'Untitled Ranking',
                        from: data.from || 'Unknown',
                        to: data.to || 'Everyone',
                        message:
                            `${data.from || 'Someone'} shared ranking: ${incomingRanking.title || 'a ranking'}`,
                        timestamp: data.timestamp || new Date().toISOString(),
                    };

                    setNotifications((prevNotifications) => {
                        const newNots = [notificationItem, ...prevNotifications]
                            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .slice(0, 2);
                        saveNotifications(newNots);
                        return newNots;
                    });
                    
                    setSharedWithMe((prevShared) => [
                        {
                            id: incomingRanking.id || notificationItem.id,
                            from: data.from || 'Unknown',
                            title: incomingRanking.title || 'Untitled Ranking',
                            orderedItems: incomingRanking.orderedItems || [],
                            tiers: incomingRanking.tiers || { S: [], A: [], B: [], C: [], D: [] },
                        },
                        ...prevShared,
                    ]);
                }
            } catch (error) {
                console.error('Invalid WebSocket message:', error);
            }
        };

        websocket.onclose = () => {
            setSocketConnected(false);
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setSocketError('Unable to connect to live notifications.');
        };

        setSocket(websocket);

        return () => {
            websocket.close();
        };
    }, []);

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

    async function sendMsg() {
        if (!selectedUser || !rankingToShare) {
            return;
        }

        const payload = {
            type: 'share-ranking',
            from: userName || 'Unknown',
            to: selectedUser,
            ranking: rankingToShare,
            timestamp: new Date().toISOString(),
            message: `${userName || 'Someone'} sent ranking titled: ${rankingToShare.title || 'a ranking'} with you!`,
        };

        setSending(true);

        try {
            const response = await fetch('/api/post/shared', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                setSocketError(errorBody?.msg || 'Unable to share ranking.');
                setSending(false);
                return;
            }

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(payload));
            }

            setDisplayRanking(false);
        } catch (error) {
            console.error('Share request failed:', error);
            setSocketError('Unable to share ranking.');
            setSending(false);
        }
    }

  return (
   <main>
    <div className="notifications-panel">
        <div className="empty"></div>
        <div className="notification-header">
            <h2>Notifications: </h2>
        </div>
            {notifications.length === 0 ? (
                <div className="notification-empty">No notifications yet.</div>
            ) : (
                [...notifications]
                    .slice(0, 1)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((notification) => (
                        <div key={notification.id} className="notification-card">
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{new Date(notification.timestamp).toLocaleString()}</div>
                        </div>
                ))
            )}
            <div className="empty"></div>
        </div>
    <div className="container">
        <div className="share-other">
            <div className="display-ranking">
                {rankingToShare && displayRanking && (
                    <div className="ranking-display">
                        <p>Title: {rankingToShare.title}</p>
                        <div className="share-container">
                            <div className="share-order">
                                <ol>
                                    {(rankingToShare.orderedItems || []).map((item, index) => (
                                        <li key={index}><input className="list-input" value={item} readOnly/></li>
                                    ))}
                                </ol>
                            </div>
                            <div className="share-tier">
                                <table border="1" cellPadding="10" className="shared-tier-table">
                                    <tbody>
                                        {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                                            <tr key={tier}>
                                                <td style={{ backgroundColor: (rankingToShare.tierColors && rankingToShare.tierColors[tier]) || getDefaultColor(tier) }}>
                                                    {tier}
                                                </td>
                                                <td className="row">{((rankingToShare.tiers && rankingToShare.tiers[tier]) || []).join(', ')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <h1>Share</h1>
             <div className="search-container">
                <input className="search-bar" type="search" placeholder="Search by username" value={search} onChange={(e) => setSearch(e.target.value)}/>
            </div>
            <br />
            <div className="scroll-user">
                <table className="search-user" border="1"> 
                    {users.filter(user => user.userName.toLowerCase().includes(search.toLowerCase())).map((user) => (
                        <tr key={user.userName}>
                            <td className="search-data">
                                <button
                                    onClick={() => setSelectedUser(user.userName)}
                                    style={{
                                        backgroundColor: selectedUser === user.userName ? 'rgba(35, 33, 33, 0.4)' : 'initial',
                                    }}
                                    className="search-button"
                                >
                                    {user.userName}
                                </button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
            <br />
            {rankingToShare && displayRanking && selectedUser && (
            <button className="send" onClick={sendMsg}
            >Send</button>
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
            <div className="scroll-me">
                {sharedWithMe.length === 0 ? (
                    <div className="shared-empty">No rankings shared with you yet.</div>
                ) : (
                [...sharedWithMe]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((ranking) => (
                  <div key={ranking.id}>
                    <div className="ranking-display">
                            Title: {ranking.title}
                        <div className="share-container">
                            <div className="share-order">
                                <ol>
                                    {ranking.orderedItems.map((item) => (
                                      <li key={item}><input className="list-input" value={item} readOnly/></li>
                                    ))}
                                </ol>
                            </div>
                            <div className="share-tier">
                                <table border="1" cellPadding="10" className="shared-tier-table">
                                    <tbody>
                                        {['S', 'A', 'B', 'C', 'D'].map((tier) => (
                                          <tr key={`${ranking.id}-${tier}`}>
                                              <td style={{ backgroundColor: (ranking.tierColors && ranking.tierColors[tier]) || getDefaultColor(tier) }}>
                                                  {tier}
                                              </td>
                                              <td className="row">{(ranking.tiers[tier] || []).join(', ')}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        </div>
                    <div>Sent by {ranking.from || ranking.userName || 'Unknown'} on {ranking.timestamp ? new Date(ranking.timestamp).toLocaleDateString() : ranking.date || "Unknown Date"}</div>
                  </div>
                )))}
            </div>
        </div>
    </div>
</main>
  );
}