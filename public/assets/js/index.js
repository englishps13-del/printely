import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Your existing Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCVtWA2FqatlTRR1gSzCTNUSFYUAbAwLW0",
  authDomain: "printelydz.firebaseapp.com",
  projectId: "printelydz",
  storageBucket: "printelydz.appspot.com",
  messagingSenderId: "49201277305",
  appId: "1:49201277305:web:df932043e4d6d986cae7a8",
  measurementId: "G-R4VJL5SR88"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get references to HTML elements
const userInfoDiv = document.getElementById("user-info");
const feedbackForm = document.getElementById('feedback-form');
const commentTextarea = document.getElementById('comment-text');
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
const loginPrompt = document.getElementById('login-prompt');
const commentsContainer = document.getElementById('comments-container');
const signupNavLink = document.getElementById('signup-nav-link');
const headerTextContainer = document.getElementById('header-text-container');
const pageFooter = document.getElementById('page-footer'); // Get the footer

document.addEventListener('DOMContentLoaded', function () {
    // --- Navbar and Dark Mode Script ---
    const menuContainer = document.querySelector('nav .container');
    const underline = document.querySelector('.underline');
    const allLinks = document.querySelectorAll('#nav-links a');
    const toggleCheckbox = document.getElementById('dm-toggle');
    const body = document.body;
    const sliderIcon = document.getElementById('slider-icon');
    const lightIcon = "https://cdn-icons-png.flaticon.com/512/3258/3258157.png";
    const darkIcon = "https://cdn-icons-png.flaticon.com/512/4445/4445942.png";

    // --- NEW: Hamburger Menu Script ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('hidden');
      navLinks.classList.toggle('active');
    });

    function moveUnderline(element) {
      if (!element || window.innerWidth < 768) return; // Don't run on mobile
      const rect = element.getBoundingClientRect();
      const parentRect = menuContainer.getBoundingClientRect();
      const left = rect.left - parentRect.left + menuContainer.scrollLeft;
      const width = rect.width;
      underline.style.width = width + 'px';
      underline.style.left = left + 'px';
    }

    setTimeout(() => {
        const activeLink = document.querySelector('a.active') || allLinks[0];
        moveUnderline(activeLink);
    }, 50);

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      body.classList.add('dark');
      toggleCheckbox.checked = true;
      sliderIcon.src = darkIcon;
    } else {
      sliderIcon.src = lightIcon;
    }

    allLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveUnderline(link));
      link.addEventListener('click', (e) => {
        allLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Close mobile menu on link click
        if (window.innerWidth < 768) {
          menuToggle.classList.remove('active');
          navLinks.classList.add('hidden');
          navLinks.classList.remove('active');
        }

        if(link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth'});
        }
      });
    });
    
    menuContainer.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('a.active') || allLinks[0];
        moveUnderline(activeLink);
    });

    window.addEventListener('resize', () => {
      const activeLink = document.querySelector('a.active') || allLinks[0];
      moveUnderline(activeLink);
      // Hide mobile menu if screen is resized to be larger
      if (window.innerWidth >= 768) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navLinks.classList.add('hidden'); // Ensure it's ready for mobile again
      }
    });

    toggleCheckbox.addEventListener('change', () => {
      if (toggleCheckbox.checked) {
        body.classList.add('dark');
        sliderIcon.src = darkIcon;
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark');
        sliderIcon.src = lightIcon;
        localStorage.setItem('theme', 'light');
      }
    });

    // --- Accordion Script ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(header => {
      header.addEventListener('click', function () {
        const panel = this.nextElementSibling;
        const isOpen = this.classList.contains('active');
        this.classList.toggle('active');
        if (isOpen) {
          panel.style.maxHeight = panel.scrollHeight + "px";
          requestAnimationFrame(() => { panel.style.maxHeight = "0px"; });
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.addEventListener('transitionend', () => {
            if (this.classList.contains('active')) panel.style.maxHeight = "none";
          }, { once: true });
        }
      });
    });
    
    // --- SLIDESHOW SCRIPT ---
    const slidesWrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');
    const dots = document.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }
        
        slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentIndex = index;
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startSlideShow() {
        stopSlideShow(); // Prevent multiple intervals
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideShow(); // Optional: stop auto-play on manual control
        startSlideShow(); // Restart the timer
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideShow();
        startSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });

    // Start slideshow on page load
    startSlideShow();
});


// --- Function to fetch and display comments in real-time ---
const displayComments = () => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, orderBy('timestamp', 'desc')); // Order by newest first

  onSnapshot(q, (snapshot) => {
    commentsContainer.innerHTML = ''; // Clear existing comments to prevent duplication
    snapshot.forEach((doc) => {
      const comment = doc.data();
      const commentElement = document.createElement('div');
      commentElement.className = 'p-6 rounded-xl bg-gray-100 dark:bg-gray-700/50 shadow-inner animate-fade-in-up';
      
      const date = comment.timestamp ? comment.timestamp.toDate().toLocaleString() : 'Just now';

      commentElement.innerHTML = `
        <div class="flex justify-between items-center">
            <h4 class="font-bold text-purple-600 dark:text-purple-300 text-lg">${comment.username}</h4>
            <span class="text-xs text-gray-500 dark:text-gray-400">${date}</span>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">${comment.commentText}</p>
      `;
      commentsContainer.appendChild(commentElement);
    });
  });
};

// --- Listen for Authentication State Changes ---
// --- Listen for Authentication State Changes ---
onAuthStateChanged(auth, async (user) => {
  // NEW: Make the user-info and footer visible now that we have a result
  userInfoDiv.style.display = 'flex'; 
  pageFooter.style.display = 'block';

  if (user) {
    // --- USER IS LOGGED IN ---
    
    // 1. Hide the "Sign Up" navigation link
    if (signupNavLink) {
        signupNavLink.style.display = 'none';
    }
    
    // 2. Update UI for logged-in state (enable feedback form)
    feedbackForm.style.display = 'block';
    loginPrompt.classList.add('hidden');
    commentTextarea.disabled = false;
    submitFeedbackBtn.disabled = false;

    // 3. Fetch user's username from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const username = userDoc.exists() ? userDoc.data().username : user.email;

    // 4. Display personalized welcome in the main header
    headerTextContainer.innerHTML = `
        <h1 class="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-down">
            Welcome back, ${username}!
        </h1>
        <h2 class="text-2xl md:text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 animate-fade-in-down" style="animation-delay: 0.2s;">
           Welcome to the Lesson Plan Builder
        </h2>
        <p class="text-lg md:text-2xl text-purple-100/90 animate-fade-in-up max-w-3xl mx-auto" style="animation-delay: 0.4s;">
            Let's create something amazing today.
        </p>
    `;

    // 5. Display Account link with icon in Navbar
    userInfoDiv.innerHTML = `
      <a href="dashboard.html" title="Go to your account dashboard" class="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-8 h-8 p-1 bg-gray-200 dark:bg-gray-600 rounded-full" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg>
          <span class="font-medium text-sm md:text-base pr-2">Account</span>
      </a>
    `;

    // 6. Display Dashboard and Logout buttons in Footer
    pageFooter.innerHTML = `
        <div class="flex justify-center items-center gap-4">
            <a href="dashboard.html" class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold shadow-lg transform hover:scale-105">Go to Dashboard</a>
            <button id="footer-logout-btn" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-lg transform hover:scale-105">Sign Out</button>
        </div>
    `;
    document.getElementById("footer-logout-btn").addEventListener("click", () => signOut(auth));


    // 7. Handle feedback form submission
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = commentTextarea.value.trim();
        
        if (commentText === '') return;

        try {
            await addDoc(collection(db, "comments"), {
                userId: user.uid,
                username: username,
                commentText: commentText,
                timestamp: serverTimestamp()
            });
            feedbackForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Sorry, there was an error submitting your feedback.");
        }
    });

  } else {
    // --- USER IS LOGGED OUT ---
    
    // 1. Restore the original generic header
    headerTextContainer.innerHTML = `
        <h2 class="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 animate-fade-in-down">
            Welcome to the Lesson Plan Builder
        </h2>
        <p class="text-lg md:text-2xl text-purple-100/90 animate-fade-in-up max-w-3xl mx-auto">
            Customize your lesson plan in a few easy steps
        </p>
    `;

    // 2. Show the "Sign Up" navigation link
    if (signupNavLink) {
        signupNavLink.style.display = 'block';
    }

    // 3. Update UI for logged-out state
    userInfoDiv.innerHTML = `<a href="login.html" class="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">Login</a>`;
    feedbackForm.style.display = 'none';
    loginPrompt.classList.remove('hidden');
    commentTextarea.disabled = true;
    submitFeedbackBtn.disabled = true;

    // 4. Show footer with a disabled button
    pageFooter.innerHTML = `
        <button id="footer-logout-btn" class="px-6 py-2 bg-gray-400 text-white rounded-lg font-bold shadow-lg cursor-not-allowed" disabled title="You must be logged in to sign out">Sign Out</button>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">You are not logged in.</p>
    `;
  }
});
// This logic is duplicated and can cause issues. It's better to keep it within the onAuthStateChanged scope.
// However, per user request not to touch the logout button, I will leave this block, but the primary logic is the one in the footer.
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      window.location.href = "index.html"; // optional redirect
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });
}
// --- Feedback Form Submission ---
if (feedbackForm) {
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const commentText = commentTextarea.value.trim();
    if (!commentText) return;

    try {
      // Get logged-in user info
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to comment.");
        return;
      }

      // Fetch username from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let username = user.email; // fallback
      if (userDocSnap.exists()) {
        username = userDocSnap.data().username || user.email;
      }

      // Save comment to Firestore
      await addDoc(collection(db, "comments"), {
        username: username,
        commentText: commentText,
        timestamp: serverTimestamp()
      });

      // Clear the textarea
      commentTextarea.value = "";

      console.log("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to post comment. Try again.");
    }
  });
}

// --- Initial call to display comments when the page loads ---
displayComments();