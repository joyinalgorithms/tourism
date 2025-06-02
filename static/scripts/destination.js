document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    setInterval(nextSlide, 5000);

    document.querySelector('.back-btn').addEventListener('click', function() {
        alert('Navigate back to destinations page');
    });

    document.querySelector('.cta-btn.primary').addEventListener('click', function() {
        alert('Redirecting to booking page...');
    });

    document.querySelector('.cta-btn.secondary').addEventListener('click', function() {
        alert('Opening photo gallery...');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    let lastScrollTop = 0;
    const nav = document.querySelector('.navigation');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    nav.style.transition = 'transform 0.3s ease-in-out';
});
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.view-photos-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const placeName = button.getAttribute('data-place');
            if (placeName) {
                const searchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(placeName)}`;
                window.open(searchUrl, '_blank');
            }
        });
    });
});
