const placesData = {
    boracay: {
        title: "Boracay Island",
        description: "Boracay is a small island in the central Philippines known for its resorts and beaches. Along the west coast, White Beach is backed by palm trees, bars and restaurants. On the east coast, strong winds make Bulabog Beach a hub for water sports. Nearby, the observation deck on Mount Luho offers panoramic views over the island.",
        address: "Malay, Aklan, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "White Beach - 4km of pristine white sand",
            "Water sports and island hopping",
            "Vibrant nightlife and dining scene",
            "Sunset sailing and beach activities"
        ],
        bestTime: "November to April",
        activities: ["Swimming", "Snorkeling", "Kitesurfing", "Island Hopping"],
        rating: 4.8
    },
    palawan: {
        title: "Palawan Underground River",
        description: "The Puerto Princesa Subterranean River National Park is a protected area in the Philippines. The park is located in the Saint Paul Mountain Range on the western coast of the island of Palawan. It features a limestone karst mountain landscape with an 8.2 km navigable underground river.",
        address: "Puerto Princesa, Palawan, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "UNESCO World Heritage Site",
            "8.2km underground river system",
            "Spectacular limestone formations",
            "Rich biodiversity and wildlife"
        ],
        bestTime: "December to May",
        activities: ["Underground River Tour", "Wildlife Watching", "Hiking", "Photography"],
        rating: 4.9
    },
    bohol: {
        title: "Chocolate Hills, Bohol",
        description: "The Chocolate Hills are a geological formation in the Bohol province of the Philippines. There are at least 1,260 hills but there may be as many as 1,776 hills spread over an area of more than 50 square kilometres. They are covered in green grass that turns brown during the dry season.",
        address: "Carmen, Bohol, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "Over 1,200 cone-shaped hills",
            "Unique geological formation",
            "Panoramic viewing decks",
            "Tarsier sanctuary nearby"
        ],
        bestTime: "December to May",
        activities: ["Sightseeing", "Photography", "Tarsier Watching", "ATV Tours"],
        rating: 4.7
    },
    siargao: {
        title: "Siargao Island",
        description: "Siargao is a tear-drop shaped island in the Philippine Sea situated 196 kilometers southeast of Tacloban. It has a land area of approximately 437 square kilometers. The east coast is relatively straight with one deep inlet, Port Pilar. Known as the surfing capital of the Philippines.",
        address: "Surigao del Norte, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "Cloud 9 - world-famous surf break",
            "Pristine beaches and lagoons",
            "Island hopping adventures",
            "Laid-back tropical atmosphere"
        ],
        bestTime: "March to October",
        activities: ["Surfing", "Island Hopping", "Swimming", "Beach Relaxation"],
        rating: 4.8
    },
    banaue: {
        title: "Banaue Rice Terraces",
        description: "The Banaue Rice Terraces are terraces that were carved into the mountains of Banaue, Ifugao, in the Philippines, by the ancestors of the indigenous people. They are frequently called the 'Eighth Wonder of the World'. It is commonly thought that the terraces were built 2,000 years ago.",
        address: "Banaue, Ifugao, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "2,000-year-old engineering marvel",
            "UNESCO World Heritage Site",
            "Traditional Ifugao culture",
            "Spectacular mountain views"
        ],
        bestTime: "December to May",
        activities: ["Hiking", "Cultural Tours", "Photography", "Village Visits"],
        rating: 4.6
    },
    mayon: {
        title: "Mayon Volcano",
        description: "Mayon Volcano is an active stratovolcano in the province of Albay in Bicol Region, on the island of Luzon in the Philippines. Renowned as the 'perfect cone' because of its symmetric conical shape, Mayon forms the northern boundary of Legazpi City.",
        address: "Albay, Bicol Region, Philippines",
        image: "/placeholder.svg?height=400&width=600",
        highlights: [
            "Perfect cone-shaped volcano",
            "Active volcanic activity",
            "Adventure activities nearby",
            "Stunning natural landscapes"
        ],
        bestTime: "December to May",
        activities: ["Volcano Viewing", "Hiking", "ATV Tours", "Photography"],
        rating: 4.5
    }
};

const modal = document.getElementById('placeModal');
const modalBody = document.getElementById('modalBody');
const backBtn = document.getElementById('backBtn');
const waterCanvas = document.getElementById('waterCanvas');
const waterBackground = document.getElementById('waterBackground');

let canvas, ctx;
let ripples = [];
let animationId;

function initWaterCanvas() {
    canvas = waterCanvas;
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    waterBackground.addEventListener('mousemove', (e) => {
        createRipple(e.clientX, e.clientY);
    });

    waterBackground.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        createRipple(touch.clientX, touch.clientY);
    });

    animateWater();
}

function createRipple(x, y) {
    ripples.push({
        x: x,
        y: y,
        radius: 0,
        opacity: 0.8,
        speed: 2
    });

    if (ripples.length > 10) {
        ripples.shift();
    }
}

function animateWater() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];

        ripple.radius += ripple.speed;
        ripple.opacity -= 0.01;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (ripple.opacity <= 0 || ripple.radius > 200) {
            ripples.splice(i, 1);
        }
    }

    animationId = requestAnimationFrame(animateWater);
}


function handleScroll() {
    const sections = document.querySelectorAll('.destination-section');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionCenter = sectionTop + sectionHeight / 2;

        const scrollProgress = (scrollY + windowHeight / 2 - sectionCenter) / windowHeight;
        const clampedProgress = Math.max(-1, Math.min(1, scrollProgress));

        const image = section.querySelector('.destination-image');
        const direction = section.getAttribute('data-direction');

        if (image) {
            let translateX = 0;

            if (direction === 'right') {
                translateX = clampedProgress * 100;
            } else {
                translateX = -clampedProgress * 100;
            }

            image.style.transform = `translateX(${translateX}px)`;
        }
    });
}

function showPlaceDetails(placeId) {
    const place = placesData[placeId];
    if (!place) return;

    modalBody.innerHTML = `
        <div class="place-hero">
            <img src="${place.image}" alt="${place.title}">
            <div class="place-hero-overlay">
                <h1>${place.title}</h1>
                <div class="place-hero-address">
                    <span style="margin-right: 8px;">📍</span>
                    ${place.address}
                </div>
            </div>
            <div class="place-rating">
                <span style="color: #fbbf24; margin-right: 4px;">⭐</span>
                ${place.rating}
            </div>
        </div>

        <div class="place-content">
            <div class="place-main">
                <div class="place-section">
                    <h2>About this destination</h2>
                    <p>${place.description}</p>
                </div>

                <div class="place-section">
                    <h3>Highlights</h3>
                    <ul class="highlights-list">
                        ${place.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="place-sidebar">
                <div class="place-section">
                    <h3>
                        <span style="margin-right: 8px;">🕒</span>
                        Best time to visit
                    </h3>
                    <p>${place.bestTime}</p>
                </div>

                <div class="place-section">
                    <h3>
                        <span style="margin-right: 8px;">👥</span>
                        Popular activities
                    </h3>
                    <div class="activities-tags">
                        ${place.activities.map(activity => `<span class="activity-tag">${activity}</span>`).join('')}
                    </div>
                </div>

                <div class="place-section">
                    <button class="gallery-btn">
                        <span>📷</span>
                        View Photo Gallery
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

window.addEventListener('scroll', handleScroll);

document.querySelectorAll('.explore-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const section = e.target.closest('.destination-section');
        const placeId = section.getAttribute('data-place');
        showPlaceDetails(placeId);
        window.location.href = '/bohol';
    });
});

backBtn.addEventListener('click', hideModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initWaterCanvas();
    console.log('Philippines Tourism Website loaded successfully!');
});

window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});
document.querySelectorAll('.destination-image-slider').forEach(slider => {
    const container = slider.querySelector('.slider-container');
    const slides = container.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        container.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }, 3000);
});
