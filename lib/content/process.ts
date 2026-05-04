/**
 * Process page content. Extends the home page's `phases` shape with longer-form
 * description prose and marginalia annotations per phase.
 *
 * The descriptions are deliberately generic and truthful — they describe how
 * the studio works without quoting any client. Safe to ship.
 */

import { phases as homePhases } from "./home";

export type PhaseDetail = {
  number: string;
  name: string;
  blurb: string;
  description: string;
  marginalia: string[];
  /** Approximate week range for the timeline graphic. */
  weekRange: string;
};

export const phaseDetails: PhaseDetail[] = [
  {
    ...homePhases[0],
    description:
      "We start with a working call, not a kickoff deck. We listen for the shape of the business — what it sells, who buys, what conversion actually looks like. Then we walk the existing site (if there is one), audit the competition, and write a one-page scope document that names every page, every section, and every cut. Nothing leaves discovery without a real answer to the question: what is this site supposed to do?",
    marginalia: [
      "the scope doc is the contract",
      "we say no to ~half the projects we hear about",
      "kickoff deck = waste of an afternoon",
    ],
    weekRange: "Week 1",
  },
  {
    ...homePhases[1],
    description:
      "Design happens in the browser, not in Figma exports. We build a single hero in real code first — typography, color, spacing, motion — and iterate on it until it carries the page. Once the system is right, the rest of the pages compose quickly. We work in plain components, in the same file structure the developer will inherit. No throwaway mocks.",
    marginalia: [
      "design in the browser",
      "the hero sets the whole system",
      "ship the system, not a screenshot",
    ],
    weekRange: "Week 2",
  },
  {
    ...homePhases[2],
    description:
      "Production code from day one. We build on the same stack the site will live on (Next.js, Tailwind, Vercel) so what you see in review is what ships. We track Core Web Vitals from the first page, write semantic HTML, and bake in accessibility — keyboard, screen reader, color contrast — as we go. No retrofits.",
    marginalia: [
      "performance is a design decision",
      "accessibility from day one, not at the end",
      "we test on real phones, not just devtools",
    ],
    weekRange: "Week 3",
  },
  {
    ...homePhases[3],
    description:
      "Launch is a checklist, not a celebration. We migrate DNS, set up analytics, monitor the first 48 hours, and hand over a clean repository the client owns outright. No ongoing retainer, no vendor lock-in. We stay reachable for 30 days for fixes, then we&apos;re out of your way.",
    marginalia: [
      "ship date: ~14 days from sign-off",
      "you own the repo, the domain, the code",
      "we do not retain. you do not depend on us.",
    ],
    weekRange: "Week 4",
  },
];

export type ProcessContent = {
  phases: PhaseDetail[];
};

export const process: ProcessContent = {
  phases: phaseDetails,
};
