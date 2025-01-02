function checkPropertyOwner() {
    try {
        const propertyInfo = JSON.parse(sessionStorage.getItem('propertyInfo'));
        if (!propertyInfo?.property) return false;

        const property = propertyInfo.property;
        return !!(
            (property.individualOwners?.length > 0) ||
            (property.groupOwners?.length > 0) ||
            (property.entityOwners?.length > 0)
        );
    } catch (error) {
        console.error('Error checking property owner:', error);
        return false;
    }
}

function showPropertyModal(userType) {
    const modalId = {
        'individual': 'individualModal',
        'group': 'groupModal',
        'entity': 'entityModal'
    }[userType];

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        const propertyData = JSON.parse(sessionStorage.getItem('selectedProperty'));
        if (propertyData) {
            const refInput = modal.querySelector('[id$="Reference"], [id$="PropertyRef"]');
            if (refInput) {
                refInput.value = propertyData.propertyReference;
            }
        }
    }
}

export function initializeToolbar() {
    const propertyOwnerSelect = document.querySelector('.user-select[data-type="property-owner"]');
    
    if (propertyOwnerSelect && checkPropertyOwner()) {
        propertyOwnerSelect.disabled = true;
        propertyOwnerSelect.title = 'Property already has an owner';
    }

    document.querySelectorAll('.user-select').forEach(select => {
        select.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (selectedValue) {
                if (select.dataset.type === 'property-owner') {
                    showPropertyModal(selectedValue);
                }
                event.target.selectedIndex = 0;
            }
        });
    });
}