const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const axios = require('axios');
const app = express();
const {randomBytes} = require('crypto');

//tell the application we are expecting json object
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    //generate random number for id
    const id = randomBytes(4).toString('hex');
    
    //get req.body & create post
    const {title} = req.body;

    posts[id] = {
        id,
        title,
    };

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    })

    res.status(201).send(posts[id]);
})

app.post('/events', (req, res) => {
    console.log('Event Received: ', req.body.type);

    res.send({});
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));