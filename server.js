const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// A single hardcoded demo account. In a real system this would be a
// database lookup with a bcrypt-hashed password (see README for the
// hashing example referenced in Part 1 of this assignment).
const DEMO_USER = {
  email: "demo@example.com",
  password: "SuperSecret123", // demo only - never store plaintext in production
};

// Server-side validation MUST be independent of, and not rely on, the
// client-side checks in script.js. A request can reach this endpoint
// directly (curl, Postman, a modified/bypassed front end), so every
// rule enforced in the browser is re-enforced here.
function validateCredentials(email, password) {
  const errors = {};

  if (typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Email must contain '@'.";
  }

  if (typeof password !== "string" || !password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  console.log(`\n[LOGIN ATTEMPT] email="${email}" password="${password}"`);

  const errors = validateCredentials(email, password);
  if (Object.keys(errors).length > 0) {
    console.log("[SERVER-SIDE VALIDATION] REJECTED ->", errors);
    return res.status(400).json({
      message: "Validation failed: " + Object.values(errors).join(" "),
      errors,
    });
  }
  console.log("[SERVER-SIDE VALIDATION] passed format checks");

  // Credential check. Uses strict equality, not string concatenation into
  // a query, so there is no SQL injection surface here - see README/Part 1.
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    console.log("[AUTH] SUCCESS");
    return res.status(200).json({ message: "Login successful." });
  }

  console.log("[AUTH] FAILED - credentials did not match");
  return res.status(401).json({ message: "Invalid email or password." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
