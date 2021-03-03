import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Cart } from '../types/Cart';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event);
    if (!event.pathParameters || !event.pathParameters.CART_ID) {
        return Responses._400({ message: 'Missing the ID from the path' });
    }

    const ID = event.pathParameters.CART_ID;
    const cart: Cart = new Cart(ID);

    try {
        await mapper.update(cart, { onMissing: 'skip' });

        return Responses._200({ cart });
    } catch (err) {
        console.error('Error updating data on DynamoDB', err);
        return Responses._400({ message: `Failed to empty the cart with ID: ${ID}` });
    }    
}