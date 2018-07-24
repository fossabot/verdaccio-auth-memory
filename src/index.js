// @flow
/**
 * Verdaccio auth memory
 */
export default class Memory {
  // flow types
  config: Object;
  verdaccioConfig: Object;
  users: Object;
  max_users: number;
  constructor(
    config: { users: Object },
    verdaccioConfig: { max_users: number }
  ) {
    this.config = config;
    this.verdaccioConfig = verdaccioConfig;
    this.users = config.users || {};
    this.max_users = verdaccioConfig.max_users || Infinity;
  }

  authenticate(user: string, password: string, done: Function): Function {
    const { users } = this;
    const userCredentials = users[user];

    if (!userCredentials) {
      return done(null, false);
    }

    if (password !== userCredentials.password) {
      const error = Error('Unauthorized access');
      // $FlowFixMe
      error.status = 401;
      return done(error);
    }

    // authentication succeeded!
    // return all usergroups this user has access to;
    return done(null, [user]);
  }

  adduser(user: Object, password: string, done: Function): Function {
    const { users, max_users } = this;
    if (users[user]) {
      return done(null, true);
    }

    if (max_users && Object.keys(users).length >= max_users) {
      let error = Error('maximum amount of users reached');
      // $FlowFixMe
      error.status = 409;
      return done(error);
    }

    this.users[user] = { name: user, password };

    return done(null, user);
  }

  allow_access(user: Object, pkg: Object, cb: Function): Function {
    if (pkg.access.includes('$all') || pkg.access.includes('$anonymous')) {
      return cb(null, true);
    }

    const { name } = user;

    if (!name) {
      const error = Error('not allowed to access package');
      // $FlowFixMe
      error.status = 403;
      return cb(error);
    }

    if (pkg.access.includes(name) || pkg.access.includes('$authenticated')) {
      return cb(null, true);
    }

    const error = Error('not allowed to access package');
    // $FlowFixMe
    error.status = 403;
    return cb(error);
  }

  allow_publish(user: Object, pkg: Object, cb: Function) {
    if (pkg.publish.includes('$all') || pkg.publish.includes('$anonymous')) {
      return cb(null, true);
    }

    const { name } = user;

    if (!name) {
      const error = Error('not allowed to publish package');
      // $FlowFixMe
      error.status = 403;
      return cb(error);
    }

    if (pkg.publish.includes(name) || pkg.publish.includes('$authenticated')) {
      return cb(null, true);
    }

    const error = Error('not allowed to publish package');
    // $FlowFixMe
    error.status = 403;
    return cb(error);
  }
}
