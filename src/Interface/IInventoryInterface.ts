interface IInventoryRequest {
    id?: number;
    quantity: number;
    unitCost: string; // Usando string para evitar problemas de precisão com números decimais
    entryDate: Date;
    invoiceNumber?: string | null;
    bookId: string;
    supplierId?: string | null;
}
export { IInventoryRequest };