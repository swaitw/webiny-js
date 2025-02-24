import { IResolveDataSourceGateway } from "./IResolveDataSourceGateway";
import { GenericRecord } from "@webiny/app/types";
import {
    DataRequest,
    DataSourceData
} from "~/features/dataSource/loadDataSource/IResolveDataSourceRepository";

// const lexicalParagraph = (value: string) => {
//     return {
//         root: {
//             children: [
//                 {
//                     children: [
//                         {
//                             detail: 0,
//                             format: 0,
//                             mode: "normal",
//                             style: "",
//                             text: value,
//                             type: "text",
//                             version: 1
//                         }
//                     ],
//                     direction: null,
//                     format: "",
//                     indent: 0,
//                     styles: [],
//                     type: "paragraph-element",
//                     version: 1
//                 }
//             ],
//             direction: null,
//             format: "",
//             indent: 0,
//             type: "root",
//             version: 1
//         }
//     };
// };

const lexicalHeading = (value: string) => {
    return {
        root: {
            children: [
                {
                    children: [
                        {
                            detail: 0,
                            format: 0,
                            mode: "normal",
                            style: "",
                            text: value,
                            type: "text",
                            version: 1
                        }
                    ],
                    direction: "ltr",
                    format: "",
                    indent: 0,
                    type: "heading-element",
                    version: 1,
                    tag: "h1",
                    styles: [{ styleId: "heading1", type: "typography" }]
                }
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "root",
            version: 1
        }
    };
};

const mocks: GenericRecord<string> = {
    "cms.entry": {
        "1": {
            title: lexicalHeading("Mocked title"),
            content: "Some random mocked content.",
            cta: {
                label: "Mocked label",
                link: "https://mock-website.com"
            },
            testimonials: [
                {
                    name: "John Smith",
                    text: "Amazing quality and quick delivery!"
                },
                {
                    name: "Emily Johnson",
                    text: "Excellent service, highly recommend!"
                },
                {
                    name: "Michael Brown",
                    text: "The product exceeded my expectations, thank you!"
                },
                {
                    name: "Sophia Davis",
                    text: "Fast shipping and great customer support!"
                },
                {
                    name: "Liam Wilson",
                    text: "Wide variety and top-notch quality!"
                },
                {
                    name: "Isabella Martinez",
                    text: "Easy to order, and it arrived sooner than expected."
                },
                {
                    name: "James Anderson",
                    text: "Impressive service, will shop again!"
                },
                {
                    name: "Olivia Thomas",
                    text: "The selection was perfect for my needs!"
                },
                {
                    name: "Benjamin Garcia",
                    text: "Fantastic experience, highly satisfied!"
                },
                {
                    name: "Mia Robinson",
                    text: "Great products and seamless process!"
                }
            ]
        },
        "2": {
            title: lexicalHeading("Another title"),
            content: "More mocked content.",
            cta: {
                label: "Another label",
                link: "https://mock-website2.com"
            },
            testimonials: [
                {
                    name: "Charlotte Lee",
                    text: "Superb quality and fast turnaround time!"
                },
                {
                    name: "Ethan Harris",
                    text: "Very pleased with my purchase, will order again."
                },
                {
                    name: "Amelia Clark",
                    text: "Outstanding service and easy ordering process."
                },
                {
                    name: "William Walker",
                    text: "Affordable prices and excellent delivery speed!"
                },
                {
                    name: "Harper Young",
                    text: "Smooth transaction and amazing products!"
                },
                {
                    name: "Lucas Hall",
                    text: "Everything arrived perfectly, thank you!"
                },
                {
                    name: "Ava King",
                    text: "Wonderful experience, great selection to choose from."
                },
                {
                    name: "Henry Allen",
                    text: "Very reliable service and high-quality items."
                },
                {
                    name: "Ella Wright",
                    text: "Shipping was faster than expected, great value!"
                },
                {
                    name: "Jackson Scott",
                    text: "Fantastic range of products and quick support!"
                }
            ]
        }
    },
    "cms.list": {
        product: [
            {
                title: "Product title #1",
                description: "Product description #1"
            },
            {
                title: "Product title #2",
                description: "Product description #2"
            }
        ],
        author: [
            {
                name: "Lucas Hall",
                bio: "Everything arrived perfectly, thank you!"
            },
            {
                name: "William Walker",
                bio: "Affordable prices and excellent delivery speed!"
            }
        ]
    }
};

export class ResolveDataSourceMockGateway implements IResolveDataSourceGateway {
    private decoratee: IResolveDataSourceGateway;

    constructor(decoratee: IResolveDataSourceGateway) {
        this.decoratee = decoratee;
    }

    async execute(request: DataRequest): Promise<DataSourceData> {
        if (request.getType() === "cms.entry") {
            const mockedData = mocks["cms.entry"][request.getConfig().entryId];
            return mockedData ? mockedData : this.decoratee.execute(request);
        }

        const modelId = request.getConfig().modelId;

        const data = mocks["cms.list"][modelId];
        if (data === undefined) {
            return this.decoratee.execute(request);
        }

        const search = request.getConfig().search?.toLowerCase();
        if (search) {
            return data.filter((item: any) => item.title.toLowerCase().includes(search));
        }

        return data;
    }
}
