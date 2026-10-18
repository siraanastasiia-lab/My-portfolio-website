# Website text: all copy for the portfolio

Source: "Portfolio cases_2.pdf" (case pages, About, domains, contacts) and the final dark-theme decisions (main page labels, buttons, contact block).
Typos from the PDF are fixed (apostrophes in "Client’s", "time‑consuming", "high‑fidelity", "complied", two grammar fixes marked in *italics*).
All site copy is in English. Use this text exactly.

---

## 1. Site-wide

**Header**
- Logo (not clickable): AS
- Menu links: Work · About · Contact
- Button: Download CV → assets/cv.pdf (opens in new tab)
- Mobile menu: ☰ opens, ✕ closes

**Footer**
© 2026 Anastasiia Sira · Kyiv, Ukraine

**Contact block** (same on main page and at the bottom of every case page)
- Section title: CONTACT
- Heading: Let's connect to discuss more ✦
- Email: sira.anastasiia@gmail.com (mailto:), with a "Copy" button. After click the button says "Copied".
- Telegram: @Nastia2323 → https://t.me/Nastia2323 (↗, hidden text for screen readers: "(opens in new tab)")
- LinkedIn: linkedin.com/in/anastasiiasira → https://www.linkedin.com/in/anastasiiasira (↗, hidden text: "(opens in new tab)")
- Button: Download CV
- Link: Back to top

---

## 2. Main page (index.html)

**Hero**
- Label: Senior UX/Product Designer · 5+ years experience
- Headline: I'm Anastasiia, a product designer who **simplifies complexity**. (the words "simplifies complexity" get the yellow marker)
- Sub-text: 5+ years designing complex digital products across SaaS, E-commerce, Marketplace, FinTech and GovTech. I improve user journeys and business metrics through research and hypothesis-driven design.
- Button: View cases ↓ (anchor to #work)

**Work** (section title: WORK). Three cards, each links to its case page.

| № | Title | Domain label | Year | Role | Cover | Link |
|---|---|---|---|---|---|---|
| 01 | Redesign for Public Services | GovTech · Full Redesign | 2025–2026 | Key Designer | assets/govtech-cover.jpg | case-govtech.html |
| 02 | Redesigning the Ticket Purchase Flow | E-commerce · Research | 2024 | UX Designer / Researcher | assets/tickets-cover.jpg | case-tickets.html |
| 03 | Improvements for Legal Practice Management App | SaaS | 2025 | UX/UI Designer | assets/legal-cover.jpg | case-legal.html |

Each card also has an arrow →.

**About** (section title: ABOUT ME)

Senior UX/Product Designer with 5+ years of experience designing complex digital products. I'm focused on improving user journeys and business metrics through research and hypothesis-driven design.

I work end-to-end, from problem discovery to validation and delivery. I specialize in simplifying complex workflows, building design systems and intuitive, accessible UX, and I advocate for a seamless design experience throughout the entire process.

Domains (chips, not clickable): SaaS · E-commerce · Marketplace · EdTech · FinTech · GovTech

---

## 3. Case page template (labels on every case page)

- Back link: ← Back
- Eyebrow under the title: ✦ + the domain label of the case
- Meta row labels: Period · My Role · Tags
- Section titles: PROJECT GOALS · MY ROLE · RESULT (Legal also has HEURISTIC REVIEW FINDINGS before RESULT)
- Bottom section: MORE CASES (2 cards, no numbers, the two other cases)
- Then the contact block and the footer

---

## 4. case-govtech.html

- **Title (H1):** Redesign for Public Services
- **Eyebrow:** ✦ GovTech · Full Redesign
- **Period:** 2025–2026
- **My Role:** Key Designer
- **Tags:** GovTech, Design Library, Style Guide, UI design, Prototyping, Stakeholder management, Cross-collaboration, Visual strategy, Accessibility

**PROJECT GOALS**

The platform enables users to explore public services, read articles and news, and access their accounts to complete government-related actions.

The project goal was redesigning the public web platform in line with brand guidelines within ServiceNow constraints, as well as creating sign-up flows and the after-login experience from scratch.

**MY ROLE**
- Led UX/UI design for a large-scale public services platform, covering both public and authenticated user experiences
- Designed end-to-end user flows within ServiceNow technical constraints
- Established and maintained a scalable Design System aligned with accessibility (WCAG 2.2 AA) standards
- Collaborated with cross-functional stakeholders to align product, business, and technical requirements
- Acted as a key driver of accessibility standards across the product
- Conducted Visual QA to ensure the design was implemented properly

**Images:** assets/govtech-1.jpg (laptop mockup), assets/govtech-2.jpg (screens grid)
Alt text 1: Public services platform shown on a laptop, home page with a list of services.
Alt text 2: Grid of redesigned screens from the public services platform.
Captions: not written yet.

**RESULT** (each item has a yellow ✦)
- Delivered a full redesign of the platform, improving usability, accessibility, and consistency across all user journeys
- A Design System that improved development efficiency and ensured UI consistency
- All design is compliant with WCAG 2.2 AA accessibility standards
- Simplified complex government workflows, improving clarity and user guidance

---

## 5. case-tickets.html

- **Title (H1):** Redesigning the Ticket Purchase Flow
- **Eyebrow:** ✦ E-commerce · Research
- **Period:** 2024
- **My Role:** UX Designer / Researcher
- **Tags:** E-commerce, Research, Improving conversion, UX Audit, Usability testing, Interviews, Prototyping, Research Report, Collaboration with Client’s product team

**PROJECT GOALS**

This project focused on improving the user experience of a worldwide transportation company’s e-commerce site, where users can buy tickets online for rides.

The main goals of this project *were* to enhance usability, increase user satisfaction, and boost conversion rates for the web e-commerce site through research-based changes.

**MY ROLE**
- UX: from discovery to validated design solutions, with a strong focus on conversion optimization
- Defined research strategy, participated in user interviews and usability testing, and translated insights into actionable product decisions
- Identified key friction points in the purchase flow and prioritized improvements based on impact vs effort
- Designed and validated new user purchase flow and interaction patterns, collaborating closely with product and engineering teams
- Facilitated stakeholder alignment by presenting research insights and design rationale

**Images:** assets/tickets-1.jpg (phones and laptop), assets/tickets-2.jpg (four phone screens)
Alt text 1: Ticket purchase flow shown on phones and a laptop.
Alt text 2: Four mobile screens of the redesigned ticket purchase flow.
Captions: not written yet.

**RESULT** (each item has a yellow ✦)
- Reduced friction in the ticket purchase flow by simplifying key steps and improving clarity of actions
- Increased conversion by addressing critical drop-off points identified during usability testing
- Improved mobile experience through a mobile-first redesign approach
- Delivered validated, development-ready design for purchase flow

---

## 6. case-legal.html

- **Title (H1):** Improvements for Legal Practice Management App
- **Eyebrow:** ✦ SaaS project (the PDF says "SaaS project"; the main page card says "SaaS". Pick one and keep it consistent.)
- **Period:** 2025
- **My Role:** UX/UI Designer
- **Tags:** SaaS, Improving retention, Heuristic evaluation, Prioritization, Prototyping, Collaboration with Client’s product team

**PROJECT GOALS**

This platform is created to automate many of the time‑consuming tasks that law firms traditionally handle manually, allowing them to save time, reduce errors, and improve overall efficiency.

The main goal was “Quick wins”, which means *helping* to increase retention by improving UX for key workflows, reducing steps and clicks with small dev effort.

**MY ROLE**
- I was working in a large design team (our designers + Client’s product team)
- Conducted heuristic evaluation and identified high-impact usability issues across key workflows
- Worked on UX improvements for a complex SaaS platform with focus on usability and retention
- Designed interaction patterns and prototypes to simplify complex tasks and reduce cognitive load
- Collaborated with stakeholders and Client’s product team to ensure business value and feasibility

**Images:** assets/legal-1.jpg (dashboard), assets/legal-2.jpg (heuristic review)
Alt text 1: Dashboard of the legal practice management app.
Alt text 2: Heuristic review of the legal practice management app with marked usability findings.
Captions: not written yet.

**HEURISTIC REVIEW FINDINGS**

To identify usability issues and guide design improvements, we conducted a Heuristic Review of the platform, covering core product flows. These findings were used to form a prioritized backlog for future design.

Each finding was assessed for impact on: Effectiveness (task completion), Efficiency (time/effort) and Satisfaction (overall experience). We used usability metrics to justify our suggestions.

Three small cards:
- Effectiveness: task completion
- Efficiency: time/effort
- Satisfaction: overall experience

**RESULT** (each item has a yellow ✦)
- Delivered end-to-end feature design and improvements within a 3.5-month engagement, from discovery to high-fidelity prototypes and successful handoff to development
- Improved usability of core workflows by reducing complexity and optimizing navigation patterns
- Increased efficiency for end users by minimizing steps and simplifying task completion
- Contributed to retention improvement by addressing key usability pain points

---

## 7. Still open (do not invent text for these)
- "12+ projects" claim on the main page
- A short summary at the top of each case page
- Image captions
- Final cover and case images (use grey placeholders until the files exist)
