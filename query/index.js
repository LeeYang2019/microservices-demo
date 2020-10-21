const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

//OUR STRUCTURE
// posts = {
//     'j123j42': {
//         id: 'j123j42',
//         title: 'post title',
//         comments: [
//             {id: 'klj3kl', content: 'comment!'}
//         ]
//     }
// }

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {

        //get id 
        const {id, title} = data;

        //create post with specified id
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentCreated') {
        //get id
        const {id, content, postId, status} = data;
        
        //get post with postId
        const post = posts[postId]; //j123k42
        
        //push content into post comments
        post.comments.push({id, content, status});
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {return comment.id === id});
        comment.status = status;
        comment.content = content;
        console.log(comment.status);
        console.log(comment.content);
    }
};

app.get('/posts', (req, res) => {
    console.log(posts);
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log('Event Received: ', req.body.type);
    const {type, data} = req.body;

    try {
        handleEvent(type, data);    
    } catch (error) {
        console.error(error.message);
    }

    res.send({});
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, async () => {
    console.log(`listening on port ${PORT}`);

    try {
        const res = await axios.get('http://localhost:4005/events');

        for (let event of res.data) {
            console.log('processing event: ', event.type);
            handleEvent(event.type, event.data);
        }    
        
    } catch (error) {
        console.error(error.message);
    }
    
});