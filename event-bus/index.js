const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    console.log('Event received: ', req.body.type);
    console.log("Status: ", req.body.data.status);
    const event = req.body;

    events.push(event);

    try {
        //posts Service
        axios.post('http://localhost:4000/events', event);

        //Comments Service
        axios.post('http://localhost:4001/events', event);

        //query service
        axios.post('http://localhost:4002/events', event);

        //moderation service
        axios.post('http://localhost:4003/events', event);

    } catch (error) {
        console.error(error.message);        
    }
    res.send({status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(events);
})

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));