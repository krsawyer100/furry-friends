require("dotenv").config();

const clientId = process.env.PETFINDER_CLIENT_ID
const clientSecret = process.env.PETFINDER_CLIENT_SECRET
const TOKEN_URL = "https://api.petfinder.com/v2/oauth2/token"

async function getCats(req, res) {
    const { zipcode } = req.params
    const API_URL = `https://api.petfinder.com/v2/animals?sort=distance&type=cat`

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

        const catResponse = await fetch(`${API_URL}&location=${zipcode}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!catResponse.ok) throw new Error('No Data Found')

        const catData = await catResponse.json()
        return res.render("cats", { cats: catData.animals, zipcode: zipcode })
    } catch (error) {
        console.error(error)
        res.render('cats', { error: error.message })
    }
}

async function getDogs(req, res) {
    const { zipcode } = req.params
    const API_URL = `https://api.petfinder.com/v2/animals?sort=distance&type=dog`

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

        const dogResponse = await fetch(`${API_URL}&location=${zipcode}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if (!dogResponse.ok) throw new Error('No Data Found')

        const dogData = await dogResponse.json()
        return res.render("dogs", { dogs: dogData.animals, zipcode: zipcode })
    } catch (error) {
        console.error(error)
        res.render('dogs', { error: error.message })
    }
}

module.exports = { getCats, getDogs }