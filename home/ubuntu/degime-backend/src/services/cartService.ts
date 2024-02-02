import { ObjectId } from 'mongoose'
import { Cart } from '@/models'
import { ICart, Item } from '@/contracts/cart'

class CartService {
  create(_cart: ICart) {
    return new Cart({
      items: _cart.items,
      user: _cart.user
    }).save()
  }
  update(userId: ObjectId, items: ICart['items']) {
    return Cart.findOneAndUpdate({ user: userId }, { items: items })
  }
  async updateItem(
    userId: ObjectId,
    productId: string | number,
    quantity: number
  ) {
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: { $pull: { productId: +productId } } }
    )
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: { $push: { productId: +productId, quantity } } }
    )
  }
  getByUserId(userId: ObjectId) {
    return Cart.findOne({ user: userId })
  }
  async addItemToCart(userId: ObjectId, item: Item) {
    console.log('test:===========', item)
    let cart = await this.getByUserId(userId)
    if (!cart) {
      cart = await this.create({ items: [item], user: userId })
    } else {
      let index = cart.items.findIndex(t => t.productId === item.productId)
      if (index > -1) {
        cart.items = cart.items.slice()
        cart.items[index].quantity = item.quantity
      } else {
        cart.items.push(item)
      }
    }
    return cart.save()
  }

  removeItemFromCart(userId: ObjectId, productId: string | number) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { items: { $pull: { productId: +productId } } },
      { new: true }
    )
  }
}

export const cartService = new CartService()
