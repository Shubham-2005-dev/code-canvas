// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVxgDi05UOjYY0Zq2mxfOPtmq_pIfrRg4",
  authDomain: "weatherdashboard-d8195.firebaseapp.com",
  projectId: "weatherdashboard-d8195",
  storageBucket: "weatherdashboard-d8195.firebasestorage.app",
  messagingSenderId: "276010378778",
  appId: "1:276010378778:web:0a82f3950a97bca8da53a3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FIXED_PASSWORD = "123456";

// 🔑 Attach AFTER page loads
document.getElementById("loginBtn").addEventListener("click", async () => {
  console.log("Login clicked"); // DEBUG

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  errorBox.textContent = "";

  if (!email) {
    errorBox.textContent = "Enter any email";
    return;
  }

  if (password !== FIXED_PASSWORD) {
    errorBox.textContent = "Password must be 123456";
    return;
  }

  const guestEmail = `guest_${Date.now()}@demo.com`;

  try {
    await createUserWithEmailAndPassword(auth, guestEmail, FIXED_PASSWORD);
    console.log("User created, redirecting...");
    window.location.href = "index1.html"; // ✅ REDIRECT
  } catch (err) {
    console.error(err);
    errorBox.textContent = err.message;
  }
});
