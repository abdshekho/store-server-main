import AWS from "aws-sdk";
import config from "../config";
import { v4 as uuid } from "uuid";

const s3 = new AWS.S3({
    accessKeyId: config.aws.iam.key,
    secretAccessKey: config.aws.iam.secret,
});

const s3Params = ({
    Body,
    ContentType,
    Key,
}: {
    Body: any;
    ContentType: string;
    Key?: string;
}) => ({
    Bucket: config.aws.bucket.name,
    Key: Key || uuid(),
    Body,
    ContentType,
});

export default { s3, s3Params };
