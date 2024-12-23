const BASE_URL = 'http://localhost:3000';

// Function to fetch latest property reference
async function fetchLatestPropertyReference() {
  try {
    const response = await fetch(`${BASE_URL}/api/properties/latest-reference`);
    if (!response.ok) throw new Error('Failed to fetch latest property reference');
    const data = await response.json();
    return data.property_reference;
  } catch (error) {
    console.error('Error fetching latest property reference:', error);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch property owners data from the backend and populate the table
  try {
    const response = await fetch(`${BASE_URL}/api/property-owners`);
    if (!response.ok) throw new Error('Network response was not ok');
    const propertyOwners = await response.json();
    
    const tableBody = document.getElementById('propertyOwnersTable');
    if (!tableBody) {
      console.error('Table body element not found');
      return;
    }
    
    tableBody.innerHTML = ''; // Clear existing rows
    
    propertyOwners.forEach(owner => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${owner.owner_id}</td>
        <td>${owner.property_reference}</td>
        <td>${owner.title_deed_number}</td>
        <td>${owner.title_deed_holder_name}</td>
        <td>${owner.title_deed_holder_surname}</td>
        <td>${owner.id_number}</td>
        <td>${owner.catchment}</td>
        <td>${owner.sub_catchment}</td>
        <td>${owner.residential_area_name}</td>
        <td>${owner.residential_area_code}</td>
        <td>${owner.email}</td>
        <td>${owner.alternate_email || 'N/A'}</td>
        <td>${owner.contact_number}</td>
        <td>${owner.alternate_contact_number || 'N/A'}</td>
        <td>
          <button class="btn-edit" onclick="editPropertyOwner(${owner.owner_id})">Edit</button>
          <button class="btn-delete" onclick="deletePropertyOwner(${owner.owner_id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching property owners:', error);
    const tableBody = document.getElementById('propertyOwnersTable');
    if (tableBody) {
      tableBody.innerHTML = '<tr><td colspan="15">Error loading property owners. Please try again later.</td></tr>';
    }
  }

  // Handle 'Add Property Owner' button click
  const addButton = document.getElementById('toggleAddFormButton');
  if (addButton) {
    addButton.addEventListener('click', () => {
      showIndividualPropertyOwnerForm();
    });
  }


  const typeButton = document.getElementById('selectOwnershipTypeButton');
  if (typeButton) {
    typeButton.addEventListener('click', () => {
      const selectedType = document.getElementById('ownershipTypeSelect').value;
      showAddPropertyOwnerForm(selectedType);
    });
  }

  // Close modals when clicking the close icon
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
      const modal = document.getElementById('addPropertyOwnerModal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Add Property Owner Form Submission
  const form = document.getElementById('addPropertyOwnerForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      //  updated propertyOwnerData object:
const propertyOwnerData = {
  catchment: document.getElementById('catchment').value,
  subCatchment: document.getElementById('subCatchment').value,
  ownerName: document.getElementById('ownerName').value,
  ownerSurname: document.getElementById('ownerSurname').value,
  propertyReference: document.getElementById('ownerReference').value,
  titleDeedNumber: document.getElementById('TitleDeedNumber').value,
  residentialAreaName: document.getElementById('ResidentialAreaName').value,
  residentialAreaCode: document.getElementById('ResidentialAreaCode').value,
  idNumber: document.getElementById('IDNumber').value,
  email: document.getElementById('Email').value,
  alternateEmail: document.getElementById('AlternateEmail').value || null,
  contactNumber: document.getElementById('ContactNumber').value,
  alternateContactNumber: document.getElementById('ConfirmContactNumber').value || null
};

  

      try {
        const response = await fetch(`${BASE_URL}/api/property-owners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(propertyOwnerData)
        });

        if (response.ok) {
          const newOwner = await response.json();
          alert('Property Owner Added Successfully!');
          
          const modal = document.getElementById('addPropertyOwnerModal');
          if (modal) {
            modal.style.display = 'none';
          }
          location.reload();
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error adding property owner:', error);
        alert('Failed to add property owner');
      }
    });
  }
});

// Function to show the Add Property Owner Form
async function showIndividualPropertyOwnerForm() {
  try {
    const latestPropertyReference = await fetchLatestPropertyReference();
    
    const form = document.getElementById('addPropertyOwnerForm');
    if (!form) {
      console.error('Form element not found');
      return;
    }

    form.innerHTML = ` 
      <h2>Add Individual Property Owner</h2>
      <label for="ownerReference">Property Reference:</label>
      <input type="text" id="ownerReference" value="${latestPropertyReference || ''}" readonly 
             style="background-color: #f0f0f0;"> <br>
      
      <label for="catchment">Select Catchment:</label>
      <select id="catchment" required>
        <option value="">--None--</option>
        <option value="Komati">Komati</option>
        <option value="Usuthu">Usuthu</option>
      </select> <br>
      
      <label for="subCatchment">Select Sub-Catchment:</label>
      <select id="subCatchment" required>
        <option value="">--None--</option>
        <option value="White River">White River</option>
        <option value="Sabie">Sabie</option>
        <option value="Upper Komati">Upper Komati</option>
        <option value="Crocodile">Crocodile</option>
      </select> <br>
      
      <label for="ownerName">Name:</label>
      <input type="text" id="ownerName" required> <br>
      
      <label for="ownerSurname">Surname:</label>
      <input type="text" id="ownerSurname" required> <br>
      
      <label for="TitleDeedNumber">Title Deed Number:</label>
      <input type="text" id="TitleDeedNumber" required> <br>
      
      <label for="ResidentialAreaName">Residential Area Name:</label>
      <input type="text" id="ResidentialAreaName" required> <br>
      
      <label for="ResidentialAreaCode">Residential Area Code:</label>
      <input type="text" id="ResidentialAreaCode" required> <br>
      
      <label for="IDNumber">Identity Number:</label>
      <input type="text" id="IDNumber" required> <br>
      
      <label for="Email">Email:</label>
      <input type="email" id="Email" required> <br>
      
      <label for="AlternateEmail">Alternate Email:</label>
      <input type="email" id="AlternateEmail"> <br>
      
      <label for="ContactNumber">Contact Number:</label>
      <input type="text" id="ContactNumber" required> <br>
      
      <label for="ConfirmContactNumber">Alternate Contact Number:</label>
      <input type="text" id="ConfirmContactNumber"> <br>
      
      <button type="submit">Add Property Owner</button>
    `;
  
    const modal = document.getElementById('addPropertyOwnerModal');
    if (modal) {
      modal.style.display = 'block';
    }
  } catch (error) {
    console.error('Error showing property owner form:', error);
    alert('Error loading the form. Please try again.');
  }
}

// Function to edit property owner
async function editPropertyOwner(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/property-owners/${id}`);
    const owner = await response.json();
    
    // Populate edit form or open edit modal with owner details
    alert(`Edit functionality for owner ${id} to be implemented`);
  } catch (error) {
    console.error('Error fetching property owner details:', error);
  }
}

// Function to delete property owner
async function deletePropertyOwner(id) {
  const confirmDelete = confirm('Are you sure you want to delete this property owner?');
  
  if (confirmDelete) {
    try {
      const response = await fetch(`${BASE_URL}/api/property-owners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Property Owner Deleted Successfully!');
        location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting property owner:', error);
      alert('Failed to delete property owner');
    }
  }
}