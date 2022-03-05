module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.user) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.user) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};
