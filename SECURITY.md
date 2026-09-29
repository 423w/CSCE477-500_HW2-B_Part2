# Security Measures Implemented While Designing the Form

This document summarizes the security-relevant design decisions made in this login form
(HW2-B, Part 2), for grading reference alongside the assignment write-up.

- **Dual-layer validation, with the server as the authoritative layer.** The form validates
  email/password format on the client (`public/script.js`) for instant UX feedback, but this layer
  is documented as a convenience only — it runs in code the user fully controls and can be bypassed
  (disabled JS, dev tools, a direct API call). `server.js` implements its own independent
  `validateCredentials` function, not shared or imported from the client, which re-enforces the same
  rules before any credential comparison and returns HTTP 400 with per-field errors on failure.

- **Injection-safe credential comparison.** The demo credential check uses strict JavaScript
  equality (`===`) against a hardcoded account, never string concatenation into a query. This closes
  off the SQL injection vector documented in Part 1 of this assignment against OWASP Juice Shop.

- **No unsanitized reflection of user input into the DOM.** The front end never uses `innerHTML` or
  otherwise renders submitted input back into the page, closing off the reflected/DOM-XSS vector
  also documented in Part 1 (Juice Shop's search bar).

- **Plaintext password comparison is demo-only.** The single hardcoded demo account is compared in
  plaintext solely because it's one fixed credential for coursework purposes. A production version
  would hash and store the password with bcrypt at registration (e.g. `bcrypt.hash(password, 12)`)
  and verify it at login with `bcrypt.compare()`, never storing or comparing plaintext.
