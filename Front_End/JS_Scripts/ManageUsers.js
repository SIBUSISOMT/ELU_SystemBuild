// JavaScript code to handle editing, deleting, and updating users
// Modal handling
const editModal = document.getElementById("editModal");
const deleteModal = document.getElementById("deleteModal");
const closeBtns = document.querySelectorAll(".close");
const BASE_URL = 'http://localhost:3000';

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    editModal.style.display = "none";
    deleteModal.style.display = "none";
  };
});

// Open edit modal with user data
function openEditModal(userId) {
  fetch(`${BASE_URL}/auth/users/${userId}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("editUserId").value = data.id;
      document.getElementById("editFirstName").value = data.FirstName;
      document.getElementById("editLastName").value = data.LastName;
      document.getElementById("editUsername").value = data.username;
      document.getElementById("editEmail").value = data.email;
      document.getElementById("editTitle").value = data.Title;

      // Show edit modal when data is populated
      editModal.style.display = "block";  
    })
    .catch(error => {
      console.error('Error fetching user data for edit:', error);
    });
}

// Open delete modal
let userToDelete = null;
function openDeleteModal(userId) {
  userToDelete = userId;
  deleteModal.style.display = "block";  // Show delete modal
}

// Close delete modal
const closeDeleteModalBtn = document.getElementById("closeDeleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

closeDeleteModalBtn.onclick = () => {
  deleteModal.style.display = "none";
  userToDelete = null;
};

cancelDeleteBtn.onclick = () => {
  deleteModal.style.display = "none";
  userToDelete = null;
};

// Confirm delete action
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

confirmDeleteBtn.onclick = () => {
  if (userToDelete) {
    fetch(`${BASE_URL}/auth/delete/${userToDelete}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => {
        deleteModal.style.display = "none";
        location.reload();  // Reload the page to reflect changes
      })
      .catch(error => {
        alert("Error deleting user.");
        deleteModal.style.display = "none";
        userToDelete = null;
      });
  }
};

// Update user on form submit
document.getElementById("editForm").onsubmit = (e) => {
  e.preventDefault();

  const userId = document.getElementById("editUserId").value;
  const updatedData = {
    FirstName: document.getElementById("editFirstName").value,
    LastName: document.getElementById("editLastName").value,
    username: document.getElementById("editUsername").value,
    email: document.getElementById("editEmail").value,
    Title: document.getElementById("editTitle").value,
  };

  fetch(`${BASE_URL}/auth/update/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
  .then(response => response.json())
  .then(() => {
    editModal.style.display = "none";  // Hide modal after successful update
    location.reload();  // Reload the page to reflect changes
  })
  .catch(error => {
    console.error('Error updating user:', error);
  });
};

// Fetch and display users in the table
function fetchUsers() {
  fetch(`${BASE_URL}/auth/users`)  // Make sure this is correct, matching your backend route
    .then(response => response.json())  // Parse the JSON response
    .then(users => {
      const userTable = document.getElementById("userTable");
      userTable.innerHTML = '';  // Clear the table before adding new rows
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.FirstName}</td>
          <td>${user.LastName}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.Title}</td>
          <td>
            <button class="btn-edit" onclick="openEditModal(${user.id})">Edit</button>
            <button class="btn-delete" onclick="openDeleteModal(${user.id})">Delete</button>
          </td>
        `;
        userTable.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching users:', error));  // Handle errors
}

// Initialize page
window.onload = () => {
  fetchUsers();
  editModal.style.display = "none";  // Ensure modals are hidden on page load
  deleteModal.style.display = "none"; 
};
