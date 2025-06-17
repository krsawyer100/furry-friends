require("dotenv").config();
const petfinder = require("@petfinder/petfinder-js")
const { Favorite } = require("../models");

const clientId = process.env.PETFINDER_CLIENT_ID
const clientSecret = process.env.PETFINDER_CLIENT_SECRET

let client = new petfinder.Client({
    apiKey: clientId, secret: clientSecret
})


async function addFavorite(req, res) {
    if(!req.session.isLoggedIn) return res.redirect("/login")

    const userId = req.session.userId
    const { petId } = req.params

    try {
        const petResponse = await client.animal.show(petId)
        const pet = petResponse.data.animal

        if (!pet) {
            return res.status(404).json({ error: "Pet not found" });
        }

        const name = pet.name
        const type = pet.type
        const age = pet.age
        const gender = pet.gender
        const size = pet.size

        await Favorite.createFavorite(userId, petId, name, type, age, gender, size)
        res.status(200).redirect("back")
    } catch(err) {
        console.error("Error adding favorite: ", err.message)
        res.status(500).send(err.message)
    }
}

async function getFavorites(req, res) {
    if (!req.session.isLoggedIn) return res.redirect("/login")
    
    try {
        const favorites = await Favorite.findByUserId(req.session.userId)
        res.render("favorites", { favorites, isLoggedIn: req.session.isLoggedIn })
    } catch(err) {
        console.error("error fetching favorites: ", err.message)
        res.status(500).send(err.message)
    }
}

async function removeFavorite(req, res) {
    if (!req.session.isLoggedIn) return res.redirect("/login")

    try {
        await Favorite.removeFavorite(req.session.userId, req.params.petId)
        res.status(200).redirect(req.get("Referrer"))
    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = { addFavorite, getFavorites, removeFavorite }