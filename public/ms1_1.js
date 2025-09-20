	import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVtWA2FqatlTRR1gSzCTNUSFYUAbAwLW0",
    authDomain: "printelydz.firebaseapp.com",
    projectId: "printelydz",
    storageBucket: "printelydz.appspot.com",
    messagingSenderId: "49201277305",
    appId: "1:49201277305:web:df932043e4d6d986cae7a8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

function setupPrintableCheckboxes(containerId, printId, formatAsList = true) {
    const checkboxContainer = document.getElementById(containerId);
    const printElement = document.getElementById(printId);
    if (!checkboxContainer || !printElement) return;
    const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');
    function updatePrintableArea() {
        const selectedLabels = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.closest('label')?.textContent || '');
        if (selectedLabels.length > 0) {
            printElement.innerHTML = formatAsList ? `<ul>${selectedLabels.map(text => `<li>${text}</li>`).join('')}</ul>` : selectedLabels.join(', ');
        } else {
            printElement.innerHTML = '';
        }
    }
    checkboxes.forEach(cb => cb.addEventListener('change', updatePrintableArea));
    updatePrintableArea();
}

document.addEventListener('DOMContentLoaded', () => {
    ['ccc-multiselect', 'target-multiselect'].forEach(id => setupPrintableCheckboxes(id, id.replace('-multiselect', '-print'), true));
    ['values-multiselect', 'domains-multiselect', 'materials-multiselect'].forEach(id => setupPrintableCheckboxes(id, id.replace('-multiselect', '-print'), false));

   const lessonData = {
        "Habits and Preferences": {
            "Get Ready": {
                preWriting: `The teacher greets the learners and welcomes them. The teacher uses a <strong>routine bag</strong> and a <strong>book picture</strong> to introduce the <strong>habit of reading</strong>, saying, "I like reading books" and "I read every day."<br>The teacher uses <strong>flashcards</strong> for basketball and football to introduce the idea of <strong>preference</strong>.<br>The teacher makes a heart shape with their hands over a heart on the football flashcard and says, "I <strong>prefer</strong> playing football."`,
                writing: `The teacher distributes a <strong>worksheet</strong> and asks students about the topics: School projects, Daily habits & preferences, or Daily habits / Healthy food.<br>The teacher asks students to <strong>read and complete a table</strong>.<br>The teacher asks students to <strong>reorder sentences</strong> to create a correct conversation.<br>The teacher invites students to <strong>read the text aloud</strong>.<br>The teacher asks students to re-read the text and <strong>complete an identification task</strong>.`,
                postWriting: `The teacher asks students to <strong>write a short message</strong> introducing themselves and describing their <strong>daily habits and preferences</strong>.<br>The teacher asks students to use the worksheets at the end of the lesson sequence (as part of a "<strong>check my progress 1st term</strong>" task).`
            },
            "Listen & Interact": {
                preWriting: `<strong>WARM UP (LEAD-IN):</strong> Teacher greets this Ls & welcomes them.<br><strong>CLAP & BLEND (BRAINSTORMING):</strong> The teacher reviews familiar hobby words from the previous year. While clapping each sound, the teacher says: "/s/ /w/ /?/ /m/" and "/r/ /i?/ /d/." Ls clap, blend, and guess: "Swim!" "Read!" Then the teacher introduces daily habits with time expressions: "/b/ /r/ /?/ /?/" ? "Brush!"<br>-T says: "I brush my teeth every day," and uses gestures to show 'every day.' Ls repeat and mime brushing.`,
                writing: `<strong>PREDICTION (ANTICIPATION):</strong> -T sticks pictures of the key words mentioned in the script on the board & asks Ls to figure out the topic of the upcoming dialogue through the paired pictures.<br><strong>ORAL COMPREHENSION:</strong><br><strong>Listening for a gist (SKIMMING):</strong> Teacher starts reading the following script (monologue) and sticks flashcards of the keywords as he says them.<br>-T asks Ls to work in pairs and gives them enough time to share ideas and say the general idea of the dialogue.<br><strong>Listening for a specific info (SCANING):</strong> Teacher invites Ls to re-listen and asks them simple questions using the target structure from the dialogue.<br>Example: What do you do every day? Ls: I wake up at 7 ...etc<br>-T asks Ls True or False questions.<br>Example: Does Emma like to drink milk? Ls may use the slate to answer the question.`,
                postWriting: `<strong>ORAL PRODUCTION (Assessment):</strong> -T creates a dialogue as a monologue, and then invites learners to perform it with him and their friends.<br>Example: A: What do you do every day? B: I always wake up at 6 o'clock. First, I pray and have my breakfast and then I get ready for school.`
            },
            "Listen & Consider": {
                preWriting: `<strong>WARMER:</strong> T greets the Ls and welcomes them.<br><strong>PHONEME SUBSTITUTION:</strong> Teacher says a word and Ls to change one sound to make a new word. Then, Ls use the new word in a short habit sentence. Run / Sun / I run - I prefer running in the morning. Cook / Book / I look - I like cooking with my mum.<br>T re-reads the previous session script (Listen & interact)<br>-T asks simple questions with gestures & tone to demonstrate intonation while learners interact to raise awareness of target structures from the listening passage.`,
                writing: `<strong>CONTROLLED PRACTICE (FOCUS ON FORM): DRILLING:</strong> T asks the Ls to repeat the target structure while using hand movements to show word boundaries and emphasize intonation. WH questions have falling intonation (?) (e.g., What do you do every day? ?), and the answer shows the habit (e.g., I always wake up at 7 o'clock). The teacher models the sentence slowly and clearly, and learners repeat it to imitate the teacher.<br>-T presents diphthongs and words with final "S" through clear habit examples: /??/ I enjOY playing video games on Sundays. "Stress in JOY" /??/ I prefER going to school early in the morning. "Stress in FER" /a?/ I LIKE riding my bike on weekends. "Stress in LIKE"<br>-T invites Ls to listen to words and asks them to write on their lists "S" "Z" / "IZ"<br><strong>GUIDED PRACTICE (SUBSTITUTION DRILLING):</strong> -T models the target structure and Ls repeat: Ahmed: What do you like to do every day? ? Ali: I always wake up at 6 and read books.<br>-T substitutes the habit (inviting friends, cooking breakfast...)`,
                postWriting: `<strong>ROLE PLAY:</strong> T invites Ls to act out a dialogue: A: What do you do in the afternoon? B: I always do my homework in the bedroom.`
            },
            "Read & Interpret": {
                preWriting: `<strong>WARMER:</strong> T greets his Ls & welcomes them.<br><strong>BACKWARDS HUNT:</strong> The teacher writes the following sentence with their letters reversed (e.g., "ylrae pu ekaw syawla I" for "I always wake up early.") & asks Ls to read it aloud.<br><strong>PREDICTION (ANTICIPATION):</strong> The teacher sticks pictures (flashcard) of mentioned in the passage on the board and asks Ls to identify the topic of the upcoming text.`,
                writing: `<strong>CHECKING PREDICTION:</strong> The teacher writes the text and asks learners to read it silently to check their predictions.<br>-T reads the text aloud & asks the Ls to follow along silently. Then, he invites some Ls to read (starting with brilliant Ls), & those who read well will be rewarded.<br><strong>SKIMMING (PAIR SHARE FOR GIST):</strong> T asks Ls to work in pairs, read the text and discuss to determine the gist of the text.<br><strong>SCANNING:</strong> T asks Ls to read the text. Then, they write the numbers under the pictures according to their appearance in the text "They may use the slate to do so".<br>-T invites Ls to provide key words. When a learner says a correct word, the teacher writes the word on the board and writes the learner's name under it as praise.<br>-T asks Ls if the text is a story, using a gesture or a flashcard to show the meaning of 'story,' or if it is a descriptive one.<br>-T asks Ls True or False questions, e.g., I always play chess with my dad. "True" or "False".`,
                postWriting: `<strong>CHAT EXCHANGE:</strong> T invites Ls to act out a dialogue: A: What do you do in the evening? B: I always revise my lessons and sometimes I read short stories.`
            },
            "Read & Consider": {
                preWriting: `<strong>WARMER:</strong> T greets his Ls & welcomes them.<br><strong>WORD BY WORD MYSTERY:</strong> Teacher writes the words from a sentence about habits (e.g., I, always, brush, my, teeth, after, meals) on crumpled or folded cards, invites a learner to pick one card at a time, then shows each card one by one unscrambled. After each word is shown, pause and let the Ls try to arrange the words into the correct sentence. Award points for correct guesses, give hints if needed, and keep the activity lively and interactive.<br><strong>PRESENTATION (DISCOVERY):</strong><br>-T writes the previous session text (I Read & Interpret) on the board and asks Ls to read it silently then he invites some Ls to read it aloud.<br>-T asks some questions about the text and Ls are supposed to answer and teacher correct their answers to get the correct structure<br>Example: What does my family do? We always eat dinner together & laugh & talk about our day. What do you prefer to do before sleeping? We prefer reading books.<br>-T asks Ls to repeat the correct structure.`,
                writing: `<strong>CONTROLLED PRACTICE (PICTURE PROMPT):</strong> -T sticks pictures of different habits. Then, the teacher starts eliciting answers from the learners.<br><strong>GUIDED PRACTICE (MEANING):</strong><br><strong>SENTENCE ANAGRAM (UNSCRAMBLE):</strong> -T provides Ls with some unscrambled sentences and asks them to rearrange them to form a correct sentence<br>Example: with/./playing/always/enjoy/football/I/my friend`,
                postWriting: `<strong>ROLE PLAY:</strong> -T invites Ls to act out a dialogue: A: What do you do in the evening? B: I always read stories and sometimes draw pictures.`
            },
            "Write Together": {
                preWriting: `<strong>LEAD-IN:</strong> T greets his Ls & welcomes them.<br><strong>DICTATION TIMED:</strong> The teacher invites 2 learners to the board ('girl VS boy'), dictates a short sentence, and asks them to write it. The one with fewer mistakes wins.<br>-T writes the following: "You meet your friends at school. Write a message to your best friend telling him about your daily routine, habits and preferences." and asks them to write it on their copybooks.<br><strong>PLANNING: Brainstorming:</strong> T asks Ls to provide him with some HOBBIES done in SPS sequence 01.<br><strong>Selecting & Organizing Ideas:</strong> T interacts with the provided ideas by selecting the relevant ones, writing them on the board, and organizing them to create a text model.`,
                writing: `<strong>DRAFTING:</strong> -T asks Ls to collaborate with each other (TPS= Think Pair Share) to develop their ideas into sentences using the text model.<br><strong>REVISING (improving content):</strong> T walks around, picks up various mistakes, writes them on the board, and asks Ls to elicit the mistakes. Then the teacher underlines them and corrects the mistakes to show Ls how to improve their writing.<br><strong>WRITING THE FINAL VERSION:</strong> -T gives groups time to revise with peer feedback, write the final version, and praises their effort and progress.`,
                postWriting: `<strong>SHARING THE FINAL PRODUCT:</strong> -T invites the best group to read their passage to the class.<br>I always wake up at 6 o'clock, wash my face, and eat my breakfast. Then I go to school, study, and play with my friends. In the afternoon, I do my homework. I prefer reading stories in the evening.`
            },
            "Write Alone": {
                preWriting: `<strong>LEAD-IN:</strong> T greets his Ls & welcomes them.<br><strong>SNAKE GAME:</strong> The teacher invites 2 learners to the board ('girl VS boy') and writes the sentence "I always do my homework after lunch." in a jumbled format without spaces or punctuation, like this: "ialwaysdomyhomeworkafterlunch". The Ls are then asked to rewrite the sentence correctly, adding appropriate spaces & punctuation. The one with fewer mistakes wins.<br><strong>PLANNING: Brainstorming:</strong> T sticks some habit flashcards on the board to engage learners in the session and help them generate ideas.<br><strong>Selecting & Organizing ideas:</strong> T interacts with the ideas provided by the Ls, asks them to select the most relevant ones, write them in their drafts, and organize them (?) to create a text.`,
                writing: `<strong>DRAFTING:</strong> -T asks Ls to work individually to develop their ideas into sentences using the text model written in their draft copybooks from the previous session.<br><strong>REVISING (improving content):</strong> T walks around, picks up various mistakes, writes them on the board, and asks Ls to elicit the mistakes. Then the teacher underlines them and corrects the mistakes to show Ls how to improve their writing.<br>-T asks Ls to re-read their work silently and check for mistakes.<br><strong>WRITING THE FINAL VERSION:</strong> T gives Ls time to revise their production & write the final version, and praises their effort and progress.`,
                postWriting: `<strong>SHARING THE FINAL PRODUCT:</strong> -T invites some Ls to read their work to the class.<br>I always wake up at 6 o'clock, wash my face, and eat my breakfast. Then I go to school, study, and play with my friends. In the afternoon, I do my homework. I prefer reading stories in the evening.`
            }
        }
    };

    
    // --- DOM ELEMENT SELECTORS ---
    const sequenceSelector = document.getElementById('main-sequence-selector');
    const sessionSelector = document.getElementById('main-session-selector');
    const loadBtn = document.getElementById('load-content-btn');
    const saveBtn = document.getElementById('saveBtn');
    const saveModal = document.getElementById('saveModal');
    const confirmSaveBtn = document.getElementById('confirmSaveBtn');
    const cancelSaveBtn = document.getElementById('cancelSaveBtn');
    const projectNameInput = document.getElementById('projectNameInput');
    const authStatusDiv = document.getElementById('auth-status');
    const themeSelect = document.getElementById('themeSelect');

    // --- POPULATE DROPDOWNS ---
    sequenceSelector.innerHTML = '<option value="">-- Select a Sequence --</option>'; 
    Object.keys(lessonData).forEach(sequence => sequenceSelector.add(new Option(sequence, sequence)));
    const defaultSessions = ["Get Ready", "Listen & Interact", "Listen & Consider", "Read & Interpret", "Read & Consider", "Write Together", "Write Alone"];
    sessionSelector.innerHTML = '<option value="">-- Select a Session --</option>';
    defaultSessions.forEach(sessionName => sessionSelector.add(new Option(sessionName, sessionName)));

    // --- LOAD PRE-MADE CONTENT ---
    loadBtn.addEventListener('click', () => {
        const seq = sequenceSelector.value;
        const sess = sessionSelector.value;
        if (seq && sess && lessonData[seq] && lessonData[seq][sess]) {
            const content = lessonData[seq][sess];
            document.getElementById('pre-writing-procedure').innerHTML = content.preWriting;
            document.getElementById('writing-procedure').innerHTML = content.writing;
            document.getElementById('post-writing-procedure').innerHTML = content.postWriting;
        } else {
            alert("Please select a valid sequence and session first.");
        }
    });

    // --- RIBBON BAR LOGIC ---
    let activeEditor = null;
    document.addEventListener('focusin', e => { if (e.target.isContentEditable) activeEditor = e.target; });
    const exec = (cmd, val = null) => { if (activeEditor) document.execCommand(cmd, false, val); };
    document.querySelectorAll('[data-cmd]').forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); exec(btn.dataset.cmd); }));
    document.getElementById('foreColor').addEventListener('input', e => exec('foreColor', e.target.value));
    document.getElementById('hiliteColor').addEventListener('input', e => exec('backColor', e.target.value));
    
    // --- MODIFIED Image Upload Logic ---
    const imageUpload = document.getElementById('imageUpload');
    document.getElementById('insertImageBtn').addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', e => {
        if (!e.target.files?.[0]) return;
        const reader = new FileReader();
        reader.onload = () => {
            const writingProcedureDiv = document.getElementById('writing-procedure');
            if (writingProcedureDiv) {
                const img = document.createElement('img');
                img.src = reader.result;
                img.width = 100;
                img.height = 100;
                img.style.float = 'left'; // Allows text to wrap
                img.style.margin = '0 8px 4px 0'; // Adds space between image and text
                writingProcedureDiv.appendChild(img);
            } else {
                // Fallback to original behavior if target div isn't found
                exec('insertImage', reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
        e.target.value = null; // Reset file input
    });

    // --- THEME SWITCHER LOGIC ---
    const changeTheme = theme => {
        document.body.className = theme;
        localStorage.setItem("ms1LessonTheme", theme);
    };
    themeSelect.addEventListener('change', () => changeTheme(themeSelect.value));
    const savedTheme = localStorage.getItem("ms1LessonTheme");
    if (savedTheme) {
        document.body.className = savedTheme;
        themeSelect.value = savedTheme;
    }

    // --- AUTHENTICATION & DATA HANDLING ---
    onAuthStateChanged(auth, user => {
        if (user) {
            currentUser = user;
            saveBtn.disabled = false;
            authStatusDiv.innerHTML = `Logged in: <strong>${user.email}</strong>`;
            loadPlanFromSession(); 
        } else {
            currentUser = null;
            saveBtn.disabled = true;
            authStatusDiv.innerHTML = `Please <a href="/login.html" style="color: blue;">log in</a> to save your work.`;
        }
    });

    // --- SAVE LOGIC ---
    saveBtn.addEventListener('click', () => { saveModal.style.display = 'flex'; });
    cancelSaveBtn.addEventListener('click', () => { saveModal.style.display = 'none'; });
    confirmSaveBtn.addEventListener('click', async () => {
        if (!currentUser) return alert("You must be logged in to save.");
        const planName = projectNameInput.value.trim();
        if (!planName) return alert("Please enter a name for your lesson plan.");

        try {
            confirmSaveBtn.disabled = true;
            confirmSaveBtn.textContent = 'Saving...';
            const getHTML = id => document.getElementById(id).innerHTML;
            const getText = id => document.getElementById(id).textContent;
            const getVal = id => document.getElementById(id).value;
            const getChecked = id => Array.from(document.querySelectorAll(`#${id} input:checked`)).map(cb => cb.closest('label').textContent.trim());

            const lessonPlanData = {
                planName, plannerType: 'ms1_1',
                school: getText('school-name'), teacher: getText('teacher-name'), date: getText('lesson-date'),
                learners: getText('learner-count'), sequence: getVal('main-sequence-selector'), session: getVal('main-session-selector'),
                classProfile: getHTML('class-profile'), materials: getChecked('materials-multiselect'),
                ccc: getChecked('ccc-multiselect'), targetCompetencies: getChecked('target-multiselect'),
                subsidiaryObjectives: getHTML('subsidiary-objectives'), sessionObjectives: getHTML('session-objectives'),
                values: getChecked('values-multiselect'), domains: getChecked('domains-multiselect'),
                anticipatedProblems: getHTML('anticipated-problems'), solutions: getHTML('solutions-plan-b'),
                procedure: {
                    preWriting: { content: getHTML('pre-writing-procedure'), interaction: getHTML('pre-writing-interaction'), time: getHTML('pre-writing-time') },
                    writing: { content: getHTML('writing-procedure'), interaction: getHTML('writing-interaction'), time: getHTML('writing-time') },
                    postWriting: { content: getHTML('post-writing-procedure'), interaction: getHTML('post-writing-interaction'), time: getHTML('post-writing-time') }
                },
                reflection: { worked: getHTML('reflection-worked'), hindered: getHTML('reflection-hindered'), points: getHTML('reflection-points') },
                createdAt: serverTimestamp(), authorId: currentUser.uid
            };

            await addDoc(collection(db, 'users', currentUser.uid, 'lessonPlans'), lessonPlanData);
            alert(`Lesson plan "${planName}" saved successfully!`);
            saveModal.style.display = 'none';
            projectNameInput.value = '';
        } catch (error) {
            console.error("Error saving document: ", error);
            alert("There was an error saving.");
        } finally {
            confirmSaveBtn.disabled = false;
            confirmSaveBtn.textContent = 'Confirm Save';
        }
    });

    // --- LOAD LOGIC ---
    async function loadPlanFromSession() {
        const planId = sessionStorage.getItem('planToLoadId');
        if (!planId || !currentUser) return;

        try {
            const docRef = doc(db, 'users', currentUser.uid, 'lessonPlans', planId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const setHTML = (id, content) => { if (document.getElementById(id)) document.getElementById(id).innerHTML = content || ''; };
                const setVal = (id, value) => { if (document.getElementById(id)) document.getElementById(id).value = value || ''; };
                const setChecks = (containerId, values) => {
                    if (values?.length) {
                        document.querySelectorAll(`#${containerId} input`).forEach(cb => cb.checked = false);
                        values.forEach(val => {
                            const label = Array.from(document.querySelectorAll(`#${containerId} label`)).find(l => l.textContent.trim() === val);
                            if (label) label.querySelector('input').checked = true;
                        });
                    }
                };

                setHTML('school-name', data.school); setHTML('teacher-name', data.teacher); setHTML('lesson-date', data.date);
                setHTML('learner-count', data.learners); setHTML('class-profile', data.classProfile);
                setVal('main-sequence-selector', data.sequence); setVal('main-session-selector', data.session);
                
                setHTML('subsidiary-objectives', data.subsidiaryObjectives); setHTML('session-objectives', data.sessionObjectives);
                setHTML('anticipated-problems', data.anticipatedProblems); setHTML('solutions-plan-b', data.solutions);

                setChecks('materials-multiselect', data.materials); setChecks('ccc-multiselect', data.ccc);
                setChecks('target-multiselect', data.targetCompetencies); setChecks('values-multiselect', data.values);
                setChecks('domains-multiselect', data.domains);

                if (data.procedure) {
                    setHTML('pre-writing-procedure', data.procedure.preWriting?.content); setHTML('pre-writing-interaction', data.procedure.preWriting?.interaction); setHTML('pre-writing-time', data.procedure.preWriting?.time);
                    setHTML('writing-procedure', data.procedure.writing?.content); setHTML('writing-interaction', data.procedure.writing?.interaction); setHTML('writing-time', data.procedure.writing?.time);
                    setHTML('post-writing-procedure', data.procedure.postWriting?.content); setHTML('post-writing-interaction', data.procedure.postWriting?.interaction); setHTML('post-writing-time', data.procedure.postWriting?.time);
                }
                
                if (data.reflection) {
                    setHTML('reflection-worked', data.reflection.worked); setHTML('reflection-hindered', data.reflection.hindered); setHTML('reflection-points', data.reflection.points);
                }
                
                // Trigger updates for printable checkbox areas
                ['ccc-multiselect', 'target-multiselect', 'values-multiselect', 'domains-multiselect', 'materials-multiselect'].forEach(id => document.querySelector(`#${id} input`)?.dispatchEvent(new Event('change')));
            } else {
                alert("Could not find the lesson plan to load.");
            }
        } catch (error) {
            console.error("Error loading plan:", error);
        } finally {
            sessionStorage.removeItem('planToLoadId');
        }
    }
});