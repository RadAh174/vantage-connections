/**
 * Process page content. Extends the home page's `phases` shape with longer-form
 * description prose and marginalia annotations per phase.
 *
 * The descriptions are deliberately generic and truthful — they describe how
 * the studio works without quoting any client. Safe to ship.
 */

import { phases as homePhases } from "./home";

export type PhaseStep = {
  title: string;
  body: string;
};

export type PhaseDetail = {
  number: string;
  name: string;
  blurb: string;
  /** Three-or-so structured sub-steps. Each renders as a numbered list
   *  item with a display-weight title + muted supporting body, rather
   *  than a flat paragraph. Gives the card real editorial hierarchy. */
  steps: PhaseStep[];
  marginalia: string[];
  /** Approximate week range for the timeline graphic. */
  weekRange: string;
};

export const phaseDetails: PhaseDetail[] = [
  {
    ...homePhases[0],
    steps: [
      { title: "30-min call.", body: "No kickoff deck." },
      { title: "Audit pass.", body: "Existing site + competition." },
      { title: "One-page scope.", body: "Every cut named upfront." },
    ],
    marginalia: [
      "the scope doc is the contract",
      "we say no to half the projects we hear",
    ],
    weekRange: "Week 1",
  },
  {
    ...homePhases[1],
    steps: [
      { title: "In the browser.", body: "Not Figma." },
      { title: "Hero first.", body: "Type, color, motion — in real code." },
      { title: "System carries.", body: "The rest of the pages compose fast." },
    ],
    marginalia: [
      "design in the browser",
      "the hero sets the whole system",
    ],
    weekRange: "Week 2",
  },
  {
    ...homePhases[2],
    steps: [
      { title: "Production stack.", body: "Same one the site will live on." },
      { title: "Performance + SEO.", body: "Baked in, not bolted on." },
      { title: "Real-device tested.", body: "Phones, not just devtools." },
    ],
    marginalia: [
      "performance is a design decision",
      "a11y from day one",
    ],
    weekRange: "Week 3",
  },
  {
    ...homePhases[3],
    steps: [
      { title: "Wired up.", body: "DNS, analytics, monitoring — handled." },
      { title: "Repo handover.", body: "You own everything." },
      { title: "30 days of fixes.", body: "Then out of your way." },
    ],
    marginalia: [
      "ship: ~14 days from sign-off",
      "you own the repo, the domain, the code",
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
