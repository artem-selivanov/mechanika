const axios = require('axios');
const {horo_auth, erc_auth} = require('./settings');
const horoshopClass = require('./helpers/horoshop');
const ercClass = require('./helpers/erc');
const h = new horoshopClass(horo_auth);
const e = new ercClass(erc_auth);

(async function () {
    console.log(horo_auth)
    const update = []
    await h.init()
    const horo_items = await h.allItems()
    console.log(`We have a ${[...Object.values(horo_items)].length} items in Horoshop`)
    await e.init()
    const erc = await e.getItems()
    for (let item of [...Object.values(erc)]) {

        const hitem = horo_items[item.sku]
        if (!hitem) continue
        //console.log(item)
        if (((hitem.presence == 0 && item.amount == 0) || (hitem.presence == 1 && item.amount > 0)) && hitem.price == item.price) continue
        update.push({
            article: item.sku,
            price: item.price,
            presence: item.amount > 0 ? "В наявності" : "Немає в наявності"
        })
    }
    console.log(update.length)

    //console.log(update)

    /*
    for (let item of [...Object.values(horo_items)]) {
        if (item.presence == 0) continue
        if (erc[item.sku]) continue
        update.push({
            article: item.sku,
            price: item.price,
            presence: "Немає в наявності"
        })
    }

    console.log(update.length)*/
    if (update.length==0) return
    await h.init()
    await h.sendUpdate("/api/catalog/import/",update)

})()