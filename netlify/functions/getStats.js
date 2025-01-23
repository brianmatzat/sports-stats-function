const axios = require('axios');

module.exports.handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  try {
    // Ensure it's a POST request
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Parse the incoming request body
    const { dataType, teamId } = JSON.parse(event.body);
    
    // Validate inputs
    if (!dataType || !teamId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Configure API request
    const config = {
      headers: {
        'Authorization': `Bearer ${process.env.STATS_PERFORM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const STATS_PERFORM_API_URL = 'https://api.stats.com/v1';

    // Handle different data type requests
    let endpoint;
    switch(dataType) {
      case 'scores':
        endpoint = `/teams/${teamId}/scores`;
        break;
      case 'roster':
        endpoint = `/teams/${teamId}/roster`;
        break;
      case 'stats':
        endpoint = `/teams/${teamId}/stats`;
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid data type' }),
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        };
    }

    // Make request to Stats Perform API
    const response = await axios.get(`${STATS_PERFORM_API_URL}${endpoint}`, config);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('API Error:', error);

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'Unknown error occurred'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};