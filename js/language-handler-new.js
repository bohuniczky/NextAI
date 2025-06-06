/**
 * Language Handler - Nová verze
 * Jednoduché a spolehlivé řešení pro přepínání jazyků
 */

/**
 * Language Handler - MVP verze
 * Jednoduché a spolehlivé řešení pro přepínání jazyků
 */

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Zjistíme aktuální jazyk z HTML atributu
        const htmlLang = document.documentElement.getAttribute('lang') || 'en';
        const currentLang = htmlLang === 'cs' ? 'cs' : 'en';
        
        // Log pro ladění
        console.log('Aktuální jazyk:', currentLang, 'URL:', window.location.pathname);
        
        // Najdeme jazykový přepínač
        const languageSwitcher = document.querySelector('.language-switcher');
        
        // Pokud nemáme jazykový přepínač, alespoň zobrazíme obsah
        if (!languageSwitcher) {
            showContent();
            return;
        }

        // Nastavíme aktivní třídu na správný odkaz
        const links = languageSwitcher.querySelectorAll('a');
        links.forEach(link => {
            const linkLang = link.getAttribute('href').includes('-cs') ? 'cs' : 'en';
            if (linkLang === currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }

        // Přidáme obsluhu kliknutí
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('active')) {
                console.log('Kliknuto na aktivní jazyk, přeskakuji přesměrování');
                return;
            }

            // Získáme cílovou URL
            const targetUrl = this.getAttribute('href');
            const currentPath = window.location.pathname;
            
            // Pokud jsme již na cílové stránce, nepřesměrováváme
            if (currentPath.endsWith(targetUrl)) {
                console.log('Již jsme na cílové stránce:', targetUrl);
                return;
            }

            // Skryjeme obsah před přesměrováním
            document.documentElement.style.opacity = '0';
            document.documentElement.style.transition = 'opacity 0.3s ease-out';
            
            // Přidáme timestamp pro cache busting
            const timestamp = new Date().getTime();
            const separator = targetUrl.includes('?') ? '&' : '?';
            const finalUrl = targetUrl + separator + '_=' + timestamp;
            
            // Po krátké prodlevě přesměrujeme
            setTimeout(function() {
                window.location.href = finalUrl;
            }, 300);
        });
    });

        // Zobrazíme obsah
        showContent();
        
        // Přidáme kontrolu konzistence jazyka v URL a HTML
        checkLanguageConsistency();
    } catch (error) {
        // V případě chyby alespoň zobrazíme obsah
        console.error('Chyba v language handleru:', error);
        showContent();
    }
});

/**
 * Kontroluje konzistenci jazyka mezi URL a HTML atributem
 */
function checkLanguageConsistency() {
    const htmlLang = document.documentElement.getAttribute('lang') || 'en';
    const currentPath = window.location.pathname;
    const shouldBeCS = currentPath.includes('-cs') || 
                     (currentPath.endsWith('/') && htmlLang === 'cs');
    const isCS = htmlLang === 'cs';
    
    // Pokud jazyk v URL neodpovídá jazyku v HTML, upozorníme do konzole
    if ((isCS && !shouldBeCS) || (!isCS && shouldBeCS)) {
        console.warn('Nesoulad jazyka mezi URL a HTML atributem:', {
            url: currentPath,
            htmlLang: htmlLang,
            shouldBeCS: shouldBeCS
        });
    }
}

/**
 * Zobrazí obsah stránky s plynulým přechodem
 */
function showContent() {
    requestAnimationFrame(() => {
        document.documentElement.style.opacity = '0';
        document.documentElement.style.visibility = 'visible';
        requestAnimationFrame(() => {
            document.documentElement.style.opacity = '1';
            document.documentElement.style.transition = 'opacity 0.3s ease-in';
        });
    });
}
