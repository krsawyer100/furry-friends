const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");

// admin login/logout
router.post("/login", controllers.auth.login);
router.get("/logout", controllers.auth.logout);
router.post("/signup", controllers.user.create);

router.get("/cats/:zipcode?page=X", controllers.petfinder.getCats)
router.get("/dogs/:zipcode?page=X", controllers.petfinder.getDogs)

router.get("/pet/:id", controllers.petfinder.getAnimal)


module.exports = router;
