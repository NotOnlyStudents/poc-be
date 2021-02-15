import { Handler } from 'aws-lambda';
import { Dynamo } from '../common/Dynamo';

import { Responses } from '../common/responses';

const productsTable = 'products-table';

export const handler: Handler = async (event: any) => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
      return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  const product = Dynamo.get(ID, productsTable).catch(err => {
      console.log('Error in Dynamo Get', err);
      return null;
  });

  console.log(product);

  if (!product) {
      return Responses._400({ message: 'Failed to get product by ID' });
  }

  return Responses._200({ product: Promise.resolve(product) });
}