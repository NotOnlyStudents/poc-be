import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { Product } from '../types/Product';
import { Responses } from '../common/responses';
import DynamoDB from '../common/dynamodb';

const mapper = new DataMapper({ client: DynamoDB });

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  if (!event.body || !(JSON.parse(event.body) as Product)) {
    return Responses._400({ message: `Missing body from request.` });
  }
  
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