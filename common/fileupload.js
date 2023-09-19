const multer = require('multer')
const AWS = require('aws-sdk')
const path = require('path')
const config = require('../config/app_config.json')



const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : config.aws.accesskey,
    secretAccessKey: process.env.AWS_SECRET_KEY ? process.env.AWS_SECRET_KEY : config.aws.secretkey,
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

function singleupload({ file }) {
    return multer({ storage }).single(file)
}

function multipleupload({ fileNames }, maxCount = 5) {
    return multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } }).fields(fileNames.map(e => (
        { name: e, maxCount: maxCount }
    )
    ))
}

function multipleDocUpload(fileNames, maxCount = 5) {
    return multer({ storage }).fields(fileNames.map(e => (
        { name: e, maxCount: maxCount }
    )
    ))
}

function multipleFilesToBuffer(key) {
    return multer({ storage: multer.memoryStorage() }).array(key)
}

async function fileUpload(req, bucketname) {


    let params
    let files;
    let a = {};
    try {
        if (req.file) {
            files = req.file;
            let fl = files.fieldname;
            let k = files.fieldname + "-" + Date.now() + path.extname(files.originalname)
            params = {
                Bucket: bucketname,
                Key: k,
                ContentEncoding: 'base64',
                ContentDisposition: 'inline',
                contentType: multer.contentType,
                Body: files.buffer
            };
            let data = await s3.upload(params).promise()
            a[fl] = data.Location
            return {
                header: {
                    code: "600"
                },
                body: {
                    value: a
                }
            };
        } else {
            files = req.files;
        }
        for (let mVal in files) {
            let ar = [];
            for (const element of files[mVal]) {
                let fl = element.fieldname;
                let k = element.fieldname + "-" + Date.now() + path.extname(element.originalname)
                params = {
                    Bucket: bucketname,
                    Key: k,
                    ContentEncoding: 'base64',
                    ContentDisposition: 'inline',
                    contentType: multer.contentType,
                    Body: element.buffer
                };
                let data = await s3.upload(params).promise()
                ar.push(data.Location)
                a[fl] = ar
            }
        }
        // return a;
        return {
            header: {
                code: "600"
            },
            body: {
                value: a
            }
        };
    } catch (e) {
        return {
            header: {
                code: "602"
            }
        };
    }
}

async function getFile(key, bucketname) {
    let params = {
        Bucket: bucketname,
        Key: key
    };
    // let a ;
    const data = await s3.getObject(params).promise()
    return data
}

async function deleteFile(key, bucketname) {
    try {
        const params = {
            Bucket: bucketname,
            Key: key
        };
        await s3.deleteObject(params).promise()
        return {
            header: {
                code: "600"
            }
        }
    } catch (e) {
        return {
            header: {
                code: "602"
            }
        };
    }
}

async function deleteAllFile(keyList, bucketname) {
    try {
        keyList.map(key => {
            // console.log(key, "key");
        })
        const objectsToDelete = keyList.map(key => ({ Key: key }));
        const params = {
            Bucket: bucketname,
            Delete: {
                Objects: objectsToDelete
            }
        };
        await s3.deleteObjects(params).promise()
        return {
            header: {
                code: "600"
            }
        }
    } catch (e) {
        // console.log(e, "ssssssssss");
        return {
            header: {
                code: "602"
            }
        };
    }
}

async function uploadBuffer(fileBuffer, filename, bucketname) {
    try {
        params = {
            Bucket: bucketname,
            Key: filename,
            ContentEncoding: 'base64',
            ContentDisposition: 'inline',
            contentType: multer.contentType,
            Body: fileBuffer
        };
        let data = await s3.upload(params).promise()
        isDone = true;
        return data.Location;
    } catch (e) {
        // console.log(e);
    }
}

function multipleFilesUploadWithConfig(key, config) {
    return multer(config).array(key)
}

function getBucket({ accesskey, secretkey }) {
    const s3Instance = new AWS.S3({
        accessKeyId: accesskey,
        secretAccessKey: secretkey
    })
    const uploadBuffer = (fileBuffer, filename, bucketname) => s3Instance.upload({
        Bucket: bucketname,
        Key: filename,
        ContentEncoding: 'base64',
        ContentDisposition: 'inline',
        contentType: multer.contentType,
        Body: fileBuffer
    }).promise()
    return ({ s3Instance, uploadBuffer, multipleFilesUploadWithConfig, singleupload })
}





module.exports = { multipleDocUpload, getBucket, fileUpload, multipleFilesUploadWithConfig, multipleFilesToBuffer, singleupload, multipleupload, getFile, uploadBuffer, deleteFile, deleteAllFile }










