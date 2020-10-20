const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const {randomBytes} = require('crypto');
const app = express();
app.use(cors());

//instruct app that we are expecting json data
app.use(bodyParser.json());

const commentsByPostID = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostID[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;

    // check if there are comments associated with id, else return empty array
    const comments = commentsByPostID[req.params.id] || [];

    //push comment into comments array
    comments.push({id: commentId, content});

    //assign array back 
    commentsByPostID[req.params.id] = comments;
    console.log(commentsByPostID[req.params.id]);

    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments);
});

app.post('/events', (req, res) => {
    console.log('Event Received: ', req.body.type);

    res.send({});
})

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));