document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.navigation');
    let lastScrollTop = 0;
    let ticking = false;

    function updateNavigation() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    });

    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                targetElement.style.transform = 'scale(1.02)';
                targetElement.style.transition = 'transform 0.3s ease';

                setTimeout(() => {
                    targetElement.style.transform = 'scale(1)';
                    setTimeout(() => {
                        targetElement.style.transition = '';
                    }, 300);
                }, 500);
            }
        });
    });

    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        initializeBackgroundAnimation(canvas);
    }

    function initializeBackgroundAnimation(canvas) {
        const ctx = canvas.getContext('2d');
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const particleCount = 30;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.1;
                this.color = this.getRandomColor();
            }

            getRandomColor() {
                const colors = [
                    'rgba(217, 119, 6, ',
                    'rgba(251, 146, 60, ',
                    'rgba(52, 211, 153, ',
                    'rgba(96, 165, 250, '
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                this.opacity += (Math.random() - 0.5) * 0.01;
                this.opacity = Math.max(0.05, Math.min(0.4, this.opacity));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.opacity + ')';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(217, 119, 6, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.policy-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(card);
    });

    const sections = document.querySelectorAll('.policy-card');
    const tocLinks = document.querySelectorAll('.toc-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                tocLinks.forEach(link => link.classList.remove('active'));

                const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-120px 0px -50% 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    document.querySelectorAll('.policy-card h2').forEach(heading => {
        heading.style.cursor = 'pointer';
        heading.title = 'Click to copy link to this section';

        heading.addEventListener('click', function() {
            const section = this.closest('.policy-card');
            const sectionId = section.getAttribute('id');

            if (sectionId) {
                const url = window.location.origin + window.location.pathname + '#' + sectionId;

                if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                        showCopyNotification(this);
                    });
                } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopyNotification(this);
                }
            }
        });
    });

    function showCopyNotification(element) {
        const notification = document.createElement('div');
        notification.textContent = 'Link copied!';
        notification.style.cssText = `
            position: absolute;
            background: #059669;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notification);

        const rect = element.getBoundingClientRect();
        notification.style.left = rect.left + 'px';
        notification.style.top = (rect.top - 40) + 'px';

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });

    let searchTimeout;
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();

            const searchTerm = prompt('Search privacy policy:');
            if (searchTerm) {
                highlightSearchTerm(searchTerm);
            }
        }
    });

    function highlightSearchTerm(term) {
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });

        if (!term) return;

        const regex = new RegExp(`(${term})`, 'gi');
        const walker = document.createTreeWalker(
            document.querySelector('.content-section'),
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(term.toLowerCase())) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const parent = textNode.parentNode;
            const highlightedHTML = textNode.textContent.replace(regex, '<mark class="search-highlight" style="background: #fef3c7; padding: 0.125rem 0.25rem; border-radius: 0.25rem;">$1</mark>');

            const wrapper = document.createElement('div');
            wrapper.innerHTML = highlightedHTML;

            while (wrapper.firstChild) {
                parent.insertBefore(wrapper.firstChild, textNode);
            }
            parent.removeChild(textNode);
        });

        const firstHighlight = document.querySelector('.search-highlight');
        if (firstHighlight) {
            firstHighlight.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    console.log('Privacy Policy page loaded successfully');
});
