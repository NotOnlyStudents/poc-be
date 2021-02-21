import { Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: any) => {
  console.log(event);
  if (!event.pathParameters || !event.pathParameters.ID) {
    return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  const toFetchProduct = new Product(ID);

  let product: Product;
  await mapper
    .get(toFetchProduct)
    .then((item: Product) => {
      product = item;
    })
    .catch((err: any) => {
      console.log('Error fetching data from DynamoDB', err);
      return null;
    });

  if (!product) {
    return Responses._400({ message: `Failed to get product by ID: ${ID}` });
  }

  return Responses._200({ product });
}