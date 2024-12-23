// API endpoints
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    GET_ALL: `${BASE_URL}/api/groups`,
    GET_ONE: (id) => `${BASE_URL}/api/groups/${id}`,
    CREATE: `${BASE_URL}/api/groups`,
    UPDATE: (id) => `${BASE_URL}/api/groups/${id}`,
    DELETE: (id) => `${BASE_URL}/api/groups/${id}`,
    GET_LATEST_REFERENCE: `${BASE_URL}/api/groups/latest-reference`
};

// DOM Elements
const groupTable = document.getElementById('groupTable');
const addGroupBtn = document.getElementById('addGroupBtn');
const addGroupModal = document.getElementById('addGroupModal');
const editGroupModal = document.getElementById('editGroupModal');
const addGroupForm = document.getElementById('addGroupForm');
const editGroupForm = document.getElementById('editGroupForm');
const closeButtons = document.querySelectorAll('.close');


// Frontend JavaScript
async function getLatestPropertyReference() {
  try {
      const response = await fetch(API_ENDPOINTS.GET_LATEST_REFERENCE);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Set the value in your form's input field
      const propertyRefInput = document.getElementById('property_reference');
        if (propertyRefInput) {
            propertyRefInput.value = data.propertyReference || '';
        }
  } catch (error) {
      console.error('Error loading property reference:', error);
      alert('Failed to load property reference. Please try again.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGroups();
  getLatestPropertyReference();
});

if (addGroupBtn) {
  addGroupBtn.addEventListener('click', () => addGroupModal.style.display = 'block');
}

if (addGroupForm) {
  addGroupForm.addEventListener('submit', handleAddGroup);
}

if (editGroupForm) {
  editGroupForm.addEventListener('submit', handleEditGroup);
}

if (closeButtons) {
  closeButtons.forEach(button => {
      button.addEventListener('click', () => {
          if (addGroupModal) addGroupModal.style.display = 'none';
          if (editGroupModal) editGroupModal.style.display = 'none';
      });
  });
}

// Window click event for closing modals
window.onclick = function(event) {
  if (event.target === addGroupModal || event.target === editGroupModal) {
      if (addGroupModal) addGroupModal.style.display = 'none';
      if (editGroupModal) editGroupModal.style.display = 'none';
  }
};
// Call this when your form component loads
getLatestPropertyReference();



// Event Listeners
document.addEventListener('DOMContentLoaded', loadGroups);
addGroupBtn.addEventListener('click', () => addGroupModal.style.display = 'block');
addGroupForm.addEventListener('submit', handleAddGroup);
editGroupForm.addEventListener('submit', handleEditGroup);
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        addGroupModal.style.display = 'none';
        editGroupModal.style.display = 'none';
    });
});

// Load all groups
async function loadGroups() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ALL);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !Array.isArray(data.data)) {
            throw new Error('Invalid data format received from server');
        }
        
        displayGroups(data.data);
    } catch (error) {
        console.error('Error loading groups:', error);
        // More specific error message based on the error type
        const errorMessage = error.message.includes('Failed to fetch') 
            ? 'Unable to connect to the server. Please check your connection.'
            : 'Failed to load groups. Please try again.';
        alert(errorMessage);
    }
}
// Display groups in table
function displayGroups(groups) {
    groupTable.innerHTML = groups.map(group => `
        <tr>
            <td>${group.group_id}</td>
            <td>${group.group_name}</td>
            <td>${group.description || '-'}</td>
            <td>${group.email}</td>
            <td>${group.alternative_email || '-'}</td>
            <td>${group.contact_number}</td>
            <td>${group.alternative_contact || '-'}</td>
            <td>${group.area_name || '-'}</td>
            <td>${group.area_code || '-'}</td>
            <td>${group.property_reference || '-'}</td>
            <td>${group.group_registration_number || '-'}</td>
            <td>${group.group_type}</td>
            <td>${group.member_count || 0}</td>
            <td>${group.created_by}</td>
            <td>${new Date(group.created_at).toLocaleDateString()}</td>
            <td>
                <button onclick="openEditModal(${group.group_id})" class="btn-edit">
                    <i class='bx bx-edit'></i>
                </button>
                <button onclick="deleteGroup(${group.group_id})" class="btn-delete">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Handle adding new group
async function handleAddGroup(event) {
    event.preventDefault();
    const formData = {
        group_name: document.getElementById('addGroupName').value,
        description: document.getElementById('addGroupDescription').value,
        email: document.getElementById('addEmail').value,
        alternative_email: document.getElementById('addAlternativeEmail').value,
        contact_number: document.getElementById('addContactNumber').value,
        alternative_contact: document.getElementById('addAlternativeContact').value,
        area_name: document.getElementById('addAreaName').value,
        area_code: document.getElementById('addAreaCode').value,
        property_reference: document.getElementById('addPropertyReference').value,
        group_registration_number: document.getElementById('addGroupRegistrationNumber').value,
        group_type: document.getElementById('addGroupType').value,
        member_count: document.getElementById('addMemberCount').value,
        created_by: 'current_user', // I Must Replace this with actual user ID from session
        created_at: new Date().toISOString()
    };

    try {
        const response = await fetch(API_ENDPOINTS.CREATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create group');

        addGroupModal.style.display = 'none';
        addGroupForm.reset();
        loadGroups();
        alert('Group added successfully!');
    } catch (error) {
        console.error('Error adding group:', error);
        alert('Failed to add group. Please try again.');
    }
}

// Open edit modal and populate form
async function openEditModal(groupId) {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ONE(groupId));
        const group = await response.json();

        document.getElementById('editGroupId').value = group.group_id;
        document.getElementById('editGroupName').value = group.group_name;
        document.getElementById('editGroupDescription').value = group.description;
        document.getElementById('editEmail').value = group.email;
        document.getElementById('editAlternativeEmail').value = group.alternative_email;
        document.getElementById('editContactNumber').value = group.contact_number;
        document.getElementById('editAlternativeContact').value = group.alternative_contact;
        document.getElementById('editAreaName').value = group.area_name;
        document.getElementById('editAreaCode').value = group.area_code;
        document.getElementById('editPropertyReference').value = group.property_reference;
        document.getElementById('editGroupRegistrationNumber').value = group.group_registration_number;
        document.getElementById('editGroupType').value = group.group_type;
        document.getElementById('editMemberCount').value = group.member_count;

        editGroupModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading group details:', error);
        alert('Failed to load group details. Please try again.');
    }
}

// Handle editing group
async function handleEditGroup(event) {
    event.preventDefault();
    const groupId = document.getElementById('editGroupId').value;
    const formData = {
        group_name: document.getElementById('editGroupName').value,
        description: document.getElementById('editGroupDescription').value,
        email: document.getElementById('editEmail').value,
        alternative_email: document.getElementById('editAlternativeEmail').value,
        contact_number: document.getElementById('editContactNumber').value,
        alternative_contact: document.getElementById('editAlternativeContact').value,
        area_name: document.getElementById('editAreaName').value,
        area_code: document.getElementById('editAreaCode').value,
        property_reference: document.getElementById('editPropertyReference').value,
        group_registration_number: document.getElementById('editGroupRegistrationNumber').value,
        group_type: document.getElementById('editGroupType').value,
        member_count: document.getElementById('editMemberCount').value,
        updated_at: new Date().toISOString()
    };

    try {
        const response = await fetch(API_ENDPOINTS.UPDATE(groupId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update group');

        editGroupModal.style.display = 'none';
        loadGroups();
        alert('Group updated successfully!');
    } catch (error) {
        console.error('Error updating group:', error);
        alert('Failed to update group. Please try again.');
    }
}

// Handle deleting group
async function deleteGroup(groupId) {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
        const response = await fetch(API_ENDPOINTS.DELETE(groupId), {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete group');

        loadGroups();
        alert('Group deleted successfully!');
    } catch (error) {
        console.error('Error deleting group:', error);
        alert('Failed to delete group. Please try again.');
    }
}


// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target === addGroupModal || event.target === editGroupModal) {
        addGroupModal.style.display = 'none';
        editGroupModal.style.display = 'none';
    }
};


// Add form validation
function validateForm(formData) {
    if (!formData.group_name || !formData.email || !formData.contact_number || !formData.group_type) {
        alert('Please fill in all required fields.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (formData.alternative_email && !emailRegex.test(formData.alternative_email)) {
        alert('Please enter a valid alternative email address.');
        return false;
    }

    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.contact_number)) {
        alert('Please enter a valid contact number.');
        return false;
    }

    if (formData.alternative_contact && !phoneRegex.test(formData.alternative_contact)) {
        alert('Please enter a valid alternative contact number.');
        return false;
    }


    return true;
}