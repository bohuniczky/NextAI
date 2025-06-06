/**
 * Jednoduchý a spolehlivý jazykový handler
 * - Detekuje jazyk z HTML atributu
 * - Nastavuje aktivní třídu na jazykovém přepínači
 * - Zajišťuje plynulé přechody mezi jazyky
 */

// Inicializace při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Skryjeme obsah během inicializace
    document.documentElement.style.opacity = '0';
    document.documentElement.style.visibility = 'visible';
    
    // Zjistíme aktuální jazyk z HTML
    const currentLang = document.documentElement.lang || 'en';
    
    // Najdeme jazykový přepínač
    const switcher = document.querySelector('.language-switcher');
    
    // Pokud existuje přepínač, nastavíme aktivní třídu a přidáme obsluhu kliknutí
    if (switcher) {
        const links = switcher.querySelectorAll('a');
        
        // Pro každý odkaz v přepínači
        links.forEach(link => {
            // Zjistíme jazyk odkazu
            const linkLang = link.href.includes('-cs') ? 'cs' : 'en';
            
            // Nastavíme aktivní třídu
            if (linkLang === currentLang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
            
            // Přidáme obsluhu kliknutí
            link.addEventListener('click', function(e) {
                // Pokud je odkaz již aktivní, nic neděláme
                if (this.classList.contains('active')) {
                    e.preventDefault();
                    return;
                }
                
                // Jinak skryjeme obsah před přechodem
                e.preventDefault();
                fadeOut(() => {
                    // Přidáme cache busting
                    const url = new URL(this.href);
                    url.searchParams.set('_', Date.now());
                    window.location.href = url.toString();
                });
            });
        });
    }
    
    // Zobrazíme obsah
    fadeIn();
});

/**
 * Plynule skryje obsah a pak zavolá callback
 */
function fadeOut(callback) {
    document.documentElement.style.opacity = '0';
    setTimeout(callback, 300);
}

/**
 * Plynule zobrazí obsah
 */
function fadeIn() {
    setTimeout(() => {
        document.documentElement.style.opacity = '1';
        document.documentElement.style.transition = 'opacity 0.3s ease-in';
    }, 10);
}
