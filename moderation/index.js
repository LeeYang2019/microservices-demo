const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body;

    try {
        if (type === 'CommentCreated') {
            const status = data.content.includes('orange') ? 'rejected' : 'approved';
            console.log('moderation, status: ', status);
    
            await axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content
                }
            });
        }
    } catch (error) {
        console.error(error.message);
    }

    res.send({});
});

app.post('/events', (req, res) => {
    console.log('Event Received: ', req.body.type);
    res.send({});
})

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
