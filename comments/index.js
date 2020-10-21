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
    comments.push({id: commentId, content, status: 'pending'});

    //assign array back 
    commentsByPostID[req.params.id] = comments;

    //information is sent to the event bus
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    console.log('Event Received: ', req.body.type);
    const {type, data} = req.body;

    if (type === 'CommentModerated') {
        const {postId, id, status, content} = data;

        const comments = commentsByPostID[postId];
        const comment = comments.filter(comment => {
            return comment.id === id;
        });
        comment.status = status;
        console.log(status);

        //event bus
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }

    res.send({});
})

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));