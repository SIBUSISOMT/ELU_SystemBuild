import { setupFormSubmissionHandlers, resetFormState } from './formSubmissionHandlers.js';

// Utility function to get stored data from session storage
function getStoredData() {
    try {
        const propertyData = JSON.parse(sessionStorage.getItem('selectedProperty'));
        const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
        
        if (!propertyData || !propertyInfo) {
            throw new Error('Missing required data in session storage');
        }
        
        return { propertyData, propertyInfo };
    } catch (error) {
        console.error('Error retrieving stored data:', error);
        return null;
    }
}

function clearExistingForms() {
    console.log('Clearing existing forms...');
    
    // Remove the dynamic property form if it exists
    const existingPropertyForm = document.getElementById('dynamicPropertyForm');
    if (existingPropertyForm) {
        existingPropertyForm.remove();
        console.log('Removed existing property form');
    }

    // Hide all other forms
    const formContainers = {
        storage: document.getElementById('storageForm')?.closest('.form-container'),
        abstraction: document.getElementById('abstractionForm')?.closest('.form-container'),
        irrigation: document.getElementById('irrigationForm')?.closest('.form-container'),
        sfra: document.getElementById('sfraForm')?.closest('.form-container'),
        waterUser: document.getElementById('waterUserForm')?.closest('.form-container')
    };

    Object.values(formContainers).forEach(container => {
        if (container) {
            container.style.display = 'none';
            // Clear all input values
            const inputs = container.getElementsByTagName('input');
            Array.from(inputs).forEach(input => {
                input.value = '';
            });
        }
    });
}

function initializeReadOnlyForms() {
    console.log('Initializing readonly forms...');
    const forms = ['propertyForm', 'storageForm', 'abstractionForm', 'irrigationForm', 'sfraForm', 'waterUserForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            console.log(`Found form: ${formId}`);
            const inputs = form.getElementsByTagName('input');
            Array.from(inputs).forEach(input => {
                input.readOnly = true;
            });
        } else {
            console.warn(`Form not found: ${formId}`);
        }
    });
}



async function createAndDisplayPropertyForm(propertyData) {
    console.log('Creating and displaying property form with data:', propertyData);
    if (!propertyData) {
        console.error('No property data provided');
        return;
    }

    const formHTML = `
        <div class="form-container" id="dynamicPropertyForm">
            <div class="form-header">
                <h2 class="section-title">Registered Property</h2>
                <button type="button" class="edit-btn" onclick="toggleEdit('propertyForm')">
                    <i class='bx bx-edit'></i>
                </button>
            </div>
            <form id="propertyForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Property Reference</label>
                        <input type="text" name="propertyReference" required>
                    </div>
                    <div class="form-group">
                        <label>Warms Number</label>
                        <input type="text" name="warmsNumber" required>
                    </div>
                    <div class="form-group">
                        <label>Title Deed Number</label>
                        <input type="text" name="titleDeedNumber" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Catchment</label>
                        <input type="text" name="catchment" required>
                    </div>
                    <div class="form-group">
                        <label>Sub Catchment</label>
                        <input type="text" name="subCatchment" required>
                    </div>
                    <div class="form-group">
                        <label>Property Area Name</label>
                        <input type="text" name="propertyAreaName" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Property Area Code</label>
                        <input type="text" name="propertyAreaCode" required>
                    </div>
                    <div class="form-group">
                        <label>Farm Size (HA)</label>
                        <input type="number" step="0.01" name="farmSizeHA" required>
                    </div>
                </div>
            </form>
        </div>
    `;

    // Insert the form at the beginning of the main content
    const firstFormContainer = document.querySelector('.form-container');
    if (firstFormContainer) {
        firstFormContainer.insertAdjacentHTML('beforebegin', formHTML);
        console.log('Property form HTML inserted');

        // Populate the form
        const form = document.getElementById('propertyForm');
        if (form) {
            Object.keys(propertyData).forEach(key => {
                const input = form.querySelector(`input[name="${key}"]`);
                if (input) {
                    input.value = propertyData[key] || '';
                    input.readOnly = true;
                    console.log(`Populated property field ${key} with value ${propertyData[key]}`);
                }
            });
        }
    } else {
        console.error('No form container found to insert property form');
    }
}

function populateStorageForm(data) {
    console.log('Populating storage form with data:', data);
    if (!data) {
        console.log('No storage data available');
        return;
    }

    const container = document.getElementById('storageForm')?.closest('.form-container');
    if (!container) {
        console.error('Storage form container not found');
        return;
    }

    container.style.display = 'block';
    const form = container.querySelector('form');
    if (!form) {
        console.error('Storage form not found in container');
        return;
    }

    const fieldMapping = {
        'storageWARMSRegisteredWaterCourse': 'Storage_WARMS_Registered_Water_Course',
        'storageWARMSRegisteredNumberOfDams': 'Storage_WARMS_Registered_Number_ofDams',
        'storageWARMSRegisteredVolume': 'Storage_WARMS_Registered_Volume',
        'storageELURegisteredWaterCourse': 'Storage_ELU_Registered_Water_Course',
        'storageELURegisteredNumberOfDams': 'Storage_ELU_Registered_Number_ofDams',
        'storageExistingLawfulVolume': 'Storage_Existing_Lawful_Volume',
        'storageQualifyingPeriodTotalStorageInM3': 'Storage_Qualifying_Period_Total_Storage_in_m3'
    };

    Object.entries(fieldMapping).forEach(([apiField, formField]) => {
        const input = form.querySelector(`input[name="${formField}"]`);
        if (input && data[apiField] !== undefined) {
            input.value = data[apiField];
            input.readOnly = true;
            console.log(`Populated storage field ${formField} with value ${data[apiField]}`);
        }
    });
}

function populateWaterUserForm(data) {
    console.log('Populating water user form with data:', data);
    if (!data) {
        console.log('No water user data available');
        return;
    }

    const container = document.getElementById('waterUserForm')?.closest('.form-container');
    if (!container) {
        console.error('Water user form container not found');
        return;
    }

    container.style.display = 'block';
    const form = container.querySelector('form');
    if (!form) {
        console.error('Water user form not found in container');
        return;
    }

    const fieldMapping = {
        'name': 'water_user_name',
        'surname': 'water_user_surname',
        'waterUserType': 'water_user_type',
        'email': 'water_user_email',
        'alternativeEmail': 'water_user_alt_email',
        'contactNumber': 'water_user_contact',
        'alternativeContactNumber': 'water_user_alt_contact'
    };

    Object.entries(fieldMapping).forEach(([apiField, formField]) => {
        const input = form.querySelector(`input[name="${formField}"]`);
        if (input && data[apiField] !== undefined) {
            input.value = data[apiField];
            input.readOnly = true;
            console.log(`Populated water user field ${formField} with value ${data[apiField]}`);
        }
    });
}

function populateAbstractionForm(data) {
    console.log('Populating abstraction form with data:', data);
    if (!data) {
        console.log('No abstraction data available');
        return;
    }

    const container = document.getElementById('abstractionForm')?.closest('.form-container');
    if (!container) {
        console.error('Abstraction form container not found');
        return;
    }

    container.style.display = 'block';
    const form = container.querySelector('form');
    if (!form) {
        console.error('Abstraction form not found in container');
        return;
    }

    const fieldMapping = {
        'nonIrrigationELUAbstractionPeriodSource': 'Non_Irrigation_ELU_Abstraction_Period_Source',
        'nonIrrigationWARMSAbstractionPeriodSource': 'Non_Irrigation_WARMS_Abstraction_Period_Source',
        'nonIrrigationELUAbstractionLawfulVolume': 'Non_Irrigation_ELU_Abstraction_Lawful_Volume',
        'nonIrrigationWARMSAbstractionLawfulVolume': 'Non_Irrigation_WARMS_Abstraction_Lawful_Volume',
        'nonIrrigationELURiverAbstraction': 'Non_Irrigation_ELU_River_Abstraction',
        'nonIrrigationWARMSRiverAbstraction': 'Non_Irrigation_WARMS_River_Abstraction'
    };

    Object.entries(fieldMapping).forEach(([apiField, formField]) => {
        const input = form.querySelector(`input[name="${formField}"]`);
        if (input && data[apiField] !== undefined) {
            input.value = data[apiField];
            input.readOnly = true;
            console.log(`Populated abstraction field ${formField} with value ${data[apiField]}`);
        }
    });
}

function populateIrrigationForm(data) {
    console.log('Populating irrigation form with data:', data);
    if (!data) {
        console.log('No irrigation data available');
        return;
    }

    const container = document.getElementById('irrigationForm')?.closest('.form-container');
    if (!container) {
        console.error('Irrigation form container not found');
        return;
    }

    container.style.display = 'block';
    const form = container.querySelector('form');
    if (!form) {
        console.error('Irrigation form not found in container');
        return;
    }

    const fieldMapping = {
        'irrigationELUVolumeFromSourceDam': 'Irrigation_ELU_Volume_From_Source_Dam',
        'irrigationWARMSVolumeFromSourceDam': 'Irrigation_WARMS_Volume_From_Source_Dam',
        'irrigationELUVolumeFromSourceBorehole': 'Irrigation_ELU_Volume_From_Source_Borehole',
        'irrigationWARMSRegisteredWater': 'Irrigation_WARMS_Registered_Water',
        'irrigationELUVolumeFromSourceSpring': 'Irrigation_ELU_Volume_From_Source_Spring',
        'irrigationWARMSVolumeFromWEIR': 'Irrigation_WARMS_Volume_From_WEIR'
    };

    Object.entries(fieldMapping).forEach(([apiField, formField]) => {
        const input = form.querySelector(`input[name="${formField}"]`);
        if (input && data[apiField] !== undefined) {
            input.value = data[apiField];
            input.readOnly = true;
            console.log(`Populated irrigation field ${formField} with value ${data[apiField]}`);
        }
    });
}

function populateSFRAForm(data) {
    console.log('Populating SFRA form with data:', data);
    if (!data) {
        console.log('No SFRA data available');
        return;
    }

    const container = document.getElementById('sfraForm')?.closest('.form-container');
    if (!container) {
        console.error('SFRA form container not found');
        return;
    }

    container.style.display = 'block';
    const form = container.querySelector('form');
    if (!form) {
        console.error('SFRA form not found in container');
        return;
    }

    const fieldMapping = {
        'sfrawarmsRegisteredHectares': 'SFRA_WARMS_Registered_Hectares',
        'sfrawarmsRegisteredVolume': 'SFRA_WARMS_Registered_Volume',
        'sfraExistingLawfulUseVolume': 'SFRA_Existing_Lawful_Use_Volume',
        'sfraExistingLawfulUseHectares': 'SFRA_Existing_Lawful_Use_Hectares'
    };

    Object.entries(fieldMapping).forEach(([apiField, formField]) => {
        const input = form.querySelector(`input[name="${formField}"]`);
        if (input && data[apiField] !== undefined) {
            input.value = data[apiField];
            input.readOnly = true;
            console.log(`Populated SFRA field ${formField} with value ${data[apiField]}`);
        }
    });
}

async function initializeManagePage() {
    console.log('Initializing manage page...');
    
    try {
        const storedData = getStoredData();
        if (!storedData) {
            console.error('No stored data found');
            return;
        }

        const { propertyData, propertyInfo } = storedData;
        const property = propertyInfo.property;

        if (!property) {
            console.error('Property information not found in the data');
            return;
        }

        console.log('Retrieved property data:', propertyData);
        console.log('Retrieved property info:', propertyInfo);

        // Create and populate forms
        await createAndDisplayPropertyForm(propertyData);

        // Add condition checks for all possible data

        if (property.waterStorages?.length > 0) {
            populateStorageForm(property.waterStorages[0]);
        }

        if (property.waterAbstractions?.length > 0) {
            populateAbstractionForm(property.waterAbstractions[0]);
        }

        if (property.irrigations?.length > 0) {
            populateIrrigationForm(property.irrigations[0]);
        }

        if (property.sfrAs?.length > 0) {
            populateSFRAForm(property.sfrAs[0]);
        }

        if (property.registeredWaterUsers?.length > 0) {
            populateWaterUserForm(property.registeredWaterUsers[0]);
        }

        // Initialize read-only state after all forms are populated
        initializeReadOnlyForms();

    } catch (error) {
        console.error('Error initializing manage page:', error);
        throw error;
    }
}

// Modal close function
window.closeModal = function(modalId) {
    console.log(`Attempting to close modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Toggle edit function
window.toggleEdit = function(formId) {
    console.log(`Toggling edit mode for form: ${formId}`);
    const form = document.getElementById(formId);
    if (!form) {
        console.error(`Form not found: ${formId}`);
        return;
    }
    
    const inputs = form.getElementsByTagName('input');
    const editBtn = form.parentElement.querySelector('.edit-btn i');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    let isCurrentlyReadonly = true;
    for(let input of inputs) {
        if(input.name !== 'Property_Reference' && input.name !== 'property_reference') {
            isCurrentlyReadonly = input.readOnly;
            break;
        }
    }

    for(let input of inputs) {
        if(input.name !== 'Property_Reference' && input.name !== 'property_reference') {
            input.readOnly = !isCurrentlyReadonly;
        }
    }
    
    // Toggle edit button icon
    editBtn.className = isCurrentlyReadonly ? 'bx bx-save' : 'bx bx-edit';
    
    // Show/hide submit button
    if (submitBtn) {
        submitBtn.style.display = isCurrentlyReadonly ? 'block' : 'none';
    }
    
    console.log(`Edit mode toggled. Readonly: ${!isCurrentlyReadonly}`);
}



// Update the window.onload event handler
window.addEventListener('load', async () => {
    console.log('Window loaded, initializing...');
    clearExistingForms();
    
    try {
        await initializeManagePage();
        setupFormSubmissionHandlers(); // Add this line to initialize form handlers
    } catch (error) {
        console.error('Failed to initialize manage page:', error);
    }
});




// Initialize page with a single event listener
window.addEventListener('load', async () => {
    console.log('Window loaded, initializing...');
    clearExistingForms();  // Clear forms first
    
    try {
        await initializeManagePage();
    } catch (error) {
        console.error('Failed to initialize manage page:', error);
    }
});

// Event listeners for form submissions
const forms = ['propertyForm', 'storageForm', 'abstractionForm', 'irrigationForm', 'sfraForm'];
forms.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log(`Form submitted: ${formId}`);
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send the data to your backend
                console.log(`Submitting ${formId} data:`, data);
                // Add your API call here
                
                // Reset form to readonly state after successful submission
                const inputs = form.getElementsByTagName('input');
                for(let input of inputs) {
                    input.readOnly = true;
                }
                
                // Reset edit button
                const editBtn = form.parentElement.querySelector('.edit-btn i');
                if (editBtn) {
                    editBtn.className = 'bx bx-edit';
                }
                
            } catch (error) {
                console.error(`Error submitting ${formId}:`, error);
                alert('Failed to save changes');
            }
        });
    }
});