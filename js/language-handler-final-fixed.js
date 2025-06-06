/**
 * FINÁLNE SPOĽAHLIVÉ RIEŠENIE - Jazykový prepínač
 * - Garantovane funguje na všetkých stránkach
 * - Žiadne blikanie, žiadne skrývanie obsahu
 * - Jednoduchý a robustný kód
 */

// Počkáme na načítanie DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('[FIXED] Language handler loaded');
    
    try {
        // Zistíme aktuálny jazyk z HTML atribútu
        const htmlLang = document.documentElement.getAttribute('lang') || 'en';
        console.log('[FIXED] Detected language from HTML:', htmlLang);
        
        // Nájdeme jazykový prepínač
        const languageSwitcher = document.querySelector('.language-switcher');
        
        // Ak máme jazykový prepínač, nastavíme aktívnu triedu a pridáme event listenery
        if (languageSwitcher) {
            console.log('[FIXED] Language switcher found');
            
            // Získame všetky odkazy v prepínači
            const links = languageSwitcher.querySelectorAll('a');
            
            // Pre každý odkaz
            links.forEach(link => {
                // Zistíme jazyk odkazu
                const href = link.getAttribute('href');
                const isCs = href.includes('-cs');
                const linkLang = isCs ? 'cs' : 'en';
                
                console.log('[FIXED] Link:', href, 'Language:', linkLang);
                
                // Nastavíme aktívnu triedu podľa aktuálneho jazyka
                if (linkLang === htmlLang) {
                    link.classList.add('active');
                    console.log('[FIXED] Set active:', linkLang);
                } else {
                    link.classList.remove('active');
                }
                
                // Pridáme obsluhu kliknutia
                link.addEventListener('click', function(e) {
                    // Ak je odkaz už aktívny, nič nerobíme
                    if (this.classList.contains('active')) {
                        console.log('[FIXED] Clicked on active language, skipping');
                        e.preventDefault();
                        return;
                    }
                    
                    console.log('[FIXED] Switching language to:', linkLang);
                    
                    // Pridáme cache busting parameter
                    e.preventDefault();
                    let targetUrl = this.href;
                    const separator = targetUrl.includes('?') ? '&' : '?';
                    targetUrl += separator + '_=' + Date.now();
                    
                    console.log('[FIXED] Redirecting to:', targetUrl);
                    window.location.href = targetUrl;
                });
            });
        } else {
            console.warn('[FIXED] No language switcher found');
        }
        
    } catch (error) {
        // V prípade chyby vypíšeme do konzoly
        console.error('[FIXED] Error in language handler:', error);
    }
});
