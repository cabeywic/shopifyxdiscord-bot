const stores = require('../../config/stores.json');

exports.getBaseAPIUrl = (shop) => {
    return `https://${shop}.myshopify.com/admin/api/2023-01`
}

exports.getStore = (storeName) => {
    return stores[storeName];
}

exports.getAllStores = () => {
    return stores;
}