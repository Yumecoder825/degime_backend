import { Schema, model } from 'mongoose'
import { ICart, CartModel, ICartMethods } from '@/contracts/cart'

const schema = new Schema<ICart, CartModel, ICartMethods>(
    {
        items:[{
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
)

export const Cart = model<ICart, CartModel>('Cart', schema)
