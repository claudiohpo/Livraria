interface ICartItemRequest {
  id?: number;
  quantity: number;
  itemId: number;
  cartId: number;
  price: number;
}

export { ICartItemRequest };