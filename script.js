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
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Eye Image" class="loaded"/>`;
        
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

    // Update result actions (show Learn More button and wire navigation)
    updateResultActions(randomCondition.name);
}

// Map predicted condition names to local disease pages
const diseasePageMap = {
    'Glaucoma': 'disease1.html',
    'Cataract': 'disease2.html',
    'Diabetic Retinopathy': 'disease3.html',
    'Healthy Eye': 'disease.html'
};

function updateResultActions(conditionName) {
    const btn = document.getElementById('learn-more-btn');
    if (!btn) return;

    const page = diseasePageMap[conditionName] || 'disease.html';
    btn.style.display = 'inline-block';
    // Special case for Healthy Eye: guide user to other disease info
    if (conditionName === 'Healthy Eye') {
        btn.textContent = 'Learn more about other diseases';
        btn.onclick = function() {
            showLoadingOverlay('Opening disease list...');
            setTimeout(() => {
                window.location.href = page; // disease.html acts as the general list
            }, 900);
        };
    } else {
        btn.textContent = `Learn more about ${conditionName}`;
        btn.onclick = function() {
            showLoadingOverlay(`Opening ${conditionName}...`);
            // short pause to allow overlay animation, then navigate
            setTimeout(() => {
                window.location.href = page;
            }, 900);
        };
    }
}

function showLoadingOverlay(message) {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    const text = overlay.querySelector('.loader-text');
    if (text) text.textContent = message || 'Loading…';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
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
    // set footer year if present
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
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
