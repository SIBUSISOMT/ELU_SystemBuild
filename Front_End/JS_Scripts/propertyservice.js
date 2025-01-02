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
                mode: 'cors',
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create property');
            }
    
            const createdProperty = await response.json();
            return createdProperty;
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


// In propertyService.js, enhance getPropertyInfo method
async getPropertyInfo(id) {
    try {
        console.log(`Fetching property info for ID: ${id}`);
        
        const response = await fetch(`${this.baseUrl}/${id}/info`, {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            mode: 'cors'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || `Failed to fetch property info for ${id}`);
        }

        const data = await response.json();
        console.log('Property Info Response:', {
            id: data.id,
            propertyReference: data.propertyReference,
            waterAbstractions: data.waterAbstractions?.length || 0,
            waterStorages: data.waterStorages?.length || 0,
            irrigations: data.irrigations?.length || 0,
            sfras: data.sfrAs?.length || 0,
            groupOwnerships: data.groupOwnerships?.length || 0,
            propertyOwnerships: data.propertyOwnerships?.length || 0,
            enterpriseOwnerships: data.enterpriseOwnerships?.length || 0,
            registeredWaterUsers: data.registeredWaterUsers?.length || 0
        });

        // Log detailed info for each data type if it exists
        if (data.waterAbstractions?.length) console.log('Water Abstractions:', data.waterAbstractions);
        if (data.waterStorages?.length) console.log('Water Storages:', data.waterStorages);
        if (data.irrigations?.length) console.log('Irrigations:', data.irrigations);
        if (data.sfrAs?.length) console.log('SFRAs:', data.sfrAs);
        if (data.groupOwnerships?.length) console.log('Group Ownerships:', data.groupOwnerships);
        if (data.propertyOwnerships?.length) console.log('Property Ownerships:', data.propertyOwnerships);
        if (data.enterpriseOwnerships?.length) console.log('Enterprise Ownerships:', data.enterpriseOwnerships);
        if (data.registeredWaterUsers?.length) console.log('Registered Water Users:', data.registeredWaterUsers);

        return data;
    } catch (error) {
        console.error(`Failed to fetch property info for ${id}:`, error);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}
}

export const propertyService = new PropertyService();