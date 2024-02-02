import { ObjectId } from 'mongoose'
import { Cart } from '@/models'
import { ICart, Item } from '@/contracts/cart'

import axios from 'axios'
import { ProductProps } from '@/contracts/products'

const apiKey = 'ck_bc7f1a55b21117d4a2c6f3102a9fad4fdc2967e3'
const apiSecret = 'cs_73357e9d2d203e7282c1a5ec62e9c1ad3ede23ac'
const baseUrl = 'https://ik1-129-71227.vs.sakura.ne.jp/' // Your store's URL
class ProductsService {
  async getProducts(): Promise<ProductProps[] | null> {
    try {
      const response = await axios.get<ProductProps[]>(
        `${baseUrl}/wp-json/wc/v3/products`,
        {
          auth: {
            username: apiKey,
            password: apiSecret
          }
        }
      )
      if (response.status === 200) {
        const products: ProductProps[] = response.data.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description
        }))
        return products
      } else {
        console.error('Product not found')
        return null
      }
    } catch (error) {
      throw error
    }
  }

  async getProduct(productId: string): Promise<ProductProps | null> {
    try {
      const response = await axios.get(
        `${baseUrl}/wp-json/wc/v3/products/${productId}`,
        {
          auth: {
            username: apiKey,
            password: apiSecret
          }
        }
      )
      if (response.status === 200) {
        const productData = response.data
        const product: ProductProps = {
          id: productData.id,
          name: productData.name,
          price: productData.price,
          description: productData.description
        }
        return product
      } else {
        return null
      }
    } catch (error) {
      console.error('Error:', error)
      throw error // You can choose to throw the error or handle it as needed.
    }
  }
}

export const productsService = new ProductsService()
