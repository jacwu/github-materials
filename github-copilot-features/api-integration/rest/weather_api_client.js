// Weather API Client
// This is a starting template for a weather API integration
// Use GitHub Copilot to complete and enhance this implementation

class WeatherAPIClient {
  constructor(apiKey, baseUrl = 'https://api.weatherapi.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get current weather for a location
   * @param {string} location - City name, ZIP code, or coordinates
   * @returns {Promise<Object>} - Weather data
   */
  async getCurrentWeather(location) {
    // TODO: Implement this method to fetch current weather data
    // HINT: Use fetch or axios to make an API call to the /current.json endpoint
    // Don't forget to handle errors and add the API key as a query parameter
  }
  
  /**
   * Get weather forecast for a location
   * @param {string} location - City name, ZIP code, or coordinates
   * @param {number} days - Number of days to forecast (1-10)
   * @returns {Promise<Object>} - Forecast data
   */
  async getForecast(location, days = 3) {
    // TODO: Implement this method to fetch forecast data
    // HINT: Use the /forecast.json endpoint with days parameter
  }
  
  /**
   * Search for locations matching a query
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Matching locations
   */
  async searchLocations(query) {
    // TODO: Implement location search using the /search.json endpoint
  }
  
  /**
   * Get historical weather data
   * @param {string} location - City name, ZIP code, or coordinates
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} - Historical weather data
   */
  async getHistoricalWeather(location, date) {
    // TODO: Implement this method to fetch historical weather data
    // HINT: Use the /history.json endpoint
  }
  
  /**
   * Helper method to handle API errors
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} - Parsed response data
   * @throws {Error} - API error with status and message
   */
  async handleResponse(response) {
    // TODO: Implement error handling for API responses
    // Parse JSON response, check for error codes, and throw appropriate errors
  }
}

// Example usage (uncomment to test):
/*
const weatherClient = new WeatherAPIClient('your-api-key-here');

async function testWeatherAPI() {
  try {
    const currentWeather = await weatherClient.getCurrentWeather('London');
    console.log('Current weather:', currentWeather);
    
    const forecast = await weatherClient.getForecast('New York', 5);
    console.log('Forecast:', forecast);
    
    const locations = await weatherClient.searchLocations('San Fran');
    console.log('Locations:', locations);
    
    const history = await weatherClient.getHistoricalWeather('Tokyo', '2023-01-01');
    console.log('Historical weather:', history);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWeatherAPI();
*/

module.exports = WeatherAPIClient;