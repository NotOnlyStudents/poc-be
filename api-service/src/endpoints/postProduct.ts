import { Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: any) => {
  console.log(event);
  
  const parsedBody: Product = JSON.parse(event.body);
  const product = new Product(parsedBody.ID, parsedBody.name, parsedBody.description, parsedBody.price);

  const putRes = await mapper.put(product).catch((err: any) => {
    console.log('Error putting data on DynamoDB', err);
    return null;
  });

  if (!putRes) {
    return Responses._400({ message: `Failed to put product: ${product}` });
  }

  return Responses._200({ product });
}