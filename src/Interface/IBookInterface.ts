interface IBookRequest {
    id?: number;
    author: string;
    category: string[];
    year: number;
    title: string;
    publisher: string;
    edition: string;
    ISBN: string;
    pages: number;
    synopsis: string;
    dimensions: {
        height: number;
        width: number;
        depth: number;
        weight: number;
    };
    pricegroup: string;
    barcode: string;
    cost: number;
}
export { IBookRequest };