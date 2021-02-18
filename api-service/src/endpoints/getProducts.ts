import { Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';

const client = new DynamoDB();
const mapper = new DataMapper({ client })

export const handler: Handler = async (event: any) => {
  console.log(event);

  let products: [Product?] = [];

  const iterator = mapper.scan(Product);
  for await (const item of iterator) {
    // Each item is an instance of Product
    products.push(item);
  }

  if (!products) {
    return Responses._400({ message: `Failed to get all products` });
  }

  return Responses._200({ products });
}