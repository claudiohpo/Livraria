interface InventoryReservation{
    id?: number;
    inventoryId: string;
    cartItemId: string;
    quantity: number;
    expiresAt?: string | Date | null;
}

export { InventoryReservation };