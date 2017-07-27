import * as passport from 'passport';
import { Strategy as OpenIDStrategy } from 'passport-openid';

import { openid, secret, adminIdentifiers } from '../../config';

export default () => {
  passport.use(new OpenIDStrategy({
      returnURL: `${openid.realm}/rest/auth/callback`,
      realm: openid.realm,
      providerURL: openid.providerURL,
      stateless: openid.stateless,
      profile: openid.profile,
  }, (identifier, profile: any, cb) => {
      console.log(profile);
      const email = profile.emails.filter(email => (new RegExp(`@${openid.domain}$`)).test(email.value))[0];
      if (!email) {
          return cb(null, false, { message: `Not an @${openid.domain} email address.` });
      }

      const user: User = {
          id: email,
          displayName: profile.displayName,
          isAdmin: adminIdentifiers.indexOf(email) !== -1,
      };

    //   profile.isAdmin = profile.username === adminUsername;
      cb(null, user);
  }));
  return 'openid';
}