const express = require('express');
const bodyParser = require('body-parser');
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

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if (type === 'PostCreated') {

        //get id 
        const {id, title} = data;

        //create post with specified id
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentCreated') {
        //get id
        const {id, content, postId} = data;
        
        //get post with postId
        const post = posts[postId]; //j123k42
        
        //push content into post comments
        post.comments.push({id, content});
    }
    console.log(posts);
    res.send({});
});

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));