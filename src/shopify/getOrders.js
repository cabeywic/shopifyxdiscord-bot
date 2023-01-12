const axios = require('axios');
const { getBaseAPIUrl, getStore } = require('./helper');
const linkParse = require('parse-link-header');

const getOrders = async (store, startDate, endDate = new Date()) => {
    const { shop, accessToken } = store;
    if(startDate > endDate) {
        throw new Error("Start date cannot be greater than end date");
    }

    let res = await axios.get(`${getBaseAPIUrl(shop)}/orders.json?status=any&fields=created_at,total-price,name&created_at_min=${startDate}&created_at_max=${endDate}&limit=250`, {
        headers: {
            'X-Shopify-Access-Token': accessToken,
        },
    })

    let orders = res.data.orders;
    if (!res.headers.get('Link')) {
        return orders;
    }
    
    let next = linkParse(res.headers.get('Link')).next;

    while(next){
        res = await axios.get(next.url, {
            headers: {
                'X-Shopify-Access-Token': accessToken,
            },
        })
        next = linkParse(res.headers.get('Link')).next;
        orders = orders.concat(res.data.orders);
    }

    return orders;
}

// getOrders(getStore("BGL"), "2022-12-01", "2022-12-31").then((orders) => {
//     const getMonthName = (date) => {
//         let months = ["January", "February", "March", "April", "May", "June", 
//         "July", "August", "September", "October", "November", "December"
//         ];
//         return months[date.getMonth()];
//     }

//     // console.log(orders)
//     console.log(`No. of Orders: ${orders.length}`)
//     let total = 0;
//     let monthlySales = {};

//     orders.forEach(order => {
//         let orderValue = parseFloat(order.total_price);
//         total += orderValue;
//         let currentMonth = getMonthName(new Date(order.created_at.split("T")[0]))
//         if (!monthlySales[currentMonth]) {
//             monthlySales[currentMonth] = orderValue;
//         } else {
//             monthlySales[currentMonth] += orderValue;
//         }
//     });

//     console.log(`Total Sales: $${total.toFixed(2)}`)
//     console.log(monthlySales)
// })


const createReport =  async (store, report) => {
    const { shop, accessToken } = store;
    const { name, shopify_ql } = report;
    let res = await axios.post(`${getBaseAPIUrl(shop)}/reports.json`, {
        "report": {
            "name": name,
            "shopify_ql": shopify_ql,
        },
        "headers": {
            'X-Shopify-Access-Token': accessToken,
        },
    })

    return res.data;
}

module.exports = {
    getOrders,
}