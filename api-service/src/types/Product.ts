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
    quantity: number;
}

@table("products-table")
export class Product implements ProductBodyRequest {
    @hashKey()
    ID: string;

    @attribute()
    name: string;

    @attribute()
    description: string;

    @attribute()
    price: number;

    @attribute()
    quantity: number;
    
    constructor(ID: string = '', name: string = '', description: string = '', price: number = 0.0, quantity: number = 1) {
        this.ID = ID;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}