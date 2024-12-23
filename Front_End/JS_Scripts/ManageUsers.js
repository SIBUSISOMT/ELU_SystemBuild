/// Initialize constants for modals and base URL
const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");
const closeBtns = document.querySelectorAll(".close");
const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const BASE_URL = 'http://localhost:3000';

let userToDelete = null; // Variable to store ID of user to delete

// Modal close handlers
closeBtns.forEach((btn) => {
  btn.onclick = () => {
    editModal.style.display = "none";
    deleteModal.style.display = "none";
  };
});

// Edit functionality
function openEditModal(userId) {
  console.log('Fetching user:', userId);
  
  fetch(`${BASE_URL}/auth/users/${userId}`)
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      
      const user = data.user || data;
      console.log('User data to populate form:', user);
      
      document.getElementById("editUserId").value = user.id;
      document.getElementById("editFirstName").value = user.FirstName;
      document.getElementById("editLastName").value = user.LastName;
      document.getElementById("editUsername").value = user.username;
      document.getElementById("editEmail").value = user.email;
      document.getElementById("editTitle").value = user.Title;

      editModal.style.display = "block";
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error fetching user data. Please try again.');
    });
}

// Delete functionality
function openDeleteModal(userId) {
  userToDelete = userId;
  deleteModal.style.display = "block";
}

// Delete modal close handlers
if (closeDeleteModalBtn) {
  closeDeleteModalBtn.onclick = () => {
    deleteModal.style.display = "none";
    userToDelete = null;
  };
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = "none";
    userToDelete = null;
  };
}

// Delete confirmation handler
if (confirmDeleteBtn) {
  confirmDeleteBtn.onclick = () => {
    if (userToDelete) {
      fetch(`${BASE_URL}/auth/users/${userToDelete}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          deleteModal.style.display = "none";
          fetchUsers(); // Refresh the user list
        } else {
          throw new Error(data.message || 'Error deleting user');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting user. Please try again.');
      })
      .finally(() => {
        userToDelete = null;
      });
    }
  };
}

// Update user form handler
const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.onsubmit = (e) => {
    e.preventDefault();

    const userId = document.getElementById("editUserId").value;
    const updatedData = {
      FirstName: document.getElementById("editFirstName").value,
      LastName: document.getElementById("editLastName").value,
      username: document.getElementById("editUsername").value,
      email: document.getElementById("editEmail").value,
      Title: document.getElementById("editTitle").value
    };

    const updateBtn = document.getElementById("updateBtn");
    if (updateBtn) {
      updateBtn.disabled = true;
      updateBtn.textContent = "Updating...";
    }

    fetch(`${BASE_URL}/auth/users/${userId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        editModal.style.display = "none";
        fetchUsers(); // Refresh the user list
      } else {
        throw new Error(data.message || 'Error updating user');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error updating user. Please try again.');
    })
    .finally(() => {
      if (updateBtn) {
        updateBtn.disabled = false;
        updateBtn.textContent = "Update";
      }
    });
  };
}

// Fetch and display users
function fetchUsers() {
  console.log('Fetching users from:', `${BASE_URL}/auth/users`);
  const userTable = document.getElementById("userTable");
  if (!userTable) return;

  userTable.innerHTML = '<tr><td colspan="7">Loading user data...</td></tr>';

  fetch(`${BASE_URL}/auth/users`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(users => {
      if (!Array.isArray(users)) {
        throw new Error('Invalid data format received');
      }
      
      if (users.length === 0) {
        userTable.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
        return;
      }

      userTable.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id || ''}</td>
          <td>${user.FirstName || ''}</td>
          <td>${user.LastName || ''}</td>
          <td>${user.username || ''}</td>
          <td>${user.email || ''}</td>
          <td>${user.Title || ''}</td>
          <td>
            <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
            <button class="btn-delete" onclick="openDeleteModal(${user.id})">Delete</button>
          </td>
        `;
        userTable.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      userTable.innerHTML = '<tr><td colspan="7">Error loading users. Please try again.</td></tr>';
    });
}

// Initialize page
// Initialize page
window.onload = () => {
  console.log('Window loaded, fetching users...');
  fetchUsers();
  if (editModal) editModal.style.display = "none";
  if (deleteModal) deleteModal.style.display = "none";
};

console.log('ManageUsers.js loaded');