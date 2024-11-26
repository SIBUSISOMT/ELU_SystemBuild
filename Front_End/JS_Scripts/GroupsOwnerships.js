// Wait until the page is fully loaded
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch Groups from backend API
    const response = await fetch('/api/groups');
    const groups = await response.json();

    const groupTable = document.getElementById('groupTable');
    
    // Populate the table with group data
    groups.forEach(group => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${group.id}</td>
        <td>${group.name}</td>
        <td>${group.description}</td>
        <td>${group.createdBy}</td>
        <td>
          <button class="btn-edit" onclick="editGroup(${group.id})">Edit</button>
          <button class="btn-delete" onclick="deleteGroup(${group.id})">Delete</button>
        </td>
      `;
      
      groupTable.appendChild(row);
    });
  } catch (err) {
    console.error('Error fetching groups:', err);
  }

  // Show the modal for adding new group when the "Add New Group" button is clicked
  document.getElementById('addGroupBtn').addEventListener('click', () => {
    document.getElementById('addGroupModal').style.display = 'block';  // Show the "Add Group" modal
  });
});

// Open the edit group modal and populate it with data
function editGroup(groupId) {
  console.log('Editing group with ID:', groupId);
  
  fetch(`/api/groups/${groupId}`)
    .then(response => response.json())
    .then(group => {
      document.getElementById('editGroupId').value = group.id;
      document.getElementById('editGroupName').value = group.name;
      document.getElementById('editGroupDescription').value = group.description;
      
      document.getElementById('editGroupModal').style.display = 'block';  // Show the edit modal
    })
    .catch(err => console.error('Error fetching group for editing:', err));
}

// Open the delete group modal
function deleteGroup(groupId) {
  console.log('Deleting group with ID:', groupId);
  
  document.getElementById('confirmDeleteGroupBtn').onclick = () => {
    fetch(`/api/groups/${groupId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(result => {
        alert('Group deleted');
        location.reload(); // Reload the page to update the table
      })
      .catch(err => console.error('Error deleting group:', err));
  };

  document.getElementById('deleteGroupModal').style.display = 'block';  // Show delete confirmation modal
}

// Close the modals
document.querySelectorAll('.close').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('editGroupModal').style.display = 'none';
    document.getElementById('deleteGroupModal').style.display = 'none';
    document.getElementById('addGroupModal').style.display = 'none';  // Close the "Add Group" modal
  });
});
