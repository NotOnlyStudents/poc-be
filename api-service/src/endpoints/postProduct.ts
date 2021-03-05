import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';
import DynamoDBClient from '../common/dynamodb';

export const handler: Handler = async (event: APIGatewayProxyEvent, _context: Context, callback: Callback) => {
  try {
    console.log(event);
    callback(null, await postProduct(event));
  } catch (error) {
    callback(error);
  }
}

export const postProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body || !(JSON.parse(event.body) as Product)) {
    return Responses._400({ message: `Missing body from request.` });
  }

  const mapper = new DataMapper({ client: DynamoDBClient });
  
  const parsedBody: Product = JSON.parse(event.body);
  const product = new Product(parsedBody.ID, parsedBody.name, parsedBody.description, parsedBody.price, parsedBody.quantity);

  try {
    await mapper.put(product);

    return Responses._200({ product });
  } catch (error) {
    console.error('Error putting data on DynamoDB', error);
    return Responses._400({ message: `Failed to put product: ${product}` });
  }
}