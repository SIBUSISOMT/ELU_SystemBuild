document.addEventListener('DOMContentLoaded', () => {
  // Handle Forgot Password Request
  const forgotPasswordLink = document.querySelector('#forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
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
            alert("A password reset link has been sent to your email.");
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
  }

  // Handle Password Reset Form Submission (for main reset-password form)
  const resetPasswordForm = document.querySelector('.reset-password-form');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = e.target.querySelector('#newPassword').value;
      const confirmPassword = e.target.querySelector('#confirmPassword').value;

      // Retrieve token and id from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const id = urlParams.get('id');

      if (password !== confirmPassword) {
        showError("Passwords do not match. Please try again.");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, token, password })
        });

        if (response.ok) {
          alert("Your password has been reset successfully. You can now log in.");
          window.location.href = `${BASE_URL}/auth/login`; // Redirect to login page or wherever appropriate
        } else {
          const error = await response.text();
          showError(error); // Show error in UI
        }
      } catch (err) {
        console.error("Error during password reset:", err);
        showError("An error occurred while resetting your password. Please try again.");
      }
    });
  }

  // Function to display errors in UI
  function showError(message) {
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.style.color = 'red';
      document.body.prepend(errorElement); // Append at the top of the body or a better place in the form
    }
    errorElement.textContent = message;
  }
});
