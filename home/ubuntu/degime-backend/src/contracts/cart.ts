import { Model, ObjectId } from "mongoose"

export type Item = {
    productId: string | number
    quantity: number
} 

export interface ICart {
    items: Item[],
    user: ObjectId
}

export interface ICartMethods {
}

export type CartModel = Model<ICart, unknown, ICartMethods>

export type AddToCartPayload = {
    item: Item
};
export type RemoveItemFromCartPayload = {
    productId: string | number
};
export type UpdateToCartPayload = Item
