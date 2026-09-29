const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const serverMessage = document.getElementById("serverMessage");

// Client-side validation function required by the assignment:
// - email must be non-empty and contain "@"
// - password must be non-empty and at least 8 characters
function validateCredentials(email, password) {
  const errors = { email: "", password: "" };

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Email must contain '@'.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

function showErrors(errors) {
  emailError.textContent = errors.email;
  passwordError.textContent = errors.password;
  emailInput.classList.toggle("invalid", Boolean(errors.email));
  passwordInput.classList.toggle("invalid", Boolean(errors.password));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  serverMessage.textContent = "";
  serverMessage.className = "server-message";

  const email = emailInput.value;
  const password = passwordInput.value;

  const errors = validateCredentials(email, password);
  showErrors(errors);

  // Stop here if client-side validation fails - never submits empty/invalid fields
  if (errors.email || errors.password) {
    return;
  }

  // Client-side checks passed - now send to the server, which re-validates
  // independently. Client-side validation is a UX convenience only; it is
  // never trusted as the sole line of defense, since it can be bypassed
  // entirely by calling the API directly (e.g. via curl or dev tools).
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      serverMessage.textContent = data.message;
      serverMessage.classList.add("success");
    } else {
      serverMessage.textContent = data.message;
      serverMessage.classList.add("error");
    }
  } catch (err) {
    serverMessage.textContent = "Could not reach the server.";
    serverMessage.classList.add("error");
  }
});
