const axios = require('axios');

class ercClass {

    constructor({login, pass}) {
        this.login = login;
        this.pass = pass;
    }

    async init() {
        let data = {
            'username': this.login,
            'password': this.pass,
        };

        let options = {
            'method': 'post',
            'url': `https://api.erc.ua/v1/auth`,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            'data': data//JSON.stringify(data),
        };

        await axios(options)
            .then(response => {
                let getdata = response.data;
//                console.log(getdata.response.token);
                this.token = getdata.token;
                //console.log(this.token)
            })
            .catch(error => {
                console.error(error);
            });
        //console.log(this.token)
    }

    async getVendors() {
        const headers = {
            "accept": "application/json",
            "X-AUTH-TOKEN": this.token
        };

        const vendors = await axios.get('https://api.erc.ua/v1/vendor?page=1&limit=2500', {headers})
        return vendors.data.content
    }


    async getByVendor( page, limit) {
        const headers = {
            "accept": "application/json",
            "X-AUTH-TOKEN": this.token
        };
        // .0 2890.0 2494.0 952.0
        const results = await axios.get(`https://api.erc.ua/v1/ware/uk?page=${page}&limit=${limit}`, {headers}) //&filters%5Bvendor%5D=${id}
        return results.data.content.map(i => i.sku.map(v => ({
            amount: i.amount == null ? 0 : parseInt(i.amount.replace(">", "")),
            price: i.ercRrcPrice,
            sku: v.code
        }))).flat()
    }

    async getItems() {
        let results = []
        let items = {}
            let page = 1
            const limit = 1000
            while (true) {
                const tmp = await this.getByVendor(page, limit) //vendor.id
                results = [...results, ...tmp]
                if (tmp.length < limit) break
                page++
                console.log(tmp.length)
                console.log(`Page: ${page}`)
                //break
            }
        console.log(`All items: ${results.length}`)
        results.map(i=>(items[i.sku]=i))
        return items
    }


}

module.exports = ercClass