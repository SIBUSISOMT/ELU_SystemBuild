import { propertyService } from './propertyService.js';

// Modal controls
const modal = document.getElementById('propertyModal');
const editModal = document.getElementById('editPropertyModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const closeEditModalButton = document.getElementById('closeEditModalButton');
const propertyForm = document.getElementById('propertyForm');
const editPropertyForm = document.getElementById('editPropertyForm');
const propertiesTable = document.getElementById('propertiesTable');

// Modal event listeners
openModalButton?.addEventListener('click', () => modal.style.display = 'flex');
closeModalButton?.addEventListener('click', () => {
    modal.style.display = 'none';
    propertyForm.reset();
});
closeEditModalButton?.addEventListener('click', () => {
    editModal.style.display = 'none';
    editPropertyForm.reset();
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        propertyForm?.reset();
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
        editPropertyForm?.reset();
    }
});

// Handle manage button click and data transfer
window.handleManage = async function(button) {
    const row = button.closest('tr');
    if (!row) {
        console.error('No row found for manage button');
        return;
    }
    
    const propertyData = {
        id: row.cells[0].textContent.trim(), // Store ID but don't display it
        propertyReference: row.cells[1].textContent.trim(),
        warmsNumber: row.cells[2].textContent.trim(),
        titleDeedNumber: row.cells[3].textContent.trim(),
        catchment: row.cells[4].textContent.trim() === 'N/A' ? '' : row.cells[4].textContent.trim(),
        subCatchment: row.cells[5].textContent.trim() === 'N/A' ? '' : row.cells[5].textContent.trim(),
        propertyAreaName: row.cells[6].textContent.trim(),
        propertyAreaCode: row.cells[7].textContent.trim(),
        farmSizeHA: row.cells[8].textContent.trim()
    };
    
    try {
        // Clear existing session storage first to prevent data persistence
        sessionStorage.clear();
        console.log('Session storage cleared');
        
        // Fetch detailed property info before navigation
        const propertyInfo = await propertyService.getPropertyInfo(propertyData.id);
        if (!propertyInfo) {
            throw new Error('No property info returned from server');
        }
        if (!propertyInfo) {
            throw new Error('No property info returned from server');
        }
        
        // Store both basic property data and detailed info
        sessionStorage.setItem('selectedProperty', JSON.stringify(propertyData));
        sessionStorage.setItem('propertyInfo', JSON.stringify(propertyInfo));
        console.log('Property data and info stored in session storage');
        
        // Add a flag to indicate fresh navigation
        sessionStorage.setItem('isNewNavigation', 'true');
        
        // Navigate to manage page
        window.location.href = "Manage.html";
    } catch (error) {
        console.error('Error in handleManage:', error);
        console.error('Failed for property ID:', propertyData.id);
        alert('Failed to fetch property details. Please try again.');
    }
};

// Fetch and display properties
async function fetchProperties() {
    try {
        const properties = await propertyService.getProperties();
        if (!propertiesTable) {
            console.error('Properties table not found');
            return;
        }

        console.log('Fetched properties:', properties);

        propertiesTable.innerHTML = properties.map(property => `
            <tr>
                <td style="display: none;">${property.id || ''}</td>
                <td>${property.propertyReference || ''}</td>
                <td>${property.warmsNumber || ''}</td>
                <td>${property.titleDeedNumber || ''}</td>
                <td>${property.catchment || 'N/A'}</td>
                <td>${property.subCatchment || property.subCatchmentName || 'N/A'}</td>
                <td>${property.propertyAreaName || ''}</td>
                <td>${property.propertyAreaCode || ''}</td>
                <td>${property.farmSizeHA || ''}</td>
                <td>
                    <button class="delete-btn" onclick="handleManage(this)">Manage</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Error fetching properties:', error);
        alert('Failed to fetch properties');
    }
}

// Handle form submissions
if (propertyForm) {
    propertyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(propertyForm);
        const propertyData = Object.fromEntries(formData.entries());
        
        try {
            console.log('Creating property with data:', propertyData);
            await propertyService.createProperty(propertyData);
            modal.style.display = 'none';
            propertyForm.reset();
            await fetchProperties();
        } catch (error) {
            console.error('Error creating property:', error);
            alert('Failed to create property');
        }
    });
}

if (editPropertyForm) {
    editPropertyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(editPropertyForm);
        const propertyData = Object.fromEntries(formData.entries());
        const propertyId = editPropertyForm.dataset.propertyId;
        
        try {
            console.log('Updating property with ID:', propertyId, 'and data:', propertyData);
            await propertyService.updateProperty(propertyId, propertyData);
            editModal.style.display = 'none';
            editPropertyForm.reset();
            await fetchProperties();
        } catch (error) {
            console.error('Error updating property:', error);
            alert('Failed to update property');
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing property registration page');
    
    // Handle property registration page
    if (propertiesTable) {
        fetchProperties();
    }
});