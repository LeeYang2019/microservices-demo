const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    //posts Service
    axios.post('http://localhost:4000/events', event);

    //Comments Service
    axios.post('http://localhost:4001/events', event);

    //query service
    axios.post('http://localhost:4002/events', event);

    res.send({status: 'OK'});
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));