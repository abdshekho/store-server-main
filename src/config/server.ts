const isProduction = process.env.NODE_ENV === "production" ? true : false;
const domain = isProduction ? "smartfamily.ae" : "localhost";
const port = 5002;

export default {
    port,
    isProduction,
    domain,
    jwtSecret: process.env.JWT_SECRET || "",
    apiUrl: isProduction ? `https://api.${domain}` : `http://${domain}:${port}`,
    clientUrl: isProduction ? `https://www.${domain}` : `http://${domain}:4002`,
    adminUrl: isProduction
        ? `https://www.admin.${domain}`
        : `http://${domain}:3002`,
};
