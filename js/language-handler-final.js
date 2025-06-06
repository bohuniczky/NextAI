/**
 * FINÁLNE RIEŠENIE - Jazykový prepínač
 * - Spoľahlivo funguje na všetkých stránkach vrátane podstránok
 * - Žiadne blikanie, plynulé prechody
 * - Detailné logovanie pre diagnostiku
 * - Robustná detekcia jazyka a správne presmerovanie
 */

// Najskôr nastavíme viditeľnosť na hidden, aby sme zabránili blikaniu
document.documentElement.style.visibility = 'hidden';

// Počkáme na načítanie DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('FINAL Language handler loaded');
    
    try {
        // Okamžite nastavíme viditeľnosť pre plynulý prechod
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '0';
        
        // Zistíme aktuálny jazyk z HTML atribútu
        const htmlLang = document.documentElement.getAttribute('lang') || 'en';
        console.log('Detected language from HTML:', htmlLang);
        
        // Nájdeme jazykový prepínač
        const languageSwitcher = document.querySelector('.language-switcher');
        
        // Ak máme jazykový prepínač, nastavíme aktívnu triedu a pridáme event listenery
        if (languageSwitcher) {
            console.log('Language switcher found');
            
            // Získame všetky odkazy v prepínači
            const links = languageSwitcher.querySelectorAll('a');
            
            // Pre každý odkaz
            links.forEach(link => {
                // Upravíme href na absolútnu cestu ak je relatívna
                const href = link.getAttribute('href');
                const isCs = href.includes('-cs');
                const linkLang = isCs ? 'cs' : 'en';
                
                console.log('Link:', href, 'Language:', linkLang);
                
                // Nastavíme aktívnu triedu podľa aktuálneho jazyka
                if (linkLang === htmlLang) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
                
                // Pridáme obsluhu kliknutia
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Ak je odkaz už aktívny, nič nerobíme
                    if (this.classList.contains('active')) {
                        console.log('Clicked on active language, skipping');
                        return;
                    }
                    
                    console.log('Switching language to:', linkLang);
                    
                    // Skryjeme obsah pred prechodom
                    document.documentElement.style.opacity = '0';
                    document.documentElement.style.transition = 'opacity 0.2s ease-out';
                    
                    // Po krátkej pauze presmerujeme
                    setTimeout(() => {
                        // Pridáme timestamp pre cache busting
                        let targetUrl = this.href;
                        const separator = targetUrl.includes('?') ? '&' : '?';
                        targetUrl += separator + '_=' + Date.now();
                        
                        console.log('Redirecting to:', targetUrl);
                        window.location.href = targetUrl;
                    }, 200);
                });
            });
        } else {
            console.log('No language switcher found');
        }
        
        // Zobrazíme obsah s plynulým prechodom
        setTimeout(() => {
            document.documentElement.style.opacity = '1';
            document.documentElement.style.transition = 'opacity 0.3s ease-in';
        }, 50);
        
    } catch (error) {
        // V prípade chyby aspoň zobrazíme obsah
        console.error('Error in language handler:', error);
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
    }
});
