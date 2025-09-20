<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCVtWA2FqatlTRR1gSzCTNUSFYUAbAwLW0",
    authDomain: "printelydz.firebaseapp.com",
    projectId: "printelydz",
    storageBucket: "printelydz.appspot.com",
    messagingSenderId: "49201277305",
    appId: "1:49201277305:web:df932043e4d6d986cae7a8",
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;


// --- CHECKBOX SCRIPT (NO CHANGES) ---
function setupPrintableCheckboxes(containerId, printId, formatAsList = true) {
    const checkboxContainer = document.getElementById(containerId);
    const printElement = document.getElementById(printId);
    if (!checkboxContainer || !printElement) return;

    const checkboxes = checkboxContainer.querySelectorAll('input[type="checkbox"]');

    function updatePrintableArea() {
        const selectedLabels = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const label = cb.closest('label');
                if (label) selectedLabels.push(label.innerText || label.textContent);
            }
        });
        
        if (selectedLabels.length > 0) {
            if (formatAsList) {
                printElement.innerHTML = '<ul>' + selectedLabels.map(text => `<li>${text}</li>`).join('') + '</ul>';
            } else {
                printElement.innerHTML = selectedLabels.join(', ');
            }
        } else {
            printElement.innerHTML = '';
        }
    }
    checkboxes.forEach(cb => cb.addEventListener('change', updatePrintableArea));
    updatePrintableArea();
}

// --- MAIN SCRIPT ---
document.addEventListener('DOMContentLoaded', () => {
    // Setup for all checkbox sections
    setupPrintableCheckboxes('ccc-multiselect', 'ccc-print', true);
    setupPrintableCheckboxes('target-multiselect', 'target-print', true);
    setupPrintableCheckboxes('values-multiselect', 'values-print', false);
    setupPrintableCheckboxes('domains-multiselect', 'domains-print', false);
    setupPrintableCheckboxes('materials-multiselect', 'materials-print', false);

    // --- Data for the Lesson Content Loader ---
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

    // --- Get elements from the HTML for Lesson Loader ---
    const sequenceSelector = document.getElementById('main-sequence-selector');
    const sessionSelector = document.getElementById('main-session-selector');
    const loadBtn = document.getElementById('load-content-btn');
    
    const preWritingTarget = document.getElementById('pre-writing-procedure');
    const writingTarget = document.getElementById('writing-procedure');
    const postWritingTarget = document.getElementById('post-writing-procedure');

    // --- Populate the first dropdown (Sequences) ---
    sequenceSelector.innerHTML = '<option value="">-- Select a Sequence --</option>'; 
    for (const sequence in lessonData) {
        const option = document.createElement('option');
        option.value = sequence;
        option.textContent = sequence;
        sequenceSelector.appendChild(option);
    }
    
    // Default Sessions dropdown
    const defaultSessions = ["Get Ready", "Listen & Interact", "Listen & Consider", "Read & Interpret", "Read & Consider", "Write Together", "Write Alone"];
    sessionSelector.innerHTML = '<option value="">-- Select a Session --</option>';
    defaultSessions.forEach(sessionName => {
        const option = document.createElement('option');
        option.value = sessionName;
        option.textContent = sessionName;
        sessionSelector.appendChild(option);
    });

    // --- Load the content into the table when the button is clicked ---
    loadBtn.addEventListener('click', () => {
        const selectedSequence = sequenceSelector.value;
        const selectedSession = sessionSelector.value;

        if (selectedSequence && selectedSession && lessonData[selectedSequence] && lessonData[selectedSequence][selectedSession]) {
            const content = lessonData[selectedSequence][selectedSession];
            preWritingTarget.innerHTML = content.preWriting;
            writingTarget.innerHTML = content.writing;
            postWritingTarget.innerHTML = content.postWriting;
        } else {
            alert("Please select both a valid sequence and session first.");
        }
    });

    // --- NEW: FUNCTION TO LOAD SAVED PLAN DATA ---
    async function loadPlanFromSession() {
        const planId = sessionStorage.getItem('planToLoadId');
        if (!planId || !currentUser) return;

        try {
            const docRef = doc(db, 'users', currentUser.uid, 'lessonPlans', planId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // --- Helper function to set contenteditable innerHTML ---
                const setHTML = (id, content) => {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = content || '';
                };
                
                // --- Helper function to set select value ---
                const setSelect = (id, value) => {
                    const el = document.getElementById(id);
                    if (el) el.value = value || '';
                };

                // --- Helper function to check checkboxes from a list ---
                const setCheckboxes = (containerId, printId, formatAsList, values) => {
                    if (values && Array.isArray(values)) {
                        // Uncheck all first
                        document.querySelectorAll(`#${containerId} input[type="checkbox"]`).forEach(cb => cb.checked = false);
                        // Check the ones from the saved data
                        values.forEach(value => {
                            document.querySelectorAll(`#${containerId} label`).forEach(label => {
                                if ((label.innerText || label.textContent).trim() === value) {
                                    const cb = label.querySelector('input[type="checkbox"]');
                                    if (cb) cb.checked = true;
                                }
                            });
                        });
                    }
                    // Update the printable view after checking/unchecking
                    setupPrintableCheckboxes(containerId, printId, formatAsList);
                };

                // --- Populate All Fields ---
                setHTML('school-name', data.school);
                setHTML('teacher-name', data.teacher);
                setHTML('lesson-date', data.date);
                setHTML('learner-count', data.learners);
                setHTML('class-profile', data.classProfile);

                setSelect('main-sequence-selector', data.sequence);
                setSelect('main-session-selector', data.session);
                
                setHTML('subsidiary-objectives', data.subsidiaryObjectives);
                setHTML('session-objectives', data.sessionObjectives);
                setHTML('anticipated-problems', data.anticipatedProblems);
                setHTML('solutions-plan-b', data.solutions);

                setCheckboxes('materials-multiselect', 'materials-print', false, data.materials);
                setCheckboxes('ccc-multiselect', 'ccc-print', true, data.ccc);
                setCheckboxes('target-multiselect', 'target-print', true, data.targetCompetencies);
                setCheckboxes('values-multiselect', 'values-print', false, data.values);
                setCheckboxes('domains-multiselect', 'domains-print', false, data.domains);

                if (data.procedure) {
                    setHTML('pre-writing-procedure', data.procedure.preWriting?.content);
                    setHTML('pre-writing-interaction', data.procedure.preWriting?.interaction);
                    setHTML('pre-writing-time', data.procedure.preWriting?.time);
                    setHTML('writing-procedure', data.procedure.writing?.content);
                    setHTML('writing-interaction', data.procedure.writing?.interaction);
                    setHTML('writing-time', data.procedure.writing?.time);
                    setHTML('post-writing-procedure', data.procedure.postWriting?.content);
                    setHTML('post-writing-interaction', data.procedure.postWriting?.interaction);
                    setHTML('post-writing-time', data.procedure.postWriting?.time);
                }
                
                if (data.reflection) {
                    setHTML('reflection-worked', data.reflection.worked);
                    setHTML('reflection-hindered', data.reflection.hindered);
                    setHTML('reflection-points', data.reflection.points);
                }
                
                console.log('Lesson plan loaded successfully!');

            } else {
                console.log("No such document!");
                alert("Could not find the lesson plan to load.");
            }
        } catch (error) {
            console.error("Error loading plan from session:", error);
            alert("There was an error loading your lesson plan.");
        } finally {
            // Clear the ID so it doesn't try to load again on refresh
            sessionStorage.removeItem('planToLoadId');
        }
    }

    // --- FIREBASE AUTH & SAVE LOGIC ---
    
    const saveBtn = document.getElementById('save-to-cloud-btn');
    const authStatusDiv = document.getElementById('auth-status');

    // --- Auth Listener ---
    onAuthStateChanged(auth, user => {
        if (user) {
            currentUser = user;
            saveBtn.disabled = false;
            authStatusDiv.innerHTML = `Logged in: <strong>${user.email}</strong>`;
            // ** ATTEMPT TO LOAD DATA WHEN USER IS LOGGED IN **
            loadPlanFromSession(); 
        } else {
            currentUser = null;
            saveBtn.disabled = true;
            authStatusDiv.innerHTML = `Please log in to save your work online.`;
        }
    });
    
    // --- Helper function to get checked labels from a checkbox container ---
    function getCheckedLabels(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        const checked = container.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checked).map(cb => {
            const label = cb.closest('label');
            return label ? (label.innerText || label.textContent).trim() : '';
        });
    }

    // --- Save to Firestore ---
    saveBtn.addEventListener('click', async () => {
        if (!currentUser) return alert("You must be logged in to save.");
        const planName = prompt("Please enter a name for your lesson plan:", "MS1 Lesson Plan");
        if (!planName) return;

        try {
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';
            
            const lessonPlanData = {
                planName,
                plannerType: 'ms1_1',
                school: document.getElementById('school-name').textContent,
                teacher: document.getElementById('teacher-name').textContent,
                date: document.getElementById('lesson-date').textContent,
                learners: document.getElementById('learner-count').textContent,
                sequence: document.getElementById('main-sequence-selector').value,
                session: document.getElementById('main-session-selector').value,
                classProfile: document.getElementById('class-profile').innerHTML,
                materials: getCheckedLabels('materials-multiselect'),
                ccc: getCheckedLabels('ccc-multiselect'),
                targetCompetencies: getCheckedLabels('target-multiselect'),
                subsidiaryObjectives: document.getElementById('subsidiary-objectives').innerHTML,
                sessionObjectives: document.getElementById('session-objectives').innerHTML,
                values: getCheckedLabels('values-multiselect'),
                domains: getCheckedLabels('domains-multiselect'),
                anticipatedProblems: document.getElementById('anticipated-problems').innerHTML,
                solutions: document.getElementById('solutions-plan-b').innerHTML,
                procedure: {
                    preWriting: {
                        content: document.getElementById('pre-writing-procedure').innerHTML,
                        interaction: document.getElementById('pre-writing-interaction').innerHTML,
                        time: document.getElementById('pre-writing-time').innerHTML
                    },
                    writing: {
                        content: document.getElementById('writing-procedure').innerHTML,
                        interaction: document.getElementById('writing-interaction').innerHTML,
                        time: document.getElementById('writing-time').innerHTML
                    },
                    postWriting: {
                        content: document.getElementById('post-writing-procedure').innerHTML,
                        interaction: document.getElementById('post-writing-interaction').innerHTML,
                        time: document.getElementById('post-writing-time').innerHTML
                    }
                },
                reflection: {
                    worked: document.getElementById('reflection-worked').innerHTML,
                    hindered: document.getElementById('reflection-hindered').innerHTML,
                    points: document.getElementById('reflection-points').innerHTML
                },
                createdAt: serverTimestamp(),
                authorId: currentUser.uid
            };

            await addDoc(collection(db, 'users', currentUser.uid, 'lessonPlans'), lessonPlanData);
            alert(`Lesson plan "${planName}" saved successfully!`);
        } catch (error) {
            console.error("Error saving document: ", error);
            alert("There was an error saving your lesson plan.");
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save to Cloud';
        }
    });

});