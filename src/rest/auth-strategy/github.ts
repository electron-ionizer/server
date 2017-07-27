import * as passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';

import { github, secret, adminIdentifiers } from '../../config';

export default () => {
  passport.use(new GitHubStrategy({
      clientID: github.clientID,
      clientSecret: github.clientSecret,
      callbackURL: `${github.realm}/rest/auth/callback`,
  }, (accessToken, refreshToken, profile: any, cb) => {
      profile.isAdmin = adminIdentifiers.indexOf(profile.username) !== -1;
      cb(null, profile);
  }));
  return 'github';
}