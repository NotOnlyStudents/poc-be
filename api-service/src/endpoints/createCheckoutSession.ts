// pk_test_51IHqhuEKthtArr3S4MYSAYFEPiFlioccyA4SjUNArmmdSmK7B05UnMdsNKIu0TCRXADZLVmjEUlqKRIR4D2SWtJ700PVmechEl
import { Handler } from 'aws-lambda';
import { AWSError, Lambda } from "aws-sdk";
import Stripe from 'stripe';

import { Responses } from '../common/responses';
import { Cart } from '../types/Cart';

const getCart = async (event: any): Promise<Cart> => {
    return new Promise<Cart>((resolve, reject) => {
        if (!event.pathParameters || !event.pathParameters.CART_ID) {
            reject(new Error(`Missing the ID from the path`));
        }
        const lambda = new Lambda({
            region: process.env.REGION
        });

        lambda.invoke({
            FunctionName: "getCart",
            Payload: JSON.stringify(event),
            InvocationType: 'Event'
        }, (err: AWSError, data: Lambda.InvocationResponse) => {
            if (err) reject(new Error(err.message));
            if (data.Payload) {
                resolve(data.Payload as Cart);
            }
        });
    });
};

export const handler: Handler = async (event: any) => {
    console.log(event);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2020-08-27'
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'eur',
                product_data: {
                    name: 'T-shirt',
                },
                unit_amount: 2000,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
    });

    return Responses._200({ id: session.id });
};
