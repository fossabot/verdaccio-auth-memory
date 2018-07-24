/**
 * Verdaccio auth memory
 */
export default class Memory {
  constructor(config, appOptions) {
    this.config = config;
    this.appOptions = appOptions;
    this.users = config.users || {};
    this.max_users = appOptions.max_users || Infinity;
  }

  authenticate(user, password, done) {
    const { users } = this;
    const userCredentials = users[user];

    if (!userCredentials) {
      return done(null, false);
    }

    if (password !== userCredentials.password) {
      const error = Error('Unauthorized access');
      error.status = 401;
      return done(error);
    }

    // authentication succeeded!
    // return all usergroups this user has access to;
    return done(null, [user]);
  }

  adduser(user, password, done) {
    const { users, max_users } = this;
    if (users[user]) {
      return done(null, true);
    }

    if (max_users && Object.keys(users).length >= max_users) {
      let error = Error('maximum amount of users reached');
      error.status = 409;
      return done(error);
    }

    this.users[user] = { name: user, password };

    done(null, user);
  }

  allow_access(user, pkg, cb) {
    if (pkg.access.includes('$all') || pkg.access.includes('$anonymous')) {
      return cb(null, true);
    }

    const { name } = user;

    if (!name) {
      const error = Error('not allowed to access package');
      error.status = 403;
      return cb(error);
    }

    if (pkg.access.includes(name) || pkg.access.includes('$authenticated')) {
      return cb(null, true);
    }

    const error = Error('not allowed to access package');
    error.status = 403;
    return cb(error);
  }

  allow_publish(user, pkg, cb) {
    if (pkg.publish.includes('$all') || pkg.publish.includes('$anonymous')) {
      return cb(null, true);
    }

    const { name } = user;

    if (!name) {
      const error = Error('not allowed to publish package');
      error.status = 403;
      return cb(error);
    }

    if (pkg.publish.includes(name) || pkg.publish.includes('$authenticated')) {
      return cb(null, true);
    }

    const error = Error('not allowed to publish package');
    error.status = 403;
    return cb(error);
  }
}
