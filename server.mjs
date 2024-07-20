import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the proxy server for Zoho Flow!');
});

// New endpoint to handle proxy requests to Zoho Flow
app.post('/proxy-zoho-flow', async (req, res) => {
    try {
        const response = await fetch('https://flow.zoho.eu/20071889412/flow/webhook/incoming?zapikey=1001.135d0547db270fb2604b6772f9c30ac1.e1c3971a221b2993f3d850b4b348471a&isdebug=false', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error proxying request to Zoho Flow:', error);
        res.status(500).json({ error: 'Error proxying request to Zoho Flow' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
