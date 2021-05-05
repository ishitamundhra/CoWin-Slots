const express = require('express');
const path = require('path');
const { Console } = require('console');
const ejsMate = require('ejs-mate');
const fetch = require("node-fetch");
const app = express();
const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?";
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

let availableSlots;

let getinfo = async function (pin, date) {

    await fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pin + "&date=" + date, {
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then((out) => {
            const { sessions } = out;
            availableSlots = sessions;
            console.log(sessions);
        })
        .catch(err => console.error(err));
}

app.get('/form', async (req, res, next) => {
    return res.render("form");
});

app.post("/track", async (req, res, next) => {

    const { pin, date } = req.body;
    await getinfo(pin, date);
    res.render("slot", { availableSlots });
})

app.listen(3000, () => {
    console.log('Serving port 3000');
})