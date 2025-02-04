const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");

router.get("/", ({ session: { isLoggedIn } }, res) => {
  res.render("index", { isLoggedIn });
});

router.get("/login", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("login", { error: req.query.error });
});

router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("signup", { error: req.query.error });
});

router.get("/cats", async ({ session: { isLoggedIn } }, res) => {
  res.render("cats", { isLoggedIn })
})

router.get("/cats/:zipcode?", controllers.petfinder.getCats)

router.get("/dogs", async ({ session: { isLoggedIn } }, res) => {
  res.render("dogs", { isLoggedIn })
})

router.get("/dogs/:zipcode?", controllers.petfinder.getDogs)

router.get("/pet/:id", controllers.petfinder.getAnimal)

router.get("/favorites", controllers.favorite.getFavorites)

router.get("/private", checkAuth, ({ session: { isLoggedIn } }, res) => {
  res.render("protected", { isLoggedIn });
});

module.exports = router;
