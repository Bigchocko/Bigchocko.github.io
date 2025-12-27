// kontakt.js

// Efekt Tilt dla kart
const cards = document.querySelectorAll('.tilt-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height/2) / 15;
        const rotateY = (x - rect.width/2) / 15;
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });
});

// WYSYŁKA FORMULARZA PRZEZ FETCH (AJAX)
const contactForm = document.getElementById('simple-form');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const btn = this.querySelector('.fire-btn');
    const content = btn.querySelector('.btn-content');
    const formData = new FormData(this);
    
    content.innerHTML = 'WYSYŁANIE... <i class="fas fa-spinner fa-spin"></i>';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            content.innerHTML = 'WYSŁANO POMYŚLNIE! ✅';
            btn.style.background = '#fff';
            btn.style.color = '#000';
            btn.style.opacity = '1';
            this.reset(); 
            
            setTimeout(() => {
                content.innerHTML = 'WYŚLIJ KOLEJNĄ <i class="fas fa-paper-plane"></i>';
                btn.style.background = '#00ff41';
                btn.disabled = false;
            }, 5000);
        } else {
            throw new Error();
        }
    } catch (error) {
        content.innerHTML = 'BŁĄD WYSYŁKI! ❌';
        btn.style.background = '#ff4d4d';
        btn.disabled = false;
        
        setTimeout(() => {
            content.innerHTML = 'SPRÓBUJ PONOWNIE';
            btn.style.background = '#00ff41';
        }, 3000);
    }
});