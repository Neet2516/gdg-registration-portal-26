Initialize a new high-fidelity production-ready single-page React component utilizing the configuration parameters found within the local workspace directory.

Context Files Available in the local directory:
1. `./implementation.md` (Contains the updated visual theme, design hierarchy, and 2-phase recruitment layout)

Core Custom User Flow State Machine to Implement (State Driven Frontend):
Manage three view states locally using a simple state controller [State 1: CAPTCHA_GATE] -> [State 2: REGISTRATION_FORM] -> [State 3: OTP_VERIFICATION] -> [State 4: SUCCESS_SCREEN]

State 1: CAPTCHA_GATE (Initial View)
- A minimalist terminal container requesting verification.
- Implement a simple frontend mock math/text captcha (e.g., dynamic random sum text field: "Prove you are human: 7 + 4 = ?").
- Input validation to check match. On success, trigger sharp crisp transition to State 2.

State 2: REGISTRATION_FORM
- Implement the form parameters cleanly utilizing `react-hook-form` paired with `@hookform/resolvers/zod`.
- Data Fields to validate via Zod schema rules:
  1. Name: Required string, min 2, max 50 characters, trimmed.
  2. Student Number: Validated strictly via Regex for 7 to 8 digits (`/^[0-9]{7,8}$/`).
  3. Phone Number: Validated via Regex for 10-digit Indian mobile sequences (`/^[6-9]\d{9}$/`).
  4. University Email ID: Read-only field. Dynamic listener parses Student Number input and auto-populates format: `[studentNumber]@akgec.ac.in` in real-time.
  5. GitHub Username/ID: Required string, trimmed.
  6. HackerRank Username/ID: Required string, trimmed.
  7. Branch Dropdown: Select field with options: CSE, CS, CSE-DS, CSE-AIML, AIML, IT, ECE, EN, ME, CE.
  8. Residency Status: Radio toggles for 'hosteller' or 'dayscholar'.
- On click of "INITIALIZE RECRUITMENT APPLICATION", trigger dynamic visual transitional feedback: "TRANSMITTING DATA...", mock a brief backend trigger delay via a timeout, then push state window cleanly into State 3.

State 3: OTP_VERIFICATION
- Render an alert terminal card block reading: "SECURE IDENTITY VERIFICATION KEY SENT TO: [studentNumber]@akgec.ac.in"
- Render a 4 or 6-digit text block digit mask verification input field.
- Mock the entry validation check (e.g., accept an arbitrary hardcoded mock code like "1234" or any 4 digit matching configuration for debugging frontend compilation loops).
- CTA Action Button: "CONFIRM CODE ENTRY & VERIFY". On trigger validation pass, switch view state into State 4.

State 4: SUCCESS_SCREEN
- A clean retro-brutalist victory card splash screen.
- Header text using Space Mono: "REGISTRATION SECURED // APPLICATION STATE: ACTIVE"
- Sub-text layout displaying a brief cosmic sign-off: "Welcome to the crucible. Keep monitoring your institutional mail inbox for Phase 01 MCQ entry coordinates."

Design Language Alignment (Extracted from implementation.md):
- Enforce solid pitch black background (#000000) for the main wrapper. Cards/Surfaces use (#0D0E12). Muted details use zinc (#71717A). Active copy/borders use stark white (#FFFFFF). Error elements text color (#EF4444).
- Font pairings: Monospace font (Space Mono) with wide-tracking and uppercase transformations for headers/labels. Sans-serif font (Inter) for standard contextual input values. No rounded curves on layout blocks or buttons—preserve sharp brutalist edges.

Generate the clean, end-to-end fully structured frontend file directly. Save the final workspace code component inside a single output file named `ProximityRegistrationForm.tsx`. Do not include comments indicating placeholders or truncated blocks.