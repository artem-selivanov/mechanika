const axios = require('axios');

class horoshopClass {

    constructor({login, pass, domain}) {
        this.login = login;
        this.pass = pass;
        this.domain = domain;
    }

    async init() {
        let data = {
            'login': this.login,
            'password': this.pass,
        };

        let options = {
            'method': 'post',
            'url': `https://${this.domain}/api/auth/`,
            'headers': {
                'Content-Type': 'application/json',
            },
            'data': JSON.stringify(data),
        };

        await axios(options)
            .then(response => {
                let getdata = response.data;
//                console.log(getdata);
//                console.log(getdata.response.token);
                this.token = getdata.response.token;
                //console.log(this.token)
            })
            .catch(error => {
                console.error(error);
            });
    }

    async getItems(start) {
        //
        const data = {
            "offset": start,
            includedParams: ["quantity", "price", "name", "presence","brand", "name"],
            "token": this.token
        };

        const options = {
            method: 'POST',
            'url': `https://${this.domain}/api/catalog/export/`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        };

        //console.log(options)

        return await axios(options)
            .then(response => {
                    //console.log(response.data)
                    return response.data.response.products
                }
            )
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    }


    async updateData(article, price, presence) {
        const data = {
            "products": [
                {"article": article, "price": price, "presence": presence}
            ],
            "token": this.token
        };

        const options = {
            method: 'POST',
            url: `https://${this.domain}/api/catalog/import/`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        };

        return await axios(options)
            .then(response => {
                console.log(response);
                return response
            })
            .then(getdata => {
                console.log(getdata);
                return getdata;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async sendUpdate(url,products) {
        const data = {
            products,
            "token": this.token
        };

        const options = {
            method: 'POST',
            url: `https://${this.domain}${url}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        };

        return await axios(options)
            .then(response => {
                console.log(response.data);
                return response.data
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    async allItems(){
        let result = []
        let all = {}
        let start = 0
        console.log(`Geting the items`)
        const notfind = []
        while (true) {
            const update = []
            const tmp= await this.getItems(start)
            //console.log(tmp[0])
            result = [...result, ... tmp]
            if (tmp.length != 500) break;
            start += 500
            console.log(`Currently get ${start}`)
            //if (start==1500) break

        }
        result.map(i=>(all[i.article]={sku:i.article, presence:i.presence.id == 2 ? 0 : 1, price:i.price, brand:i.brand?.value?.ua}))
        return all
    }

}

module.exports = horoshopClass