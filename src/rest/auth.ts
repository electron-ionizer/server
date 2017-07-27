import * as express from 'express';
import * as passport from 'passport';
import * as session from 'express-session';

import initializeStrategy from './auth-strategy';
import { secret } from '../config';

const strategyName = initializeStrategy();

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

const router = express();

router.get('/login', passport.authenticate(strategyName));
router.get('/callback', passport.authenticate(strategyName, { failureRedirect: '/rest/auth/login' }), (req, res) => {
    res.redirect('/');
});
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

export const authenticateRouter = router;
export const setupApp = (app: express.Router) => {
    app.use(session({
        secret,
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
