import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Cart } from '../types/Cart';
import { Responses } from '../common/responses';

const client = new DynamoDB();
const mapper = new DataMapper({ client })

export const handler: Handler = async (event: any) => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the ID from the path' });
  }

  const ID = event.pathParameters.ID;
  const toFetchCart: Cart = new Cart(ID);

  let cart: Cart;
  await mapper
    .get(toFetchCart)
    .then((item: Cart) => {
      cart = item;
    })
    .catch((err: any) => {
      console.log('Error fetching data from DynamoDB', err);
      return null;
    });

  if (!cart) {
    return Responses._400({ message: `Failed to get cart by ID: ${ID}` });
  }

  return Responses._200({ cart });
}