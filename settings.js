const path = require('path');
//console.log(path.join(process.cwd(), `.env`))
const path2 = process.cwd().indexOf("/home/ubuntu") > -1 ? "/home/ubuntu/terabit" : "D:\\OpenServer\\domains\\mechanika"

require('dotenv').config({path: path.join(path2, `.env`)});

const horo_auth = {
    login: process.env.HEMAIL,
    pass: process.env.HPASS,
    domain: process.env.HSITE
}
const erc_auth = {
    login: process.env.ERC_LOGIC,
    pass: process.env.ERC_PASS
}

module.exports = {horo_auth, erc_auth}

