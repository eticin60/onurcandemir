document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor & Interaction Logic
    const cursor = document.querySelector('.glow-cursor');
    let cursorX = 0, cursorY = 0;
    let mouseX = 0, mouseY = 0;

    // Sparkle Trail Logic
    const createSparkle = (x, y) => {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        document.body.appendChild(sparkle);

        const size = Math.random() * 4 + 2; // Random size 2-6px
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        // Random direction drift
        const xDir = (Math.random() - 0.5) * 30;
        const yDir = (Math.random() - 0.5) * 30;

        sparkle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.8 },
            { transform: `translate(calc(-50% + ${xDir}px), calc(-50% + ${yDir}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0,0,0.2,1)'
        }).onfinish = () => sparkle.remove();
    };

    // Only activate custom cursor if device supports hover and is desktop
    if (window.matchMedia('(hover: hover) and (min-width: 1025px)').matches) {
        if (cursor) {
            cursor.style.display = 'block';

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                // Sparkle effect (frequency tuned)
                if (Math.random() > 0.6) createSparkle(mouseX, mouseY);
            });

            const animateCursor = () => {
                cursorX += (mouseX - cursorX) * 0.12; // Smooth fade follow
                cursorY += (mouseY - cursorY) * 0.12;
                cursor.style.left = `${cursorX}px`;
                cursor.style.top = `${cursorY}px`;
                requestAnimationFrame(animateCursor);
            };
            animateCursor();

            // Interaction States
            const interactive = document.querySelectorAll('a, button, input, select, textarea, .step, .product-card, .cert-card, .partner-item');
            interactive.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
            });
        }
    }

    // Reveal Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smart Navigation Active Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 250) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksList.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if it's a modal trigger first
            if (this.classList.contains('modal-trigger')) return;

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('info-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    const triggers = document.querySelectorAll('.modal-trigger');

    if (modalOverlay) {
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const contentId = trigger.getAttribute('data-content');
                const contentTemplate = document.getElementById(`content-${contentId}`);

                if (contentTemplate) {
                    modalBody.innerHTML = contentTemplate.innerHTML;
                    modalOverlay.classList.add('active');
                }
            });
        });

        const closeModal = () => {
            modalOverlay.classList.remove('active');
        };

        modalClose.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Stats Counter Animation ---
    const statsSection = document.querySelector('.stats-section');
    const counters = document.querySelectorAll('.counter');
    let started = false;

    if (statsSection) {
        const startCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const increment = target / 100;

                const updateCounter = () => {
                    const c = +counter.innerText;
                    if (c < target) {
                        counter.innerText = Math.ceil(c + increment);
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target + "+";
                    }
                };
                updateCounter();
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                startCounters();
                started = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // --- FAQ Accordion ---
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- PWA Install Banner (Simulation) ---
    const pwaBanner = document.getElementById('pwa-banner');
    const pwaClose = document.getElementById('pwa-close-btn');
    const pwaInstall = document.getElementById('pwa-install-btn');

    // Show banner after 3 seconds
    setTimeout(() => {
        if (pwaBanner) pwaBanner.classList.add('visible');
    }, 3000);

    if (pwaClose) {
        pwaClose.addEventListener('click', () => {
            pwaBanner.classList.remove('visible');
        });
    }

    if (pwaInstall) {
        pwaInstall.addEventListener('click', () => {
            alert('Uygulama yükleniyor... (Simülasyon)');
            pwaBanner.classList.remove('visible');
        });
    }

    // --- BEFORE / AFTER SLIDER LOGIC ---
    function initComparisons() {
        const slider = document.querySelector('.comparison-slider');
        const overlay = document.querySelector('.img-comp-overlay');
        const container = document.querySelector('.comparison-container');
        let clicked = 0;
        let w, h;

        if (!slider || !overlay) return;

        w = container.offsetWidth;
        h = container.offsetHeight;

        slider.addEventListener('mousedown', slideReady);
        window.addEventListener('mouseup', slideFinish);
        slider.addEventListener('touchstart', slideReady);
        window.addEventListener('touchend', slideFinish);

        function slideReady(e) {
            e.preventDefault();
            clicked = 1;
            window.addEventListener('mousemove', slideMove);
            window.addEventListener('touchmove', slideMove);
        }

        function slideFinish() {
            clicked = 0;
        }

        function slideMove(e) {
            if (clicked == 0) return;
            let pos = getCursorPos(e);
            if (pos < 0) pos = 0;
            if (pos > w) pos = w;
            slide(pos);
        }

        function getCursorPos(e) {
            let a, x = 0;
            e = (e.changedTouches) ? e.changedTouches[0] : e;
            let rect = container.getBoundingClientRect();
            x = e.pageX - rect.left;
            return x - window.pageXOffset;
        }

        function slide(x) {
            overlay.style.width = x + "px";
            slider.style.left = x + "px"; // Actually stick to cursor
        }
    }
    setTimeout(initComparisons, 100); // Small delay to ensure render
    window.addEventListener('resize', () => { setTimeout(initComparisons, 500); });


    // --- SMART QUOTE WIZARD LOGIC ---
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const floorRange = document.getElementById('floorRange');
    const floorValue = document.getElementById('floorValue');

    if (floorRange) {
        floorRange.addEventListener('input', (e) => {
            floorValue.textContent = e.target.value + " Kat";
        });
    }

    function updateWizard(stepIndex) {
        // Show correct step
        wizardSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index === stepIndex) step.classList.add('active');
        });

        // Update progress bar
        progressSteps.forEach((progress, index) => {
            progress.classList.remove('active');
            if (index <= stepIndex) progress.classList.add('active');
        });
    }

    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < wizardSteps.length - 1) {
                currentStep++;
                updateWizard(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateWizard(currentStep);
            }
        });
    });

    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Teklif talebiniz başarıyla alındı! Mühendislerimiz 30 dakika içinde sizinle iletişime geçecektir.');
        });
    }

});
