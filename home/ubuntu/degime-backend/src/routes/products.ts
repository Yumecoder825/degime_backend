import { Router } from 'express'

import { authGuard } from '@/guards'
import { productsController } from '@/controllers'

export const products = (router: Router): void => {
    router.get(
        '/products',
        productsController.getProducts
    );

    router.get(
        '/products/product/:productId',
        authGuard.isAuth,
        productsController.getProduct
    );
}
