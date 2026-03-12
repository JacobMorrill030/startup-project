const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

function createRankingRecord(userName, ranking = {}) {
  const timestamp = new Date().toISOString();
  const savedId = ranking.savedId || ranking.id || uuid.v4();

  return {
    ...ranking,
    id: savedId,
    savedId,
    userName,
    from: userName,
    title: typeof ranking.title === 'string' && ranking.title.trim() ? ranking.title.trim() : 'Untitled Ranking',
    orderedItems: Array.isArray(ranking.orderedItems) ? ranking.orderedItems : [],
    tiers: ranking.tiers || { S: [], A: [], B: [], C: [], D: [] },
    savedAt: ranking.savedAt || timestamp,
  };
}

// The users are saved in memory and disappear whenever the service is restarted.
let users = [];
let rankings = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('userName', req.body.userName)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.userName, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ userName: user.userName });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const {userName, password} = req.body;
    if (!userName || !password) {
      return res.status(400).json({ ok: false, msg: 'Missing userName or password' });
    }
    const user = await findUser('userName', req.body.userName);
    if ( user && user.password && await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      return res.json({ userName: user.userName });
      return;
    }
    return res.status(401).json({ ok: false, msg: 'Invalid userName or password' });
  
  } catch (err) {
    console.log('login error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});


async function createUser(userName, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    userName: userName,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

// retieve the rankings for the authenticated user, sorted by saved date with the most recent first
apiRouter.get('/get/rankings', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  req.cookies[authCookieName];
  const userRankings = rankings.filter(r => r.userName === user.userName)
  .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  res.json(userRankings);
});

// post the ranking for the authenticated user, create a 
// new ranking if the user doesn't have one with the same title
apiRouter.post('/post/rankings', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const rankingToSave = createRankingRecord(user.userName, req.body);

  rankings = rankings.filter(
    (ranking) => !(ranking.id === rankingToSave.id && ranking.userName === user.userName)
  );
  rankings.unshift(rankingToSave);
  res.status(201).json(rankingToSave);
});

// deletes rankings with the specified id for the authentcated user
apiRouter.delete('/rankings/:id', verifyAuth, async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  const before = rankings.length;
  rankings = rankings.filter(r => !(r.id === req.params.id && r.userName === user.userName));

  if (rankings.length === before) {
    return res.status(404).json({ ok: false, msg: 'Ranking not found' });
  }
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
