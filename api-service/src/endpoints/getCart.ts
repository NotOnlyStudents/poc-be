import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Cart } from '../types/Cart';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the ID from the path' });
  }

  const ID = event.pathParameters.ID;
  const toFetchCart: Cart = new Cart(ID);

  try {
    const cart: Cart = await mapper.get(toFetchCart);

    return Responses._200({ cart });
  } catch (error) {
    console.log('Error fetching data from DynamoDB', error);
    return Responses._400({ message: `Failed to get cart by ID: ${ID}` });
  }
}