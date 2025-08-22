export const initialFolders = {
    folders: [
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
                    children: [
                        {
                            id: "1-1-1",
                            name: "2024",
                            files: [
                                {
                                    id: "file8",
                                    name: "Invoice-Feb.pdf",
                                    size: 850,
                                    type: "application/pdf",
                                    uploadedAt: new Date().toISOString(),
                                    url: "#",
                                    typeofFile: "invoicepdf",
                                },
                            ],
                            children: [
                                {
                                    id: "1-1-1-1",
                                    name: "March",
                                    files: [
                                        {
                                            id: "file9",
                                            name: "Invoice-Mar.pdf",
                                            size: 900,
                                            type: "application/pdf",
                                            uploadedAt: new Date().toISOString(),
                                            url: "#",
                                            typeofFile: "invoicepdf",
                                        },
                                    ],
                                    children: [
                                        {
                                            id: "1-1-1-1-1",
                                            name: "April",
                                            // files: [
                                            //     {
                                            //     id: "file10",
                                            //     name: "Invoice-Apr.pdf",
                                            //     size: 950,
                                            //     type: "application/pdf",
                                            //     uploadedAt: new Date().toISOString(),
                                            //     url: "#",
                                            //     typeofFile: "invoicepdf",
                                            //     },
                                            // ],
                                            children: [
                                                {
                                                    id: "1-1-1-1-1-1",
                                                    name: "Week 1",
                                                    files: [
                                                        {
                                                            id: "file11",
                                                            name: "Invoice-Apr-Week1.pdf",
                                                            size: 300,
                                                            type: "application/pdf",
                                                            uploadedAt: new Date().toISOString(),
                                                            url: "#",
                                                            typeofFile: "invoicepdf",
                                                        },
                                                    ],
                                                    children: [
                                                        {
                                                            id: "1-1-1-1-1-1-1",
                                                            name: "Day 1",
                                                            files: [
                                                                {
                                                                    id: "file13",
                                                                    name: "Invoice-Apr-Week1-Day1.pdf",
                                                                    size: 150,
                                                                    type: "application/pdf",
                                                                    uploadedAt: new Date().toISOString(),
                                                                    url: "#",
                                                                    typeofFile: "invoicepdf",
                                                                },
                                                            ],
                                                            children: [],
                                                            parentId: "1-1-1-1-1-1",
                                                            isExpanded: true,
                                                        }
                                                    ],
                                                    parentId: "1-1-1-1-1",
                                                    isExpanded: true,
                                                },
                                                {
                                                    id: "1-1-1-1-1-2",
                                                    name: "Week 2",
                                                    files: [
                                                        {
                                                            id: "file12",
                                                            name: "Invoice-Apr-Week2.pdf",
                                                            size: 320,
                                                            type: "application/pdf",
                                                            uploadedAt: new Date().toISOString(),
                                                            url: "#",
                                                            typeofFile: "invoicepdf",
                                                        },
                                                    ],
                                                    children: [],
                                                    parentId: "1-1-1-1-1",
                                                    isExpanded: true,
                                                },
                                            ],
                                            parentId: "1-1-1-1",
                                            isExpanded: true,
                                        }
                                    ],
                                    parentId: "1-1-1",
                                    isExpanded: true,
                                },
                            ],
                            parentId: "1-1",
                            isExpanded: true,
                        },
                    ],
                     isExpanded: true,
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
    ],

    files: [
        {
            id: "file100",
            name: "SystemArchitecture.pdf",
            size: 2048,
            type: "application/pdf",
            uploadedAt: new Date().toISOString(),
            url: "#",
            typeofFile: "pdf",
        },
        {
            id: "file101",
            name: "Readme.txt",
            size: 300,
            type: "text/plain",
            uploadedAt: new Date().toISOString(),
            url: "#",
            typeofFile: "txt",
        },
    ],
};