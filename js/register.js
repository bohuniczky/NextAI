/**
 * NextAI Registration Form JavaScript
 * Handles form validation and submission simulation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the registration form
    const registerForm = document.getElementById('registerForm');
    
    // Get the success modal
    const successModal = document.getElementById('successModal');
    
    // Get the close button
    const closeButtons = document.querySelectorAll('.close, .modal-footer .btn');
    
    // Form submission handler
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Simulate form submission
                submitForm();
            }
        });
    }
    
    // Close modal when clicking close button or outside
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    /**
     * Validate the registration form
     * @returns {boolean} True if valid, false otherwise
     */
    function validateForm() {
        // Remove any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Get form fields
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Check if fields are empty
        if (!name || !email || !password) {
            showError(isPageCzech() ? 
                'Prosím vyplňte všechna povinná pole.' : 
                'Please fill in all required fields.');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(isPageCzech() ? 
                'Prosím zadejte platnou e-mailovou adresu.' : 
                'Please enter a valid email address.');
            return false;
        }
        
        // Validate password length
        if (password.length < 6) {
            showError(isPageCzech() ? 
                'Heslo musí mít alespoň 6 znaků.' : 
                'Password must be at least 6 characters long.');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert at the top of the form
        const form = document.getElementById('registerForm');
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    /**
     * Submit the form with loading simulation
     */
    function submitForm() {
        // Get the submit button
        const submitButton = registerForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${isPageCzech() ? 'Zpracování...' : 'Processing...'}`;
        
        // Simulate API call delay
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Reset form
            registerForm.reset();
            
            // Show success modal
            successModal.style.display = 'flex';
        }, 1500);
    }
    
    /**
     * Check if the current page is Czech version
     * @returns {boolean} True if Czech, false if English
     */
    function isPageCzech() {
        return document.documentElement.lang === 'cs';
    }
});
