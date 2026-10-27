# 🌌 PROXIMITY 6.0 | GDG AKGEC Recruitment Portal

An interactive, high-fidelity, retro-brutalist cosmic recruitment portal built for **Google Developer Groups (GDG) AKGEC**. This application acts as the gateway for students to register for the multi-tiered recruitment process, evaluating analytical, coding, and technical capabilities.

---

## 🎨 Visual Identity & Typographic Layout

The portal is designed with a stark, terminal-like **retro-brutalist cosmic aesthetic**. It utilizes sharp container boxes, custom glow animations, pixelated noise, and CRT overlays to replicate a futuristic sandbox environment.

### 1. Typography & Hierarchy
* **UI Actions & Headings Hierarchy:** 
  * Font: `'Space Mono', monospace;`
  * Styling: Uppercase transformations (`uppercase`), wide tracking (`tracking-widest` / `tracking-wider`), and stark font weights.
* **Form Inputs & Descriptive Content:** 
  * Font: `'Inter', sans-serif;`
  * Styling: Clean rendering for validation instructions, system errors, and input labels.

### 2. Micro-Interactions & Special Effects
* **CRT Screen & Scanlines:** Vintage screen overlay styling with retro scanline patterns and edge curvature.
* **Dither/Halftone Grid:** A pixel-grain noise texture pattern overlaying dark surfaces to preserve a raw terminal feel.
* **Spiderweb Glows:** Dynamic custom-colored spiderwebs glowing on viewport margins (Red and Blue glowing animations).
* **Transitions:** Rapid micro-feedback on active items: `transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1)`.

---

## 🏗️ Core Application Sections

### 1. Hero Portal Terminal
* **Core Tagline:** `"FROM PIXELS TO PROGRAMS. BUILD WHAT MATTERS."`
* **Context:** An introductory welcome to Proximity 6.0 detailing the entry point to Google Developer Groups AKGEC.

### 2. Recruitment Evaluation Path
* **Phase 01 | Cognitive & Tech Screening (MCQ):** Evaluating Web Core (HTML5/CSS3), Logic (JavaScript), Data Layers (SQL & Databases), and Logical Reasoning.
* **Phase 02 | Algorithmic Crucible (Coding):** A competitive programming sandboxed stage featuring algorithmic challenges (DSA) and optimization metrics.

### 3. State-Driven Registration Terminal
The registration flow runs on a localized sequential state machine to secure user identity and credentials.

```
[State 1: CAPTCHA_GATE] ➔ [State 2: REGISTRATION_FORM] ➔ [State 3: OTP_VERIFICATION] ➔ [State 4: SUCCESS_SCREEN]
```

* **State 1: Captcha Gate:** 
  * Simple math captcha logic (`x + y = ?`) to check for human interaction before revealing the recruitment gates.
* **State 2: Registration Terminal:** 
  * Structured form validated strictly using `react-hook-form` and `zod`.
  * **Dynamic Email Resolution:** Real-time generation of student email address: `[studentNumber]@akgec.ac.in` from the input.
* **State 3: OTP Authentication:** 
  * An alert module simulating secure identity verification keys dispatched to the user's institutional email address.
* **State 4: Success Splash Screen:**
  * High-fidelity retro confirmation screen signaling that the recruitment registration has been successfully logged.

---

## 🛠️ Technology Stack & Architecture

### Frontend Layer
* **Framework:** React 19 & TypeScript
* **Build System:** Vite 8
* **Styling:** Tailwind CSS v4 & custom CRT scanline utilities
* **Animation Profiles:**
  * **Framer Motion:** Smooth state transitions, loader fades, and modal entries.
  * **GSAP & ScrollTrigger:** Integrated timeline scrolls for visual layouts.
  * **Lenis:** Smooth inertia-scrolling for high-end scrolling experiences.

### API Gateway Proxy
* **Catch-All Edge Router:** Located at `api/v1/[...path].js` (configured for Vercel Serverless deployments).
* **Purpose:** Proxies registration payloads, OTP dispatch, and key validations securely to a remote upstream backend server using the `BACKEND_URL` environment configuration, bypassing CORS and protecting client communications.

---

## 📂 Project Directory Structure

```text
GDG-registration-portal/
├── api/
│   └── v1/
│       └── [...path].js           # Vercel catch-all serverless API proxy
├── src/
│   ├── assets/
│   │   ├── fonts/                 # Custom thematic fonts
│   │   └── images/                # Retro-brutalist graphic resources
│   ├── components/
│   │   ├── sections/              # Main layout sections (Hero, Domains, FAQ, etc.)
│   │   │   ├── Domains.tsx
│   │   │   ├── EvaluationPath.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── RegistrationGateway.tsx
│   │   │   └── SpiderMemories.tsx
│   │   ├── ProximityRegistrationForm.tsx  # Multi-stage form controller
│   │   ├── Button.tsx             # Custom retro UI Button
│   │   ├── CaptchaGate.tsx        # Captcha view component
│   │   ├── OtpVerification.tsx    # OTP code verification component
│   │   ├── RegistrationForm.tsx   # React-Hook-Form fields with Zod validation
│   │   └── SuccessScreen.tsx      # Success layout
│   ├── pages/
│   │   └── RecruitmentPortal.tsx  # Main Scrolling Portal page
│   ├── index.css                  # Main theme design configurations
│   ├── main.tsx                   # App Entry point
│   └── App.tsx                    # Main Page Router
├── vercel.json                    # Routing and deployment configurations
├── vite.config.ts                 # Build config matching React-TS configurations
└── package.json                   # Script and package dependencies
```

---

## ⚙️ Local Setup & Configuration

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Neet2516/GDG-registration-portal.git
   cd GDG-registration-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Execution
* Run local development server:
  ```bash
  npm run dev
  ```
* Lint source files:
  ```bash
  npm run lint
  ```
* Build for production:
  ```bash
  npm run build
  ```
* Preview production build locally:
  ```bash
  npm run preview
  ```

---

## 🌐 Environment Variables

Copy `.env.example` to `.env` for local development and set `BACKEND_URL` to the backend origin (the proxy forwards `/api/v1/send-otp`, `/api/v1/verify-otp`, and `/api/v1/register`). The Vite dev proxy and Vercel gateway both preserve the backend's `/api/v1` route prefix. For Vercel deployment, set `BACKEND_URL` in the project's Environment Variables:

```env
BACKEND_URL=https://proximety-7nt5.vercel.app
# Optional: reCAPTCHA v3 site key used when requesting a verification code
VITE_RECAPTCHA_SITE_KEY=
```

The registration form derives the college email from the first name and student number, sends an email OTP, and submits the registration only after successful OTP verification.

---

## 🚀 Deployment

The project is structured with a custom `vercel.json` gateway rule:

```json
{
  "rewrites": [
    { "source": "/api/v1/:path*", "destination": "/api/v1/[...path]" }
  ]
}
```

Deploy the application instantly on Vercel by ensuring `BACKEND_URL` is set in your Vercel Environment Variables dashboard.
