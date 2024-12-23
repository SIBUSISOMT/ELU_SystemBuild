const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');

// Menu item click handlers
if (allSideMenu) {
    allSideMenu.forEach(item=> {
        const li = item.parentElement;
        item.addEventListener('click', function () {
            allSideMenu.forEach(i=> {
                i.parentElement.classList.remove('active');
            })
            li.classList.add('active');
        })
    });
}

// Toggle sidebar
if (menuBar && sidebar) {
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    })
}

// Search functionality
if (searchButton && searchButtonIcon && searchForm) {
    searchButton.addEventListener('click', function (e) {
        if(window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if(searchForm.classList.contains('show')) {
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    })
}

// Responsive sidebar
if (sidebar && window.innerWidth < 768) {
    sidebar.classList.add('hide');
}

// Window resize handler
window.addEventListener('resize', function () {
    if(this.innerWidth > 576 && searchButtonIcon && searchForm) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})

// Dark mode switch
if (switchMode) {
    switchMode.addEventListener('change', function () {
        if(this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    })
}

// Navigation functions
function redirectToIndex() {
    window.location.href = '/../Front_End/Html_Pages/ManageUsers.html';
}

function redirectToPropertyOwners() {
    window.location.href = '/../Front_End/Html_Pages/PropertyOwner.html';
}

// Only add event listener if the button exists
const redirectButton = document.getElementById('redirectButton');
if (redirectButton) {
    redirectButton.addEventListener('click', redirectToIndex);
}