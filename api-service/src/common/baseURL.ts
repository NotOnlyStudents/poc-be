let baseUrl: string;
let clientBaseUrl: string;
if (process.env.IS_OFFLINE) {
    baseUrl = "http://localhost:3000";
    clientBaseUrl = "http://localhost:8080";
} else {
    baseUrl = "https://api.annoiato.net";
    clientBaseUrl = "https://shop.annoiato.net";
}