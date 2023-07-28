const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is up and running. Please send POST request with userHandle to /leetcode');
});

// Use a route parameter to capture the username
app.get('/leetcode/:username', async (req, res) => {
    try {
        // Access the captured username from the params
        const userHandle = req.params.username;

        if (!userHandle) {
            return res.send({ statusCode: 400, status: "Error", message: "User Handle is required" });
        }

        console.log("this api hit");
        const url = `https://leetcode.com/${userHandle}`;
        const html = await axios.get(url);
        const $ = await cheerio.load(html.data);
        const details = $('.rating-contest-graph').prev().first().first().text().toString();
        let rating = details.slice(14, 19);
        rating = rating.replace(",", "");

        const data = {
            "userHandle": userHandle,
            "rating": rating,
        };

        return res.send({
            "statusCode": 200,
            "status": "OK",
            "message": "Success",
            "data": data
        });
    } catch (e) {
        return res.send({
            "statusCode": 200,
            "status": "ok",
            "message": "user not available",
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
