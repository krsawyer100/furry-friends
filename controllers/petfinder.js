require("dotenv").config();
const petfinder = require("@petfinder/petfinder-js")

const clientId = process.env.PETFINDER_CLIENT_ID
const clientSecret = process.env.PETFINDER_CLIENT_SECRET

let client = new petfinder.Client({
    apiKey: clientId, secret: clientSecret
})

async function getCats(req, res) {
    const { isLoggedIn } = req.session
    const { zipcode } = req.params
    let page =  req.query.page || 1
    const limit = 20

    try {
        const catResult = await client.animal.search({
            type: "cat",
            location: zipcode,
            sort: "distance",
            page,
            limit
        })

        const totalPages = catResult.data.pagination.total_pages

        const catData = catResult.data.animals.map(function(cat) {
            return {
                ...cat,
                distance: Math.round(cat.distance)
            }
        })

        return res.render("cats", {
            cats: catData,
            zipcode: zipcode,
            currentPage: Number(page),
            totalPages: totalPages,
            isLoggedIn: isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching cats:", error);
        res.render('cats', { error: error.message });
    }
}
async function getDogs(req, res) {
    const { isLoggedIn } = req.session
    const { zipcode } = req.params
    let page =  req.query.page || 1
    const limit = 20

    try {
        const dogResult = await client.animal.search({
            type: "dog",
            location: zipcode,
            sort: "distance",
            page,
            limit
        })

        const totalPages = dogResult.data.pagination.total_pages

        const dogData = dogResult.data.animals.map(function(dog) {
            return {
                ...dog,
                distance: Math.round(dog.distance)
            }
        })

        return res.render("dogs", {
            dogs: dogData,
            zipcode: zipcode,
            currentPage: Number(page),
            totalPages: totalPages,
            isLoggedIn: isLoggedIn
        })
    } catch (error) {
        console.error("Error fetching dogs:", error);
        res.render('dogs', { error: error.message });
    }
}

async function getAnimal(req, res) {
    const { id } = req.params
    const { isLoggedIn } = req.session 

    try {

        const animalResult = await client.animal.show(id)

        // if (!animalResult.data.animal) throw new Error('No Animal Data Found')

        console.log("Data: ", animalResult.data.animal)

        return res.render("animalInfo", { 
            animal: animalResult.data.animal,
            isLoggedIn: isLoggedIn
        })

    } catch(error) {
        console.error(error)
        res.render('animalInfo', { error: error.message })
    }
}

module.exports = { getCats, getDogs, getAnimal }