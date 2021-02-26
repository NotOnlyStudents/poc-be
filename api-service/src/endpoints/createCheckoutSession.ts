// pk_test_51IHqhuEKthtArr3S4MYSAYFEPiFlioccyA4SjUNArmmdSmK7B05UnMdsNKIu0TCRXADZLVmjEUlqKRIR4D2SWtJ700PVmechEl
import { Handler } from 'aws-lambda';
import axios from 'axios';
import Stripe from 'stripe';

import { Responses } from '../common/responses';
import { Cart } from '../types/Cart';
import { Product } from "../types/Product";

const getCart = async (cartID: string): Promise<Cart> => {
    try {
        const resp = await axios.get<{cart: Cart}>("http://localhost:3000/dev/cart/" + cartID);

        return resp.data.cart;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const handler: Handler = async (event: any) => {
    console.log(event);
    if (!event.pathParameters || !event.pathParameters.CART_ID) {
        Responses._400({ message: `Missing the ID from the path` });
    }    

    try {
        const cart = await getCart(event.pathParameters.CART_ID);

        const cartItems = cart.products.map((item: Product) => {
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        description: item.description
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            };
        });

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2020-08-27'
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: cartItems,
            mode: 'payment',
            success_url: 'http://localhost:8080/purchased',
            cancel_url: 'http://localhost:8080/'
        });

        return Responses._200({ id: session.id });
    } catch (error) {
        console.log(`Error while getting the ${event.pathParameters.CART_ID} cart - ${error}`);
        return Responses._400({ message: `Error while getting the ${event.pathParameters.CART_ID} cart.` });
    }
}
