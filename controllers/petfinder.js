require("dotenv").config();

const clientId = process.env.PETFINDER_CLIENT_ID
const clientSecret = process.env.PETFINDER_CLIENT_SECRET
const TOKEN_URL = "https://api.petfinder.com/v2/oauth2/token"

async function getCats(req, res) {
    const { zipcode } = req.params
    const page = req.query.page || 1
    const limit = 20

    const API_URL = `https://api.petfinder.com/v2/animals?sort=distance&type=cat&location=${zipcode}&page=${page}&limit=${limit}`

    try {
        const fetch = (await import('node-fetch')).default

        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        })

        if (!tokenResponse.ok) throw new Error('No Token Found')
        
        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        const catResponse = await fetch(API_URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!catResponse.ok) throw new Error('No Data Found')

        const catData = await catResponse.json()
        const totalPages = catData.pagination.total_pages

        const roundedCats = catData.animals.map(cat => ({
            ...cat,
            distance: Math.round(cat.distance)
        }))

        return res.render("cats", { 
            cats: roundedCats, 
            zipcode: zipcode,
            currentPage: Number(page),
            totalPages: totalPages 
        })
    } catch (error) {
        console.error(error)
        res.render('cats', { error: error.message })
    }
}

async function getDogs(req, res) {
    const { zipcode } = req.params
    const page = req.query.page || 1
    const limit = 20

    const API_URL = `https://api.petfinder.com/v2/animals?sort=distance&type=dog&location=${zipcode}&page=${page}&limit=${limit}`

    try {
        const fetch = (await import('node-fetch')).default

        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        })

        if (!tokenResponse.ok) throw new Error('No Token Found')
        
        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        const dogResponse = await fetch(API_URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!dogResponse.ok) throw new Error('No Data Found')

        const dogData = await dogResponse.json()
        const totalPages = dogData.pagination.total_pages

        const roundedDogs = dogData.animals.map(dog => ({
            ...dog,
            distance: Math.round(dog.distance)
        }))

        return res.render("dogs", { 
            dogs: roundedDogs, 
            zipcode: zipcode,
            currentPage: Number(page),
            totalPages: totalPages  
        })
    } catch (error) {
        console.error(error)
        res.render('dogs', { error: error.message })
    }
}

async function getAnimal(req, res) {
    const id = req.params.id 

    console.log("id: " + id)

    const API_URL = `https://api.petfinder.com/v2/animals/${id}`

    console.log("API URL: " + API_URL)

    try {
        const fetch = (await import('node-fetch')).default

        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
        })

        if (!tokenResponse.ok) throw new Error('No Token Found')
        
        const tokenData = await tokenResponse.json()
        const accessToken = tokenData.access_token

        const animalResponse = await fetch(API_URL, {
            method: 'GET',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!animalResponse.ok) throw new Error('No Data Found')

        const animalData = await animalResponse.json()

        console.log("Data: ", animalData.animal)

        return res.render("animalInfo", { 
            animal: animalData.animal
        })

    } catch(error) {
        console.error(error)
        res.render('animalInfo', { error: error.message })
    }
}

module.exports = { getCats, getDogs, getAnimal }