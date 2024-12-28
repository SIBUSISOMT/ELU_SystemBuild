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
openModalButton.addEventListener('click', () => modal.style.display = 'flex');
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    propertyForm.reset();
});
closeEditModalButton.addEventListener('click', () => {
    editModal.style.display = 'none';
    editPropertyForm.reset();
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        propertyForm.reset();
    }
    if (event.target === editModal) {
        editModal.style.display = 'none';
        editPropertyForm.reset();
    }
});

// Fetch and display properties
async function fetchProperties() {
    try {
        const properties = await propertyService.getProperties();
        propertiesTable.innerHTML = properties.map(property => `
            <tr>
             
                <td>${property.propertyReference}</td>
                <td>${property.warmsNumber}</td>
                <td>${property.titleDeedNumber}</td>
                <td>${property.catchment}</td>
                <td>${property.subCatchmentName || property.subCatchment}</td>
                <td>${property.propertyAreaName}</td>
                <td>${property.propertyAreaCode}</td>
                <td>${property.farmSizeHA}</td>
                <td>
                    <button class="delete-btn" data-id="">Manage</button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', redirect);
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        alert('Failed to fetch properties');
    }

// Handle property form submission
propertyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(propertyForm);
    const propertyData = Object.fromEntries(formData.entries());
    
    try {
        await propertyService.createProperty(propertyData);
        modal.style.display = 'none';
        propertyForm.reset();
        await fetchProperties();
    } catch (error) {
        console.error('Error creating property:', error);
        alert('Failed to create property');
    }
});

// Handle edit property form submission
editPropertyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(editPropertyForm);
    const propertyData = Object.fromEntries(formData.entries());
    const propertyId = editPropertyForm.dataset.propertyId;
    
    try {
        await propertyService.updateProperty(propertyId, propertyData);
        editModal.style.display = 'none';
        editPropertyForm.reset();
        await fetchProperties();
    } catch (error) {
        console.error('Error updating property:', error);
        alert('Failed to update property');
    }
});



// Handle delete button click
async function redirect() {
   window.location.href = "Manage.html";
   
}
}
// Initial fetch of properties
fetchProperties();