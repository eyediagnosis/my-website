const eyeImage = document.getElementById("eyeImage");
const preview = document.getElementById("preview");
const dropArea = document.getElementById("drop-area");

// Drag & drop handlers
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('hover'), false);
});

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('hover'), false);
});

dropArea.addEventListener('drop', handleDrop, false);
dropArea.addEventListener('click', () => eyeImage.click());

// Handle dropped or selected file
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    eyeImage.files = files;
    handleFiles(files);
}

eyeImage.addEventListener("change", () => handleFiles(eyeImage.files));

function handleFiles(files) {
    if(files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Eye Image"/>`;
        const img = preview.querySelector("img");
        setTimeout(() => img.style.opacity = 1, 50);
    }
    reader.readAsDataURL(file);

    // Placeholder for AI results
    document.getElementById("confidence").innerText = "Confidence: 85%";
    document.getElementById("diagnosis").innerText = "Diagnosis: Sample Disease";
    document.getElementById("future").innerText = "Future Actions: Follow up in 1 month";
    document.getElementById("definition").innerText = "Definition: Sample disease definition goes here.";
}

// Scroll fade-in effect
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.2
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
