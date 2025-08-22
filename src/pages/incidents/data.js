export const initialFolders = [
        {
            id: "1",
            name: "Documents",
            files: [
                {
                    id: "file1",
                    name: "ProjectProposal.pdf",
                    size: 1024,
                    type: "application/msword",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "pdf",
                },
            ],
            children: [
                {
                    id: "1-1",
                    name: "Invoices",
                    isExpanded:true,
                    files: [
                        {
                            id: "file7",
                            name: "Invoice-Jan.pdf",
                            size: 800,
                            type: "application/pdf",
                            uploadedAt: new Date().toISOString(),
                            url: "#",
                            typeofFile: "invoicepdf",
                        },
                    ],
                    children: [],
                    parentId: "1",
                },
            ],
            parentId: null,
            isExpanded: true,
        },
        {
            id: "2",
            name: "Reports",
            files: [
                {
                    id: "file4",
                    name: "AnnualReport2024.pdf",
                    size: 1024,
                    type: "application/pdf",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "pdf",
                },
            ],
            parentId: null,
            isExpanded: true,
        },
    ];