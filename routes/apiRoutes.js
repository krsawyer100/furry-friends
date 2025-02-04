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

router.post("/favorites/:petId", controllers.favorite.addFavorite)
router.get("/favorites", controllers.favorite.getFavorites)
router.delete("/favorites/:petId", controllers.favorite.removeFavorite)

module.exports = router;
