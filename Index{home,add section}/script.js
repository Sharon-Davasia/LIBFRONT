// Demo credentials
const demoUsers = [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'manager', password: 'manager123', role: 'Manager' },
    { username: 'staff', password: 'staff123', role: 'Staff' }
];

// DOM Elements
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');
const signinBtn = document.getElementById('signin-btn');
const signoutBtn = document.getElementById('signout-btn');
const signinModal = document.getElementById('signin-modal');
const closeSigninModal = document.getElementById('close-signin-modal');
const signinForm = document.getElementById('signin-form');
const profileInfo = document.getElementById('profile-info');
const navHome = document.getElementById('nav-home');
const navAddSection = document.getElementById('nav-add-section');
const mainContent = document.getElementById('main-content');
const addSectionModal = document.getElementById('add-section-modal');
const closeModal = document.getElementById('close-modal');
const addSectionForm = document.getElementById('add-section-form');
const numShiftsSelect = document.getElementById('numShifts');
const shiftTimesContainer = document.getElementById('shift-times-container');

// Profile Dropdown Toggle
profileIcon.addEventListener('click', () => {
    profileDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('show');
    }
});

// Sign In Modal
signinBtn.addEventListener('click', () => {
    signinModal.style.display = 'block';
    profileDropdown.classList.remove('show');
});

closeSigninModal.addEventListener('click', () => {
    signinModal.style.display = 'none';
});

// Sign In Form Submit
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = signinForm.username.value;
    const password = signinForm.password.value;

    // Check credentials against demo users
    const user = demoUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        profileInfo.innerHTML = `
            <p>Welcome, ${user.username}</p>
            <p class="user-role">${user.role}</p>
        `;
        signinBtn.style.display = 'none';
        signoutBtn.style.display = 'block';
        signinModal.style.display = 'none';
        signinForm.reset();
        
        // Store user info in sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            role: user.role
        }));
    } else {
        signinForm.reset();
        signinModal.style.display = 'none';
    }
});

// Sign Out
signoutBtn.addEventListener('click', () => {
    profileInfo.innerHTML = '<p>Not signed in</p>';
    signinBtn.style.display = 'block';
    signoutBtn.style.display = 'none';
    profileDropdown.classList.remove('show');
    sessionStorage.removeItem('currentUser');
});

// Check for existing session on page load
window.addEventListener('load', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        profileInfo.innerHTML = `
            <p>Welcome, ${currentUser.username}</p>
            <p class="user-role">${currentUser.role}</p>
        `;
        signinBtn.style.display = 'none';
        signoutBtn.style.display = 'block';
    }
});

// Navigation
navHome.addEventListener('click', () => {
    navHome.classList.add('active');
    navAddSection.classList.remove('active');
    mainContent.innerHTML = `
        <h1>Welcome to the Admin Dashboard</h1>
        <p>Select an option from the sidebar.</p>
    `;
});

navAddSection.addEventListener('click', () => {
    navAddSection.classList.add('active');
    navHome.classList.remove('active');
    addSectionModal.style.display = 'block';
});

// Close Add Section Modal
closeModal.addEventListener('click', () => {
    addSectionModal.style.display = 'none';
});

// Handle number of shifts change
numShiftsSelect.addEventListener('change', () => {
    const numShifts = parseInt(numShiftsSelect.value);
    shiftTimesContainer.innerHTML = '';

    for (let i = 1; i <= numShifts; i++) {
        const shiftDiv = document.createElement('div');
        shiftDiv.className = 'shift-time-group';
        shiftDiv.innerHTML = `
            <h4>Shift ${i}</h4>
            <div class="shift-inputs">
                <label>Start Time: 
                    <input type="time" name="shift${i}Start" required>
                </label>
                <label>End Time: 
                    <input type="time" name="shift${i}End" required>
                </label>
            </div>
        `;
        shiftTimesContainer.appendChild(shiftDiv);
    }
});

// Add Section Form Submit
addSectionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(addSectionForm);
    const sectionData = {
        sectionName: formData.get('sectionName'),
        numSeats: formData.get('numSeats'),
        startSeat: formData.get('startSeat'),
        endSeat: formData.get('endSeat'),
        numShifts: formData.get('numShifts'),
        price: formData.get('price'),
        days: formData.getAll('days'),
        activeSeats: formData.get('activeSeats'),
        inactiveSeats: formData.get('inactiveSeats'),
        facilities: formData.getAll('facilities'),
        shifts: []
    };

    // Collect shift times
    for (let i = 1; i <= sectionData.numShifts; i++) {
        sectionData.shifts.push({
            shiftNumber: i,
            startTime: formData.get(`shift${i}Start`),
            endTime: formData.get(`shift${i}End`)
        });
    }

    // Here you would typically send this data to a server
    console.log('Section Data:', sectionData);

    // Show success message
    alert('Section added successfully!');
    addSectionModal.style.display = 'none';
    addSectionForm.reset();
    shiftTimesContainer.innerHTML = '';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === signinModal) {
        signinModal.style.display = 'none';
    }
    if (e.target === addSectionModal) {
        addSectionModal.style.display = 'none';
    }
}); 