window.DISEASE_KEYS = [
    'ageDegeneration',
    'glaucoma',
    'cataract',
    'diabetes',
    'hypertension',
    'myopia',
    'normal',
    'others'
];

window.DISEASES = {
    ageDegeneration: {
        key: 'ageDegeneration',
        displayName: 'Age-Related Macular Degeneration (AMD)',
        overview: 'A chronic condition that affects the macula and can blur central vision.',
        symptoms: [
            'Blurry or distorted central vision',
            'Difficulty reading or recognizing faces',
            'Dark or empty spots in the center of vision'
        ],
        riskFactors: ['Age 50+', 'Family history', 'Smoking or cardiovascular disease'],
        nextSteps: [
            'Schedule a comprehensive eye exam with retinal imaging.',
            'Discuss treatment options and monitoring frequency.',
            'Track any changes in central vision at home.'
        ],
        urgentSigns: ['Sudden vision loss', 'Rapid new distortion in central vision'],
        didYouKnow: 'Early detection can slow vision loss and preserve daily function.'
    },
    glaucoma: {
        key: 'glaucoma',
        displayName: 'Glaucoma',
        overview: 'Damage to the optic nerve, often linked to elevated eye pressure.',
        symptoms: [
            'Gradual peripheral vision loss',
            'Halos around lights',
            'Eye pressure or pain in acute cases'
        ],
        riskFactors: ['Family history', 'Age 40+', 'Diabetes or high eye pressure'],
        nextSteps: [
            'Book an eye pressure screening and optic nerve evaluation.',
            'Ask about visual field testing and ongoing monitoring.',
            'Follow prescribed eye drop or treatment plans.'
        ],
        urgentSigns: ['Sudden eye pain with nausea', 'Rapid vision changes with halos'],
        didYouKnow: 'Glaucoma can progress silently, so routine screening is critical.'
    },
    cataract: {
        key: 'cataract',
        displayName: 'Cataract',
        overview: 'Clouding of the eye lens that reduces clarity and contrast.',
        symptoms: ['Blurry or hazy vision', 'Glare sensitivity', 'Faded color perception'],
        riskFactors: ['Aging', 'UV exposure', 'Diabetes or smoking'],
        nextSteps: [
            'Discuss lens evaluation with an eye specialist.',
            'Update prescriptions to maximize clarity.',
            'Review surgical options if vision impacts daily life.'
        ],
        urgentSigns: ['Sudden cloudiness or pain', 'Rapid vision decline'],
        didYouKnow: 'Cataract surgery is one of the most common and effective procedures.'
    },
    diabetes: {
        key: 'diabetes',
        displayName: 'Diabetic Retinopathy',
        overview: 'Blood sugar damage to retinal vessels that can reduce vision over time.',
        symptoms: ['Floaters or blurred vision', 'Dark areas in vision', 'Vision changes in both eyes'],
        riskFactors: ['Long-term diabetes', 'High blood pressure', 'Pregnancy with diabetes'],
        nextSteps: [
            'Schedule a dilated retinal exam.',
            'Manage blood sugar and blood pressure targets.',
            'Follow specialist guidance for treatment or monitoring.'
        ],
        urgentSigns: ['Sudden vision loss', 'Flashes of light or new floaters'],
        didYouKnow: 'Consistent glucose control lowers the risk of retinal damage.'
    },
    hypertension: {
        key: 'hypertension',
        displayName: 'Hypertensive Retinopathy',
        overview: 'Retinal damage caused by long-term high blood pressure.',
        symptoms: ['Blurred vision', 'Headaches or eye strain', 'Reduced visual sharpness'],
        riskFactors: ['Uncontrolled hypertension', 'Cardiovascular disease', 'Smoking'],
        nextSteps: [
            'Coordinate care to manage blood pressure levels.',
            'Request retinal imaging and follow-up exams.',
            'Monitor for vision changes during treatment.'
        ],
        urgentSigns: ['Severe headache with vision changes', 'Sudden vision loss'],
        didYouKnow: 'Healthy blood pressure protects both vision and heart health.'
    },
    myopia: {
        key: 'myopia',
        displayName: 'Myopia (Nearsightedness)',
        overview: 'A refractive condition where distant objects appear blurred.',
        symptoms: ['Squinting to see distance', 'Eye fatigue', 'Headaches after focusing'],
        riskFactors: ['Family history', 'Excess near work', 'Limited outdoor activity'],
        nextSteps: [
            'Get a vision exam for corrective lenses.',
            'Ask about myopia management options.',
            'Take regular breaks during near work.'
        ],
        urgentSigns: ['Sudden flashes or floaters', 'Curtain-like shadow in vision'],
        didYouKnow: 'Outdoor time may help slow myopia progression in children.'
    },
    normal: {
        key: 'normal',
        displayName: 'No Abnormality Detected',
        overview: 'No clear signs of a specific condition detected in the image.',
        symptoms: [
            'No notable symptoms observed',
            'Vision may still change over time',
            'Routine care still matters'
        ],
        riskFactors: ['General eye strain', 'Screen exposure', 'Age-related changes'],
        nextSteps: [
            'Maintain routine eye exams.',
            'Protect eyes from UV exposure.',
            'Monitor for any new symptoms.'
        ],
        urgentSigns: ['Sudden vision changes', 'New flashes, floaters, or eye pain'],
        didYouKnow: 'Even normal results benefit from regular eye checkups.'
    },
    others: {
        key: 'others',
        displayName: 'Other / Uncertain',
        overview: 'The image suggests an issue that does not match a known category.',
        symptoms: ['Unusual visual changes', 'Discomfort or irritation', 'Inconsistent symptoms'],
        riskFactors: ['Recent eye injury', 'Infection or inflammation', 'Undiagnosed conditions'],
        nextSteps: [
            'Follow up with an eye specialist for evaluation.',
            'Share symptom history and recent eye events.',
            'Consider additional diagnostic imaging.'
        ],
        urgentSigns: ['Sudden pain, redness, or vision loss', 'Rapidly worsening symptoms'],
        didYouKnow: 'A clinical exam can clarify unclear or mixed signals.'
    }
};
