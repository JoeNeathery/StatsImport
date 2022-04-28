const aws = require('aws-sdk');
const parser = require('xml2json');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    try{
        //Parse sport and file type
        const sport = key.substring(0, key.indexOf('_'));
        const fileType = key.substring(key.indexOf('_') + 1, key.includes('$') ? key.indexOf('$') : key.indexOf('.'));

        //get file data
        const xml = await s3.getObject(params).promise();

        //convert xml to JSON payload
        var json = parser.toJson(xml);
        console.log(json);

        //call corresponding data load microservice
        //move file to processed data s3 bucket
        return true;
    } catch (err){
        //console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Error: ` + err;
        console.log(message);
        throw new Error(message);
    }
};