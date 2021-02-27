import { Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Cart } from '../types/Cart';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: any) => {
    console.log(event);
    if (!event.pathParameters || !event.pathParameters.CART_ID) {
        return Responses._400({ message: 'Missing the ID from the path' });
    }

    const ID = event.pathParameters.CART_ID;
    const cart: Cart = new Cart(ID);

    const updateRes = await mapper.update(cart, { onMissing: 'skip' }).catch((err: Error) => {
        console.log('Error updating data on DynamoDB', err);
        return null;
    });

    console.log(updateRes);

    if (!updateRes) {
        return Responses._400({ message: `Failed to empty the cart with ID: ${ID}` });
    }

    return Responses._200({ cart });
}