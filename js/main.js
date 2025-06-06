document.addEventListener('DOMContentLoaded', function() {
    // Toggle switch functionality for lead magnet
    const companyOption = document.getElementById('company-option');
    const individualOption = document.getElementById('individual-option');
    const companyFields = document.querySelector('.company-fields');
    const individualFields = document.querySelector('.individual-fields');
    const companyResults = document.querySelector('.company-results');
    const individualResults = document.querySelector('.individual-results');
    const assessmentTitle = document.querySelector('.assessment-title');
    const assessmentButton = document.querySelector('.assessment-button');
    const analysisText = document.querySelector('.analysis-text');
    
    if (companyOption && individualOption) {
        // Handle company option
        companyOption.addEventListener('change', function() {
            if (this.checked) {
                companyFields.style.display = 'block';
                individualFields.style.display = 'none';
                companyResults.style.display = 'block';
                individualResults.style.display = 'none';
                assessmentTitle.textContent = 'Business Assessment';
                assessmentButton.textContent = 'Get Free Company Assessment';
                analysisText.textContent = 'Analyzing your business...';
            }
        });
        
        // Handle individual option
        individualOption.addEventListener('change', function() {
            if (this.checked) {
                companyFields.style.display = 'none';
                individualFields.style.display = 'block';
                companyResults.style.display = 'none';
                individualResults.style.display = 'block';
                assessmentTitle.textContent = 'Consultant Assessment';
                assessmentButton.textContent = 'Get Free Personal Assessment';
                analysisText.textContent = 'Analyzing your potential...';
            }
        });
    }
    
    // Kód pro práci s uloženým jazykem byl přesunut do language-handler.js
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navCta = document.querySelector('.nav-cta');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            navCta.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                
                // Handle modal links specially
                if (targetId === '#assessment') {
                    document.querySelector(targetId).style.display = 'flex';
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                        mobileMenuToggle.click();
                    }
                }
            }
        });
    });

    // Modal functionality
    const assessmentModal = document.getElementById('assessment');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            assessmentModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === assessmentModal) {
            assessmentModal.style.display = 'none';
        }
    });

    // Testimonial slider
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (testimonials.length > 0 && dotsContainer) {
        let currentSlide = 0;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        // Initially hide all slides except the first
        testimonials.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
        
        // Functions to control the slider
        function goToSlide(slideIndex) {
            testimonials.forEach((slide, index) => {
                slide.style.display = index === slideIndex ? 'block' : 'none';
                dots[index].classList.toggle('active', index === slideIndex);
            });
            currentSlide = slideIndex;
        }
        
        function nextSlide() {
            const newIndex = (currentSlide + 1) % testimonials.length;
            goToSlide(newIndex);
        }
        
        function prevSlide() {
            const newIndex = (currentSlide - 1 + testimonials.length) % testimonials.length;
            goToSlide(newIndex);
        }
        
        // Add event listeners to buttons
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Auto-advance slides every 5 seconds
        setInterval(nextSlide, 5000);
    }

    // Form submissions
    const contactForm = document.getElementById('contactForm');
    const assessmentForm = document.getElementById('assessmentForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server
            // For now, just show a success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real implementation, you would send the form data to a server
            // For now, just show a success message
            alert('Thank you for requesting an assessment! Our team will contact you shortly.');
            assessmentForm.reset();
            assessmentModal.style.display = 'none';
        });
    }

    // Sticky header
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.hero');
    
    if (header && heroSection) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    // Animation on scroll
    const animateElements = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card, .certification-badges, .speaker-card');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load
    
    // Enhanced CTA button effects
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        // Mouse enter effect
        button.addEventListener('mouseenter', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            this.appendChild(ripple);
            
            // Position the ripple where mouse entered
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add subtle text shadow
            this.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.7)';
            
            // Scale text slightly
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        // Mouse leave effect
        button.addEventListener('mouseleave', function() {
            // Reset text shadow
            this.style.textShadow = 'none';
            
            // Reset transform
            this.style.transform = '';
        });
        
        // Click effect
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
});
