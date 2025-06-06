/**
 * NextAI Workshop Request Form JavaScript
 * Handles form validation, submission, and confirmation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    const workshopForm = document.getElementById('workshopRequestForm');
    if (workshopForm) {
        workshopForm.addEventListener('submit', function(e) {
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
    
    // Initialize form elements
    initFormElements();
});

/**
 * Initialize form elements like custom selects, etc.
 */
function initFormElements() {
    // Add event listener to participant count input to update range value display
    const participantCountInput = document.getElementById('participantCount');
    const participantCountValue = document.getElementById('participantCountValue');
    
    if (participantCountInput && participantCountValue) {
        // Set initial value
        participantCountValue.textContent = participantCountInput.value;
        
        // Update on change
        participantCountInput.addEventListener('input', function() {
            participantCountValue.textContent = this.value;
        });
    }
    
    // Add event listeners to duration radio buttons to show additional info
    const durationRadios = document.querySelectorAll('input[name="workshopDuration"]');
    durationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateDurationInfo(this.value);
        });
    });
}

/**
 * Update duration info based on selection
 */
function updateDurationInfo(duration) {
    const infoElement = document.querySelector('.duration-info');
    if (!infoElement) return;
    
    let infoText = '';
    const isEnglish = document.documentElement.lang === 'en';
    
    switch(duration) {
        case 'half-day':
            infoText = isEnglish ? 
                '4 hours, ideal for focused topics' : 
                '4 hodiny, ideální pro zaměřená témata';
            break;
        case 'full-day':
            infoText = isEnglish ? 
                '8 hours with lunch break, comprehensive coverage' : 
                '8 hodin s přestávkou na oběd, komplexní pokrytí';
            break;
        case 'two-day':
            infoText = isEnglish ? 
                '16 hours over two days, deep dive with hands-on practice' : 
                '16 hodin během dvou dnů, hloubkové ponoření s praktickým cvičením';
            break;
        case 'custom':
            infoText = isEnglish ? 
                'Tell us your preferred duration in the additional requirements' : 
                'Sdělte nám preferovanou délku v dodatečných požadavcích';
            break;
    }
    
    infoElement.textContent = infoText;
    infoElement.style.display = infoText ? 'block' : 'none';
}

/**
 * Validate form fields
 */
function validateForm() {
    // Get form fields
    const organizationName = document.getElementById('organizationName').value.trim();
    const contactName = document.getElementById('contactName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const workshopTopic = document.getElementById('workshopTopic').value.trim();
    const participantCount = document.getElementById('participantCount').value;
    const workshopDuration = document.querySelector('input[name="workshopDuration"]:checked');
    const preferredDate = document.getElementById('preferredDate').value;
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!organizationName || !contactName || !email || !phone || !workshopTopic || 
        !participantCount || !workshopDuration || !preferredDate || !terms) {
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
 * Show error message
 */
function showError(message) {
    // Use a more user-friendly approach than alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add error message to the top of the form
    const form = document.getElementById('workshopRequestForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorDiv.classList.add('fade-out');
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 3000);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    const formData = new FormData(document.getElementById('workshopRequestForm'));
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });
    
    console.log('Workshop request data to submit:', formDataObj);
    
    // Simulate API call with timeout
    setTimeout(function() {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
        
        // Show confirmation modal
        document.getElementById('confirmationModal').style.display = 'block';
        
        // Add workshop details to confirmation
        const workshopTopic = document.getElementById('workshopTopic').value;
        const organizationName = document.getElementById('organizationName').value;
        
        // Add to confirmation message if not already added
        const confirmationInfo = document.querySelector('.confirmation-info');
        if (confirmationInfo && !document.querySelector('.workshop-confirmation-details')) {
            const confirmationDetails = document.createElement('div');
            confirmationDetails.className = 'workshop-confirmation-details';
            confirmationDetails.innerHTML = `
                <p><strong>${document.documentElement.lang === 'cs' ? 'Téma:' : 'Topic:'}</strong> ${workshopTopic}</p>
                <p><strong>${document.documentElement.lang === 'cs' ? 'Organizace:' : 'Organization:'}</strong> ${organizationName}</p>
            `;
            
            // Insert before the next steps list
            const nextStepsList = confirmationInfo.querySelector('ol, ul');
            if (nextStepsList) {
                confirmationInfo.insertBefore(confirmationDetails, nextStepsList);
            } else {
                confirmationInfo.insertBefore(confirmationDetails, confirmationInfo.firstChild);
            }
        }
        
        // Reset form
        document.getElementById('workshopRequestForm').reset();
        
        // In a real application, you would send form data to a server here
        // using fetch or XMLHttpRequest
    }, 1500);
}
