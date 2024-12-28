const API_CONFIG = {
    BASE_URL: 'https://localhost:7030/api',
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

class PropertyService {
    constructor() {
        this.baseUrl = `${API_CONFIG.BASE_URL}/properties`;
    }

    async getProperties() {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'GET',
                headers: API_CONFIG.HEADERS,
                mode: 'cors'  // Added CORS mode
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch properties:', error);
            throw error;
        }
    }

    async createProperty(propertyData) {
        try {
            const payload = {
                propertyReference: propertyData.propertyReference,
                warmsNumber: propertyData.warmsNumber,
                titleDeedNumber: propertyData.titleDeedNumber,
                catchment: propertyData.catchment,
                subCatchment: propertyData.subCatchment,
                propertyAreaName: propertyData.propertyAreaName,
                propertyAreaCode: propertyData.propertyAreaCode,
                farmSizeHA: parseFloat(propertyData.farmSizeHA)
            };

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: API_CONFIG.HEADERS,
                mode: 'cors',  // Added CORS mode
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create property');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to create property:', error);
            throw error;
        }
    }

    async updateProperty(id, propertyData) {
        try {
            const payload = {
                id: id,
                propertyReference: propertyData.propertyReference,
                warmsNumber: propertyData.warmsNumber,
                titleDeedNumber: propertyData.titleDeedNumber,
                catchment: propertyData.catchment,
                subCatchment: propertyData.subCatchment,
                propertyAreaName: propertyData.propertyAreaName,
                propertyAreaCode: propertyData.propertyAreaCode,
                farmSizeHA: parseFloat(propertyData.farmSizeHA)
            };

            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: API_CONFIG.HEADERS,
                mode: 'cors',  // Added CORS mode
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update property');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to update property:', error);
            throw error;
        }
    }

    async deleteProperty(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: API_CONFIG.HEADERS,
                mode: 'cors'  // Added CORS mode
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete property');
            }
            return true;
        } catch (error) {
            console.error('Failed to delete property:', error);
            throw error;
        }
    }

    async getPropertyById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: API_CONFIG.HEADERS,
                mode: 'cors'  // Added CORS mode
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch property ${id}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch property ${id}:`, error);
            throw error;
        }
    }
}

export const propertyService = new PropertyService();