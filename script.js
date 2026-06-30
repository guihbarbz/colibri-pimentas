document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dark Mode Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });

    function updateIcon(isDark) {
        if (isDark) {
            themeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
        } else {
            themeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
        }
    }

    // --- 2. Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 3. Accordion Exclusivo ---
    const details = document.querySelectorAll("details");
    details.forEach((targetDetail) => {
        targetDetail.addEventListener("click", () => {
            details.forEach((detail) => {
                if (detail !== targetDetail) {
                    detail.removeAttribute("open");
                }
            });
        });
    });

    // --- 4. Smooth Scroll JS Fallback (Garante compatibilidade) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// --- Lógica do Sticky Scroll (Guia em 6 Passos) ---
    const heroTrack = document.getElementById('hero-track');
    const intro = document.getElementById('scrolly-intro');
    const steps = document.querySelectorAll('.scrolly-step');
    
    if (heroTrack) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const rect = heroTrack.getBoundingClientRect();
                
                // Calcula o progresso de 0 a 1
                let progress = -rect.top / (rect.height - window.innerHeight);
                progress = Math.max(0, Math.min(1, progress));

                // 1. Controla a Introdução (Desaparece gradualmente nos primeiros 12% da rolagem)
                if (progress < 0.12) {
                    intro.style.opacity = 1 - (progress * (1 / 0.12));
                    intro.style.transform = `translateY(${progress * -100}px) scale(${1 - (progress * 0.5)})`;
                    intro.style.pointerEvents = 'auto';
                } else {
                    intro.style.opacity = 0;
                    intro.style.pointerEvents = 'none';
                }

                // 2. Controla os 6 Passos e a Sidebar lateral
                const startOffset = 0.15;
                const totalSteps = steps.length;
                const stepWindow = (1 - startOffset) / totalSteps;

                // Seleciona os itens da sidebar UMA ÚNICA VEZ antes do loop
                const sidebarItems = document.querySelectorAll('.sidebar-item');

                steps.forEach((step, index) => {
                    const stepStart = startOffset + (index * stepWindow);
                    const stepEnd = stepStart + stepWindow;

                    // Se o progresso atual estiver dentro da "janela" desse passo
                    if (progress >= stepStart && progress < stepEnd) {
                        step.classList.add('active');
                        
                        // Atualiza a sidebar lateral
                        sidebarItems.forEach(item => item.classList.remove('active'));
                        sidebarItems[index].classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- Header Transparente -> Sólido no Scroll ---
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });