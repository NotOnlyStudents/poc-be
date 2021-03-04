import { APIGatewayProxyEvent } from 'aws-lambda';
import { describe, it } from "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as nock from 'nock';
// import { DynamoDB } from 'aws-sdk';
import { postProduct } from "../src/endpoints/postProduct";

import { Product } from "../src/types/Product";

sinon.stub(console, 'error');

describe('postProduct', () => {
    afterEach(() => nock.cleanAll());

    it('postProduct with success response', async () => {
        nock.recorder.rec();

        const eventBody: Product = {
            ID: '1',
            name: 'Nike',
            description: 'Sneakers',
            price: 13075,
            quantity: 2
        };

        const event = {
            body: JSON.stringify(eventBody),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            },
            httpMethod: 'POST',
            isBase64Encoded: false,
            path: '/product'
        } as unknown as APIGatewayProxyEvent;

        const response = await postProduct(event);
        expect(response.statusCode).to.equal(200);
    });
});
