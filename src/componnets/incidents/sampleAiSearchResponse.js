// Mock search response
export const sampleResponse = {
  top_results: [
    {
      id: "doc_1",
      fileName: "GovernmentGuaranteePolicy2022.pdf",
      content: "Government guarantee policy document outlining the framework and procedures for financial guarantees provided by government entities in 2022."
    },
    {
      id: "doc_2",
      fileName: "GuaranteePolicy2022.pdf",
      content: "Comprehensive policy document detailing guarantee procedures and risk assessment methodologies for government-backed financial instruments."
    },
    {
      id: "doc_3",
      fileName: "Policy2022.pdf",
      content: "General policy framework document covering various government initiatives and regulatory updates for the year 2022."
    },
    {
      id: "doc_4",
      fileName: "2022PolicyGovt.pdf",
      content: "Official government policy document outlining strategic directions and operational guidelines for various departments in 2022."
    },
    {
      id: "doc_5",
      fileName: "OldPolicyCircular2018.pdf",
      content: "Archived policy circular from 2018 containing previous guidelines and procedures that have been superseded by newer versions."
    },
    {
      id: "doc_6",
      fileName: "PolicyCircular2018.pdf",
      content: "Policy circular document from 2018 detailing administrative procedures and compliance requirements for government agencies."
    },
    {
      id: "doc_7",
      fileName: "Circular2018.pdf",
      content: "Official circular memorandum containing directives and operational updates issued in 2018 for government departments."
    },
    {
      id: "doc_8",
      fileName: "2018OldPolicy.pdf",
      content: "Legacy policy document from 2018 outlining previous regulatory frameworks and compliance standards."
    },
    {
      id: "doc_9",
      fileName: "GIGW_Guidelines.pdf",
      content: "Guidelines for Indian Government Websites (GIGW) document containing standards and best practices for government web portals."
    },
    {
      id: "doc_10",
      fileName: "Guidelines.pdf",
      content: "General guidelines document outlining standard operating procedures and compliance requirements for government initiatives."
    },
    {
      id: "doc_11",
      fileName: "Govt_guidelines.pdf",
      content: "Government guidelines document providing framework for implementation of various programs and services."
    },
    {
      id: "doc_12",
      fileName: "Website_guidelines.pdf",
      content: "Comprehensive guidelines for website development and maintenance, including accessibility standards and security protocols."
    },
    {
      id: "doc_13",
      fileName: "CyberSecurityFramework.docx",
      content: "Cybersecurity framework document outlining risk management strategies, security controls, and incident response procedures."
    },
    {
      id: "doc_14",
      fileName: "SecurityFramework.docx",
      content: "Security framework document detailing protective measures, monitoring protocols, and compliance requirements for IT systems."
    },
    {
      id: "doc_15",
      fileName: "Framework.docx",
      content: "Comprehensive framework document providing structural guidelines and implementation methodologies for various initiatives."
    },
  ]
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
