import { DynamoDB } from 'aws-sdk';

import Writeable from '../types/Writeable';

// aliases
type AttributeMap = DynamoDB.DocumentClient.AttributeMap;
type GetItemInput = DynamoDB.DocumentClient.GetItemInput;

const dynamoDb = new DynamoDB.DocumentClient();

export const Dynamo = {
    async get(ID: string, tableName: string): Promise<AttributeMap> {
        const params: GetItemInput = {
            TableName: tableName,
            Key: {
                ID
            }
        };

        const data = await dynamoDb.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching data for ID of ${ID} from ${tableName}`);
        }

        return data.Item;
    },

    async write<T extends Writeable>(data: T, TableName: string): Promise<object> {
        if (!data.ID) {
            throw Error('No ID on the data.')
        }

        const params = {
            TableName,
            Item: data
        }

        const res = await dynamoDb.put(params).promise();
        if (!res) {
            throw Error(`There was an error inserting ID of ${data.ID} into table ${TableName}`);
        }
        return data;
    }
}