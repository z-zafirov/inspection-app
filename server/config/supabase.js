// Supabase client configuration (uses HTTPS REST API - works through proxy)
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
require('dotenv').config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
// Use service_role key for backend (bypasses RLS for full database access)
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  process.exit(1);
}

// Configure proxy support for corporate networks
const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

// Custom fetch with proxy support
const customFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    agent
  });
};

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: customFetch
  }
});

console.log('✓ Supabase client initialized (HTTPS REST API via proxy)');

module.exports = supabase;
