// src/utils/fetchData.js

export async function fetchData(endpoint, options = {}) {
    const baseUrl = 'https://v2.api.noroff.dev'; // Update if needed
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || response.statusText);
      }
  
      return data;
    } catch (error) {
      console.error('Fetch error:', error.message);
      throw error;
    }
  }

  export async function fetchVenues(query = "") {
    const url = `/holidaze/venues${query ? `?${query}` : ""}`;
  
    try {
      const data = await fetchData(url);
      return data;
    } catch (error) {
      console.error("Failed to fetch venues:", error.message);
      return null;
    }
  }
  
  