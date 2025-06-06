/**
 * NextAI Simple Enrollment Popup
 * Jednoduchý a spolehlivý přihlašovací formulář
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Enrollment popup initialized');
    
    // Vytvořit modální okna, pokud neexistují
    if (!document.getElementById('enrollmentModal')) {
        const modal = createEnrollmentModal();
        document.body.appendChild(modal);
        console.log('Sign Up modal created');
    }
    
    if (!document.getElementById('signinModal')) {
        const signinModal = createSigninModal();
        document.body.appendChild(signinModal);
        console.log('Sign In modal created');
    }
    
    // Najít všechna tlačítka pro registraci
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    console.log('Found ' + enrollButtons.length + ' enrollment buttons');
    
    // Přidat událost kliknutí na všechna tlačítka pro registraci
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Enrollment button clicked');
            
            // Získat informace o kurzu, pokud jsou k dispozici
            const courseId = this.dataset.courseId || '';
            const courseName = this.dataset.courseName || '';
            console.log('Course name:', courseName, 'Course ID:', courseId);
            
            // Uložit vybraný kurz do dočasného úložiště
            sessionStorage.setItem('selectedCourseId', courseId);
            sessionStorage.setItem('selectedCourseName', courseName);
            
            // Zobrazit modální okno
            showModal();
        });
    });
    
    // Najít všechna tlačítka pro přihlášení
    const signinButtons = document.querySelectorAll('.btn-text');
    console.log('Found ' + signinButtons.length + ' signin buttons');
    
    // Přidat událost kliknutí na všechna tlačítka pro přihlášení
    signinButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Sign in button clicked');
            
            // Zobrazit přihlašovací modální okno
            const modal = document.getElementById('signinModal');
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('show');
            }
        });
    });
    
    // Zavřít modální okno při kliknutí na tlačítko zavřít
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
            }
        }
    });
    
    // Zavřít modální okno při kliknutí mimo obsah
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('enrollmentModal');
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Zavřít modální okno klávesou Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });
    
    // Zpracovat odeslání formuláře
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'quickEnrollForm') {
            e.preventDefault();
            console.log('Form submitted');
            
            // Validovat formulář
            if (validateForm()) {
                // Simulovat odeslání formuláře
                submitForm();
            }
        }
    });
});

/**
 * Vytvořit modální okno pro přihlášení
 */
function createEnrollmentModal() {
    const isPageCzech = document.documentElement.lang === 'cs';
    
    // Vytvořit kontejner modálního okna
    const modal = document.createElement('div');
    modal.id = 'enrollmentModal';
    modal.className = 'modal';
    
    // Seznam dostupných kurzů
    const courses = [
        { id: 'course1', name: isPageCzech ? 'AI pro každého: Úvod bez technických znalostí' : 'AI for Everyone: Introduction with No Technical Knowledge Required' },
        { id: 'course2', name: isPageCzech ? 'Top AI nástroje - Text, obrázky, produktivita' : 'Top AI Tools - Text, Images, Productivity' },
        { id: 'course3', name: isPageCzech ? 'Souboj AI gigantů' : 'AI Giants Battle' },
        { id: 'course4', name: isPageCzech ? 'Analýza klientského portfolia s AI' : 'Client Portfolio Analysis with AI' },
        { id: 'course5', name: isPageCzech ? 'Pokročilé finanční modelování s AI' : 'Advanced Financial Modeling with AI' },
        { id: 'course6', name: isPageCzech ? 'AI pro rychlý růst týmu' : 'AI for Rapid Team Growth' }
    ];
    
    // Obsah modálního okna
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isPageCzech ? 'Registrace' : 'Sign Up'}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p class="modal-subtitle">${isPageCzech ? 'Vyplňte své údaje pro přihlášení na kurz' : 'Fill in your details to enroll in the course'}</p>
                
                <form id="quickEnrollForm">
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
                    <div class="form-group">
                        <label for="password">${isPageCzech ? 'Heslo' : 'Password'}*</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-group">
                        <label for="courseSelect">${isPageCzech ? 'Vyberte kurz' : 'Select Course'}*</label>
                        <select id="courseSelect" name="courseSelect" required>
                            <option value="">${isPageCzech ? 'Vyberte kurz' : 'Select a course'}</option>
                            ${courses.map(course => `<option value="${course.id}">${course.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${isPageCzech ? 'Registrovat' : 'Enroll Now'}</button>
                    </div>
                </form>
                
                <div id="formSuccess" class="success-message" style="display: none;">
                    ${isPageCzech ? 
                        'Děkujeme za registraci! Váš účet byl vytvořen a byli jste přihlášeni do vybraného kurzu.' : 
                        'Thank you for signing up! Your account has been created and you have been enrolled in the selected course.'}
                </div>
            </div>
        </div>
    `;
    
    // Přidat styly pro modální okno
    addModalStyles();
    
    return modal;
}

/**
 * Vytvoří modální okno pro přihlášení
 */
function createSigninModal() {
    // Zjistit, zda je stránka v češtině
    const isPageCzech = document.documentElement.lang === 'cs';
    
    // Vytvořit kontejner modálního okna
    const modal = document.createElement('div');
    modal.id = 'signinModal';
    modal.className = 'modal';
    
    // Obsah modálního okna
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${isPageCzech ? 'Přihlášení' : 'Sign In'}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <p class="modal-subtitle">${isPageCzech ? 'Zadejte své přihlašovací údaje' : 'Enter your login credentials'}</p>
                
                <form id="signinForm">
                    <div class="form-group">
                        <label for="signinEmail">${isPageCzech ? 'E-mail' : 'Email'}*</label>
                        <input type="email" id="signinEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="signinPassword">${isPageCzech ? 'Heslo' : 'Password'}*</label>
                        <input type="password" id="signinPassword" name="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">${isPageCzech ? 'Přihlásit' : 'Sign In'}</button>
                    </div>
                </form>
                
                <div id="signinFormSuccess" class="success-message" style="display: none;">
                    ${isPageCzech ? 
                        'Přihlášení bylo úspěšné! Budete přesměrováni.' : 
                        'Sign in successful! You will be redirected.'}
                </div>
            </div>
        </div>
    `;
    
    // Přidat událost pro zavření modálního okna
    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    // Zavřít modální okno při kliknutí mimo obsah
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            e.target.classList.remove('show');
        }
    });
    
    // Zpracování formuláře
    modal.querySelector('#signinForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Sign in form submitted');
        
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        
        // Validace formuláře
        if (!email || !password) {
            alert(isPageCzech ? 'Vyplňte prosím všechna povinná pole' : 'Please fill in all required fields');
            return;
        }
        
        // Simulace odeslání formuláře
        console.log('Sign in data:', { email, password });
        
        // Zobrazit zprávu o úspěchu
        document.getElementById('signinForm').style.display = 'none';
        document.getElementById('signinFormSuccess').style.display = 'block';
        
        // Zavřít modální okno po 5 sekundách
        setTimeout(function() {
            modal.style.display = 'none';
            modal.classList.remove('show');
            // Reset formuláře a zprávy
            document.getElementById('signinForm').style.display = 'block';
            document.getElementById('signinFormSuccess').style.display = 'none';
            document.getElementById('signinForm').reset();
        }, 5000);
    });
    
    return modal;
}

/**
 * Přidat styly pro modální okno
 */
function addModalStyles() {
    if (document.getElementById('enrollmentModalStyles')) {
        return;
    }
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'enrollmentModalStyles';
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
        }
        
        .modal.show {
            display: flex;
        }
        
        .modal-content {
            background-color: #fff;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
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
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-subtitle {
            margin-top: 0;
            color: #666;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        
        .form-actions {
            margin-top: 20px;
        }
        
        .btn-primary {
            background-color: #1a73e8;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        
        .btn-primary:hover {
            background-color: #1557b0;
        }
        
        .error-message {
            color: #d32f2f;
            background-color: #fbe9e7;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
        
        .success-message {
            color: #388e3c;
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 4px;
            margin-top: 15px;
            text-align: center;
        }
        
        .selected-course-info {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
        }
    `;
    
    document.head.appendChild(styleSheet);
}

/**
 * Zobrazit modální okno
 */
function showModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Resetovat formulář
        const form = document.getElementById('quickEnrollForm');
        if (form) {
            form.reset();
            form.style.display = 'block';
        }
        
        // Skrýt úspěšnou zprávu
        const success = document.getElementById('formSuccess');
        if (success) {
            success.style.display = 'none';
            // Odstranit předchozí informace o kurzu
            const previousCourseInfo = success.querySelector('.selected-course-success');
            if (previousCourseInfo) {
                previousCourseInfo.remove();
            }
        }
        
        // Odstranit chybové zprávy
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        
        // Předvybrat kurz, pokud byl předán z tlačítka
        const courseSelect = document.getElementById('courseSelect');
        if (courseSelect) {
            // Získat ID kurzu z sessionStorage
            const selectedCourseId = sessionStorage.getItem('selectedCourseId');
            const selectedCourseName = sessionStorage.getItem('selectedCourseName');
            
            if (selectedCourseId) {
                // Najít odpovídající kurz podle ID
                const options = Array.from(courseSelect.options);
                const matchingOption = options.find(option => 
                    option.value === selectedCourseId);
                
                if (matchingOption) {
                    courseSelect.value = matchingOption.value;
                }
            } else if (selectedCourseName) {
                // Pokud nemáme ID, zkusit najít podle názvu
                const options = Array.from(courseSelect.options);
                const matchingOption = options.find(option => 
                    option.textContent === selectedCourseName);
                
                if (matchingOption) {
                    courseSelect.value = matchingOption.value;
                }
            }
        }
    }
}

/**
 * Skrýt modální okno
 */
function hideModal() {
    const modal = document.getElementById('enrollmentModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        // Vyčistit sessionStorage
        sessionStorage.removeItem('selectedCourseId');
        sessionStorage.removeItem('selectedCourseName');
    }
}

/**
 * Validovat formulář
 */
function validateForm() {
    // Odstranit existující chybové zprávy
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Získat hodnoty polí
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const courseSelect = document.getElementById('courseSelect');
    const selectedCourse = courseSelect ? courseSelect.value : null;
    
    // Zkontrolovat, zda jsou pole vyplněna
    if (!firstName || !lastName || !email || !password) {
        showMessage('error', document.documentElement.lang === 'cs' ? 
            'Prosím vyplňte všechna povinná pole.' : 
            'Please fill in all required fields.');
        return false;
    }
    
    // Zkontrolovat, zda je vybrán kurz
    if (courseSelect && !selectedCourse) {
        showMessage('error', document.documentElement.lang === 'cs' ? 
            'Prosím vyberte kurz.' : 
            'Please select a course.');
        return false;
    }
    
    // Validovat formát e-mailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('error', document.documentElement.lang === 'cs' ? 
            'Prosím zadejte platnou e-mailovou adresu.' : 
            'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

/**
 * Zobrazit zprávu ve formuláři
 */
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Vložit na začátek formuláře
    const form = document.getElementById('quickEnrollForm');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
    }
}

/**
 * Simulovat odeslání formuláře
 */
function submitForm() {
    // Zobrazit načítání
    const submitButton = document.querySelector('#quickEnrollForm button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = document.documentElement.lang === 'cs' ? 'Zpracování...' : 'Processing...';
    submitButton.disabled = true;
    
    // Získat vybraný kurz
    const courseSelect = document.getElementById('courseSelect');
    let selectedCourseName = '';
    if (courseSelect && courseSelect.selectedIndex > 0) {
        selectedCourseName = courseSelect.options[courseSelect.selectedIndex].text;
    }
    
    // Simulovat odeslání (v reálné aplikaci by zde byl AJAX požadavek)
    setTimeout(function() {
        // Skrýt formulář
        const form = document.getElementById('quickEnrollForm');
        if (form) {
            form.style.display = 'none';
        }
        
        // Zobrazit úspěšnou zprávu
        const success = document.getElementById('formSuccess');
        if (success) {
            success.style.display = 'block';
            
            // Přidat informaci o vybraném kurzu
            if (selectedCourseName) {
                const isPageCzech = document.documentElement.lang === 'cs';
                const courseInfo = document.createElement('p');
                courseInfo.className = 'selected-course-success';
                courseInfo.innerHTML = `<strong>${isPageCzech ? 'Vybraný kurz' : 'Selected course'}:</strong> ${selectedCourseName}`;
                success.appendChild(courseInfo);
            }
        }
        
        // Automaticky zavřít po 5 sekundách
        setTimeout(hideModal, 5000);
    }, 1500);
}
