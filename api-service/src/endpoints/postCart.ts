import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Cart } from '../types/Cart';
import { Product } from '../types/Product';
import { Responses } from '../common/responses';

const client = new DynamoDB();
const mapper = new DataMapper({ client })

export const handler: Handler = async (event: any) => {
    const parsedBody: Cart = await JSON.parse(event.body);
    const products = parsedBody.products.map((item: Product) => {
        return new Product(item.ID, item.name, item.description, item.price);
    });

    const cart = new Cart(parsedBody.ID, products);

    const putRes = await mapper.put(cart).catch((err: any) => {
        console.log('Error putting data on DynamoDB', err);
        return null;
    });

    if (!putRes) {
        return Responses._400({ message: `Failed to put product: ${cart}` });
    }

    return Responses._200({ cart });
}