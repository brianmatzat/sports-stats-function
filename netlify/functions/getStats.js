// Fetch data from Stats Perform API
async function fetchStatsData(endpoint, apiKey) {
    try {
        const response = await fetch(`https://api.stats.com/v1/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching Stats Perform data:', error);
    }
}