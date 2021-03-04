// import { describe, it } from "mocha";
// import { expect } from "chai";
// import * as sinon from "sinon";
import { expect, describe, it } from '@jest/globals'

import { Responses } from "../src/common/responses";

// sinon.stub(console, 'error');

describe('Response', () => {
    it('Creating a 200 response is successful', async () => {
        const response = Responses._200();
        expect(response.statusCode).toEqual(200);
    });

    it('Creating a 400 response is successful', async () => {
        const response = Responses._400();
        expect(response.statusCode).toEqual(400);
    });
});
