export const Responses = {
    _200(data = {}): Response {
        return { 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            },
            statusCode: 200,
            body: JSON.stringify(data)
        };
    },
    _400(data = {}): Response {
        return { 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            },
            statusCode: 400,
            body: JSON.stringify(data)
        };
    }
};
