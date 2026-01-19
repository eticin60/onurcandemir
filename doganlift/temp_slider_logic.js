
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
window.addEventListener('load', initComparisons);
// Re-init on resize
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
        floorValue.textContent = e.target.value + " Durak";
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
        // Here you would normally send the data to a backend
    });
}
