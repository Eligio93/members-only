const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      console.log(user)
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            console.log(user)
            if (!user) {
                return done(null, false, { message: "Incorrect mail" });
            };
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        };
    })
);


module.exports = passport

