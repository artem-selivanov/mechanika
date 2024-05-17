const {parseStringPromise} = require('xml2js');
const axios = require('axios');

async function getYml(url) {
    let obj = {}
    const xml = (await axios.get(url)).data
    const xmlresult = await parseStringPromise(xml)


    const offers = xmlresult.yml_catalog.shop[0].offers[0].offer
    console.log(`Items in the stock: ${offers.filter(i=>i['$'].available == 'true').length}`)
    console.log(`Items not in the stock: ${offers.filter(i=>i['$'].available != 'true').length}`)

    offers.map(i=>(obj[i['$'].id.toString()]={price:Math.ceil(i.price[0]), stock:i['$'].available == 'true'}))
    return obj
}

module.exports = {getYml}