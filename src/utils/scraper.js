const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite(url) {
  try {
    // Fetch the website content
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into cheerio
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style').remove();

    // Get the text content and remove extra whitespace
    const rawText = $('body').text().replace(/\s+/g, ' ').trim();

    return rawText;
  } catch (error) {
    console.error('Error scraping website:', error.message);
    return null;
  }
}

// Example usage
const websiteUrl = 'https://example.com';
scrapeWebsite(websiteUrl)
  .then(text => {
    if (text) {
      console.log('Scraped content:');
      console.log(text);
    } else {
      console.log('Failed to scrape website.');
    }
  });