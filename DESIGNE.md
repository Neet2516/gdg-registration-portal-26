# GDG Registration Portal — Design and Implementation Plan

## 1. Purpose

Build a responsive event website and attendee registration flow based on the supplied Figma file:
[Registration portal in Figma](https://www.figma.com/design/6LFTtEgiKG4rzqqV58Fnlm/registration-portal?node-id=0-1&t=wJHkQXGsnBpmLxYA-1).

The design is branded **BYTE TALKS 2026** and includes an event landing page, a registration form, a confirmation/entry pass, and an error state. The repository currently has no application files or framework configuration, so this plan stays implementation-stack-neutral.

## 2. Product goals

- Explain the event and make registration the primary action.
- Present event logistics, speakers, past events, and FAQs in a scannable single-page experience.
- Make registration straightforward on desktop and mobile, with clear validation and consent.
- Give a successful registrant a useful confirmation and entry pass.
- Preserve the Figma's dark, retro-terminal visual style without sacrificing readability or accessibility.

## 3. Information architecture

### Public event page

1. **Header:** BYTE TALKS identity; About, FAQs, and Mentors navigation; Register CTA.
2. **Hero:** event title and tagline, event status/countdown, registration CTA, and prominent event artwork/poster.
3. **Event summary:** short description, event tags, eligibility/limited-seat callouts, date, time, venue, and registration/capacity indicators.
4. **About:** event description and a short “P.S.” eligibility / attendee note.
5. **Speakers and guests:** speaker, mentor, and guest profiles with portrait/artwork and short biographies.
6. **Voices from past speakers:** quote/testimonial cards.
7. **Previous events:** event cards with artwork and a details link.
8. **FAQs:** expandable question rows and a final Register CTA.
9. **Footer:** event identity, quick links, social links, and copyright.

### Registration

Fields shown in the design:

- Full name
- Email
- Phone number (10 digits)
- Student number
- Course and year
- Required consent to the code of conduct and event updates

The reference shows a field-level phone validation error and a completed-registration button. Keep invalid values visible, explain how to correct them, and prevent submission until required fields and consent are valid.

### Registration result

- **Success:** confirmation heading, attendee entry pass, registration ID, event date/time and venue, QR/check-in code, and actions to download the pass, add the event to a calendar, or share it.
- **Error:** clear failure message and a way to return to the form or retry. Do not show a success pass unless registration has been stored successfully.

## 4. Visual design direction

### Look and feel

- Dark charcoal page background with slightly lighter charcoal panels.
- Warm off-white text, borders, and rules; vermilion/coral primary actions and error accents; teal and green as secondary status accents.
- High-contrast, outlined cards and controls with small offset shadows that echo the layered poster artwork.
- Sparse decorative dots, event illustrations, and bold event graphics; keep decoration out of the way of form labels and actions.
- Uppercase, heavy display headings paired with compact monospaced labels and body copy.

### Type and layout

- Figma names **Archivo Black** and **Space Mono**. Use those families if available and licensed for the project; otherwise select close, legible fallbacks.
- Use a centered desktop content area (the main page design is approximately 1440px wide, with content around 1120px), clear horizontal rules between sections, and deliberate whitespace.
- On small screens, stack multi-column content and speaker/event cards, keep buttons comfortably tappable, and let form controls fill the available width.
- Treat the screenshots as visual references, not as implementation assets. Use the actual available Figma-exported artwork and icons for decorative elements.

### Design tokens to establish

Exact color values are not exposed as Figma variables in the supplied file. Confirm them in Figma before implementation and record them as shared tokens:

| Token | Intended use |
| --- | --- |
| `color.page` | Main dark page background |
| `color.surface` | Form, FAQ, and card surfaces |
| `color.text` | Primary warm off-white text |
| `color.text-muted` | Secondary labels and supporting copy |
| `color.border` | High-contrast outlines and section rules |
| `color.action` | Primary CTA and key highlights |
| `color.success` | Valid/confirmed status |
| `color.error` | Invalid fields and error state |
| `color.accent` | Secondary teal/green highlights |
| `font.display` | Heavy display headings |
| `font.mono` | Labels, body copy, and data |

Use a consistent spacing scale, border thickness, focus ring, and offset-shadow treatment rather than hardcoding one-off values per component.

## 5. Interaction and behavior

- Header links scroll to their matching sections; Register CTAs open the registration form.
- FAQ rows are keyboard-operable disclosures with their expanded state announced to assistive technology.
- Event status, remaining seats, and countdown values come from event data, not fixed decorative text.
- Validate required fields and formats on the client for immediate feedback and again on the server before creating a registration.
- Preserve entered values after validation or network errors.
- Disable duplicate submission while a registration request is in progress; provide visible progress and failure feedback.
- Only display the pass after a successful registration response. The download, calendar, and share actions must each have working behavior and sensible fallbacks.

## 6. Implementation plan

### Phase 0 — Confirm content and requirements

- Confirm the final event name, tagline, eligibility, date/time/time zone, venue, capacity, registration status, speaker biographies, and FAQ answers.
- Confirm whether registrations are individual or team-based, whether student number/email must be unique, and whether a confirmation email is required.
- Resolve apparent draft content before release: the file contains placeholder descriptions, duplicate FAQ copy, and event/date details that appear to describe more than one event. Confirm which event data belongs on this site.
- Decide framework, hosting, persistence, email provider, and who will maintain event content. Do not choose these from the visual design alone.

**Deliverable:** approved content and a short list of functional decisions.

### Phase 1 — Project foundation and design system

- Set up the chosen application framework, routing, formatting, and test commands.
- Add the confirmed fonts, Figma artwork, and shared color/typography/spacing tokens.
- Create reusable primitives for buttons, outlined cards, form fields, status badges, section headings, and navigation.
- Build the page shell and responsive layout breakpoints.

**Deliverable:** working page shell with tokens and reusable visual primitives.

### Phase 2 — Event landing page

- Implement the header, hero, event logistics, about, speakers/guests, testimonials, previous events, FAQs, and footer.
- Populate sections from structured event content instead of embedding placeholder copy in layout components.
- Wire section navigation, registration CTAs, FAQ disclosures, and event status displays.
- Compare desktop and mobile output against the Figma frames and adjust layout, typography, spacing, and artwork placement.

**Deliverable:** responsive, navigable event page.

### Phase 3 — Registration form

- Build the form with semantic labels, appropriate input types, required-state indication, and keyboard support.
- Implement the specified phone validation and field-level error presentation; validate consent and all other required fields.
- Provide clear loading, validation, and request-failure states while preserving entered data.
- Add automated tests for valid input, missing required values, malformed email/phone, consent, and submission failure.

**Deliverable:** accessible form that is ready to connect to registration storage.

### Phase 4 — Registration service and pass

- Add a server-side registration endpoint or equivalent application action and persistent registration storage.
- Enforce validation, eligibility, duplicate-registration policy, and capacity limits on the server. Capacity checks and registration creation must be atomic to avoid overbooking.
- Generate a stable registration ID and a non-guessable check-in token; avoid placing personal data directly in a QR code.
- Send a confirmation email only after a registration is successfully saved. Define retry/failed-email handling separately so a delivery failure does not create a false registration failure.
- Render the success pass from the saved registration and event data; implement pass download, calendar export, and share behavior.

**Deliverable:** end-to-end registration and confirmation flow.

### Phase 5 — Quality assurance and release

- Test the landing page, form, confirmation, and error states at mobile, tablet, and desktop widths.
- Check keyboard-only navigation, visible focus, labels, error announcements, contrast, reduced-motion behavior, and screen-reader semantics.
- Verify boundary cases: full capacity, closed registration, duplicate submit, server/network failure, and unavailable email delivery.
- Confirm no placeholder copy or sample attendee data remains; verify privacy/consent wording and retention expectations.
- Deploy to the chosen host and verify production form submission, email delivery, pass download, and calendar behavior.

**Deliverable:** release-ready portal and a documented operational check.

## 7. Suggested component boundaries

Keep implementation boundaries aligned with the page and user flow:

- `EventHeader` and `EventFooter`
- `EventHero` and `EventDetails`
- `SpeakerGrid`, `TestimonialList`, and `PreviousEvents`
- `FAQAccordion`
- `RegistrationForm` and reusable `FormField`
- `RegistrationStatus` for loading, success, and error feedback
- `EntryPass` for the confirmed registrant's ticket and follow-up actions

These are conceptual boundaries; adapt names and file layout to the framework selected in Phase 0.

## 8. Acceptance criteria

- The public page contains the agreed sections and matches the Figma's overall dark, high-contrast, retro-event visual direction.
- Desktop and mobile layouts have no horizontal overflow and keep primary actions easy to find.
- Every form control has a programmatic label, every validation error is associated with its field, and all interactions work without a mouse.
- Invalid or incomplete registrations cannot be created; server-side checks prevent duplicates and over-capacity registration according to the agreed policy.
- A confirmation pass appears only for a saved registration and contains the correct event/attendee details.
- Loading, closed/full, validation, success, and failure states are visible and understandable.
- Event text, dates, counts, and speaker information are approved real content rather than Figma placeholders or sample values.

## 9. Open decisions

1. Which event is the source of truth where the design shows conflicting event titles or dates?
2. Is eligibility restricted to particular academic years, and what are the allowed course/year options?
3. What is the capacity policy, and how should duplicate registrations be identified?
4. Should attendees receive email confirmation, and what exact personal information belongs on the downloadable pass?
5. Which framework, hosting platform, database, and email service should the implementation use?
