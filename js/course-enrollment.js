/**
 * NextAI Course Enrollment System
 * Handles enrollment for specific courses
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Course enrollment system loaded');
    
    // Create the enrollment modal if it doesn't exist
    if (!document.getElementById('courseEnrollmentModal')) {
        const modal = createCourseEnrollmentModal();
        document.body.appendChild(modal);
        console.log('Course enrollment modal created');
    }
    
    // Find all enrollment buttons
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    console.log('Found ' + enrollButtons.length + ' enrollment buttons');
    
    // Add click event to all enrollment buttons
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Enrollment button clicked');
            
            // Get course info if available
            const courseId = this.dataset.courseId || '';
            const courseName = this.dataset.courseName || '';
            console.log('Course info:', courseId, courseName);
            
            // Set course info in the form if available
            if (courseName) {
                const courseNameInput = document.getElementById('modalCourseName');
                if (courseNameInput) {
                    courseNameInput.value = courseName;
                    
                    // Also update the course name display if it exists
                    const courseDisplay = document.getElementById('selectedCourseName');
                    if (courseDisplay) {
                        courseDisplay.textContent = courseName;
                        document.getElementById('selectedCourseInfo').style.display = 'block';
                    }
                }
            } else {
                // Hide course info if no course name
                const courseInfoDiv = document.getElementById('selectedCourseInfo');
                if (courseInfoDiv) {
                    courseInfoDiv.style.display = 'none';
                }
            }
            
            // Show the modal
            showCourseEnrollmentModal();
        });
    });
    
    // Close modal when clicking close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            hideCourseEnrollmentModal();
        }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('courseEnrollmentModal');
        if (e.target === modal) {
            hideCourseEnrollmentModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideCourseEnrollmentModal();
        }
    });
    
    // Handle form submission
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'courseEnrollForm') {
            e.preventDefault();
            console.log('Form submitted');
            
            // Validate form
            if (validateCourseEnrollmentForm()) {
                // Simulate form submission
                submitCourseEnrollmentForm();
            }
        }
    });
});

/**
 * Create the course enrollment modal HTML structure
 */
function createCourseEnrollmentModal() {
    const isPageCzech = document.documentElement.lang === 'cs';
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'courseEnrollmentModal';
    modal.className = 'modal enrollment-modal';
    
    // Modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isPageCzech ? 'Rychlé přihlášení' : 'Quick Enrollment'}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p class="modal-subtitle">${isPageCzech ? 'Vyplňte své údaje pro přihlášení na kurz' : 'Fill in your details to enroll in the course'}</p>
                
                <div id="selectedCourseInfo" class="selected-course-info">
                    <p>${isPageCzech ? 'Vybraný kurz:' : 'Selected course:'} <span id="selectedCourseName"></span></p>
                </div>
                
                <form id="courseEnrollForm" action="#" method="POST">
                    <input type="hidden" id="modalCourseId" name="courseId" value="">
                    <input type="hidden" id="modalCourseName" name="courseName" value="">
                    
                    <div class="form-group">
                        <label for="firstName">${isPageCzech ? 'Jméno' : 'First Name'}*</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="lastName">${isPageCzech ? 'Příjmení' : 'Last Name'}*</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">${isPageCzech ? 'E-mail' : 'Email'}*</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${isPageCzech ? 'Přihlásit se' : 'Enroll Now'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles if not already added
    if (!document.getElementById('courseEnrollmentModalStyles')) {
        addCourseModalStyles();
    }
    
    return modal;
}

/**
 * Add modal styles to the document
 */
function addCourseModalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'courseEnrollmentModalStyles';
    styleSheet.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
            display: flex;
        }
        
        .modal-content {
            background-color: #fff;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
            transform: translateY(-20px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            position: relative;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #333;
            font-size: 24px;
        }
        
        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            transition: color 0.2s;
        }
        
        .modal-close:hover {
            color: #333;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-subtitle {
            margin-top: 0;
            margin-bottom: 20px;
            color: #666;
        }
        
        .selected-course-info {
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 3px solid #3498db;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        .form-group input:focus {
            border-color: #3498db;
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .form-actions .btn {
            flex: 1;
        }
        
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
            border-left: 4px solid #f5c6cb;
        }
        
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 14px;
            border-left: 4px solid #c3e6cb;
        }
        
        @media (max-width: 480px) {
            .form-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(styleSheet);
}

/**
 * Show the course enrollment modal
 */
function showCourseEnrollmentModal() {
    const modal = document.getElementById('courseEnrollmentModal');
    if (modal) {
        modal.classList.add('show');
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

/**
 * Hide the course enrollment modal
 */
function hideCourseEnrollmentModal() {
    const modal = document.getElementById('courseEnrollmentModal');
    if (modal) {
        modal.classList.remove('show');
        
        // Reset form and error messages
        const form = document.getElementById('courseEnrollForm');
        if (form) form.reset();
        
        const errorMessage = modal.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
        
        const successMessage = modal.querySelector('.success-message');
        if (successMessage) successMessage.remove();
    }
}

/**
 * Validate the course enrollment form
 * @returns {boolean} True if valid, false otherwise
 */
function validateCourseEnrollmentForm() {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Check if fields are empty
    if (!firstName || !lastName || !email) {
        showFormMessage('error', document.documentElement.lang === 'cs' ? 
            'Prosím vyplňte všechna povinná pole.' : 
            'Please fill in all required fields.');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage('error', document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platnou e-mailovou adresu.' : 
            'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

/**
 * Show message in the form
 * @param {string} type - Message type: 'error' or 'success'
 * @param {string} message - Message to display
 */
function showFormMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    const form = document.getElementById('courseEnrollForm');
    form.insertBefore(messageDiv, form.firstChild);
}

/**
 * Submit the course enrollment form with loading simulation
 */
function submitCourseEnrollmentForm() {
    // Get the submit button
    const form = document.getElementById('courseEnrollForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${document.documentElement.lang === 'cs' ? 'Zpracování...' : 'Processing...'}`;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Show success message
        showFormMessage('success', document.documentElement.lang === 'cs' ? 
            'Přihlášení bylo úspěšně odesláno! Brzy vás budeme kontaktovat.' : 
            'Enrollment successfully submitted! We will contact you soon.');
        
        // Hide form fields
        const formGroups = form.querySelectorAll('.form-group, .form-actions');
        formGroups.forEach(group => {
            group.style.display = 'none';
        });
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'btn btn-primary btn-full';
        closeButton.textContent = document.documentElement.lang === 'cs' ? 'Zavřít' : 'Close';
        closeButton.addEventListener('click', hideCourseEnrollmentModal);
        form.appendChild(closeButton);
        
        // Auto close after delay
        setTimeout(hideCourseEnrollmentModal, 5000);
    }, 1500);
}
