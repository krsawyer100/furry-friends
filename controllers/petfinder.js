require("dotenv").config();
const petfinder = require("@petfinder/petfinder-js")
const { Favorite } = require("../models");

const clientId = process.env.PETFINDER_CLIENT_ID
const clientSecret = process.env.PETFINDER_CLIENT_SECRET

let client = new petfinder.Client({
    apiKey: clientId, secret: clientSecret
})

async function getCats(req, res) {
    const { isLoggedIn, userId } = req.session
    const { zipcode } = req.params
    let page =  req.query.page || 1
    const limit = 20

    const locationRes = await fetch(`https://api.zippopotam.us/us/${zipcode}`)
    const locationData = await locationRes.json()
    let cityState = `${locationData.places[0]['place name']}, ${locationData.places[0]['state abbreviation']}`

    try {
        const catResult = await client.animal.search({
            type: "cat",
            location: zipcode,
            sort: "distance",
            page,
            limit
        })

        const totalPages = catResult.data.pagination.total_pages

        const favorites = isLoggedIn ? await Favorite.findByUserId(userId) : []
        const favoriteIds = favorites.map(f => f.petId)

        const catData = catResult.data.animals.map(function(cat) {
            return {
                ...cat,
                distance: Math.round(cat.distance),
                isFavorite: favoriteIds.includes(String(cat.id))
            }
        })

        return res.render("cats", {
            cats: catData,
            zipcode,
            cityState,
            currentPage: Number(page),
            totalPages,
            isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching cats:", error);
        res.render('cats', { error: error.message });
    }
}
async function getDogs(req, res) {
    const { isLoggedIn, userId } = req.session
    const { zipcode } = req.params
    let page =  req.query.page || 1
    const limit = 20

    const locationRes = await fetch(`https://api.zippopotam.us/us/${zipcode}`)
    const locationData = await locationRes.json()
    let cityState = `${locationData.places[0]['place name']}, ${locationData.places[0]['state abbreviation']}`

    try {
        const dogResult = await client.animal.search({
            type: "dog",
            location: zipcode,
            sort: "distance",
            page,
            limit
        })

        const totalPages = dogResult.data.pagination.total_pages

        const favorites = isLoggedIn ? await Favorite.findByUserId(userId) : []
        const favoriteIds = favorites.map(f => f.petId)

        const dogData = dogResult.data.animals.map(function(dog) {
            return {
                ...dog,
                distance: Math.round(dog.distance),
                isFavorite: favoriteIds.includes(String(dog.id))
            }
        })

        return res.render("dogs", {
            dogs: dogData,
            zipcode,
            cityState,
            currentPage: Number(page),
            totalPages,
            isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching dogs:", error);
        res.render('dogs', { error: error.message });
    }
}

async function getAnimal(req, res) {
    const { id } = req.params
    const { isLoggedIn, userId } = req.session 

    try {

        const animalResult = await client.animal.show(id)
        const animal = animalResult.data.animal

        let isFavorite = false

        if (isLoggedIn) {
            const favorites = await Favorite.findByUserId(userId)
            isFavorite = favorites.some(fav => fav.petId === id)
        }

        return res.render("animalInfo", { 
            animal,
            isLoggedIn: isLoggedIn,
            isFavorite
        })

    } catch(error) {
        console.error(error)
        res.render('animalInfo', { error: error.message })
    }
}

module.exports = { getCats, getDogs, getAnimal }