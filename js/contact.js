/**
 * NextAI Contact Form JavaScript
 * Handles form tabs, validation, and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get tab to show
            const tabToShow = this.getAttribute('data-tab');
            
            // Update form fields based on selected tab
            updateFormFields(tabToShow);
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Simulate form submission
                submitForm();
            }
        });
    }
    
    // Workshop request form submission
    const workshopForm = document.getElementById('workshopForm');
    if (workshopForm) {
        workshopForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateWorkshopForm()) {
                // Simulate form submission
                submitWorkshopForm();
            }
        });
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close, #modalClose');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('confirmationModal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('confirmationModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Initialize form fields based on URL parameters
    initializeFromUrlParams();
});

/**
 * Initialize form fields from URL parameters
 */
function initializeFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryType = urlParams.get('type');
    
    if (inquiryType) {
        // Find the tab button for this inquiry type
        const tabButton = document.querySelector(`.tab-btn[data-tab="${inquiryType}"]`);
        if (tabButton) {
            // Simulate click on the tab button
            tabButton.click();
        }
    }
    
    // If on workshop request page, check for course parameters
    const courseId = urlParams.get('courseId');
    const courseName = urlParams.get('courseName');
    
    if (courseId && courseName && document.getElementById('workshopCourse')) {
        document.getElementById('workshopCourse').value = decodeURIComponent(courseName);
    }
}

/**
 * Update form fields based on selected tab
 */
function updateFormFields(tabType) {
    const form = document.getElementById('contactForm');
    const subjectField = document.getElementById('subject');
    
    // Update subject placeholder based on tab
    if (subjectField) {
        switch(tabType) {
            case 'general':
                subjectField.placeholder = document.documentElement.lang === 'cs' ? 
                    'Váš obecný dotaz' : 'Your general inquiry';
                break;
            case 'support':
                subjectField.placeholder = document.documentElement.lang === 'cs' ? 
                    'Popište váš technický problém' : 'Describe your technical issue';
                break;
            case 'sales':
                subjectField.placeholder = document.documentElement.lang === 'cs' ? 
                    'Dotaz ohledně produktů nebo služeb' : 'Inquiry about products or services';
                break;
        }
    }
    
    // You could add more dynamic form field changes here based on the tab
}

/**
 * Validate contact form fields
 */
function validateForm() {
    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message || !terms) {
        alert(document.documentElement.lang === 'cs' ? 
            'Prosím vyplňte všechna povinná pole.' : 
            'Please fill in all required fields.');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert(document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platnou e-mailovou adresu.' : 
            'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

/**
 * Validate workshop request form fields
 */
function validateWorkshopForm() {
    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const participants = document.getElementById('participants').value.trim();
    const message = document.getElementById('message').value.trim();
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!firstName || !lastName || !email || !company || !participants || !message || !terms) {
        alert(document.documentElement.lang === 'cs' ? 
            'Prosím vyplňte všechna povinná pole.' : 
            'Please fill in all required fields.');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert(document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platnou e-mailovou adresu.' : 
            'Please enter a valid email address.');
        return false;
    }
    
    // Participants validation - must be a number
    if (isNaN(participants) || participants < 1) {
        alert(document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platný počet účastníků.' : 
            'Please enter a valid number of participants.');
        return false;
    }
    
    return true;
}

/**
 * Submit contact form data
 */
function submitForm() {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = document.documentElement.lang === 'cs' ? 'Odesílání...' : 'Sending...';
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Show confirmation modal
        document.getElementById('confirmationModal').style.display = 'flex';
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // In a real application, you would send form data to a server here
        // using fetch or XMLHttpRequest
    }, 1500);
}

/**
 * Submit workshop request form data
 */
function submitWorkshopForm() {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = document.documentElement.lang === 'cs' ? 'Odesílání...' : 'Sending...';
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Show confirmation modal
        document.getElementById('confirmationModal').style.display = 'flex';
        
        // Reset form
        document.getElementById('workshopForm').reset();
        
        // In a real application, you would send form data to a server here
        // using fetch or XMLHttpRequest
    }, 1500);
}
