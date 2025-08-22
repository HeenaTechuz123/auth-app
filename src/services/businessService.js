// Business service that connects to MySQL backend API
const API_BASE_URL = "http://localhost:5001/api";

export const businessService = {
  // Get all businesses with filtering
  getAllBusinesses: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.industry && filters.industry !== 'all') {
        queryParams.append('industry', filters.industry);
      }
      
      if (filters.location && filters.location !== 'all') {
        queryParams.append('location', filters.location);
      }
      
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      const url = `${API_BASE_URL}/businesses?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      return {
        data: [],
        total: 0,
        success: false,
        error: error.message
      };
    }
  },

  // Get business by ID
  getBusinessById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            data: null,
            success: false,
            error: 'Business not found'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching business:', error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  },

  // Add new business
  addBusiness: async (businessData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error adding business:', error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  },

  // Update business
  updateBusiness: async (id, businessData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          return {
            data: null,
            success: false,
            error: 'Business not found'
          };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating business:', error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  },

  // Delete business
  deleteBusiness: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          return {
            data: null,
            success: false,
            error: 'Business not found'
          };
        }
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting business:', error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  },

  // Get unique industries for filtering
  getIndustries: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/filters/industries`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching industries:', error);
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  },

  // Get unique locations for filtering
  getLocations: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/businesses/filters/locations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return {
        data: [],
        success: false,
        error: error.message
      };
    }
  }
};