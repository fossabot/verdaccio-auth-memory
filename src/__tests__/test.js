import Memory from '../index';

describe('Memory Auth', function() {
  describe('add_user', () => {
    it('should adds users with default configurartion', done => {
      const auth = new Memory({}, {});
      auth.adduser('test', 'secret', (err, user) => {
        expect(err).toBeNull();
        expect(user).toEqual('test');
        done();
      });
    });
    it('should check for user already ', done => {
      const config = {
        users: {
          test: {
            password: 'xxxx-yyyy-zzzz'
          }
        }
      };

      const appConfig = {
        max_users: 2
      };
      const auth = new Memory(config, appConfig);
      auth.adduser('test', 'secret', (err, user) => {
        expect(err).toBeNull();
        expect(user).toBeTruthy();
        done();
      });
    });
  });
  // describe('replace user', function() {
  //   before(function(done) {
  //     auth.adduser('test', 'secret', function(err, user) {
  //       assert.ifError(err);
  //       done();
  //     });
  //   });
  //   it('replaces password', function(done) {
  //     auth.adduser('test', 'new_secret', function(err, user) {
  //       assert.ifError(err);
  //       assert.equal(user, 'test');
  //       auth.authenticate('test', 'new_secret', function(err, groups) {
  //         assert.ifError(err);
  //         done();
  //       });
  //     });
  //   });
  // });
  // describe('#authenticate', function(done) {
  //   before(function(done) {
  //     auth.adduser('test', 'secret', function(err, user) {
  //       assert.ifError(err);
  //       done();
  //     });
  //   });
  //   it('validates existing users', function(done) {
  //     auth.authenticate('test', 'secret', function(err, groups) {
  //       assert.ifError(err);
  //       assert(groups);
  //       done();
  //     });
  //   });
  //   it('fails if wrong password', function(done) {
  //     auth.authenticate('test', 'no-secret', function(err, groups) {
  //       assert(err);
  //       done();
  //     });
  //   });
  //   it('fails if user doesnt exist', function(done) {
  //     auth.authenticate('john', 'secret', function(err, groups) {
  //       assert(err);
  //       done();
  //     });
  //   });
  // });
});
