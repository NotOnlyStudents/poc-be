import { expect, test } from '@jest/globals'
import { APIGatewayProxyEvent } from 'aws-lambda';
import { postProduct } from "../src/endpoints/postProduct";

import Product from "../src/types/Product";

test('Post poroduct successful', async () => {
    const product = new Product('1', 'Adidas', 'Shoes', 13090, 2);

    const event = {
        body: JSON.stringify(product),
        path: '/product',
        pathParameters: null,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    } as unknown as APIGatewayProxyEvent;

    const response = await postProduct(event);
    expect(response.statusCode).toEqual(200);
});
