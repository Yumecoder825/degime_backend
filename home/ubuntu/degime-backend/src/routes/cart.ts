import { Router } from 'express'

import { authGuard } from '@/guards'
import { cartController } from '@/controllers'
import { cartValidation } from '@/validations'

export const cart = (router: Router): void => {
    router.post(
        '/cart',
        authGuard.isAuth,
        cartValidation.add2Cart,
        cartController.addToCart
    );
    router.get(
        '/cart/mine',
        authGuard.isAuth,
        cartController.getMyCart
    );
    router.post(
        '/cart/item/delete',
        authGuard.isAuth,
        cartController.removeFromCart
    );
    router.post(
        '/cart/item',
        authGuard.isAuth,
        cartValidation.update2Cart,
        cartController.updateItemFromCart
    );
}
