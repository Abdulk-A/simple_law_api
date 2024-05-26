const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')

const PORT = 3000
const app = express()

app.get('/', (req,res) => {
    res.send("Hello world");
})

const baseURL = "https://dictionary.law.com/Default.aspx?letter="
const words = []

const capitalLetters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

capitalLetters.forEach(letter => {
    const letterURL = baseURL + letter
    axios.get(letterURL)
    .then((result) => {
        const html = result.data
        const $ = cheerio.load(html)
        
        $('.entry').each((index, element) => { //div.entry 

            const word = $(element).find('.word a').text().trim() //find each anchor within a class called .word and get the text
            const definition = $(element).find('.definition').text() //find all elements with .definition class and get the text

            words.push({ //create a json object and push it onto words
                word,
                definition
            })
        });        
    }).catch((err) => {
        console.log(err)
    });
})

app.get('/api/words', async (req,res) => {
    words.sort((a,b) => a.word.localeCompare(b.word));
    res.json(words);
})

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

