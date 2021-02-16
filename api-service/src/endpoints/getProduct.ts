import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';

const client = new DynamoDB();
const mapper = new DataMapper({ client })

export const handler: Handler = async (event: any) => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  const toFetchProduct = new Product(ID);

  const product: Product = await mapper.get(toFetchProduct).catch((err: any) => {
    console.log('Error fetching data from DynamoDB', err);
    return null;
  });

  if (!product) {
      return Responses._400({ message: `Failed to get product by ID: ${ID}` });
  }

  return Responses._200({ product });
}