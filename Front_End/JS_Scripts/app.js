// Toggle between sign-in and sign-up modes
const signInBtn = document.querySelector("#sign-in-btn");
const signUpBtn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const BASE_URL = 'http://localhost:3000';

signUpBtn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

signInBtn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle Sign-In Form Submission
document.querySelector('.sign-in-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.querySelector('#loginUsername').value;
  const password = e.target.querySelector('#loginPassword').value;

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, { // Ensure this matches your route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href = data.redirectUrl || '/Front_End/Html_Pages/Dashboard.html';
    } else {
      const error = await response.text();
      showError(error); // Show error in UI
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
    showError("An error occurred during sign-in. Please try again.");
  }
});


// Handle Sign-Up Form Submission
document.querySelector('.sign-up-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.querySelector('#registerUsername').value;
  const email = e.target.querySelector('#registerEmail').value;
  const Title = e.target.querySelector('#Title').value;
  const password = e.target.querySelector('#registerPassword').value;
  const passwordConfirm = e.target.querySelector('#registerPassword2').value;

  if (password !== passwordConfirm) {
    showError("Passwords do not match. Please try again.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, { // Updated to include '/auth'
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, Title })
    });

    if (response.ok) {
      alert("Sign-up successful! You can now log in.");
      container.classList.remove("sign-up-mode");
    } else {
      const error = await response.text();
      showError(error); // Show error in UI
    }
  } catch (err) {
    console.error("Error during sign-up:", err);
    showError("An error occurred during sign-up. Please try again.");
  }
});

// Handle Forgot Password Request
document.querySelector('#forgotPasswordLink').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = prompt("Please enter your registered email address:");

  if (email) {
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        alert("If this email is registered, you will receive a password reset link.");
      } else {
        const error = await response.text();
        showError(error); // Show error in UI
      }
    } catch (err) {
      console.error("Error during forgot password:", err);
      showError("An error occurred while sending the password reset link. Please try again.");
    }
  }
});

// Function to display errors in UI
function showError(message) {
  const errorElement = document.querySelector('.error-message');
  if (!errorElement) {
    const newErrorElement = document.createElement('div');
    newErrorElement.className = 'error-message';
    newErrorElement.style.color = 'red';
    document.body.prepend(newErrorElement); // Append at the top of body or a better place in form
  }
  document.querySelector('.error-message').textContent = message;
}