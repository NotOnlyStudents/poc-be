import {
    attribute,
    hashKey,
    table
} from '@aws/dynamodb-data-mapper-annotations';

interface ProductBodyRequest {
    ID: string;
    name: string;
    description: string;
    price: number;
}

@table(process.env.PRODUCTS_TABLE)
export class Product implements ProductBodyRequest {
    @hashKey()
    ID: string;

    @attribute()
    name: string;

    @attribute()
    description: string;

    @attribute()
    price: number;
    
    constructor(ID: string = '', name: string = '', description: string = '', price: number = 0) {
        this.ID = ID;
        this.name = name;
        this.description = description;
        this.price = price;
    }
}