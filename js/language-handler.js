/**
 * Language Handler Script
 * Kompletní řešení pro přepínání jazyků bez blikání
 */

// Konfigurace
const CONFIG = {
    defaultLang: 'en',
    langAttribute: 'data-language',
    transitionDuration: '0.2s',
    transitionEasing: 'ease-out',
    // Přidáme příznak pro sledování, zda už probíhá přesměrování
    isRedirecting: false
};

// Stav aplikace
const state = {
    isInitialized: false,
    isChecking: false,
    currentPath: window.location.pathname,
    currentSearch: window.location.search,
    // Uložíme si referrer, abychom poznali, že přecházíme mezi jazyky
    referrer: document.referrer
};

/**
 * Hlavní inicializační funkce
 */
function initialize() {
    if (state.isInitialized) return;
    state.isInitialized = true;
    
    // Skryjeme obsah před zobrazením
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = `opacity ${CONFIG.transitionDuration} ${CONFIG.transitionEasing}`;
    
    // Inicializace komponent
    initLanguageDetection();
    initLanguageSwitcher();
    
    // Zobrazíme obsah, pokud je vše v pořádku
    if (!state.isChecking) {
        showContent();
    }
}

/**
 * Inicializace detekce jazyka
 */
function initLanguageDetection() {
    const currentLang = document.documentElement.getAttribute(CONFIG.langAttribute);
    const shouldBeCS = state.currentPath.includes('-cs') || 
                     (state.currentPath.endsWith('/') && document.documentElement.lang === 'cs');
    
    // Pokud jazyk v URL odpovídá jazyku stránky, nic neděláme
    if ((currentLang === 'cs' && shouldBeCS) || (currentLang !== 'cs' && !shouldBeCS)) {
        return;
    }
    
    // Jinak přesměrujeme na správnou jazykovou verzi
    state.isChecking = true;
    redirectToCorrectLanguage();
}

/**
 * Přesměrování na správnou jazykovou verzi
 */
function redirectToCorrectLanguage() {
    // Pokud už přesměrování probíhá, ukončíme funkci
    if (CONFIG.isRedirecting) {
        state.isChecking = false;
        showContent();
        return;
    }

    const currentLang = document.documentElement.getAttribute(CONFIG.langAttribute);
    let newUrl = state.currentPath;
    
    // Zjistíme, zda uživatel přišel z jiné stránky našeho webu
    const isInternalNavigation = state.referrer && 
        (state.referrer.includes(window.location.hostname) || 
         state.referrer.includes('localhost'));
    
    // Pokud uživatel přišel z jiné stránky našeho webu, nechceme ho přesměrovávat
    if (isInternalNavigation) {
        state.isChecking = false;
        showContent();
        return;
    }
    
    // Přidáme nebo odebereme -cs podle aktuálního jazyka
    if (currentLang === 'cs') {
        // Přidáme -cs k URL, jen pokud tam ještě není
        if (!newUrl.includes('-cs')) {
            if (newUrl.endsWith('/')) {
                newUrl = newUrl + 'index-cs.html';
            } else if (newUrl.endsWith('.html')) {
                newUrl = newUrl.replace(/(\.html)$/, '-cs$1');
            } else {
                newUrl = newUrl + '-cs';
            }
        }
    } else {
        // Odebereme -cs z URL, pokud tam je
        if (newUrl.includes('-cs')) {
            if (newUrl.endsWith('-cs')) {
                newUrl = newUrl.slice(0, -3);
            } else if (newUrl.endsWith('-cs.html')) {
                newUrl = newUrl.replace(/-cs(\.html)$/, '$1');
            } else if (newUrl.endsWith('index-cs.html')) {
                newUrl = newUrl.replace('index-cs.html', 'index.html');
            }
        }
    }
    
    // Pokud se URL nezměnila, zobrazíme obsah a končíme
    if (newUrl === state.currentPath) {
        state.isChecking = false;
        showContent();
        return;
    }
    
    // Přidáme zpět query parametry, pokud nějaké byly
    if (state.currentSearch) {
        newUrl += (newUrl.includes('?') ? '&' : '?') + state.currentSearch.substring(1);
    }
    
    // Označíme, že probíhá přesměrování
    CONFIG.isRedirecting = true;
    
    // Přesměrujeme na novou URL
    console.log('Přesměrování na:', newUrl);
    window.location.replace(newUrl);
}

/**
 * Inicializace jazykového přepínače
 */
function initLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;
    
    const links = switcher.querySelectorAll('a');
    const currentLang = document.documentElement.getAttribute(CONFIG.langAttribute) || CONFIG.defaultLang;
    
    // Nastavíme aktivní třídu
    links.forEach(link => {
        const linkLang = link.getAttribute('href').includes('-cs') ? 'cs' : 'en';
        link.classList.toggle('active', linkLang === currentLang);
        
        // Přidáme event listener pro plynulý přechod
        link.addEventListener('click', handleLanguageSwitch);
    });
}

/**
 * Obsluha přepnutí jazyka
 */
function handleLanguageSwitch(e) {
    e.preventDefault();
    
    // Získáme cílovou URL
    const targetUrl = this.getAttribute('href');
    
    // Pokud už klikáme na aktivní odkaz, nic neděláme
    if (this.classList.contains('active')) {
        return;
    }
    
    // Plynulé skrytí obsahu
    document.documentElement.style.opacity = '0';
    document.documentElement.style.pointerEvents = 'none';
    
    // Krátká prodleva pro plynulý přechod
    setTimeout(() => {
        // Přidáme timestamp pro vynucení obnovení stránky
        const separator = targetUrl.includes('?') ? '&' : '?';
        const urlWithTimestamp = targetUrl + separator + 't=' + new Date().getTime();
        window.location.href = urlWithTimestamp;
    }, parseFloat(CONFIG.transitionDuration) * 1000);
}

/**
 * Zobrazí obsah stránky plynulým rozsvícením
 */
function showContent() {
    // Zajistíme, že obsah je viditelný (pokud náhodou není)
    document.documentElement.style.display = 'block';
    
    // Spustíme plynulé rozsvícení
    requestAnimationFrame(() => {
        document.documentElement.style.opacity = '1';
        document.documentElement.style.pointerEvents = 'auto';
    });
}

// Spustíme inicializaci při načtení DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    // DOM je již načtený
    setTimeout(initialize, 0);
}

/**
 * Kontroluje, zda jazyk stránky odpovídá URL
 * Pokud ne, přesměruje na správnou verzi
 */
function checkLanguageMatch() {
    // Získáme jazyk stránky z HTML elementu
    const htmlElement = document.documentElement;
    const dataLanguage = htmlElement.getAttribute('data-language');
    
    // Označíme, že kontrola jazyka proběhla
    languageChecked = true;
    
    // Pokud stránka nemá nastavený data-language atribut, zobrazíme obsah a končíme
    if (!dataLanguage) {
        console.warn('Page does not have data-language attribute, skipping language check');
        if (contentReady) showContent();
        return;
    }
    
    // Získáme aktuální cestu a název souboru
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const fileName = pathParts[pathParts.length - 1] || 'index.html';
    
    // Detekce jazyka z URL a stránky
    const isCzechUrl = fileName.includes('-cs');
    const isCzechPage = dataLanguage === 'cs';
    
    // Pokud jazyk URL odpovídá jazyku stránky, zobrazíme obsah a končíme
    if (isCzechUrl === isCzechPage) {
        if (contentReady) showContent();
        return;
    }
    
    // Pokud jsme zde, došlo k nesouladu - logujeme a přesměrujeme
    console.log('Language mismatch detected:', { fileName, dataLanguage, isCzechUrl, isCzechPage });
    
    // Vytvoříme správnou URL podle jazyka stránky
    let correctPath;
    
    // Speciální případy pro index a courses
    if (isCzechPage) {
        // Jsme na české stránce, ale URL je anglická - přidáme -cs
        if (fileName === 'index.html' || fileName === '' || fileName.endsWith('/')) {
            correctPath = currentPath.replace(/(index\.html)?$/, 'index-cs.html');
        } else if (fileName === 'courses.html') {
            correctPath = currentPath.replace('courses.html', 'courses-cs.html');
        } else if (fileName.endsWith('.html')) {
            // Obecný případ - přidáme -cs před .html
            correctPath = currentPath.replace(/(\.html)$/, '-cs$1');
        } else {
            // Pro ostatní případy přidáme -cs na konec cesty
            correctPath = currentPath + '-cs';
        }
    } else {
        // Jsme na anglické stránce, ale URL je česká - odstraníme -cs
        if (fileName === 'index-cs.html' || (fileName === 'index-cs' && !currentPath.endsWith('/'))) {
            correctPath = currentPath.replace('index-cs', 'index');
        } else if (fileName === 'courses-cs.html') {
            correctPath = currentPath.replace('courses-cs.html', 'courses.html');
        } else if (fileName.endsWith('-cs.html')) {
            // Obecný případ - odstraníme -cs před .html
            correctPath = currentPath.replace(/-cs(\.html)$/, '$1');
        } else if (fileName.endsWith('-cs')) {
            // Odstraníme -cs z konce cesty
            correctPath = currentPath.replace(/-cs$/, '');
        } else {
            // Výchozí chování - zobrazíme obsah
            if (contentReady) showContent();
            return;
        }
    }
    
    // Přidáme timestamp pro vynucení obnovení stránky a zabránění cachování
    const timestamp = new Date().getTime();
    const separator = correctPath.includes('?') ? '&' : '?';
    const redirectUrl = correctPath + separator + '_t=' + timestamp;
    
    console.log('Redirecting to:', redirectUrl);
    
    // Přesměrujeme na správnou URL pomocí replace (neukládá do historie)
    window.location.replace(redirectUrl);
}



/**
 * Zobrazí obsah stránky plynulým rozsvícením
 */
function showContent() {
    // Zajistíme, že obsah je viditelný (pokud náhodou není)
    document.documentElement.style.display = 'block';
    
    // Krátká prodleva pro zajištění, že prohlížeč má čas na vykreslení
    requestAnimationFrame(() => {
        // Spustíme plynulé rozsvícení
        requestAnimationFrame(() => {
            document.documentElement.style.opacity = '1';
        });
    });
}

/**
 * Inicializuje přepínač jazyků
 */
function initLanguageSwitcher() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (!languageSwitcher) return;
    
    const languageLinks = languageSwitcher.querySelectorAll('a');
    const currentPath = window.location.pathname;
    const isEnglishPage = !currentPath.includes('-cs');
    
    // Nastavíme aktivní třídu a přidáme event listenery
    languageLinks.forEach(link => {
        // Nastavíme aktivní třídu
        const linkHref = link.getAttribute('href');
        const isEnglishLink = !linkHref.includes('-cs');
        
        if (isEnglishLink === isEnglishPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Přidáme event listener
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Plynule skryjeme obsah před přesměrováním
            document.documentElement.style.opacity = '0';
            document.documentElement.style.pointerEvents = 'none'; // Zamezíme interakci během přechodu
            
            // Získáme cílovou URL
            const targetUrl = this.getAttribute('href');
            
            // Přidáme timestamp pro vynucení obnovení stránky
            const timestamp = new Date().getTime();
            const separator = targetUrl.includes('?') ? '&' : '?';
            const urlWithTimestamp = targetUrl + separator + '_t=' + timestamp;
            
            // Přesměrujeme na novou URL
            window.location.href = urlWithTimestamp;
        });
    });
}
