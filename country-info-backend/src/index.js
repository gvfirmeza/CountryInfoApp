require('dotenv').config()
const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3000

// Get Available Countries
app.get('/api/countries', async (req, res) => {
    try {
        const response = await axios.get('https://date.nager.at/api/v3/AvailableCountries')
        res.json(response.data)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch countries' })
    }
})

// Get Country Info
app.get('/api/country/:code', async (req, res) => {
    const countryCode = req.params.code

    try {
        const countryResponse = await axios.get(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`)
        const countryData = countryResponse.data

        const populationResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/population', {
            country: countryData.commonName
        })
        const populationData = populationResponse.data.data.populationCounts

        const flagResponse = await axios.post('https://countriesnow.space/api/v0.1/countries/flag/images', {
            country: countryData.commonName
        })
        const flagUrl = flagResponse.data.data.flag

        const countryInfo = {
            name: countryData.commonName,
            borders: countryData.borders,
            populationHistory: populationData,
            flagUrl: flagUrl,
        }

        res.json(countryInfo)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch country information' })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})