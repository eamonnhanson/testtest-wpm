import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
    origin: 'https://www.planteenboom.nu', // Replace with your Shopify store domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.send('Welkom bij de testtest formulierverzendingsserver!');
});

// Proxy endpoint for Zoho Flow
app.post('/proxy-zoho-flow', async (req, res) => {
    const payload = req.body;

    try {
        const response = await fetch('https://flow.zoho.eu/20071889412/flow/webhook/incoming?zapikey=1001.135d0547db270fb2604b6772f9c30ac1.e1c3971a221b2993f3d850b4b348471a&isdebug=false', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error('Error sending data to Zoho Creator: ' + response.statusText);
        }

        res.json(data);
    } catch (error) {
        console.error('Error sending data to Zoho Creator:', error);
        res.status(500).json({ error: 'Error sending data to Zoho Creator' });
    }
});

app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
