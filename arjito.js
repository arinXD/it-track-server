const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// Define your API routes here
app.get('/', (req, res) => {
    // Handle GET request for /api/users
    res.json({ message: 'GET request received for /' });
});
app.post('/api', (req, res) => {
    // Handle POST request for /api/users
    res.json({ message: 'POST request received for /' });
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});