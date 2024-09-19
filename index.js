const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Route to serve the report data
const reportRouter = require('./routes/report.js');
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch report data
app.use('/api', reportRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

