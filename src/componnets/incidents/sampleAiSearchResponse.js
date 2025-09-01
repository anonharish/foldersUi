// Mock search response
export const sampleResponse = 
{
    "summary": "The Indian Government, with the goal of strengthening e-Governance and improving citizen services",
    "sources": [
        {
            "fileName": "Guidelines_for_Government_websites.pdf",
            "content": "& Pension,\nGovernment of India.\n Minister Of State \nPrime MINISTER’S OFFICE AND\nMInistry of Personnel, \nPublic Grievances and Pensions\nGovernment of India\nMessage\nIt is indeed a pleasure to learn that the Department of Administrative \nReforms and Public Grievances, in association with the National Informatics \nCentre (NIC), has formulated Guidelines for Indian Government Websites.\nWith the advent of e-Governance and focus on web enablement \nof citizen services, there has been an urgent need for such guidelines. I am \nconfident that these guidelines will bring uniformity in the quality of content \nas well as enhance the overall usability and functionality of Indian Government \nWebsites. These guidelines would also assist the Government of India to improve \nthe standard of information and service delivery through the electronic media \nand demonstrate its commitment to enhance government citizen interaction \nthrough application of internet technologies. \nThe inclusion of these “Guidelines for Indian Government Websites” \nin the",
            "score": 0.77506894
        },
              {
            "fileName": "letter_of_do.pdf",
            "content": "cent Labour (Prohibition & Regulation) Act, 1986, which came into force \nw.e.f. 01.09.2016, to curb the menace of child labour in a more effective way and \nto achieve the related Sustainable Development Goal. \n2. \nIn this connection, I would like to inform you that India has recently ratified \nthe two core Conventions of International Labour Organisation (ILO) namely the \nMinimum Age Convention, 1973 (No.138) and Worst Forms of Child Labour \nConvention, 1999 (No.182) to reaffirm its commitment for eradication of child \nlabour in the country. \n3. \nConsequent upon amendment in the Act, the Ministry has notified the Child \nLabour (Prohibition & Regulation) Amendment Rules, 2017 (Central Rules) on \n02.06.2017 in accordance with the provisions of the Act and copy of the same is \navailable on website of the Ministry",
            "score": 0.82821846
        }
    ],
    "suggestions": [
        "What are the guidelines for Indian Government Websites aimed at improving?",
        "How do the guidelines enhance government-citizen interaction?",
        "In what way do the guidelines contribute to e-Governance?"
    ]
}


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
