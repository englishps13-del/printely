// ---------- Theme Switcher ----------
const themeSwitcher = document.getElementById("themeSwitcher");
const tableContainer = document.getElementById("table-container");

themeSwitcher.addEventListener("change", (e) => {
  const val = e.target.value;
  tableContainer.className = "";
  // In case the value is 'default', we want to set a theme class for consistency
  const themeClass = val === "default" ? "theme-default" : val;
  tableContainer.classList.add(themeClass);
});


// ---------- Competency / Teaching Materials pill toggle ----------
document.querySelectorAll(".competency-option input").forEach((input) => {
  const label = input.closest(".competency-option");
  const setState = () => label.classList.toggle("selected", input.checked);
  input.addEventListener("change", setState);
  setState(); // initialize
});

// ---------- Lesson plan data (Level -> Sequence -> Section -> Sessions) ----------
const data = {
  "3PS": {
    "FAMILY AND FRIENDS": {
      "FAMILY": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "FRIENDS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    },
    "SCHOOL": {
      "SCHOOL OBJECTS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "SCHOOL SUBJECTS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    },
    "HOME": {
      "DESCRIBING A HOUSE": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "LOCATION ROOMS IN A HOUSE": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    },
    "PLAY TIME": {
      "TOYS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "FAVOURITE TOYS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    },
    "PETS": {
      "PETS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "PETS BODY PARTS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    },
    "BIRTHDAY": {
      "PARTY INVITATION": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"],
      "PARTY CELEBRATION": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and write", "I play roles"]
    }
  },
  "4PS": {
    "FAMILY AND FRIENDS": {
      "FAMILY": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"],
      "FRIENDS": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"]
    },
    "SCHOOL": {
      "SCHOOL FACILITIES": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"],
      "MAPPING": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"]
    },
    "FUN TIME AND GAMES": {
      "FUN TIME": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"],
      "GAMES": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"]
    },
 	"FOOD AND HEALTH": {
      "FOOD": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"],
      "HEALTH": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"]
    },
	"ANIMALS": {
      "FARM": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"],
      "ZOO": ["I sing and have fun, I listen and repeat", "I read and discover", "I read and enjoy", "I read and write", "I play roles"]
    }
  },
  "5PS": {
    "JOBS, OCCUPATIONS, AND HOBBIES": {
      "JOBS AND OCCUPATIONS": ["I get ready", "I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "i learn to write", "I write"],
      "HOBBIES": ["I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "I learn to write", "I write", "I check my progress"]
    },
    "HOMETOWN, CITY, VILLAGE AMENITIES": {
      "HOMETOWN, CITY, VILLAGE AMENITIES": ["I get ready", "I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "i learn to write", "I write"],
      "DIRECTIONS": ["I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "I learn to write", "I write", "I check my progress"]
    },
    "HOLIDAYS AND TRAVELLING": {
      "HOLIDAYS": ["I get ready", "I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "i learn to write", "I write"],
      "TRAVELLING": ["I listen and interact", "I listen and discover", "I read and understand", "I read and discover", "I learn and enjoy", "I learn to write", "I write", "I check my progress"]
    }
  }
};

// ---------- Dropdown elements ----------
const levelSelect = document.getElementById("levelSelect");
const sequenceSelect = document.getElementById("sequenceSelect");
const sectionSelect = document.getElementById("sectionSelect");
const sessionSelect = document.getElementById("sessionSelect");

// Load sequences when level changes
levelSelect.addEventListener("change", function () {
  const level = this.value;
  sequenceSelect.innerHTML = '<option value="">-- Select Sequence --</option>';
  sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';
  if (data[level]) {
    Object.keys(data[level]).forEach(seq => {
      const opt = document.createElement("option");
      opt.value = seq;
      opt.textContent = seq;
      sequenceSelect.appendChild(opt);
    });
    const remediationOpt = document.createElement("option");
    remediationOpt.value = "REMEDIATION & STANDARDISATION";
    remediationOpt.textContent = "REMEDIATION & STANDARDISATION";
    sequenceSelect.appendChild(remediationOpt);
  }
});

// Load sections when sequence changes
sequenceSelect.addEventListener("change", function () {
  const level = levelSelect.value;
  const seq = this.value;
  sectionSelect.innerHTML = '<option value="">-- Select Section --</option>';
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';
  if (seq === "REMEDIATION & STANDARDISATION") {
    const remediationOpt = document.createElement("option");
    remediationOpt.value = "REMEDIATION & STANDARDISATION";
    remediationOpt.textContent = "REMEDIATION & STANDARDISATION";
    sectionSelect.appendChild(remediationOpt);
    const remediationSessionOpt = document.createElement("option");
    remediationSessionOpt.value = "REMEDIATION & STANDARDISATION";
    remediationSessionOpt.textContent = "REMEDIATION & STANDARDISATION";
    sessionSelect.appendChild(remediationSessionOpt);
  } else if (data[level] && data[level][seq]) {
    Object.keys(data[level][seq]).forEach(section => {
      const opt = document.createElement("option");
      opt.value = section;
      opt.textContent = section;
      sectionSelect.appendChild(opt);
    });
  }
});

// Load sessions when section changes
sectionSelect.addEventListener("change", function () {
  const level = levelSelect.value;
  const seq = sequenceSelect.value;
  const section = this.value;
  sessionSelect.innerHTML = '<option value="">-- Select Session --</option>';
  if (seq === "REMEDIATION & STANDARDISATION") {
    const remediationSessionOpt = document.createElement("option");
    remediationSessionOpt.value = "REMEDIATION & STANDARDISATION";
    remediationSessionOpt.textContent = "REMEDIATION & STANDARDISATION";
    sessionSelect.appendChild(remediationSessionOpt);
  } else if (data[level] && data[level][seq] && data[level][seq][section]) {
    data[level][seq][section].forEach(session => {
      const opt = document.createElement("option");
      opt.value = session;
      opt.textContent = session;
      sessionSelect.appendChild(opt);
    });
  }
});

// ---------- RIBBON EDITOR LOGIC ----------
(function() {
  let activeEditor = null;
  
  document.addEventListener('focusin', e => {
      if (e.target.isContentEditable) {
          activeEditor = e.target;
      }
  });

  function exec(cmd, value = null) {
    if (activeEditor) {
      activeEditor.focus();
      document.execCommand(cmd, false, value);
    }
  }

  document.querySelectorAll('[data-cmd]').forEach(btn => {
      btn.addEventListener('click', e => {
          e.preventDefault();
          exec(btn.dataset.cmd);
      });
  });

  document.getElementById('fontFamily').addEventListener('change', e => {
    exec('fontName', e.target.value);
  });
  
  document.getElementById('fontSize').addEventListener('change', e => {
      const sizeMap = { '10': 1, '12': 2, '14': 3, '16': 4, '18': 5, '20': 6, '24': 7 };
      exec('fontSize', sizeMap[e.target.value] || 3);
  });

  document.getElementById('foreColor').addEventListener('input', e => {
      exec('foreColor', e.target.value);
  });
  
  document.getElementById('hiliteColor').addEventListener('input', e => {
      exec('hiliteColor', e.target.value);
  });

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  document.querySelector('.insert-image-btn').addEventListener('click', e => {
    e.preventDefault();
    if (activeEditor) {
        fileInput.click();
    } else {
        alert("Please click into a text area before inserting an image.");
    }
  });

  fileInput.addEventListener('change', function () {
    const file = this.files && this.files[0];
    if (!file || !activeEditor) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      const img = document.createElement('img');
      img.src = ev.target.result;
      insertNodeAtCursor(img, activeEditor);
    };
    reader.readAsDataURL(file);
    this.value = '';
  });

  function insertNodeAtCursor(node, editor) {
    editor.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      editor.appendChild(node);
      return;
    }
    let range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();

// =================================================================
// ---------- SAVE & LOAD LESSON PLAN WITH FIREBASE ----------
// =================================================================

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCVtWA2FqatlTRR1gSzCTNUSFYUAbAwLW0",
  authDomain: "printelydz.firebaseapp.com",
  projectId: "printelydz",
  storageBucket: "printelydz.appspot.com",
  messagingSenderId: "49201277305",
  appId: "1:49201277305:web:df932043e4d6d986cae7a8",
  measurementId: "G-R4VJL5SR88"
};

// --- Initialize Firebase ---
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Global state for editing ---
let currentPlanId = null;

// --- Modal and Button elements ---
const saveButton = document.getElementById("save-button");
const planNameModal = document.getElementById("planNameModal");
const planNameInput = document.getElementById("planNameInput");
const cancelSave = document.getElementById("cancelSave");
const confirmSave = document.getElementById("confirmSave");

// --- NEW: Function to populate the form with loaded data ---
function populateForm(planData) {
    // Populate simple text/number inputs
    document.getElementById("schoolName").value = planData.school || '';
    document.getElementById("teacherName").value = planData.teacher || '';
    document.getElementById("learnerCount").value = planData.learners || '';
    document.getElementById("sessionObjective").value = planData.objective || '';
    planNameInput.value = planData.planName || ''; // Pre-fill plan name for re-saving

    // FIXED: Populate subsidiary objective input field
    document.getElementById("subsidiaryObjective").value = planData.subsidiaryObjective || 'Building Confidence in Language Use.';

    // Populate contenteditable divs
    document.getElementById('warmerProcedure').innerHTML = planData.warmer?.procedure || '';
    document.getElementById('installProcedure').innerHTML = planData.install?.procedure || '';
    document.getElementById('assessmentProcedure').innerHTML = planData.assessment?.procedure || '';

    // Populate stage inputs
    document.getElementById('warmerInteraction').value = planData.warmer?.interaction || '';
    document.getElementById('warmerTime').value = planData.warmer?.time || '';
    document.getElementById('installInteraction').value = planData.install?.interaction || '';
    document.getElementById('installTime').value = planData.install?.time || '';
    document.getElementById('assessmentInteraction').value = planData.assessment?.interaction || '';
    document.getElementById('assessmentTime').value = planData.assessment?.time || '';
    
    // Populate textareas
    document.getElementById('whatWorked').value = planData.reflection?.worked || '';
    document.getElementById('whatHindered').value = planData.reflection?.hindered || '';
    document.getElementById('actionPoints').value = planData.reflection?.actionPoints || '';

    // Populate checkboxes for materials and competencies
    const setCheckedValues = (containerId, values) => {
        document.querySelectorAll(`#${containerId} input[type='checkbox']`).forEach(cb => {
            cb.checked = (values || []).includes(cb.value);
            cb.dispatchEvent(new Event('change')); // Trigger visual style update
        });
    };
    setCheckedValues('materials', planData.materials);
    setCheckedValues('competencies', planData.competencies);

    // Populate chained dropdowns
    levelSelect.value = planData.level || '';
    levelSelect.dispatchEvent(new Event('change'));

    setTimeout(() => {
        sequenceSelect.value = planData.sequence || '';
        sequenceSelect.dispatchEvent(new Event('change'));
        setTimeout(() => {
            sectionSelect.value = planData.section || '';
            sectionSelect.dispatchEvent(new Event('change'));
            setTimeout(() => {
                sessionSelect.value = planData.session || '';
            }, 100);
        }, 100);
    }, 100);
}

// --- NEW: Function to load a specific plan from Firestore ---
async function loadPlan(planId) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to load a plan.");
        return;
    }
    console.log(`Loading plan with ID: ${planId}`);
    try {
        const planRef = db.collection("users").doc(user.uid).collection("lessonPlans").doc(planId);
        const planDoc = await planRef.get();
        if (planDoc.exists) {
            currentPlanId = planId; // Set the global ID for future updates
            populateForm(planDoc.data());
            alert("Lesson plan loaded successfully!");
        } else {
            alert("Error: Lesson plan not found.");
            console.error("No such document!");
        }
    } catch (error) {
        alert("An error occurred while loading the plan. Please check the console.");
        console.error("Error getting document:", error);
    }
}


// --- Auth Listener ---
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User is logged in:", user.email);
    saveButton.disabled = false;
    saveButton.innerHTML = "<i class='fa-solid fa-save'></i> Save Plan";

    // --- NEW: Check session storage to see if we need to load a plan ---
    const planToLoadId = sessionStorage.getItem('planToLoadId');
    if (planToLoadId) {
        loadPlan(planToLoadId);
        sessionStorage.removeItem('planToLoadId'); // Clean up after loading
    }

  } else {
    console.log("User is not logged in.");
    saveButton.disabled = true;
    saveButton.innerHTML = "Log In to Save";
    currentPlanId = null; // Clear plan ID on logout
  }
});


// --- Save Functionality ---
saveButton.addEventListener("click", () => {
  if (!auth.currentUser) {
    alert("Please log in to save your lesson plan.");
    return;
  }
  // If not editing a plan, clear the input. If editing, it's pre-filled by loadPlan.
  if (!currentPlanId) {
      planNameInput.value = "";
  }
  planNameModal.style.display = "flex";
  planNameInput.focus();
});

cancelSave.addEventListener("click", () => {
  planNameModal.style.display = "none";
});

confirmSave.addEventListener("click", async () => {
  const planName = planNameInput.value.trim();
  const user = auth.currentUser;

  if (!planName) {
    alert("Please enter a name for your lesson plan!");
    return;
  }
  if (!user) {
    alert("Authentication error. Please make sure you are logged in.");
    return;
  }

  confirmSave.disabled = true;
  confirmSave.textContent = "Saving...";

  const lessonData = {
    uid: user.uid,
    planName: planName,
    plannerType: "interface",
    school: document.getElementById("schoolName").value,
    teacher: document.getElementById("teacherName").value,
    level: document.getElementById("levelSelect").value,
    learners: document.getElementById("learnerCount").value,
    sequence: document.getElementById("sequenceSelect").value,
    section: document.getElementById("sectionSelect").value,
    session: document.getElementById("sessionSelect").value,
    objective: document.getElementById("sessionObjective").value,
    // FIXED: Get value from the new input field
    subsidiaryObjective: document.getElementById("subsidiaryObjective").value,
    materials: Array.from(
      document.querySelectorAll("#materials input[type='checkbox']:checked")
    ).map(cb => cb.value),
    competencies: Array.from(
      document.querySelectorAll("#competencies input[type='checkbox']:checked")
    ).map(cb => cb.value),
    warmer: {
        procedure: document.getElementById('warmerProcedure').innerHTML,
        interaction: document.getElementById('warmerInteraction').value,
        time: document.getElementById('warmerTime').value,
    },
    install: {
        procedure: document.getElementById('installProcedure').innerHTML,
        interaction: document.getElementById('installInteraction').value,
        time: document.getElementById('installTime').value,
    },
    assessment: {
        procedure: document.getElementById('assessmentProcedure').innerHTML,
        interaction: document.getElementById('assessmentInteraction').value,
        time: document.getElementById('assessmentTime').value,
    },
    reflection: {
        worked: document.getElementById('whatWorked').value,
        hindered: document.getElementById('whatHindered').value,
        actionPoints: document.getElementById('actionPoints').value,
    },
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    if (currentPlanId) {
        // --- UPDATE existing plan ---
        const planRef = db.collection("users").doc(user.uid).collection("lessonPlans").doc(currentPlanId);
        await planRef.update(lessonData);
        alert(`Lesson plan "${planName}" updated successfully!`);
    } else {
        // --- ADD new plan ---
        lessonData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        const docRef = await db.collection("users").doc(user.uid).collection("lessonPlans").add(lessonData);
        currentPlanId = docRef.id; // Store the new ID so the next save is an update
        alert(`Lesson plan "${planName}" saved successfully!`);
    }
    planNameModal.style.display = "none";
  } catch (error) {
    console.error("Error saving lesson plan:", error);
    alert("An error occurred while saving. Please check the console and try again.");
  } finally {
    confirmSave.disabled = false;
    confirmSave.textContent = "Save";
  }
});
