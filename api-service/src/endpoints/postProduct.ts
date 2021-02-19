import { Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product, ProductBodyRequest } from '../types/Product';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: any) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  
  const parsedBody: ProductBodyRequest = JSON.parse(event.body);
  const product = new Product(ID, parsedBody.name, parsedBody.description, parsedBody.price);

  const putRes = await mapper.put(product).catch((err: any) => {
    console.log('Error putting data on DynamoDB', err);
    return null;
  });

  if (!putRes) {
    return Responses._400({ message: `Failed to put product: ${product}` });
  }

  return Responses._200({ product });
}