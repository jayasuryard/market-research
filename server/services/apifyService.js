import { ApifyClient } from 'apify-client';

/**
 * Apify Service
 * Wrapper for Apify actor runs used in market research pipelines.
 * Falls back gracefully to [] when APIFY_API_KEY is not set or actor fails.
 */

let client = null;

function getClient() {
  if (!client && process.env.APIFY_API_KEY) {
    client = new ApifyClient({ token: process.env.APIFY_API_KEY });
  }
  return client;
}

/**
 * Run the Apify Google Search Scraper actor.
 * @param {string|string[]} queries  - Search query or array of queries
 * @param {number} maxResults        - Results per query page (default 10)
 * @returns {Array} Flat array of organic result objects { title, url, description }
 */
export async function googleSearch(queries, maxResults = 10) {
  const c = getClient();
  if (!c) {
    console.warn('[Apify] APIFY_API_KEY not set — skipping Google search');
    return [];
  }

  const queryStr = Array.isArray(queries) ? queries.join('\n') : queries;

  try {
    const run = await c.actor('apify/google-search-scraper').call({
      queries: queryStr,
      maxPagesPerQuery: 1,
      resultsPerPage: maxResults,
      countryCode: 'us',
      languageCode: 'en',
    });

    const { items } = await c.dataset(run.defaultDatasetId).listItems();

    // Each item has organicResults array; flatten all pages
    return items.flatMap(page =>
      (page.organicResults || []).map(r => ({
        title: r.title || '',
        url: r.url || '',
        description: r.description || r.snippet || '',
      }))
    );
  } catch (err) {
    console.error('[Apify] Google search failed:', err.message);
    return [];
  }
}

/**
 * Search Reddit discussions via Google (site:reddit.com).
 * @param {string} topic  - Topic or keywords to find Reddit threads about
 * @param {number} max    - Max results
 * @returns {Array}
 */
export async function searchReddit(topic, max = 15) {
  return googleSearch(`site:reddit.com ${topic}`, max);
}

/**
 * Search for product reviews and complaints.
 * @param {string} productCategory  - e.g., "time tracking software"
 * @param {number} max
 * @returns {Array}
 */
export async function searchReviews(productCategory, max = 10) {
  const queries = [
    `${productCategory} reviews problems complaints`,
    `site:g2.com ${productCategory} reviews`,
    `site:reddit.com ${productCategory} alternative`,
  ].join('\n');
  return googleSearch(queries, max);
}
