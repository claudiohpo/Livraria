interface IInventoryRequest {
    id?: number;
    quantity: number;
    unitCost: string; 
    entryDate: Date;
    invoiceNumber?: string | null;
    bookId: string;
    supplierId?: string | null;
}
export { IInventoryRequest };