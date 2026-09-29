# Secure Login Form (HW2-B, Part 2)

A small login form inspired by the [OWASP Juice Shop](https://owasp-juice.shop) login page, built to
demonstrate both **client-side** and **server-side** input validation as part of a web security
coursework assignment.

Reference SECURITY.md for specific security features.

## What this project does

- Renders an email + password login form styled after Juice Shop's login page.
- **Client-side validation** (`public/script.js`) blocks submission of empty fields, requires the
  email to contain `@`, and requires the password to be at least 8 characters — giving the user
  immediate feedback before anything is sent over the network.
- **Server-side validation** (`server.js`) independently re-checks the exact same rules. This is the
  layer that actually matters for security: client-side validation is only a UX convenience and can
  be bypassed entirely (disabled JS, a direct `curl`/Postman request, browser dev tools), so the
  server never trusts it.
- A single hardcoded demo account (`demo@example.com` / `SuperSecret123`) is used to demonstrate a
  successful vs. failed login. Credentials are compared with strict equality — not concatenated into
  a query string — so there is no SQL injection surface in this demo backend.

## Project structure

```
juice-login-form/
├── public/
│   ├── index.html     # login form markup
│   ├── style.css       # Juice Shop-inspired dark theme styling
│   └── script.js        # client-side validation + fetch() to /login
├── server.js            # Express server, serves the form + /login endpoint
├── package.json
└── README.md
```

## How to run it

Requires [Node.js](https://nodejs.org) (v18+ recommended).

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/juice-shop-secure-login-form.git
cd juice-shop-secure-login-form

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Then open **http://localhost:3001** in your browser.

Try:
- Submitting with an empty field → client-side error shown, nothing sent to the server.
- An email with no `@`, or a password under 8 characters → client-side error shown.
- `demo@example.com` / `SuperSecret123` → "Login successful."
- Any other valid-looking but wrong credentials → "Invalid email or password." (server-side check).

## Why both layers of validation?

Client-side validation improves user experience (instant feedback, no wasted round trip) but
provides **no real security**, since it runs entirely in code the user controls. Server-side
validation is the actual security boundary, because it cannot be bypassed by disabling JavaScript
or sending requests directly to the API. This project intentionally implements both, with the
server-side checks fully independent of (not reused from) the client-side code.

## Related coursework

This project is Part 2 of a 3-part assignment analyzing OWASP Juice Shop's security. Part 1 covers
vulnerabilities identified in Juice Shop itself (SQL injection, XSS, weak credentials) and their
mitigations; Part 3 documents an attempted SQL injection / XSS attack against this form.

