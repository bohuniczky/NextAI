/**
 * NextAI Enrollment Form JavaScript
 * Handles course selection, multi-step form navigation, validation, and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('courseId');
    const courseName = urlParams.get('courseName');
    
    // Set course information if provided in URL
    if (courseId && courseName) {
        document.getElementById('courseId').value = courseId;
        document.getElementById('courseName').value = decodeURIComponent(courseName);
        
        // Populate course summary
        populateCourseSummary(courseId, decodeURIComponent(courseName));
    } else {
        // If no course selected, redirect back to courses page
        const isEnglish = window.location.pathname.includes('enroll.html');
        window.location.href = isEnglish ? 'courses.html' : 'courses-cs.html';
    }
    
    // Initialize multi-step form
    initMultiStepForm();
    
    // Form submission
    const enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Simulate form submission
                submitForm();
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
});

/**
 * Populate course summary in sidebar
 */
function populateCourseSummary(courseId, courseName) {
    const courseSummary = document.getElementById('courseSummary');
    
    // Get course information based on ID
    // In a real application, this would fetch from a database or API
    const courseInfo = getCourseInfo(courseId);
    
    // Create HTML for course summary
    let summaryHTML = `
        <div class="summary-item">
            <h4>${courseName}</h4>
        </div>
        <div class="summary-item">
            <strong>${document.documentElement.lang === 'cs' ? 'Formát:' : 'Format:'}</strong>
            <span>${courseInfo.format}</span>
        </div>
        <div class="summary-item">
            <strong>${document.documentElement.lang === 'cs' ? 'Délka:' : 'Duration:'}</strong>
            <span>${courseInfo.duration}</span>
        </div>
        <div class="summary-item">
            <strong>${document.documentElement.lang === 'cs' ? 'Úroveň:' : 'Level:'}</strong>
            <span>${courseInfo.level}</span>
        </div>
    `;
    
    courseSummary.innerHTML = summaryHTML;
}

/**
 * Get course information based on ID
 * In a real application, this would fetch from a database or API
 */
function getCourseInfo(courseId) {
    // Sample course information
    const courseInfo = {
        format: document.documentElement.lang === 'cs' ? 'Online / Prezenčně' : 'Online / In-person',
        duration: document.documentElement.lang === 'cs' ? 'Celodenní / Půldenní' : 'Full-day / Half-day',
        level: courseId.includes('advanced') ? 
            (document.documentElement.lang === 'cs' ? 'Pokročilý' : 'Advanced') : 
            (document.documentElement.lang === 'cs' ? 'Začátečník' : 'Beginner')
    };
    
    return courseInfo;
}

/**
 * Initialize multi-step form navigation
 */
function initMultiStepForm() {
    // Get all steps and navigation buttons
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Add event listeners to next buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find current active step
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
            const nextStepNumber = currentStepNumber + 1;
            
            // Validate current step before proceeding
            if (validateStep(currentStepNumber)) {
                // Hide current step
                currentStep.classList.remove('active');
                
                // Show next step
                document.getElementById(`step${nextStepNumber}`).classList.add('active');
                
                // Update progress indicator
                updateProgress(nextStepNumber);
            }
        });
    });
    
    // Add event listeners to previous buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find current active step
            const currentStep = document.querySelector('.form-step.active');
            const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
            const prevStepNumber = currentStepNumber - 1;
            
            // Hide current step
            currentStep.classList.remove('active');
            
            // Show previous step
            document.getElementById(`step${prevStepNumber}`).classList.add('active');
            
            // Update progress indicator
            updateProgress(prevStepNumber);
        });
    });
    
    // Initialize radio card selection
    const radioCards = document.querySelectorAll('.radio-card input[type="radio"]');
    radioCards.forEach(radio => {
        radio.addEventListener('change', function() {
            // Update course format in summary
            if (this.name === 'courseFormat') {
                updateCourseSummaryFormat(this.value);
            }
        });
    });
    
    // Initialize date selection
    const dateSelect = document.getElementById('preferredDate');
    if (dateSelect) {
        dateSelect.addEventListener('change', function() {
            updateCourseSummaryDate(this.value);
        });
    }
}

/**
 * Update progress indicator
 */
function updateProgress(stepNumber) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((step, index) => {
        // Convert from 1-based to 0-based index
        const stepIndex = index + 1;
        
        // Reset all classes
        step.classList.remove('active', 'completed');
        
        // Mark steps as active or completed
        if (stepIndex === stepNumber) {
            step.classList.add('active');
        } else if (stepIndex < stepNumber) {
            step.classList.add('completed');
        }
    });
}

/**
 * Validate specific step
 */
function validateStep(stepNumber) {
    // Step 1 validation
    if (stepNumber === 1) {
        // Check if course format is selected
        const formatSelected = document.querySelector('input[name="courseFormat"]:checked');
        const dateSelected = document.getElementById('preferredDate').value;
        
        if (!formatSelected) {
            showError(document.documentElement.lang === 'cs' ? 
                'Prosím vyberte formát kurzu.' : 
                'Please select a course format.');
            return false;
        }
        
        if (!dateSelected) {
            showError(document.documentElement.lang === 'cs' ? 
                'Prosím vyberte preferované datum.' : 
                'Please select a preferred date.');
            return false;
        }
        
        return true;
    }
    
    // Step 2 validation
    if (stepNumber === 2) {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!firstName || !lastName || !email || !phone) {
            showError(document.documentElement.lang === 'cs' ? 
                'Prosím vyplňte všechna povinná pole.' : 
                'Please fill in all required fields.');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(document.documentElement.lang === 'cs' ? 
                'Prosím zadejte platnou e-mailovou adresu.' : 
                'Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    return true;
}

/**
 * Show error message
 */
function showError(message) {
    // Use a more user-friendly approach than alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Find the active step
    const activeStep = document.querySelector('.form-step.active');
    
    // Check if there's already an error message
    const existingError = activeStep.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message to the top of the active step
    activeStep.insertBefore(errorDiv, activeStep.firstChild);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
}

/**
 * Validate all form fields before final submission
 */
function validateForm() {
    // Get form fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const courseFormat = document.querySelector('input[name="courseFormat"]:checked');
    const preferredDate = document.getElementById('preferredDate').value;
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!firstName || !lastName || !email || !phone || !courseFormat || !preferredDate || !terms) {
        showError(document.documentElement.lang === 'cs' ? 
            'Prosím vyplňte všechna povinná pole.' : 
            'Please fill in all required fields.');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platnou e-mailovou adresu.' : 
            'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

/**
 * Submit form data
 * In a real application, this would send data to a server
 */
function submitForm() {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${document.documentElement.lang === 'cs' ? 'Odesílání...' : 'Submitting...'}`;
    
    // Collect all form data
    const formData = new FormData(document.getElementById('enrollmentForm'));
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    console.log('Form data to submit:', formDataObj);
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show confirmation modal
        document.getElementById('confirmationModal').style.display = 'block';
        
        // Reset form and progress
        resetForm();
        
        // In a real application, you would send form data to a server here
        // using fetch or XMLHttpRequest
    }, 1500);
}

/**
 * Reset form to initial state
 */
function resetForm() {
    // Reset form fields
    document.getElementById('enrollmentForm').reset();
    
    // Reset multi-step navigation
    const steps = document.querySelectorAll('.form-step');
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    
    // Reset progress indicator
    updateProgress(1);
}

/**
 * Update course summary format
 */
function updateCourseSummaryFormat(format) {
    const formatDisplay = document.querySelector('.summary-item:nth-child(2) span');
    if (formatDisplay) {
        let formatText = '';
        
        switch(format) {
            case 'full-day':
                formatText = document.documentElement.lang === 'cs' ? 'Celodenní workshop' : 'Full-day Workshop';
                break;
            case 'half-day':
                formatText = document.documentElement.lang === 'cs' ? 'Půldenní workshop' : 'Half-day Workshop';
                break;
            case 'online':
                formatText = document.documentElement.lang === 'cs' ? 'Online kurz' : 'Online Course';
                break;
            default:
                formatText = format;
        }
        
        formatDisplay.textContent = formatText;
    }
}

/**
 * Update course summary date
 */
function updateCourseSummaryDate(date) {
    const dateDisplay = document.querySelector('.summary-item:nth-child(3) span');
    if (dateDisplay && date) {
        // Format date nicely
        const dateObj = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString(
            document.documentElement.lang === 'cs' ? 'cs-CZ' : 'en-US', 
            options
        );
        
        dateDisplay.textContent = formattedDate;
    }
}

/**
 * Update course links on courses page
 * This function should be called from the courses page
 */
function updateCourseLinks() {
    console.log('Initializing course links');
    // Get all enrollment buttons
    const enrollButtons = document.querySelectorAll('.course-action a');
    console.log('Found enrollment buttons:', enrollButtons.length);
    
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only process buttons with href="#enroll"
            if (this.getAttribute('href') === '#enroll') {
                e.preventDefault();
                console.log('Enrollment button clicked');
                
                // Get course information
                const courseCard = this.closest('.course-card');
                const courseTitle = courseCard.querySelector('h3').textContent.replace(/^\d+\.\s+/, '');
                const courseId = courseCard.closest('.courses-section').id;
                
                console.log('Course info:', courseId, courseTitle);
                
                // Determine language
                const isEnglish = !window.location.pathname.includes('-cs');
                
                // Redirect to enrollment page with course information
                const targetUrl = (isEnglish ? 'enroll.html' : 'enroll-cs.html') + 
                                '?courseId=' + encodeURIComponent(courseId) + 
                                '&courseName=' + encodeURIComponent(courseTitle);
                
                console.log('Redirecting to:', targetUrl);
                window.location.href = targetUrl;
            }
        });
    });
}

// Initialize course links if on courses page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('courses') || window.location.pathname.endsWith('/')) {
        console.log('On courses page, initializing links');
        updateCourseLinks();
    }
});
