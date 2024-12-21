// Wait until the page is fully loaded
window.addEventListener('DOMContentLoaded', async () => {
    try {
      // Fetch Entities from backend API
      const response = await fetch('/api/entities');
      const entities = await response.json();
  
      const entityTable = document.getElementById('entityTable');
      
      // Populate the table with entity data
      entities.forEach(entity => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${entity.id}</td>
          <td>${entity.propertyName}</td>
          <td>${entity.owner}</td>
          <td>${entity.location}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>${entity.owner}</td>
          <td>
            <button class="btn-edit" onclick="editEntity(${entity.id})">Edit</button>
            <button class="btn-delete" onclick="deleteEntity(${entity.id})">Delete</button>
          </td>
        `;
        
        entityTable.appendChild(row);
      });
    } catch (err) {
      console.error('Error fetching entities:', err);
    }
  
    // Show the modal for adding new entity when the "Add New Entity" button is clicked
    document.getElementById('addEntityBtn').addEventListener('click', () => {
      document.getElementById('addEntityModal').style.display = 'block';  // Show the "Add Entity" modal
    });
  });
  
  // Open the edit entity modal and populate it with data
  function editEntity(entityId) {
    console.log('Editing entity with ID:', entityId);
    
    fetch(`/api/entities/${entityId}`)
      .then(response => response.json())
      .then(entity => {
        document.getElementById('editEntityId').value = entity.id;
        document.getElementById('editPropertyName').value = entity.propertyName;
        document.getElementById('editOwner').value = entity.owner;
        document.getElementById('editLocation').value = entity.location;
        
        document.getElementById('editEntityModal').style.display = 'block';  // Show the edit modal
      })
      .catch(err => console.error('Error fetching entity for editing:', err));
  }
  
  // Open the delete entity modal
  function deleteEntity(entityId) {
    console.log('Deleting entity with ID:', entityId);
    
    document.getElementById('confirmDeleteEntityBtn').onclick = () => {
      fetch(`/api/entities/${entityId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(result => {
          alert('Entity deleted');
          location.reload(); // Reload the page to update the table
        })
        .catch(err => console.error('Error deleting entity:', err));
    };
  
    document.getElementById('deleteEntityModal').style.display = 'block';  // Show delete confirmation modal
  }
  
  // Close the modals
  document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('editEntityModal').style.display = 'none';
      document.getElementById('deleteEntityModal').style.display = 'none';
      document.getElementById('addEntityModal').style.display = 'none';  // Close the "Add Entity" modal
    });
  });
  