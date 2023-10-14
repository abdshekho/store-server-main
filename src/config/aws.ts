export default {
    iam: {
        key: process.env.IAM_KEY,
        secret: process.env.IAM_SECRET,
    },
    bucket: {
        name: process.env.BUCKET_NAME as string,
    },
};
