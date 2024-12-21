// PropertyOwner.js
const apiUrl = 'http://localhost:3000/api/properties';

// Modal controls
const modal = document.getElementById('propertyModal');
const editModal = document.getElementById('editPropertyModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const closeEditModalButton = document.getElementById('closeEditModalButton');
const propertyForm = document.getElementById('propertyForm');
const editPropertyForm = document.getElementById('editPropertyForm');
const propertiesTable = document.getElementById('propertiesTable');

openModalButton.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

closeEditModalButton.addEventListener('click', () => {
  editModal.style.display = 'none';
});

// Fetch properties
async function fetchProperties() {
  const response = await fetch(apiUrl);
  const properties = await response.json();
  propertiesTable.innerHTML = properties.map(property => `
    <tr>
      <td>${property.id}</td>
      <td>${property.propertyReference}</td>
      <td>${property.warmsNumber}</td>
      <td>${property.titleDeedNumber}</td>
      <td>${property.subCatchmentName}</td>
      <td>${property.propertyAreaName}</td>
      <td>${property.propertyAreaCode}</td>
      <td>${property.farmSizeHA}</td>
      <td>
        <button class="edit-btn" data-id="${property.id}">Edit</button>
        <button class="delete-btn" data-id="${property.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => openEditModal(button.dataset.id));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => deleteProperty(button.dataset.id));
  });
}

// Register property
propertyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    propertyReference: document.getElementById('propertyReference').value,
    warmsNumber: document.getElementById('warmsNumber').value,
    titleDeedNumber: document.getElementById('titleDeedNumber').value,
    subCatchmentName: document.getElementById('subCatchmentName').value,
    propertyAreaName: document.getElementById('propertyAreaName').value,
    propertyAreaCode: document.getElementById('propertyAreaCode').value,
    farmSizeHA: document.getElementById('farmSizeHA').value,
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const result = await response.json();  // Assuming the response includes a `redirectUrl`
    alert(result.message);  // Show success alert
    window.location.href = result.redirectUrl;  // Redirect to main.html
  } else {
    alert('Failed to register property.');
  }
});

// Open Edit Modal
async function openEditModal(id) {
  const response = await fetch(`${apiUrl}/${id}`);
  const property = await response.json();

  document.getElementById('editPropertyId').value = property.id;
  document.getElementById('editPropertyReference').value = property.propertyReference;
  document.getElementById('editWarmsNumber').value = property.warmsNumber;
  document.getElementById('editTitleDeedNumber').value = property.titleDeedNumber;
  document.getElementById('editSubCatchmentName').value = property.subCatchmentName;
  document.getElementById('editPropertyAreaName').value = property.propertyAreaName;
  document.getElementById('editPropertyAreaCode').value = property.propertyAreaCode;
  document.getElementById('editFarmSizeHA').value = property.farmSizeHA;

  editModal.style.display = 'flex';
}

// Edit property
editPropertyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editPropertyId').value;
  const data = {
    propertyReference: document.getElementById('editPropertyReference').value,
    warmsNumber: document.getElementById('editWarmsNumber').value,
    titleDeedNumber: document.getElementById('editTitleDeedNumber').value,
    subCatchmentName: document.getElementById('editSubCatchmentName').value,
    propertyAreaName: document.getElementById('editPropertyAreaName').value,
    propertyAreaCode: document.getElementById('editPropertyAreaCode').value,
    farmSizeHA: document.getElementById('editFarmSizeHA').value,
  };

  const response = await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    alert('Property updated successfully!');
    editModal.style.display = 'none';
    fetchProperties();
  } else {
    alert('Failed to update property.');
  }
});

// Delete property
async function deleteProperty(id) {
  if (confirm('Are you sure you want to delete this property?')) {
    const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Property deleted successfully!');
      fetchProperties();
    } else {
      alert('Failed to delete property.');
    }
  }
}

// Initialize
fetchProperties();
