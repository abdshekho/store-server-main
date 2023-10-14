const emailConfig = {
    host: "mail.crownphoenixadv.com",
    noreply: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
};

export default emailConfig;
