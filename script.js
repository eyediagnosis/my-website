// ============================================
// TAB FUNCTIONALITY
// ============================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
function openModal(title, content) {
    const modal = document.getElementById('info-modal');
    if (modal) {
        document.getElementById('modal-text').innerHTML = content;
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// ============================================
// DRAG & DROP UPLOAD
// ============================================
function initializeUploadHandlers() {
    const eyeImage = document.getElementById('eyeImage');
    const preview = document.getElementById('preview');
    const dropArea = document.getElementById('drop-area');

    if (!dropArea) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('hover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('hover');
        }, false);
    });

    // Handle dropped files
    dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        eyeImage.files = files;
        handleFiles(files);
    }, false);

    // Handle click to select files
    dropArea.addEventListener('click', () => eyeImage.click());

    // Make drop area keyboard accessible (Enter / Space)
    dropArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            eyeImage.click();
        }
    });

    // Handle file selection
    eyeImage.addEventListener('change', () => handleFiles(eyeImage.files));
}

function handleFiles(files) {
    if (files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Eye Image" class="loaded" loading="lazy"/>`;
        // provide a subtle flash to indicate upload succeeded
        const dropAreaEl = document.getElementById('drop-area');
        if (dropAreaEl) {
            dropAreaEl.classList.add('drop-flash');
            setTimeout(() => dropAreaEl.classList.remove('drop-flash'), 900);
        }
        
        // Show results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Simulate AI analysis (placeholder)
        simulateAIAnalysis();
    };

    reader.readAsDataURL(file);
}

function simulateAIAnalysis() {
    // Placeholder AI results - replace with actual API call
    const conditions = [
        { name: 'Glaucoma', confidence: 85 },
        { name: 'Cataract', confidence: 72 },
        { name: 'Diabetic Retinopathy', confidence: 58 },
        { name: 'Healthy Eye', confidence: 95 }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

    // Update result cards
    const diagnosisEl = document.getElementById('diagnosis');
    const confidenceEl = document.getElementById('confidence');
    const definitionEl = document.getElementById('definition');
    const futureEl = document.getElementById('future');

    if (diagnosisEl) diagnosisEl.textContent = randomCondition.name;
    if (confidenceEl) confidenceEl.textContent = `${randomCondition.confidence}%`;
    if (definitionEl) definitionEl.textContent = `This is a sample diagnosis for "${randomCondition.name}". Click "Learn More" to get detailed information about this condition.`;
    if (futureEl) futureEl.textContent = 'Schedule a follow-up appointment with an ophthalmologist within 2 weeks. In the meantime, monitor any vision changes.';
}

// ============================================
// SCROLL FADE-IN ANIMATIONS
// ============================================
function initializeFadeInAnimations() {
    const faders = document.querySelectorAll('.fade-in, .slide-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
}

// ============================================
// INITIALIZE ALL FEATURES ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeUploadHandlers();
    initializeFadeInAnimations();
    initializeTooltips();

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// ============================================
// TOOLTIP FUNCTIONALITY
// ============================================
function initializeTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'visible';
                tooltipText.style.opacity = '1';
            }
        });

        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            if (tooltipText) {
                tooltipText.style.visibility = 'hidden';
                tooltipText.style.opacity = '0';
            }
        });
    });
}
