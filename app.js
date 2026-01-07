// ============================================
// TAB FUNCTIONALITY
// ============================================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            const target = document.getElementById(tabName);
            if (target) {
                target.classList.add('active');
            }
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
    const browseButton = document.getElementById('trigger-upload');
    const analyzePrimary = document.getElementById('analyze-btn');
    const analyzeSecondary = document.getElementById('analyze-btn-secondary');

    if (!dropArea || !eyeImage) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

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

    dropArea.addEventListener('drop', function(e) {
        const files = e.dataTransfer.files;
        eyeImage.files = files;
        handleFiles(files);
    }, false);

    dropArea.addEventListener('click', () => eyeImage.click());

    dropArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            eyeImage.click();
        }
    });

    if (browseButton) {
        browseButton.addEventListener('click', () => eyeImage.click());
    }

    [analyzePrimary, analyzeSecondary].forEach(button => {
        if (!button) return;
        button.addEventListener('click', () => {
            if (eyeImage.files && eyeImage.files.length > 0) {
                handleFiles(eyeImage.files);
            } else {
                eyeImage.click();
            }
        });
    });

    eyeImage.addEventListener('change', () => handleFiles(eyeImage.files));
}

function handleFiles(files) {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded eye image" />`;

        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        simulateAIAnalysis();
    };

    reader.readAsDataURL(file);
}

function simulateAIAnalysis() {
    const diseaseDisplayNames = {
        ageDegeneration: 'Age Degernation (AMD)',
        glaucoma: 'Glaucoma',
        cataract: 'Cataract',
        diabetes: 'Diabetes',
        hypertension: 'Hypertensive Retinopathy',
        myopia: 'Myopia (Nearsightedness)',
        normal: 'No Abnormality Detected',
        others: 'Other / Uncertain'
    };

    const conditions = [
        { key: 'ageDegeneration', confidence: 84 },
        { key: 'glaucoma', confidence: 79 },
        { key: 'cataract', confidence: 72 },
        { key: 'diabetes', confidence: 68 },
        { key: 'hypertension', confidence: 74 },
        { key: 'myopia', confidence: 81 },
        { key: 'normal', confidence: 93 },
        { key: 'others', confidence: 60 }
    ];

    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const displayName = diseaseDisplayNames[randomCondition.key] || randomCondition.key;

    const diagnosisEl = document.getElementById('diagnosis');
    const confidenceEl = document.getElementById('confidence');
    const definitionEl = document.getElementById('definition');
    const futureEl = document.getElementById('future');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceMeter = document.querySelector('.confidence-meter');

    if (diagnosisEl) diagnosisEl.textContent = displayName;
    if (confidenceEl) confidenceEl.textContent = `${randomCondition.confidence}%`;
    if (definitionEl) {
        definitionEl.textContent = `This is a sample definition for "${displayName}". Learn more to review symptoms, causes, and care guidance.`;
    }
    if (futureEl) {
        futureEl.textContent = 'Schedule a follow-up appointment with an ophthalmologist within 2 weeks. Monitor any changes in vision or comfort.';
    }

    if (confidenceBar) {
        confidenceBar.style.width = `${randomCondition.confidence}%`;
    }
    if (confidenceMeter) {
        confidenceMeter.setAttribute('aria-valuenow', String(randomCondition.confidence));
    }

    updateResultActions(randomCondition.key, displayName);
}

function updateResultActions(conditionKey, displayName) {
    const btn = document.getElementById('learn-more-btn');
    if (!btn) return;

    btn.style.display = 'inline-flex';
    btn.textContent = `Learn more about ${displayName}`;
    btn.onclick = function() {
        showLoadingOverlay(`Opening ${displayName}...`);
        setTimeout(() => {
            window.location.href = `disease-info.html#disease-${conditionKey}`;
        }, 900);
    };
}

function showLoadingOverlay(message) {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    const text = overlay.querySelector('.loader-text');
    if (text) text.textContent = message || 'Loading...';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initializeRevealAnimations() {
    const faders = document.querySelectorAll('.fade-in, .slide-in, .reveal');

    if (!faders.length) return;

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
    initializeRevealAnimations();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

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
