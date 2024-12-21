const BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch property owners data from the backend and populate the table
  try {
    const response = await fetch(`${BASE_URL}/api/property-owners`);
    const propertyOwners = await response.json();
    
    const tableBody = document.getElementById('propertyOwnersTable');
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
  }

  // Handle 'Add Property Owner' button click
  document.getElementById('toggleAddFormButton').addEventListener('click', () => {
    document.getElementById('ownershipTypeModal').style.display = 'block';
  });

  // Handle 'Ownership Type' selection
  document.getElementById('selectOwnershipTypeButton').addEventListener('click', () => {
    const selectedType = document.getElementById('ownershipTypeSelect').value;
    showAddPropertyOwnerForm(selectedType);
  });

  // Close modals when clicking the close icon
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('addPropertyOwnerModal').style.display = 'none';
      document.getElementById('ownershipTypeModal').style.display = 'none';
    });
  });

  // Add Property Owner Form Submission
  document.getElementById('addPropertyOwnerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ensure that the form field names match the expected keys in the backend
    const propertyOwnerData = {
      property_reference: document.getElementById('ownerReference').value,
      title_deed_number: document.getElementById('TitleDeedNumber').value,
      title_deed_holder_name: document.getElementById('ownerName').value,
      title_deed_holder_surname: document.getElementById('ownerSurname').value,
      residential_area_name: document.getElementById('ResidentialAreaName').value,
      residential_area_code: document.getElementById('ResidentialAreaCode').value,
      email: document.getElementById('Email').value,
      alternate_email: document.getElementById('AlternateEmail').value || null,
      contact_number: document.getElementById('ContactNumber').value,
      alternate_contact_number: document.getElementById('ConfirmContactNumber').value || null,
      id_number: document.getElementById('IDNumber').value,
      catchment: document.getElementById('catchment').value,
      sub_catchment: document.getElementById('subCatchment').value,
    };

    console.log(JSON.stringify(propertyOwnerData, null, 2));

    // Logging the propertyOwnerData to confirm the keys match
    console.log('Property Owner Data:', propertyOwnerData);

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
        
        document.getElementById('addPropertyOwnerModal').style.display = 'none';
        location.reload(); // Refresh the page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding property owner:', error);
      alert('Failed to add property owner');
    }
  });
});

// Function to show the Add Property Owner Form based on ownership type
function showAddPropertyOwnerForm(type) {
  const form = document.getElementById('addPropertyOwnerForm');
  form.innerHTML = '';  // Clear any existing fields
  if (type === 'individual') {
    form.innerHTML = ` 
      <h2>Add Individual Property Owner</h2>
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
      <label for="ownerReference">Property Reference:</label>
      <input type="text" id="ownerReference" required> <br>
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

  } else if (type === 'entity') {
    window.location.href = "/Front_End/Html_Pages/EntrepriseOwnership.html";
  } else if (type === 'group') {
    window.location.href = "/Front_End/Html_Pages/GroupOwnership.html";
  }
  // Show the Add Property Owner modal after injecting fields
  document.getElementById('ownershipTypeModal').style.display = 'none';
  document.getElementById('addPropertyOwnerModal').style.display = 'block';
}
// Function to edit property owner (to be implemented)
async function editPropertyOwner(id) {
  try {
    const response = await fetch(`/api/property-owners/${id}`);
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
      const response = await fetch(`/api/property-owners/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Property Owner Deleted Successfully!');
        location.reload(); // Refresh table
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
