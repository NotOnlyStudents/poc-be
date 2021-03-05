import { expect, describe, it } from '@jest/globals'
import Responses from "../src/common/responses";

describe('Response', () => {
    it('Creating a 200 response is successful', async () => {
        const response = Responses.success();
        expect(response.statusCode).toEqual(200);
    });

    it('Creating a 400 response is successful', async () => {
        const response = Responses.userError();
        expect(response.statusCode).toEqual(400);
    });
});
