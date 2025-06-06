/**
 * KRIZOVÉ ŘEŠENÍ - Jednoduchý a spolehlivý jazykový handler
 * - Funguje na všech stránkách včetně podstránek
 * - Žádné blikání, žádné problémy
 */

// Počkáme na načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Language handler loaded');
    
    try {
        // Okamžitě nastavíme viditelnost pro plynulý přechod
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '0';
        
        // Zjistíme aktuální jazyk z HTML atributu
        const htmlLang = document.documentElement.getAttribute('lang') || 'en';
        console.log('Detected language from HTML:', htmlLang);
        
        // Najdeme jazykový přepínač
        const languageSwitcher = document.querySelector('.language-switcher');
        
        // Pokud máme jazykový přepínač, nastavíme aktivní třídu a přidáme event listenery
        if (languageSwitcher) {
            console.log('Language switcher found');
            
            // Získáme všechny odkazy v přepínači
            const links = languageSwitcher.querySelectorAll('a');
            
            // Pro každý odkaz
            links.forEach(link => {
                // Určíme jazyk odkazu (cs nebo en)
                const href = link.getAttribute('href');
                const isCs = href.includes('-cs');
                const linkLang = isCs ? 'cs' : 'en';
                
                console.log('Link:', href, 'Language:', linkLang);
                
                // Nastavíme aktivní třídu podle aktuálního jazyka
                if (linkLang === htmlLang) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
                
                // Přidáme obsluhu kliknutí
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Pokud je odkaz již aktivní, nic neděláme
                    if (this.classList.contains('active')) {
                        console.log('Clicked on active language, skipping');
                        return;
                    }
                    
                    console.log('Switching language to:', linkLang);
                    
                    // Skryjeme obsah před přechodem
                    document.documentElement.style.opacity = '0';
                    
                    // Po krátké prodlevě přesměrujeme
                    setTimeout(() => {
                        // Přidáme timestamp pro cache busting
                        let targetUrl = this.href;
                        const separator = targetUrl.includes('?') ? '&' : '?';
                        targetUrl += separator + '_=' + Date.now();
                        
                        console.log('Redirecting to:', targetUrl);
                        window.location.href = targetUrl;
                    }, 300);
                });
            });
        } else {
            console.log('No language switcher found');
        }
        
        // Zobrazíme obsah s plynulým přechodem
        setTimeout(() => {
            document.documentElement.style.opacity = '1';
            document.documentElement.style.transition = 'opacity 0.3s ease-in';
        }, 50);
        
    } catch (error) {
        // V případě chyby alespoň zobrazíme obsah
        console.error('Error in language handler:', error);
        document.documentElement.style.visibility = 'visible';
        document.documentElement.style.opacity = '1';
    }
});
