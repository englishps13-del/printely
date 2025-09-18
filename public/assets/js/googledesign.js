// --- IMPORT FIREBASE MODULES ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCVtWA2FqatlTRR1gSzCTNUSFYUAbAwLW0",
  authDomain: "printelydz.firebaseapp.com",
  projectId: "printelydz",
  storageBucket: "printelydz.appspot.com",
  messagingSenderId: "49201277305",
  appId: "1:49201277305:web:df932043e4d6d986cae7a8",
  measurementId: "G-R4VJL5SR88"
};

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DOM ELEMENTS ---
const saveButton = document.getElementById('save-button');
const saveModal = document.getElementById('saveModal');
const closeModalBtn = document.querySelector('.modal-close-btn');
const planNameInput = document.getElementById('planNameInput');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

let currentUser = null;
let currentPlanId = null;
let isEditMode = false;

// --- HELPER FUNCTIONS ---
function showLoading() { loadingIndicator.style.display = 'flex'; }
function hideLoading() { loadingIndicator.style.display = 'none'; }

function showToast(message, type = 'success') {
  toastMessage.textContent = message;
  toast.className = `toast show ${type}`;
  toastIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// --- AUTHENTICATION ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    saveButton.disabled = false;
    saveButton.title = "Save your lesson plan";

    const planToLoadId = sessionStorage.getItem('planToLoadId');
    if (planToLoadId) {
        loadPlan(planToLoadId);
        sessionStorage.removeItem('planToLoadId');
    }
  } else {
    currentUser = null;
    saveButton.disabled = true;
    saveButton.title = "You must be logged in to save";
  }
});

// --- SAVE & LOAD LOGIC ---
function collectPlanData() {
    const getCheckedValues = (containerId) => {
        const values = [];
        document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`).forEach(cb => values.push(cb.value));
        return values;
    };

    return {
        school: document.getElementById('school').value,
        teacher: document.getElementById('teacher').value,
        learners: document.getElementById('learners').value,
        level: document.getElementById('levelSelect').value,
        sequence: document.getElementById('sequenceSelect').value,
        section: document.getElementById('sectionSelect').value,
        session: document.getElementById('sessionSelect').value,
        objectives: document.getElementById('objectives').innerHTML,
        competencies: getCheckedValues('competencies'),
        materials: getCheckedValues('materials'),
        warmer: {
            procedure: document.getElementById('warmer-procedure').innerHTML,
            interaction: document.getElementById('warmer-interaction').innerHTML,
            time: document.getElementById('warmer-time').innerHTML,
        },
        install: {
            procedure: document.getElementById('install-procedure').innerHTML,
            interaction: document.getElementById('install-interaction').innerHTML,
            time: document.getElementById('install-time').innerHTML,
        },
        assessment: {
            procedure: document.getElementById('assessment-procedure').innerHTML,
            interaction: document.getElementById('assessment-interaction').innerHTML,
            time: document.getElementById('assessment-time').innerHTML,
        },
        activitySummary: document.getElementById('activity-summary').innerHTML,
        plannerType: 'google', // Discriminator field
        theme: document.documentElement.className,
    };
}

function populateForm(data) {
    const setCheckedValues = (containerId, values) => {
        document.querySelectorAll(`#${containerId} input[type="checkbox"]`).forEach(cb => {
            cb.checked = values.includes(cb.value);
        });
    };

    document.getElementById('school').value = data.school || '';
    document.getElementById('teacher').value = data.teacher || '';
    document.getElementById('learners').value = data.learners || '';
    document.getElementById('levelSelect').value = data.level || '';
    
    // Trigger change events to populate dependent dropdowns
    levelSelect.dispatchEvent(new Event('change'));
    setTimeout(() => {
        sequenceSelect.value = data.sequence || '';
        sequenceSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            sectionSelect.value = data.section || '';
            sectionSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                sessionSelect.value = data.session || '';
            }, 100);
        }, 100);
    }, 100);

    document.getElementById('objectives').innerHTML = data.objectives || '';
    setCheckedValues('competencies', data.competencies || []);
    setCheckedValues('materials', data.materials || []);

    document.getElementById('warmer-procedure').innerHTML = data.warmer?.procedure || '';
    document.getElementById('warmer-interaction').innerHTML = data.warmer?.interaction || '';
    document.getElementById('warmer-time').innerHTML = data.warmer?.time || '';

    document.getElementById('install-procedure').innerHTML = data.install?.procedure || '';
    document.getElementById('install-interaction').innerHTML = data.install?.interaction || '';
    document.getElementById('install-time').innerHTML = data.install?.time || '';

    document.getElementById('assessment-procedure').innerHTML = data.assessment?.procedure || '';
    document.getElementById('assessment-interaction').innerHTML = data.assessment?.interaction || '';
    document.getElementById('assessment-time').innerHTML = data.assessment?.time || '';

    document.getElementById('activity-summary').innerHTML = data.activitySummary || '';
    document.documentElement.className = data.theme || 'theme-doodle';
    document.getElementById('theme-selector').value = (data.theme || 'theme-doodle').replace('theme-', '');
}

async function loadPlan(planId) {
    if (!currentUser) return;
    showLoading();
    try {
        const planRef = doc(db, "users", currentUser.uid, "lessonPlans", planId);
        const planDoc = await getDoc(planRef);
        if (planDoc.exists()) {
            const planData = planDoc.data();
            currentPlanId = planId;
            isEditMode = true;
            populateForm(planData);
            showToast("Lesson plan loaded successfully!", "success");
        } else {
            showToast("Lesson plan not found.", "error");
        }
    } catch (error) {
        console.error("Error loading plan:", error);
        showToast("Could not load the lesson plan.", "error");
    } finally {
        hideLoading();
    }
}

async function savePlan(planName) {
  if (!currentUser || !planName.trim()) return;
  showLoading();
  try {
    const planData = collectPlanData();
    planData.planName = planName.trim();
    planData.updatedAt = serverTimestamp();
    
    let docRef;
    if (isEditMode && currentPlanId) {
        docRef = doc(db, "users", currentUser.uid, "lessonPlans", currentPlanId);
        await updateDoc(docRef, planData);
        showToast("Lesson plan updated successfully!", "success");
    } else {
        planData.createdAt = serverTimestamp();
        const plansRef = collection(db, "users", currentUser.uid, "lessonPlans");
        const newDoc = await addDoc(plansRef, planData);
        currentPlanId = newDoc.id;
        isEditMode = true;
        showToast("Lesson plan saved successfully!", "success");
    }
    
    saveModal.style.display = 'none';
    planNameInput.value = '';

  } catch (error) {
    console.error("Error saving plan:", error);
    showToast("Error saving plan. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

// --- EVENT LISTENERS ---
saveButton.addEventListener('click', () => {
  saveModal.style.display = 'flex';
  planNameInput.focus();
});

closeModalBtn.addEventListener('click', () => {
  saveModal.style.display = 'none';
  planNameInput.value = '';
});

confirmSaveBtn.addEventListener('click', () => {
  const planName = planNameInput.value.trim();
  if (planName) {
    savePlan(planName);
  } else {
    showToast("Please enter a name for your plan.", "error");
  }
});

window.addEventListener('click', (e) => {
  if (e.target === saveModal) {
    saveModal.style.display = 'none';
    planNameInput.value = '';
  }
});

// --- RICH TEXT EDITOR LOGIC (simplified) ---
let activeEditor = null;
document.addEventListener('focusin', e => {
    if (e.target.isContentEditable) activeEditor = e.target;
});

function exec(cmd, value = null) {
  if (activeEditor) document.execCommand(cmd, false, value);
}

document.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        exec(btn.dataset.cmd);
    });
});

// --- CURRICULUM & PAGE LOGIC ---
const themeSelector = document.getElementById('theme-selector');
themeSelector.addEventListener('change', (e) => {
  document.documentElement.className = `theme-${e.target.value}`;
});

const curriculumData = { 
    "3PS": { 
        "  Family and Friends": { 
            "  Family": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  Friends": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        }, 
        "  School": { 
            "  School Objects": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  School Subjects": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        }, 
        "  Home": { 
            "  Describing a House": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  Location Rooms in a House": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        }, 
        "  Play Time": { 
            "  Toys": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  Favourite Toys": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        }, 
        "  Pets": { 
            "  Pets": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  Pets Body Parts": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        }, 
        "  Birthday": { 
            "  Party Invitation": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"], 
            "  Party Celebration": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and write", "  I play roles"]
        } 
    },
    "4PS": { 
        "  Family and Friends": { 
            "  Family": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"], 
            "  Friends": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"]
        }, 
        "  School": { 
            "  School Facilities": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"], 
            "  Mapping": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"]
        }, 
        "  Fun Time and Games": { 
            "  Fun Time": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"], 
            "  Games": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"]
        },
        "  Food and Health": { 
            "  Food": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"], 
            "  Health": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"]
        },
        "  Animals": { 
            "  Farm": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"], 
            "  Zoo": ["  I sing and have fun, I listen and repeat", "  I read and discover", "  I read and enjoy", "  I read and write", "  I play roles"]
        }
    }, 
    "5PS": { 
        "  Jobs, Occupations, and Hobbies": { 
            "  Jobs and Occupations": ["  I get ready.", "  I listen and interact", "  I listen and discover", "  I read an"]
        }
    }
};

const levelSelect = document.getElementById('levelSelect');
const sequenceSelect = document.getElementById('sequenceSelect');
const sectionSelect = document.getElementById('sectionSelect');
const sessionSelect = document.getElementById('sessionSelect');

// Populate level dropdown
Object.keys(curriculumData).forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level;
    levelSelect.appendChild(option);
});

// Handle level change
levelSelect.addEventListener('change', function() {
    const selectedLevel = this.value;
    sequenceSelect.innerHTML = '<option value="">Select Sequence</option>';
    
    if (selectedLevel && curriculumData[selectedLevel]) {
        Object.keys(curriculumData[selectedLevel]).forEach(sequence => {
            const option = document.createElement('option');
            option.value = sequence;
            option.textContent = sequence;
            sequenceSelect.appendChild(option);
        });
    }
    
    // Clear downstream dropdowns
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
    sessionSelect.innerHTML = '<option value="">Select Session</option>';
});

// Handle sequence change
sequenceSelect.addEventListener('change', function() {
    const selectedLevel = levelSelect.value;
    const selectedSequence = this.value;
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
    
    if (selectedLevel && selectedSequence && curriculumData[selectedLevel][selectedSequence]) {
        Object.keys(curriculumData[selectedLevel][selectedSequence]).forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionSelect.appendChild(option);
        });
    }
    
    // Clear downstream dropdown
    sessionSelect.innerHTML = '<option value="">Select Session</option>';
});

// Handle section change
sectionSelect.addEventListener('change', function() {
    const selectedLevel = levelSelect.value;
    const selectedSequence = sequenceSelect.value;
    const selectedSection = this.value;
    sessionSelect.innerHTML = '<option value="">Select Session</option>';
    
    if (selectedLevel && selectedSequence && selectedSection && 
        curriculumData[selectedLevel][selectedSequence][selectedSection]) {
        curriculumData[selectedLevel][selectedSequence][selectedSection].forEach(session => {
            const option = document.createElement('option');
            option.value = session;
            option.textContent = session;
            sessionSelect.appendChild(option);
        });
    }
});

// Font size controls
document.getElementById('fontInc').addEventListener('click', () => {
    const currentSize = parseInt(document.getElementById('fontSize').value);
    const newSize = Math.min(currentSize + 2, 72);
    document.getElementById('fontSize').value = newSize;
    document.execCommand('fontSize', false, '7');
    // Adjust font size directly since fontSize command doesn't work well
    if (activeEditor) {
        activeEditor.style.fontSize = newSize + 'px';
    }
});

document.getElementById('fontDec').addEventListener('click', () => {
    const currentSize = parseInt(document.getElementById('fontSize').value);
    const newSize = Math.max(currentSize - 2, 8);
    document.getElementById('fontSize').value = newSize;
    document.execCommand('fontSize', false, '1');
    // Adjust font size directly since fontSize command doesn't work well
    if (activeEditor) {
        activeEditor.style.fontSize = newSize + 'px';
    }
});

// Font family control
document.getElementById('fontFamily').addEventListener('change', function() {
    if (activeEditor) {
        activeEditor.style.fontFamily = this.value;
    }
});

// Text color control
document.getElementById('foreColor').addEventListener('change', function() {
    document.execCommand('foreColor', false, this.value);
});

// Highlight color control
document.getElementById('hiliteColor').addEventListener('change', function() {
    document.execCommand('hiliteColor', false, this.value);
});

// Word count and selection info
function updateWordCount() {
    const editableAreas = document.querySelectorAll('.editable-area');
    let totalWords = 0;
    
    editableAreas.forEach(area => {
        const text = area.innerText || area.textContent;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        totalWords += words.length;
    });
    
    document.getElementById('wordCount').textContent = `${totalWords} words`;
}

function updateSelectionInfo() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        document.getElementById('selectionInfo').textContent = `${selection.toString().length} characters selected`;
    } else {
        document.getElementById('selectionInfo').textContent = 'No selection';
    }
}

document.addEventListener('selectionchange', updateSelectionInfo);
document.addEventListener('input', updateWordCount);

// Initialize
updateWordCount();
updateSelectionInfo();

// Image insertion
document.querySelector('.insert-image-btn').addEventListener('click', () => {
    const url = prompt('Enter image URL:');
    if (url) {
        exec('insertImage', url);
    }
});