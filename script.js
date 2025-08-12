// script.js (single-file, corrected + debug)
// Must be loaded as a module: <script type="module" src="script.js"></script>

// ---- Firebase imports (use same version for all) ----
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// ---- Basic debug info ----
console.log("SCRIPT: top-level executed", { href: location.href, ts: new Date().toISOString() });

// ---- Global error handlers to catch import/async errors ----
window.addEventListener("error", (ev) => {
  console.error("GLOBAL ERROR:", ev.message || ev.error || ev);
});
window.addEventListener("unhandledrejection", (ev) => {
  console.error("UNHANDLED REJECTION:", ev.reason);
});

// ---- Firebase config (corrected storageBucket) ----
const firebaseConfig = {
  apiKey: "AIzaSyA4SKJYpsrA2VTspUazWEHexN1MKQtg2l8",
  authDomain: "credits-14ea9.firebaseapp.com",
  projectId: "credits-14ea9",
  storageBucket: "credits-14ea9.appspot.com",
  messagingSenderId: "262500310044",
  appId: "1:262500310044:web:897f1a1936470992b4d3d9",
  measurementId: "G-77YWXK9SZP"
};

// ---- Initialize Firebase ----
let app, analytics, auth;
try {
  app = initializeApp(firebaseConfig);
  // analytics may throw on non-https/or blocked env; wrap defensively
  try { analytics = getAnalytics(app); } catch(e) { console.warn("Analytics init failed:", e); }
  auth = getAuth(app);
  console.log("Firebase: initialized", { app: !!app, auth: !!auth });
} catch (initErr) {
  console.error("Firebase init error:", initErr);
  // If firebase fails to initialize, auth will be undefined and further calls will error.
}

// ---- Helper validator ----
const empty = (s) => !s || s.trim().length === 0;

// ---- Main DOM logic ----
window.addEventListener("DOMContentLoaded", () => {
  console.log("SCRIPT: DOMContentLoaded");

  // Grab elements
  const submitButton = document.getElementById("submit");
  const signupButton = document.getElementById("sign-up");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const main = document.getElementById("main");
  const createacct = document.getElementById("create-acct");

  const signupEmailIn = document.getElementById("email-signup");
  const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
  const signupPasswordIn = document.getElementById("password-signup");
  const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
  const createacctbtn = document.getElementById("create-acct-btn");
  const returnBtn = document.getElementById("return-btn");

  console.log("SCRIPT: elements present?", {
    submitButton: !!submitButton,
    signupButton: !!signupButton,
    emailInput: !!emailInput,
    passwordInput: !!passwordInput,
    createacct: !!createacct
  });

  if (!submitButton || !signupButton) {
    console.error("SCRIPT: required buttons are missing - check IDs & markup (case-sensitive).");
    return;
  }

  // Attach create-account listener
  createacctbtn?.addEventListener("click", async function () {
    console.log("EVENT: createacctbtn clicked");
    const signupEmail = signupEmailIn.value.trim();
    const confirmSignupEmail = confirmSignupEmailIn.value.trim();
    const signupPassword = signupPasswordIn.value;
    const confirmSignUpPassword = confirmSignUpPasswordIn.value;

    let isVerified = true;
    if (empty(signupEmail) || empty(confirmSignupEmail) || empty(signupPassword) || empty(confirmSignUpPassword)) {
      window.alert("Please fill out all required fields.");
      isVerified = false;
    }
    if (signupEmail !== confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.");
      isVerified = false;
    }
    if (signupPassword !== confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.");
      isVerified = false;
    }
    if (!isVerified) return;

    if (!auth) {
      console.error("AUTH NOT INITIALIZED — cannot create account.");
      window.alert("Auth not ready. See console for details.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      console.log("Create account success:", userCredential.user);
      window.alert("Success! Account created.");
    } catch (error) {
      console.error("Create account error:", error);
      window.alert(`Error creating account: ${error.code || error.message || "see console"}`);
    }
  });

  // Attach sign-in listener
  submitButton.addEventListener("click", async function () {
    console.log("EVENT: submit clicked");
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (empty(email) || empty(password)) {
      window.alert("Please enter an email and password.");
      return;
    }
    if (!auth) {
      console.error("AUTH NOT INITIALIZED — cannot sign in.");
      window.alert("Auth not ready. See console for details.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in success:", userCredential.user);
      window.alert("Success! Welcome back!");
    } catch (error) {
      console.error("Sign in error:", error);
      window.alert(`Sign in failed: ${error.code || error.message || "see console"}`);
    }
  });

  // Toggle to create-account view
  signupButton.addEventListener("click", () => {
    console.log("EVENT: signupButton clicked");
    if (main && createacct) {
      main.style.display = "none";
      createacct.style.display = "block";
    }
  });

  // Return to login
  returnBtn?.addEventListener("click", () => {
    console.log("EVENT: returnBtn clicked");
    if (main && createacct) {
      main.style.display = "block";
      createacct.style.display = "none";
    }
  });

  console.log("SCRIPT: event listeners attached");
});
