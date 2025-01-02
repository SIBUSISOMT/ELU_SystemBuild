const baseUrl = 'https://localhost:7030/api';

// Field mappings for all forms
const fieldMappings = {

    abstractionForm: {
        'Non_Irrigation_ELU_Abstraction_Period_Source': 'nonIrrigationELUAbstractionPeriodSource',
        'Non_Irrigation_WARMS_Abstraction_Period_Source': 'nonIrrigationWARMSAbstractionPeriodSource',
        'Non_Irrigation_ELU_Abstraction_Lawful_Volume': 'nonIrrigationELUAbstractionLawfulVolume',
        'Non_Irrigation_WARMS_Abstraction_Lawful_Volume': 'nonIrrigationWARMSAbstractionLawfulVolume',
        'Non_Irrigation_ELU_River_Abstraction': 'nonIrrigationELURiverAbstraction',
        'Non_Irrigation_WARMS_River_Abstraction': 'nonIrrigationWARMSRiverAbstraction'
    },
    storageForm: {
        'Storage_WARMS_Registered_Water_Course': 'storageWARMSRegisteredWaterCourse',
        'Storage_WARMS_Registered_Number_ofDams': 'storageWARMSRegisteredNumberOfDams',
        'Storage_WARMS_Registered_Volume': 'storageWARMSRegisteredVolume',
        'Storage_ELU_Registered_Water_Course': 'storageELURegisteredWaterCourse',
        'Storage_ELU_Registered_Number_ofDams': 'storageELURegisteredNumberOfDams',
        'Storage_Existing_Lawful_Volume': 'storageExistingLawfulVolume',
        'Storage_Qualifying_Period_Total_Storage_in_m3': 'storageQualifyingPeriodTotalStorageInM3'
    },
    sfraForm: {
        'SFRA_WARMS_Registered_Hectares': 'sfrawarmsRegisteredHectares',
        'SFRA_WARMS_Registered_Volume': 'sfrawarmsRegisteredVolume',
        'SFRA_Existing_Lawful_Use_Volume': 'sfraExistingLawfulUseVolume',
        'SFRA_Existing_Lawful_Use_Hectares': 'sfraExistingLawfulUseHectares'
    },
    waterUserForm: {
        'water_user_name': 'name',
        'water_user_surname': 'surname',
        'water_user_type': 'waterUserType',
        'water_user_email': 'email',
        'water_user_alt_email': 'alternativeEmail',
        'water_user_contact': 'contactNumber',
        'water_user_alt_contact': 'alternativeContactNumber'
    },
    propertyForm: {
        'titleDeedNumber': 'titleDeedNumber',
        'titleDeedHolderName': 'titleDeedHolderName',
        'titleDeedHolderSurname': 'titleDeedHolderSurname',
        'residentialAreaName': 'residentialAreaName',
        'residentialAreaCode': 'residentialAreaCode',
        'email': 'email',
        'alternativeEmail': 'alternativeEmail',
        'contactNumber': 'contactNumber',
        'alternativeContactNumber': 'alternativeContactNumber',
        'identityNumber': 'identityNumber',
        'catchment': 'catchment',
        'subCatchment': 'subCatchment'
    },
    irrigationForm: {
        'Irrigation_ELU_Volume_From_Source_Dam': 'irrigationELUVolumeFromSourceDam',
        'Irrigation_WARMS_Volume_From_Source_Dam': 'irrigationWARMSVolumeFromSourceDam',
        'Irrigation_ELU_Volume_From_Source_Borehole': 'irrigationELUVolumeFromSourceBorehole',
        'Irrigation_WARMS_Registered_Water': 'irrigationWARMSRegisteredWater',
        'Irrigation_ELU_Volume_From_Source_Spring': 'irrigationELUVolumeFromSourceSpring',
        'Irrigation_WARMS_Volume_From_WEIR': 'irrigationWARMSVolumeFromWEIR'
    }
};

// Form configuration
export const formConfig = {
    propertyForm: { 
        endpoint: 'updateProperty',
        successMessage: 'Property details updated successfully'
    },
    storageForm: { 
        endpoint: 'updateStorage',
        successMessage: 'Storage information updated successfully'
    },
    abstractionForm: { 
        endpoint: 'updateAbstraction',
        successMessage: 'Abstraction information updated successfully'
    },
    irrigationForm: { 
        endpoint: 'updateIrrigation',
        successMessage: 'Irrigation information updated successfully'
    },
    sfraForm: { 
        endpoint: 'updateSFRA',
        successMessage: 'SFRA details updated successfully'
    },
    waterUserForm: {
        endpoint: 'updateWaterUser',
        successMessage: 'Water user information updated successfully'
    }
};

// API Service
export const formApiService = {
    async updateProperty(propertyId, data) {
        try {
            const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
            const ownershipId = propertyInfo?.property?.propertyOwnerships?.[0]?.id;
            
            if (!ownershipId) {
                throw new Error('Property ownership ID not found');
            }

            const requestData = {
                id: ownershipId,
                propertyId: propertyId,
                ...data
            };

            console.log('Sending property data:', JSON.stringify(requestData, null, 2));
            const response = await fetch(`${baseUrl}/PropertyOwners/${ownershipId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update property: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    },

    async updateStorage(propertyId, data) {
        try {
            const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
            const storageId = propertyInfo?.property?.waterStorages?.[0]?.id;
            
            if (!storageId) {
                throw new Error('Storage ID not found');
            }

            const requestData = {
                id: storageId,
                propertyId: propertyId,
                ...data
            };

            console.log('Sending storage data:', JSON.stringify(requestData, null, 2));
            const response = await fetch(`${baseUrl}/WaterStorage/${storageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update storage: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating storage:', error);
            throw error;
        }
    },

    async updateSFRA(propertyId, data) {
        try {
            const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
            const sfraId = propertyInfo?.property?.sfrAs?.[0]?.id;
            
            if (!sfraId) {
                throw new Error('SFRA ID not found');
            }

            const requestData = {
                id: sfraId,
                propertyId: propertyId,
                ...data
            };

            console.log('Sending SFRA data:', JSON.stringify(requestData, null, 2));
            const response = await fetch(`${baseUrl}/SFRA/${sfraId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update SFRA: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating SFRA:', error);
            throw error;
        }
    },

    async updateWaterUser(propertyId, data) {
        try {
            const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
            const waterUserId = propertyInfo?.property?.registeredWaterUsers?.[0]?.id;
            
            if (!waterUserId) {
                throw new Error('Water User ID not found');
            }

            const requestData = {
                id: waterUserId,
                propertyId: propertyId,
                ...data
            };

            console.log('Sending water user data:', JSON.stringify(requestData, null, 2));
            const response = await fetch(`${baseUrl}/RegisteredWaterUsers/${waterUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update water user: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating water user:', error);
            throw error;
        }
    },


 
        async updateAbstraction(propertyId, data) {
            try {
                const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
                const abstractionId = propertyInfo?.property?.waterAbstractions?.[0]?.id;
                
                if (!abstractionId) {
                    throw new Error('Abstraction ID not found');
                }
    
                // Format data to match WaterAbstractionDTO
                const requestData = {
                    id: abstractionId,
                    propertyId: propertyId,
                    nonIrrigationELUAbstractionPeriodSource: data.nonIrrigationELUAbstractionPeriodSource.toString(),
                    nonIrrigationWARMSAbstractionPeriodSource: data.nonIrrigationWARMSAbstractionPeriodSource.toString(),
                    nonIrrigationELUAbstractionLawfulVolume: parseFloat(data.nonIrrigationELUAbstractionLawfulVolume),
                    nonIrrigationWARMSAbstractionLawfulVolume: parseFloat(data.nonIrrigationWARMSAbstractionLawfulVolume),
                    nonIrrigationELURiverAbstraction: data.nonIrrigationELURiverAbstraction.toString(),
                    nonIrrigationWARMSRiverAbstraction: data.nonIrrigationWARMSRiverAbstraction.toString()
                };
    
                console.log('Sending abstraction data:', JSON.stringify(requestData, null, 2));
                const response = await fetch(`${baseUrl}/WaterAbstractions/${abstractionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData)
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to update abstraction: ${errorText}`);
                }
                return await response.json();
            } catch (error) {
                console.error('Error updating abstraction:', error);
                throw error;
            }
        },

    async updateIrrigation(propertyId, data) {
        try {
            const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
            const irrigationId = propertyInfo?.property?.irrigations?.[0]?.id;
            
            if (!irrigationId) {
                throw new Error('Irrigation ID not found');
            }

            const requestData = {
                id: irrigationId,
                propertyId: propertyId,
                ...data
            };

            console.log('Sending irrigation data:', JSON.stringify(requestData, null, 2));
            const response = await fetch(`${baseUrl}/Irrigation/${irrigationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update irrigation: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating irrigation:', error);
            throw error;
        }
    }
};



// Utility function to prepare form data
export function prepareFormData(form) {
    const formData = new FormData(form);
    const rawData = Object.fromEntries(formData.entries());
    const mapping = fieldMappings[form.id];
    const data = {};

    console.log('Raw form data:', rawData);
    console.log('Using mapping:', mapping);

    if (mapping) {
        Object.entries(rawData).forEach(([key, value]) => {
            const mappedKey = mapping[key] || key;
            if (value !== '' && value !== undefined) {
                // Handle decimal fields for irrigation
                if (form.id === 'irrigationForm') {
                    data[mappedKey] = value !== '' ? parseFloat(value) : null;
                }
                // Handle mixed types for abstraction
                else if (form.id === 'abstractionForm') {
                    if (mappedKey.toLowerCase().includes('lawfulvolume')) {
                        data[mappedKey] = value !== '' ? parseFloat(value) : null;
                    } else {
                        data[mappedKey] = value.toString();
                    }
                }
                // Default handling for other forms
                else {
                    data[mappedKey] = value;
                }
            }
        });
    }

    console.log('Prepared form data:', data);
    return data;
}

// Function to reset form to readonly state
export function resetFormState(form) {
    const inputs = form.getElementsByTagName('input');
    Array.from(inputs).forEach(input => {
        input.readOnly = true;
    });

    const editBtn = form.parentElement.querySelector('.edit-btn i');
    if (editBtn) {
        editBtn.className = 'bx bx-edit';
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.style.display = 'none';
    }
}

// Main form submission handler setup
export function setupFormSubmissionHandlers() {
    Object.entries(formConfig).forEach(([formId, { endpoint, successMessage }]) => {
        const form = document.getElementById(formId);
        if (!form) {
            console.log(`Form not found: ${formId}`);
            return;
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            console.log(`Form submitted: ${formId}`);
            
            const storedData = JSON.parse(sessionStorage.getItem('selectedProperty'));
            console.log('Stored property data:', storedData);
            
            if (!storedData?.id) {
                console.error('No property ID found');
                alert('Error: Property ID not found');
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) {
                console.error('Submit button not found');
                return;
            }

            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Saving...';
            submitButton.disabled = true;

            try {
                const formData = prepareFormData(form);
                console.log(`Submitting ${endpoint} with data:`, formData);
                
                await formApiService[endpoint](storedData.id, formData);
                console.log(`${formId} updated successfully`);
                alert(successMessage);
                resetFormState(form);
            } catch (error) {
                console.error(`Error submitting ${formId}:`, error);
                alert(`Failed to save changes: ${error.message}`);
            } finally {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    });
}

// Enhanced error logging
function logApiError(error, endpoint, data) {
    console.error('API Error Details:', {
        timestamp: new Date().toISOString(),
        endpoint,
        error: {
            message: error.message,
            stack: error.stack
        },
        data: JSON.stringify(data, null, 2)
    });
}