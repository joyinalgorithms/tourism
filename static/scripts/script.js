window.addEventListener('load', function() {
    const loader = document.getElementById('pageLoader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');

    ctaButton.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.1)';
    });

    ctaButton.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(1)';
    });

    ctaButton.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

const video = document.querySelector('video');
if (video) {
    video.addEventListener('error', function() {
        console.log('Video failed to load');
        document.querySelector('.video-background').style.background =
            'linear-gradient(45deg, #1e3c72, #2a5298)';
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target === ctaButton) {
        window.location.href = '/view';
    }
});
