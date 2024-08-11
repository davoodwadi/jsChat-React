// const axios = require('axios');

// exports.handler = async (event, context) => {
//   try {
//     // Make a POST request to the Render server
//     await axios.post('https://jschatapi.onrender.com/api/gpt/completions/stream', {}, {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'touch': 'yes',
//       }
//     });

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: 'touch success. data received from server using function.' }),
//     };
//   } catch (error) {
//     console.error('Error:', error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: 'Error in sending data to the server using function' }),
//     };
//   }
// };