document.addEventListener('DOMContentLoaded', async () => {
  // Fetch property owners data from the backend and populate the table
  try {
    const response = await fetch('/api/property-owners');
    const propertyOwners = await response.json();
    
    const tableBody = document.getElementById('propertyOwnersTable');
    
    propertyOwners.forEach(owner => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${owner.id}</td>
        <td>${owner.propertyReference}</td>
        <td>${owner.titleDeedNumber}</td>
        <td>${owner.titleDeedHolderName}</td>
        <td>${owner.titleDeedHolderSurname}</td>
        <td>
          <button class="btn-edit" onclick="editPropertyOwner(${owner.id})">Edit</button>
          <button class="btn-delete" onclick="deletePropertyOwner(${owner.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching property owners:', error);
  }

  // Handle 'Add Property Owner' button click
  document.getElementById('toggleAddFormButton').addEventListener('click', () => {
    document.getElementById('ownershipTypeModal').style.display = 'block';  // Show ownership type modal
  });

  // Handle 'Ownership Type' selection
  document.getElementById('selectOwnershipTypeButton').addEventListener('click', () => {
    const selectedType = document.getElementById('ownershipTypeSelect').value;
    showAddPropertyOwnerForm(selectedType);  // Show the add property owner form for the selected type
  });

  // Close modals when clicking the close icon
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('addPropertyOwnerModal').style.display = 'none';
      document.getElementById('ownershipTypeModal').style.display = 'none';
    });
  });
});

// Function to show the Add Property Owner Form based on ownership type
function showAddPropertyOwnerForm(type) {
  const form = document.getElementById('addPropertyOwnerForm');
  form.innerHTML = '';  // Clear any existing fields
  
  // Inject form fields based on ownership type
  if (type === 'individual') {
    form.innerHTML = `
      <label for="ownerName">Name:</label>
      <input type="text" id="ownerName" required>
      <label for="ownerSurname">Surname:</label>
      <input type="text" id="ownerSurname" required>
      <label for="ownerReference">Property Reference:</label>
      <input type="text" id="ownerReference" required>
      <button type="submit">Add Property Owner</button>
    `;
  } else if (type === 'entity') {
    window.location.href = "/Front_End/Html_Pages/EntityOwnership.html"
  } else if (type === 'group') {
    window.location.href = "/Front_End/Html_Pages/GroupOwnership.html";
  }
  


  // Show the Add Property Owner modal after injecting fields
  document.getElementById('ownershipTypeModal').style.display = 'none';
  document.getElementById('addPropertyOwnerModal').style.display = 'block';
}
