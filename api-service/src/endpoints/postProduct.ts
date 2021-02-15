import { Handler } from 'aws-lambda';
import { Responses } from '../common/responses';
import { Dynamo } from '../common/Dynamo';

import { ProductInterface } from '../types/Product';

const productsTable: string = process.env.productsTable as string;

export const handler: Handler = async (event: any) => {
  if (!event.pathParameters || !event.pathParameters.ID) {
      return Responses._400({ message: 'Missing the ID from the path' }); 
  }

  const ID = event.pathParameters.ID;
  
  const product: ProductInterface = JSON.parse(event.body);
  product.ID = ID;

  const newProduct = await Dynamo.write(product, productsTable).catch(err => {
      console.log('Error in dynamo write', err);
  });

  if (!newProduct) {
      return Responses._400({ message: 'Failed to get product by ID' });
  }

  return Responses._200({ newProduct });
}