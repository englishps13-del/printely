// ---------- Print to PDF (uses system print dialog) ----------
function downloadPDF() {
  window.print();
}

// ---------- Theme Switcher ----------
const themeSwitcher = document.getElementById("themeSwitcher");
const tableContainer = document.getElementById("table-container");

// Ensure initial class is correct
themeSwitcher.addEventListener("change", (e) => {
  const val = e.target.value;
  tableContainer.className = "";
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
      "FAMILY": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "FRIENDS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    },
    "SCHOOL": {
      "SCHOOL OBJECTS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "SCHOOL SUBJECTS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    },
    "HOME": {
      "DESCRIBING A HOUSE": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "LOCATION ROOMS IN A HOUSE": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    },
    "PLAY TIME": {
      "TOYS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "FAVOURITE TOYS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    },
    "PETS": {
      "PETS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "PETS BODY PARTS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    },
    "BIRTHDAY": {
      "PARTY INVITATION": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ],
      "PARTY CELEBRATION": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and write",
        "I play roles"
      ]
    }
  },

  "4PS": {
    "FAMILY AND FRIENDS": {
      "FAMILY": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ],
      "FRIENDS": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ]
    },
    "SCHOOL": {
      "SCHOOL FACILITIES": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ],
      "MAPPING": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ]
    },
    "FUN TIME AND GAMES": {
      "FUN TIME": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ],
      "GAMES": [
        "I sing and have fun, I listen and repeat",
        "I read and discover",
        "I read and enjoy",
        "I read and write",
        "I play roles"
      ]
    }
  },

  "5PS": {
    "JOBS, OCCUPATIONS, AND HOBBIES": {
      "JOBS AND OCCUPATIONS": [
        "I get ready",
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn and write",
        "I write"
      ],
      "HOBBIES": [
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn to write",
        "I write",
        "I check my progress"
      ]
    },
    "HOMETOWN, CITY, VILLAGE AMENITIES": {
      "HOMETOWN, CITY, VILLAGE AMENITIES": [
        "I get ready",
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn and write",
        "I write"
      ],
      "DIRECTIONS": [
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn to write",
        "I write",
        "I check my progress"
      ]
    },
    "HOLIDAYS AND TRAVELLING": {
      "HOLIDAYS": [
        "I get ready",
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn and write",
        "I write"
      ],
      "TRAVELLING": [
        "I listen and interact",
        "I listen and discover",
        "I read and understand",
        "I read and discover",
        "I learn and enjoy",
        "I learn to write",
        "I write",
        "I check my progress"
      ]
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

    // Add special option
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

// ---------- Quill Editor ----------
Quill.register('modules/imageResize', window.ImageResize);

const quill = new Quill('#editor', {
  theme: 'snow',
  placeholder: 'Write your lesson procedure here...',
  modules: {
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'super' }, { 'script': 'sub' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['image'],
        ['clean']
      ]
    },
    imageResize: {}
  }
});

// ---------- Font size adjust (safe checks) ----------
function calculateNewSize(currentSize, delta) {
  const sizes = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px'];
  let index = sizes.indexOf(currentSize);
  if (index === -1) index = sizes.indexOf('16px');
  let newIndex = index + delta;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= sizes.length) newIndex = sizes.length - 1;
  return sizes[newIndex];
}

function adjustFontSize(delta) {
  const range = quill.getSelection();
  if (!range) return;

  const format = quill.getFormat(range);
  const currentSize = format.size || '16px';
  const newSize = calculateNewSize(currentSize, delta);

  if (range.length === 0) {
    quill.format('size', newSize);
  } else {
    quill.formatText(range.index, range.length, 'size', newSize);
  }
}

// Only attach if buttons exist in DOM
const incBtn = document.getElementById('increase-size');
const decBtn = document.getElementById('decrease-size');

if (incBtn) incBtn.addEventListener('click', () => adjustFontSize(1));
if (decBtn) decBtn.addEventListener('click', () => adjustFontSize(-1));
