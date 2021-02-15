import Writeable from './Writeable';

export interface ProductInterface extends Writeable {
    readonly name: string;
    readonly description: string;
    readonly preice: number;
}

export class Product implements ProductInterface {
    ID: string;
    name: string;
    description: string;
    preice: number;
    
    constructor(ID: string, name: string, description: string, preice: number) {
        this.ID = ID;
        this.name = name;
        this.description = description;
        this.preice = preice;
    }
}