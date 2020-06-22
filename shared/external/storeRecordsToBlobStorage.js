const BlobStorage = require('@azure/storage-blob');
const Configuration = require('./configuration');

async function storeRecordsToBlobStorage(itemRecords, item, initialize = false) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = await BlobStorage.BlobServiceClient.fromConnectionString(Configuration.keys.azureWebJobsStorage);

    // Get a reference to a container
    const containerClient = await blobServiceClient.getContainerClient(Configuration.keys.azureContainerName);

    const blobName = getBlobName(item.system.id);
    const blobData = getBlobData(itemRecords, item, initialize);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.upload(blobData, blobData.length);
}

function getBlobName(id) {
    return `${id}.json`;
}

function getBlobData(itemRecords, item, initialize) {
    return JSON.stringify({
        itemRecords,
        codename: item.system.codename,
        id: item.system.id,
        operation: getOperation(itemRecords, initialize),
        section: 'tutorials',
    });
}

function getOperation(itemRecords, initialize) {
    if (initialize) {
        return 'INITIALIZE';
    } else if (itemRecords.length === 0) {
        return 'DELETE';
    } else {
        return 'UPDATE';
    }
}

module.exports = {
    storeRecordsToBlobStorage,
};
