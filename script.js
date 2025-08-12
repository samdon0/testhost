// script.js (fixed)

// Use same Firebase version for all modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA4SKJYpsrA2VTspUazWEHexN1MKQtg2l8",
  authDomain: "credits-14ea9.firebaseapp.com",
  projectId: "credits-14ea9",
  storageBucket: "credits-14ea9.appspot.com", // corrected
  messagingSenderId: "262500310044",
  appId: "1:262500310044:web:897f1a1936470992b4d3d9",
  measurementId: "G-77YWXK9SZP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Wait for DOM to be ready (defensive)
window.addEventListener("DOMContentLoaded", () => {
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

  // Helper validator
  const empty = (s) => !s || s.trim().length === 0;

  createacctbtn.addEventListener("click", async function () {
    let isVerified = true;

    const signupEmail = signupEmailIn.value.trim();
    const confirmSignupEmail = confirmSignupEmailIn.value.trim();
    const signupPassword = signupPasswordIn.value;
    const confirmSignUpPassword = confirmSignUpPasswordIn.value;

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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      console.log("Account created:", userCredential.user);
      window.alert("Success! Account created.");
    } catch (error) {
      console.error("Create account error:", error);
      // more descriptive message to user
      window.alert("Error occurred when creating account. See console for details.");
    }
  });

  submitButton.addEventListener("click", async function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (empty(email) || empty(password)) {
      window.alert("Please enter an email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);
      window.alert("Success! Welcome back!");
    } catch (error) {
      console.error("Sign in error:", error);
      window.alert("Sign in failed. See console for details.");
    }
  });

  signupButton.addEventListener("click", function () {
    main.style.display = "none";
    createacct.style.display = "block";
  });

  returnBtn.addEventListener("click", function () {
    main.style.display = "block";
    createacct.style.display = "none";
  });
});
