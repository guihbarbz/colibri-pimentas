/* =======================================================
   1. FORÇAR SCROLL PARA O TOPO AO CARREGAR
======================================================= */
window.history.scrollRestoration = 'manual';
window.onload = function() {
    window.scrollTo(0, 0);
};

/* =======================================================
   2. HEADER DINÂMICO
======================================================= */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* =======================================================
   3. CARROSSEL VERTICAL DA HERO SECTION
======================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    
    if (track) {
        const items = track.querySelectorAll('.carousel-item');
        const itemHeight = 60;
        const totalOriginals = 10;
        let currentIndex = 3; 
        
        items.forEach(item => item.classList.remove('active'));
        items[currentIndex].classList.add('active');

        setInterval(() => {
            currentIndex++;
            
            track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
            track.style.transform = `translateY(-${(currentIndex - 3) * itemHeight}px)`;
            
            items.forEach(item => item.classList.remove('active'));
            items[currentIndex].classList.add('active');

            if (currentIndex === 3 + totalOriginals) {
                setTimeout(() => {
                    track.style.transition = 'none';
                    currentIndex = 3; 
                    track.style.transform = `translateY(0px)`;
                    
                    items.forEach(item => item.classList.remove('active'));
                    items[currentIndex].classList.add('active');
                    
                    track.offsetHeight; 
                }, 500); 
            }
        }, 2500);
    }
});

/* =======================================================
   4. SCROLLYTELLING SVG (O NOVO CAMINHO)
======================================================= */
(function(){
    const track = document.getElementById('journeyTrack');
    if(!track) return; // Só executa se a seção existir

    const svg = document.getElementById('roadSvg');
    const bgPath = document.getElementById('roadBg');
    const progPath = document.getElementById('roadProgress');
    const car = document.getElementById('roadCar');
    const dots = Array.from(document.querySelectorAll('.stage-dot'));
    const stages = Array.from(document.querySelectorAll('.stage'));
    const hudPill = document.getElementById('hudPill');
    const hudActive = document.getElementById('hudActive');
    const hudFill = document.getElementById('hudFill');
   
    const measureNS = 'http://www.w3.org/2000/svg';
    const measureSvg = document.createElementNS(measureNS,'svg');
    measureSvg.setAttribute('style','position:absolute;width:0;height:0;overflow:hidden;');
    const measurePath = document.createElementNS(measureNS,'path');
    measureSvg.appendChild(measurePath);
    document.body.appendChild(measureSvg);
   
    let totalLength = 0;
    let fractions = [];
    let pathD = '';
   
    function buildRoad(){
        const rect = track.getBoundingClientRect();
        const w = track.clientWidth;
        const h = track.clientHeight;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
    
        const points = dots.map(d => {
            const r = d.getBoundingClientRect();
            return { x: r.left - rect.left + r.width/2, y: r.top - rect.top + r.height/2 };
        });
    
        let d = `M ${points[0].x} ${points[0].y}`;
        let cumulative = [0];
        let dSoFar = d;
        measurePath.setAttribute('d', dSoFar);
    
        for(let i=0; i<points.length-1; i++){
            const p0 = points[i], p1 = points[i+1];
            const midY = p0.y + (p1.y - p0.y) * 0.5;
            const seg = ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
            dSoFar += seg;
            measurePath.setAttribute('d', dSoFar);
            cumulative.push(measurePath.getTotalLength());
        }
    
        pathD = dSoFar;
        totalLength = cumulative[cumulative.length - 1] || 1;
        fractions = cumulative.map(c => c / totalLength);
    
        bgPath.setAttribute('d', pathD);
        progPath.setAttribute('d', pathD);
        progPath.style.strokeDasharray = totalLength;
        progPath.style.strokeDashoffset = totalLength;
    }
   
    let ticking = false;
   
    function update(){
        ticking = false;
        const rect = track.getBoundingClientRect();
        const viewH = window.innerHeight;
        const refY = viewH * 0.5;
        let progress = (refY - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));
    
        progPath.style.strokeDashoffset = totalLength * (1 - progress);
    
        if(progPath.getPointAtLength){
            const pt = progPath.getPointAtLength(totalLength * progress);
            car.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
        }
    
        let activeIndex = 0;
        dots.forEach((dot,i) => {
            const frac = fractions[i] || 0;
            const passed = progress >= frac - 0.015;
            dot.classList.toggle('is-passed', passed);
            if(passed) activeIndex = i;
        });

        dots.forEach((dot,i) => {
            dot.classList.toggle('is-active', i === activeIndex && progress > 0.01 && progress < 0.995);
        });
    
        const visible = progress > 0.005 && progress < 0.995;
        hudPill.classList.toggle('is-visible', visible);
        hudActive.textContent = String(activeIndex + 1).padStart(2,'0');
        hudFill.style.width = (progress * 100).toFixed(1) + '%';
    }
   
    function onScroll(){
        if(!ticking){
            requestAnimationFrame(update);
            ticking = true;
        }
    }
   
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){ entry.target.classList.add('in-view'); }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -10% 0px' });
   
    stages.forEach(s => io.observe(s));
   
    function init(){ buildRoad(); update(); }
   
    window.addEventListener('resize', () => { buildRoad(); update(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', init);
    
    init();
    
    if(document.fonts && document.fonts.ready){
        document.fonts.ready.then(() => { buildRoad(); update(); });
    }
})();

/* =======================================================
   5. MODO ESCURO (DARK MODE)
======================================================= */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        const svg = themeToggle.querySelector('svg');
        if (body.classList.contains('dark-mode')) {
            svg.innerHTML = sunIcon;
        } else {
            svg.innerHTML = moonIcon;
        }
    });
}

/* =======================================================
   6. REVELAÇÃO DE SEÇÕES AO ROLAR (.reveal)
======================================================= */
(function(){
    const revealEls = document.querySelectorAll('.reveal');
    if(!revealEls.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
})();