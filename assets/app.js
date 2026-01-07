function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const target = document.getElementById(tabName);
            if (target) target.classList.add('active');
        });
    });
}

function getDiseaseKeys() {
    if (window.DISEASE_KEYS && window.DISEASE_KEYS.length) {
        return window.DISEASE_KEYS.slice();
    }
    if (window.DISEASES) {
        return Object.keys(window.DISEASES);
    }
    return [];
}

function getDiseaseDataList() {
    if (!window.DISEASES) return [];
    return getDiseaseKeys().map(key => window.DISEASES[key]).filter(Boolean);
}

function getDiseaseDisplayName(key, fallback) {
    if (window.DISEASES && window.DISEASES[key]) {
        return window.DISEASES[key].displayName;
    }
    return fallback || 'this condition';
}

function normalizeDiseaseKey(disease) {
    if (!disease) return '';
    if (typeof disease === 'string') return disease;
    return disease.key || disease.label || '';
}

function getDiseaseTone(key) {
    if (key === 'normal') return 'normal';
    if (key === 'others') return 'other';
    return 'disease';
}

function detectLowEffects() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    const lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
    return prefersReducedMotion || lowCpu || lowMemory;
}

function applyEffectsLevel(level) {
    const body = document.body;
    if (!body) return;
    body.classList.toggle('low-effects', level === 'low');

    const toggles = document.querySelectorAll('[data-effects-toggle]');
    toggles.forEach(toggle => {
        toggle.textContent = `Effects: ${level === 'low' ? 'Low' : 'High'}`;
    });
}

function initializeEffectsToggle() {
    const toggles = document.querySelectorAll('[data-effects-toggle]');

    const stored = localStorage.getItem('effectsLevel');
    const autoLow = detectLowEffects();
    const level = stored || (autoLow ? 'low' : 'high');

    applyEffectsLevel(level);

    if (!toggles.length) return;

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isLow = document.body.classList.contains('low-effects');
            const nextLevel = isLow ? 'high' : 'low';
            localStorage.setItem('effectsLevel', nextLevel);
            applyEffectsLevel(nextLevel);
        });
    });
}

function initializeUploadHandlers() {
    const eyeImage = document.getElementById('eyeImage');
    const dropArea = document.getElementById('drop-area');
    const preview = document.getElementById('preview');
    const analyzeBtn = document.getElementById('analyze-btn');

    if (!eyeImage || !dropArea) return;

    const preventDefaults = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
    });

    dropArea.addEventListener('drop', (event) => {
        const files = event.dataTransfer.files;
        eyeImage.files = files;
        handleFiles(files);
    });

    dropArea.addEventListener('click', () => eyeImage.click());

    dropArea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            eyeImage.click();
        }
    });

    eyeImage.addEventListener('change', () => handleFiles(eyeImage.files));

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            if (eyeImage.files && eyeImage.files.length > 0) {
                handleFiles(eyeImage.files);
            } else {
                eyeImage.click();
            }
        });
    }

    if (preview) {
        preview.setAttribute('aria-live', 'polite');
    }
}

function handleFiles(files) {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('preview');
        if (preview) {
            preview.innerHTML = `<img src="${event.target.result}" alt="Uploaded eye image" />`;
        }

        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.remove('is-hidden');
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        simulateAIAnalysis();
    };

    reader.readAsDataURL(file);
}

function simulateAIAnalysis() {
    const list = getDiseaseDataList();
    const fallback = [
        { key: 'glaucoma', displayName: 'Glaucoma', overview: 'Sample overview.' },
        { key: 'cataract', displayName: 'Cataract', overview: 'Sample overview.' },
        { key: 'normal', displayName: 'No Abnormality Detected', overview: 'Sample overview.' }
    ];

    const conditions = list.length ? list : fallback;
    const selection = conditions[Math.floor(Math.random() * conditions.length)];
    const confidence = Math.floor(60 + Math.random() * 35);
    const key = normalizeDiseaseKey(selection);
    const displayName = getDiseaseDisplayName(key, selection.displayName);

    const diagnosisEl = document.getElementById('diagnosis');
    const confidenceEl = document.getElementById('confidence');
    const definitionEl = document.getElementById('definition');
    const futureEl = document.getElementById('future');
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceMeter = document.querySelector('.confidence-meter');

    if (diagnosisEl) diagnosisEl.textContent = displayName;
    if (confidenceEl) confidenceEl.textContent = `${confidence}%`;
    if (definitionEl) definitionEl.textContent = selection.overview || 'Sample definition.';
    if (futureEl) {
        const nextSteps = Array.isArray(selection.nextSteps) ? selection.nextSteps : [];
        futureEl.textContent = nextSteps[0] || 'Schedule a follow-up appointment for a clinical review.';
    }

    if (confidenceBar) confidenceBar.style.width = `${confidence}%`;
    if (confidenceMeter) confidenceMeter.setAttribute('aria-valuenow', String(confidence));

    updateConditionBadge(key);
    updateResultActions(key);
}

function updateConditionBadge(key) {
    const badge = document.getElementById('diagnosis-badge');
    if (!badge) return;

    badge.classList.remove('badge-normal', 'badge-other', 'badge-disease');

    const tone = getDiseaseTone(key);
    if (tone === 'normal') {
        badge.textContent = 'Normal';
        badge.classList.add('badge-normal');
    } else if (tone === 'other') {
        badge.textContent = 'Other';
        badge.classList.add('badge-other');
    } else {
        badge.textContent = 'Detected';
        badge.classList.add('badge-disease');
    }
}

function updateResultActions(key) {
    const btn = document.getElementById('learn-more-btn');
    if (!btn) return;

    const displayName = getDiseaseDisplayName(key, 'this condition');
    btn.classList.remove('is-hidden');
    btn.textContent = `Learn more about ${displayName}`;

    btn.onclick = () => {
        showLoadingOverlay('Opening details...');
        setTimeout(() => {
            window.location.href = `disease-info.html#disease-${key}`;
        }, 500);
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

function initializeRevealAnimations() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || document.body.classList.contains('low-effects')) {
        items.forEach(item => item.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    items.forEach(item => observer.observe(item));
}

function focusDiseaseFromHash() {
    const accordion = document.getElementById('disease-accordion');
    if (!accordion) return;

    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector(hash);
    if (!target) return;

    const details = target.querySelector('details');
    if (details) details.open = true;

    target.classList.remove('disease-highlight');
    window.requestAnimationFrame(() => {
        target.classList.add('disease-highlight');
    });

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => target.classList.remove('disease-highlight'), 1400);
}

function buildDetailList(items) {
    if (!Array.isArray(items) || !items.length) return '';
    return `
        <ul class="detail-list">
            ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
}

function initializeDiseaseLibrary() {
    const grid = document.getElementById('disease-grid');
    const accordion = document.getElementById('disease-accordion');
    const searchInput = document.getElementById('disease-search');
    const chips = document.querySelectorAll('.chip');

    if (!grid || !accordion || !window.DISEASES) return;

    const render = (list) => {
        grid.innerHTML = list.map(disease => {
            const facts = disease.facts || (disease.didYouKnow ? [disease.didYouKnow] : []);
            return `
                <article class="disease-card" data-key="${disease.key}">
                    <h3>${disease.displayName}</h3>
                    <p class="section-subtitle">${disease.overview}</p>
                    <div class="quick-facts">
                        ${facts.map(fact => `<span>- ${fact}</span>`).join('')}
                    </div>
                </article>
            `;
        }).join('');

        accordion.innerHTML = list.map(disease => {
            return `
                <section id="disease-${disease.key}" class="disease-section">
                    <details>
                        <summary>${disease.displayName}</summary>
                        <div class="detail-grid">
                            <div><strong>Overview:</strong> ${disease.overview}</div>
                            <div>
                                <strong>Common Symptoms:</strong>
                                ${buildDetailList(disease.symptoms)}
                            </div>
                            <div>
                                <strong>Risk Factors:</strong>
                                ${buildDetailList(disease.riskFactors)}
                            </div>
                            <div>
                                <strong>Typical Next Steps:</strong>
                                ${buildDetailList(disease.nextSteps)}
                            </div>
                            <div>
                                <strong>Urgent Warning Signs:</strong>
                                ${buildDetailList(disease.urgentSigns)}
                            </div>
                            <div><strong>Did You Know:</strong> ${disease.didYouKnow}</div>
                            <div><strong>Disclaimer:</strong> This information is educational and not medical advice.</div>
                        </div>
                    </details>
                </section>
            `;
        }).join('');

        window.setTimeout(focusDiseaseFromHash, 60);
    };

    const filterList = () => {
        const activeChip = document.querySelector('.chip.active');
        const activeKey = activeChip ? activeChip.dataset.filter : 'all';
        const term = searchInput ? searchInput.value.trim().toLowerCase() : '';

        let list = getDiseaseDataList();
        if (activeKey && activeKey !== 'all') {
            list = list.filter(item => item.key === activeKey);
        }
        if (term) {
            list = list.filter(item => item.displayName.toLowerCase().includes(term) || item.key.toLowerCase().includes(term));
        }

        render(list);
    };

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(btn => btn.classList.remove('active'));
            chip.classList.add('active');
            filterList();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterList);
    }

    render(getDiseaseDataList());
    window.addEventListener('hashchange', focusDiseaseFromHash);
}

function getExploredDiseases() {
    const stored = localStorage.getItem('exploredDiseases');
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function setExploredDiseases(list) {
    localStorage.setItem('exploredDiseases', JSON.stringify(list));
}

function updateProgressTracker() {
    const countEl = document.getElementById('explored-count');
    const bestEl = document.getElementById('quiz-best-score');
    if (countEl) {
        const explored = getExploredDiseases();
        countEl.textContent = `${explored.length}/8`;
    }
    if (bestEl) {
        const best = Number(localStorage.getItem('quizBestScore') || 0);
        bestEl.textContent = `${best}%`;
    }
}

function initializeExploreMore() {
    const explorerGrid = document.getElementById('explore-disease-grid');
    const modal = document.getElementById('disease-modal');
    const modalBody = document.getElementById('disease-modal-body');
    const modalTitle = document.getElementById('disease-modal-title');
    const modalClose = document.getElementById('disease-modal-close');

    if (!explorerGrid || !window.DISEASES) return;

    const dataList = getDiseaseDataList();

    explorerGrid.innerHTML = dataList.map(disease => {
        return `
            <article class="explore-card">
                <div class="explore-card-header">
                    <div>
                        <h3>${disease.displayName}</h3>
                        <p class="section-subtitle">${disease.overview}</p>
                    </div>
                    <span class="chip chip-static">Learn</span>
                </div>
                <button class="btn btn-secondary btn-small" type="button" data-disease-open="${disease.key}">
                    Open
                </button>
            </article>
        `;
    }).join('');

    const openButtons = explorerGrid.querySelectorAll('[data-disease-open]');
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-disease-open');
            const disease = window.DISEASES[key];
            if (!disease) return;

            if (modalTitle) modalTitle.textContent = disease.displayName;
            if (modalBody) {
                modalBody.innerHTML = `
                    <p class="section-subtitle">${disease.overview}</p>
                    <div class="detail-grid">
                        <div>
                            <strong>Symptoms:</strong>
                            ${buildDetailList(disease.symptoms)}
                        </div>
                        <div>
                            <strong>Risk Factors:</strong>
                            ${buildDetailList(disease.riskFactors)}
                        </div>
                        <div>
                            <strong>Typical Next Steps:</strong>
                            ${buildDetailList(disease.nextSteps)}
                        </div>
                        <div>
                            <strong>Urgent Warning Signs:</strong>
                            ${buildDetailList(disease.urgentSigns)}
                        </div>
                        <div><strong>Did You Know:</strong> ${disease.didYouKnow}</div>
                        <div><strong>Disclaimer:</strong> This information is educational and not medical advice.</div>
                    </div>
                `;
            }

            const explored = new Set(getExploredDiseases());
            explored.add(key);
            setExploredDiseases(Array.from(explored));
            updateProgressTracker();

            if (modal) {
                modal.classList.add('show');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    initializeSymptomMatcher();
    initializeQuiz();
    initializeFlashcards();
    updateProgressTracker();
}

function initializeSymptomMatcher() {
    const checklist = document.getElementById('symptom-checklist');
    const results = document.getElementById('symptom-results');
    if (!checklist || !results) return;

    const symptoms = [
        { id: 'blur-central', label: 'Blurry central vision', weights: { ageDegeneration: 2, cataract: 1, diabetes: 1 } },
        { id: 'peripheral-loss', label: 'Peripheral vision loss', weights: { glaucoma: 2 } },
        { id: 'halos', label: 'Halos around lights', weights: { glaucoma: 2, cataract: 1 } },
        { id: 'floaters', label: 'Floaters or dark spots', weights: { diabetes: 2, myopia: 1 } },
        { id: 'glare', label: 'Glare sensitivity', weights: { cataract: 2 } },
        { id: 'headache', label: 'Headaches or eye strain', weights: { myopia: 2, hypertension: 1 } },
        { id: 'distortion', label: 'Lines look wavy or distorted', weights: { ageDegeneration: 2 } },
        { id: 'sudden-change', label: 'Sudden vision change', weights: { glaucoma: 1, diabetes: 1, hypertension: 1, others: 1 } },
        { id: 'redness', label: 'Redness or irritation', weights: { others: 2 } },
        { id: 'double', label: 'Double vision', weights: { cataract: 1, others: 1 } },
        { id: 'night', label: 'Difficulty seeing at night', weights: { cataract: 2, myopia: 1 } },
        { id: 'not-sure', label: "I'm not sure", weights: {} }
    ];

    checklist.innerHTML = symptoms.map(symptom => {
        return `
            <label class="check-row">
                <input type="checkbox" value="${symptom.id}">
                <span>${symptom.label}</span>
            </label>
        `;
    }).join('');

    const updateMatches = () => {
        const checked = Array.from(checklist.querySelectorAll('input:checked')).map(input => input.value);
        const scores = {};
        const matches = {};

        symptoms.forEach(symptom => {
            if (!checked.includes(symptom.id)) return;
            Object.keys(symptom.weights).forEach(key => {
                scores[key] = (scores[key] || 0) + symptom.weights[key];
                if (!matches[key]) matches[key] = [];
                matches[key].push(symptom.label);
            });
        });

        const ranked = Object.keys(scores)
            .map(key => ({ key, score: scores[key], matched: matches[key] || [] }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4);

        if (!ranked.length) {
            results.innerHTML = '<p class="section-subtitle">Select symptoms to see possible matches.</p>';
            return;
        }

        results.innerHTML = ranked.map(entry => {
            const name = getDiseaseDisplayName(entry.key, entry.key);
            return `
                <div class="result-card">
                    <strong>${name}</strong>
                    <ul class="detail-list">
                        ${entry.matched.map(item => `<li>Matches: ${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }).join('');
    };

    checklist.addEventListener('change', updateMatches);
    updateMatches();
}

function initializeQuiz() {
    const container = document.getElementById('quiz-container');
    const scoreEl = document.getElementById('quiz-score');
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next');
    if (!container || !scoreEl || !feedbackEl || !nextBtn) return;

    const questions = [
        {
            question: 'Which condition is most associated with optic nerve damage and peripheral vision loss?',
            options: ['Cataract', 'Glaucoma', 'Myopia', 'Hypertension'],
            answer: 1,
            explanation: 'Glaucoma often impacts the optic nerve and peripheral vision first.',
            key: 'glaucoma'
        },
        {
            question: 'Cloudy or hazy vision with glare sensitivity is a classic sign of:',
            options: ['Cataract', 'Diabetes', 'AMD', 'Hypertension'],
            answer: 0,
            explanation: 'Cataracts cloud the lens and increase glare sensitivity.',
            key: 'cataract'
        },
        {
            question: 'Which condition is tied to high blood pressure damaging the retina?',
            options: ['Myopia', 'Hypertensive Retinopathy', 'Normal', 'Glaucoma'],
            answer: 1,
            explanation: 'Hypertensive retinopathy reflects vascular damage from high blood pressure.',
            key: 'hypertension'
        },
        {
            question: 'Sudden floaters or flashes can be a warning sign for:',
            options: ['Myopia', 'Normal', 'Others', 'Diabetes'],
            answer: 3,
            explanation: 'Diabetes can cause new floaters or flashes.',
            key: 'diabetes'
        },
        {
            question: 'Age Degernation mainly affects:',
            options: ['Central vision', 'Peripheral vision', 'Night vision only', 'Depth perception'],
            answer: 0,
            explanation: 'AMD impacts the macula and central vision clarity.',
            key: 'ageDegeneration'
        },
        {
            question: 'Which condition is a refractive issue causing distance blur?',
            options: ['Myopia', 'Cataract', 'Hypertension', 'Others'],
            answer: 0,
            explanation: 'Myopia makes distant objects look blurry without correction.',
            key: 'myopia'
        },
        {
            question: 'A normal result still means you should:',
            options: ['Skip future exams', 'Only return if pain occurs', 'Maintain routine eye exams', 'Ignore new symptoms'],
            answer: 2,
            explanation: 'Routine eye exams remain important even with a normal result.',
            key: 'normal'
        },
        {
            question: 'An uncertain finding should prompt:',
            options: ['No action', 'Self-treatment only', 'Follow-up with a specialist', 'Avoid eye exams'],
            answer: 2,
            explanation: 'Unclear signals are best evaluated by a clinician.',
            key: 'others'
        }
    ];

    let current = 0;
    let score = 0;
    let answered = false;

    const renderQuestion = () => {
        const q = questions[current];
        answered = false;
        feedbackEl.textContent = '';
        container.innerHTML = `
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((option, index) => `
                    <button class="chip quiz-option" type="button" data-index="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
        `;
        scoreEl.textContent = `Score: ${score}/${questions.length}`;
        nextBtn.textContent = current === questions.length - 1 ? 'Finish' : 'Next';
    };

    container.addEventListener('click', (event) => {
        const target = event.target.closest('.quiz-option');
        if (!target || answered) return;

        answered = true;
        const q = questions[current];
        const selected = Number(target.dataset.index);
        const correct = selected === q.answer;

        if (correct) {
            score += 1;
            target.classList.add('active');
            feedbackEl.textContent = `Correct. ${q.explanation}`;
        } else {
            target.classList.add('quiz-wrong');
            feedbackEl.textContent = `Not quite. ${q.explanation}`;
            const correctBtn = container.querySelector(`[data-index="${q.answer}"]`);
            if (correctBtn) correctBtn.classList.add('active');
        }

        scoreEl.textContent = `Score: ${score}/${questions.length}`;
    });

    nextBtn.addEventListener('click', () => {
        if (!answered) return;
        if (current < questions.length - 1) {
            current += 1;
            renderQuestion();
            return;
        }

        const percent = Math.round((score / questions.length) * 100);
        const best = Number(localStorage.getItem('quizBestScore') || 0);
        if (percent > best) {
            localStorage.setItem('quizBestScore', String(percent));
        }
        updateProgressTracker();
        current = 0;
        score = 0;
        renderQuestion();
        feedbackEl.textContent = `Quiz complete. You scored ${percent}%. Starting over.`;
    });

    renderQuestion();
}

function initializeFlashcards() {
    const grid = document.getElementById('flashcard-grid');
    const shuffleBtn = document.getElementById('flashcard-shuffle');
    if (!grid || !shuffleBtn) return;

    const cards = [
        { front: 'AMD: What vision is affected?', back: 'Central vision clarity is most affected.' },
        { front: 'AMD: Key symptom?', back: 'Wavy lines or central distortion.' },
        { front: 'Glaucoma: Primary risk?', back: 'High eye pressure and family history.' },
        { front: 'Glaucoma: Early sign?', back: 'Peripheral vision loss.' },
        { front: 'Cataract: Vision change?', back: 'Cloudy or hazy vision with glare.' },
        { front: 'Cataract: Common treatment?', back: 'Lens replacement surgery.' },
        { front: 'Diabetes: Eye impact?', back: 'Retinal vessel damage over time.' },
        { front: 'Diabetes: Urgent sign?', back: 'Sudden floaters or vision loss.' },
        { front: 'Hypertension: Retina effect?', back: 'Vascular changes from high blood pressure.' },
        { front: 'Hypertension: Next step?', back: 'Control blood pressure and monitor eyes.' },
        { front: 'Myopia: What is it?', back: 'Nearsightedness causing distance blur.' },
        { front: 'Myopia: Helpful habit?', back: 'Take breaks from near work.' },
        { front: 'Normal: What it means?', back: 'No clear abnormality detected.' },
        { front: 'Normal: Still do?', back: 'Routine eye exams and monitoring.' },
        { front: 'Others: Next step?', back: 'Follow up with a specialist for clarity.' },
        { front: 'Others: Why?', back: 'Some findings do not match known categories.' }
    ];

    const render = (list) => {
        grid.innerHTML = list.map(card => {
            return `
                <button class="flashcard" type="button">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">${card.front}</div>
                        <div class="flashcard-back">${card.back}</div>
                    </div>
                </button>
            `;
        }).join('');

        grid.querySelectorAll('.flashcard').forEach(card => {
            card.addEventListener('click', () => card.classList.toggle('flipped'));
        });
    };

    shuffleBtn.addEventListener('click', () => {
        const shuffled = cards.slice().sort(() => Math.random() - 0.5);
        render(shuffled);
    });

    render(cards);
}

function initializeActiveNav() {
    const links = document.querySelectorAll('.nav-link');
    if (!links.length) return;
    const path = window.location.pathname.split('/').pop();
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === path) link.classList.add('active');
        if (path === '' && href === 'index.html') link.classList.add('active');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEffectsToggle();
    initializeTabs();
    initializeUploadHandlers();
    initializeRevealAnimations();
    initializeDiseaseLibrary();
    initializeExploreMore();
    initializeActiveNav();

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
