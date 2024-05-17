const {parseStringPromise} = require('xml2js');
const axios = require('axios');
const {horo_auth, validCats, url} = require('./settings');
const horoshopClass = require('./helpers/horoshop');
const {getYml} = require('./helpers/xml');
const h = new horoshopClass(horo_auth);

(async function () {
    const dclink = await getYml(url)
    await h.init()
    let result
    let start = 0

    const notfind = []
    while (true) {
        const update = []
        result = await h.getItems(start)
        if (result == null) break;
        start += 500
        console.log(`Horoshop send ${result.length} products`)
        for (let {article, price, presence, parent, name} of result) {
            // if (!parent.value||parent.value.split("/").filter(i => (validCats.indexOf(i) > -1)).length == 0) continue
            if (!parent.value) continue
            const stock = presence.id == 1
            const dcitem = dclink[article]
            //console.log(dcitem)
            if (!dcitem && stock) update.push({article, presence:"Немає в наявності"})
            if (!dcitem || (dcitem.price == price && dcitem.stock == stock)) continue
            update.push({article, price: dcitem.price, presence: dcitem.stock ? "В наявності" : "Немає в наявності"})
        }
        console.log(`Current position ${start}`)
        console.log(`The script will update ${update.length}`)
        console.log(`-------`)
        if (update.length>0) await h.sendUpdate("/api/catalog/import/",update)
        if (result.length < 500) break;
    }

})()