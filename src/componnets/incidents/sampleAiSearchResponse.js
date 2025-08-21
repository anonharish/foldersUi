// Mock search response
export const sampleResponse = {
  top_results: [
    {
      fileName: "ProjectPlan.pdf",
      content:
        "This document contains the full project plan, milestones, and deadlines for the upcoming release scheduled in Q3.",
    },
    {
      fileName: "IncidentReport_July.docx",
      content:
        "Incident report regarding system downtime on July 10th, including root cause analysis and corrective actions.",
    },
    {
      fileName: "FinancialSummary.xlsx",
      content:
        "Q2 financial summary showing revenue growth, expenses, and forecast for the next quarter.",
    },
    {
      fileName: "MeetingNotes_August.txt",
      content:
        "Notes from the August strategy meeting covering new product features and market expansion strategy.",
    },
    {
      fileName: "UserGuide.pdf",
      content:
        "The official user guide with instructions, troubleshooting steps, and FAQs for new employees.",
    },
  ],
};

// Mock search history
export const sampleHistory = [
  {
    query: "project plan",
    results: sampleResponse,
    timestamp: new Date("2025-08-15T10:15:00").toISOString(),
  },
  {
    query: "incident july",
    results: sampleResponse,
    timestamp: new Date("2025-08-18T14:30:00").toISOString(),
  },
  {
    query: "financial report",
    results: sampleResponse,
    timestamp: new Date("2025-08-20T09:00:00").toISOString(),
  },
];
