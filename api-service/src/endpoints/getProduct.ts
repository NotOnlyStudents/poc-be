import { Handler } from 'aws-lambda';
import { Dynamo } from '../common/Dynamo';

import { Responses } from '../common/responses';

const productsTable: string = process.env.productsTable as string;

export const handler: Handler = async (event: any) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  const product = Dynamo.get(ID, productsTable).catch(err => {
      console.log('Error in Dynamo Get', err);
      return null;
  });

  if (!product) {
      return Responses._400({ message: 'Failed to get product by ID' });
  }

  return Responses._200({ product });
}