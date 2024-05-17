// Import the axios module
const axios = require('axios');

// Define the URL for the GET request
const url = 'https://jsonplaceholder.typicode.com/posts/1';

// Use axios to make the GET request
axios.get(url)
    .then(response => {
        // Handle the successful response
        console.log('Data:', response.data);
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
    });
