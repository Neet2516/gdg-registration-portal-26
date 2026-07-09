# PROXIMITY 6.0 | FRONTEND INTERACTIVE DESIGN LOG & CONTENT MAP

---

## 🎨 Visual Identity & Typographic Layout

The portal must strictly adhere to a retro-brutalist cosmic aesthetic. Use sharp containment boxes and avoid soft rounding borders to match a terminal-style asset presentation.

### 1. Font Pairing & Hierarchy Rules
* **Header / UI Actions Hierarchy:** `font-family: 'Space Mono', monospace;`
  * Headings must use uppercase transformations (`uppercase`) with a wide letter spacing tracking system (`tracking-widest` / `tracking-wider`).
* **Content / Form Data Input Copy:** `font-family: 'Inter', sans-serif;`
  * Keeps validation messages, system instructions, and user input labels highly readable.

### 2. Micro-Interactions & Asset Generation
* **Dither/Halftone Effect:** Central image containers or background floating SVGs (like the orbital tracks and the hourglass elements from the event design) should be rendered with a stark monochrome contrast mask to replicate a pixelated grain texture.
* **Component Motion Profiles:** Buttons, select menus, and layout blocks must transition immediately on hover or active click states using a fast, crisp curve: `transition: all 150ms cubic-bezier(0.19, 1, 0.22, 1)`.

---

## 🏗️ Core Section Layout Matrix
*Build the landing page layout tracking down sequentially in a single scrolling layout container (`<main className="w-full bg-black min-h-screen">`).*

### Section 01: Hero Portal Terminal
* **Left Sub-Header Tag:** Monospace vector copy: `"FROM PIXELS TO PROGRAMS. BUILD WHAT MATTERS."`
* **Primary Title Display:** * Text block: `PROXIMITY 6.0` 
  * Subtitle text: `GDG AKGEC RECRUITMENT PORTAL`
* **Introductory Context Block:**
  > Turn ideas into impactful experiences through design and engineering. Join a community of creators, innovators, and problem-solvers shaping the future—one interface, one algorithm, and one product at a time.
  >
  > Proximity 6.0 is your gateway into Google Developer Groups AKGEC. This portal serves as your official entry point to register for the multi-tiered recruitment crucible designed to evaluate your fundamental tech metrics, structural instincts, and algorithmic problem-solving capabilities.

---

### Section 02: Recruitment Evaluation Path
*A clear visual map detailing how the two recruitment phases are structured for applicants.*

#### **📊 PHASE 01 | COGNITIVE & TECH SCREENING (MCQ)**
* **Focus Vectors:** Technical foundations and baseline analytical capability.
* **Syllabus Matrix:** * Web Core: `HTML5` & `CSS3` (Semantic layout architectures)
  * Logic Engine: `JavaScript` (Execution environments, core patterns)
  * Data Layers: `SQL & Databases` (Relational schemas, query structures)
  * Core Assessment: `Logical Reasoning` (Problem analysis under constraints)

#### **⚔️ PHASE 02 | ALGORITHMIC CRUCIBLE (CODING)**
* **Focus Vectors:** Computational problem solving and code optimization.
* **Execution Metric:** Sandboxed competitive programming stage featuring standard multi-level `Data Structures & Algorithms (DSA)` problems.

---

### Section 03: Direct Registration Terminal (The Form)
*Positioned centrally within a single-page layout structure (`bg-[#0D0E12] border border-[#71717A]`). No wild-card files or task logic required.*

```text
+-----------------------------------------------------------------------+
|  [GDG AKGEC RECRUITMENT REPO GATES: PROXIMITY 6.0]                    |
+-----------------------------------------------------------------------+
|                                                                       |
|  * APPLICANT NAME                                                     |
|    [ Input Field: e.g. Rahul Sharma ]                                 |
|                                                                       |
|  * STUDENT NUMBER                      * CONTACT NUMBER               |
|    [ Input Field: e.g. 2310003 ]        [ Input Field: 10 Digits ]     |
|                                                                       |
|  * UNIVERSITY MAIL ID                                                 |
|    [ Read-only Field: auto-populates as {student_number}@akgec.ac.in] |
|                                                                       |
|  * GITHUB USERNAME / ID                * HACKERRANK USERNAME / ID     |
|    [ Input Field: e.g. dev_username ]   [ Input Field: e.g. hr_profile|
|                                                                       |
|  * SELECTION BRANCH                    * RESIDENCY ALLOCATION         |
|    [ Dropdown Selection ]               ( ) Day Scholar   ( ) Hosteller|
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |                INITIALIZE RECRUITMENT GATEWAY                   |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+