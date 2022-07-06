import axios from 'axios'
import * as waxjs from "@waxio/waxjs/dist";
import Link from 'anchor-link'
import { useToast } from 'vue-toastification'
const toast = useToast()
import {
    isWebUri
} from 'valid-url';
import moment from 'moment';
import BrowserTransport from 'anchor-link-browser-transport'
var keys = null
var laccount = null
if (localStorage.getItem("ual-wax:autologin") != null) {
    let ualWax = JSON.parse(localStorage.getItem("ual-wax:autologin"))
    keys = ualWax ? ualWax.pubKeys : null
}
if (localStorage.getItem("wax_user") != null) {
    laccount = localStorage.getItem("wax_user")
}
const chainUrl = () => {
    if (localStorage.getItem("rpc-link-key") != null) {
        let url = localStorage.getItem("rpc-link-key");
        return `https://${url}/v1/chain`;
    } else {
        return process.env.VUE_APP_CHAIN_API
    }
}
const defaultChain = () => {
    if (localStorage.getItem("rpc-link-key") != null) {
        let url = localStorage.getItem("rpc-link-key");
        return `https://${url}`;
    } else {
        return process.env.VUE_APP_CHAIN_URL
    }
}
const assetUrl = (asset = false) => {
    let link = process.env.VUE_APP_API_URL;
    if (localStorage.getItem("rpc-asset-key") != null) {
        link = localStorage.getItem("rpc-asset-key");
    }
    if (asset) {
        link = `${link}/atomicassets/v1/assets`;
    }
    return link;
}
const waxOptions = {
    rpcEndpoint: defaultChain(),
    userAccount: localStorage.getItem("wax_user") || null,
    pubKeys: keys,
    tryAutoLogin: false
}
var wax = new waxjs.WaxJS(waxOptions);

const getImgUrl = (hash, isVideo) => {
    if (isWebUri(hash)) {
        return hash;
    }
    let url = 'http://ipfs.io/ipfs/' + hash;
    if (isVideo) {
        return url
    }
    return '//images.weserv.nl/?url=' + url + "&w=300&h=300";
}
const callApi = async(params, callback) => {
    axios
        .get(`${assetUrl(true)}?owner=${localStorage.getItem('wax_user')}&page=1&limit=100${params}`)
        .then(() => callback)
}
const link = new Link({
    transport: new BrowserTransport({
        requestStatus: false
    }),
    chains: [{
        chainId: process.env.VUE_APP_CHAIN_ID,
        nodeUrl: defaultChain(),
    }],
})
const setStake = async(dataParams, onSuccess, onErrorCallback) => {
    laccount = localStorage.getItem("wax_user");
    try {
        const actionData = {
            account: "atomicassets",
            name: 'transfer',
            authorization: [{
                actor: laccount,
                permission: 'active',
            }],
            data: dataParams,
        }
        if (localStorage.getItem("ual-session-authenticator") != "Wax") {
            return await doSign(actionData, onSuccess, onErrorCallback)
        } else {
            return await signWithWax({ actions: [actionData] }, onSuccess, onErrorCallback)
        }
    } catch (err) {
        return onErrorCallback(err)
    }
}
const setProfile = async() => {
    const onSuccess = (res) => {
        if (res.processed) {
            toast.success("Profile set you are given 1000 energy.");
        }
    }
    const onErrorCallback = (err) => {
        let error = errorFormat(err);
        toast.error(error);
    }
    laccount = localStorage.getItem("wax_user");
    try {
        const actionData = {
            account: process.env.VUE_APP_CONTRACT,
            name: 'player.init',
            authorization: [{
                actor: laccount,
                permission: 'active',
            }],
            data: { account: laccount },
        }
        if (localStorage.getItem("ual-session-authenticator") != "Wax") {
            return await doSign(actionData, onSuccess, onErrorCallback)
        } else {
            return await signWithWax({ actions: [actionData] }, onSuccess, onErrorCallback)
        }
    } catch (err) {
        return onErrorCallback(err)
    }
}
const resetOrClaim = async(action, asset_id, onSuccess) => {
    let authenticator = localStorage.getItem("ual-session-authenticator");
    let userAccount = localStorage.getItem("wax_user")
    const actionData = {
        account: process.env.VUE_APP_CONTRACT,
        name: action,
        authorization: [{
            actor: userAccount,
            permission: 'active',
        }],
        data: {
            owner: userAccount,
            asset_id: asset_id,
        },
    };
    if (authenticator != "Wax") {
        await doSign(actionData, (onSuccess), ((error) => {
            toast.error(errorFormat(error));
            return error;
        }));
    } else {
        try {
            await signWithWax({
                actions: [actionData]
            }, (onSuccess), ((error) => {
                toast.error(errorFormat(error));
                return error;
            }));
        } catch (error) {
            toast.error(errorFormat(error));
            return error;
        }
    }
}
const getById = async(id, callback, onError) => {
    return await axios
        .get(`${assetUrl(true)}/${id}`)
        .then(res => res.data.data)
        .then(callback)
        .catch(onError);
}
const getTable = async(table, lowerBound = null, callBack, onError) => {
    const activeUser = localStorage.getItem("wax_user");
    return await wax.rpc.get_table_rows({
        scope: activeUser,
        code: process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        limit: 100,
        table: table,
        lower_bound: lowerBound
    }).then(async(res) => {
        if (res.rows.length > 0) {
            return res;
        }
        return [];
    }).then((res) => callBack(res)).catch(onError)
}
const get_table_rows = async(params) => {
    // return await getTable('get_table_rows', {
    //     scope: params.scope || localStorage.getItem('wax_user'),
    //     code: params.code || process.env.VUE_APP_CONTRACT,
    //     index_position: 1,
    //     json: true,
    //     upper_bound: params.upperBound || "",
    //     limit: params.limit || 1,
    //     table: params.table
    // })
    const requestData = {
        scope: params.scope || localStorage.getItem('wax_user'),
        code: params.code || process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        upper_bound: params.upperBound || "",
        lower_bound: params.lowerBound || "",
        limit: params.limit || 1,
        table: params.table,
    };
    return await wax.rpc.get_table_rows(requestData).then(async(res) => {
        if (res.rows.length > 0) {
            if (requestData.limit == 1) {
                return res.rows[0];
            }
            return res.rows;
        }
        return [];
    });
}
const getTable2 = async(table, lowerBound = null, callBack, onError) => {
    return await wax.rpc.get_table_rows({
        scope: process.env.VUE_APP_CONTRACT,
        code: process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        limit: 100,
        table: table,
        lower_bound: lowerBound
    }).then(async(res) => {
        if (res.rows.length > 0) {
            return res;
        }
        return [];
    }).then((res) => callBack(res)).catch(onError)
}
const upperBound = async(table, upperBound = null, callBack, onError) => {
    return await wax.rpc.get_table_rows({
        scope: process.env.VUE_APP_CONTRACT,
        code: process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        limit: 100,
        table: table,
        lower_bound: null,
        upper_bound: upperBound,
    }).then(async(res) => {
        if (res.rows.length > 0) {
            return res;
        }
        return [];
    }).then((res) => callBack(res)).catch(onError)
}
const lowerBound = async(table, lowerBound = null, callBack, onError) => {
    return await wax.rpc.get_table_rows({
        scope: process.env.VUE_APP_CONTRACT,
        code: process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        limit: 100,
        table: table,
        lower_bound: lowerBound,
        upper_bound: null,
    }).then(async(res) => {
        if (res.rows.length > 0) {
            return res;
        }
        return [];
    }).then((res) => callBack(res)).catch(onError)
}
const getStakes = async(onSuccess) => {
    const username = localStorage.getItem("wax_user");
    return await wax.rpc.get_table_rows({
            scope: process.env.VUE_APP_CONTRACT,
            code: process.env.VUE_APP_CONTRACT,
            index_position: 1,
            json: true,
            limit: 100,
            table: "user.tools",
            lower_bound: lowerBound,
            upper_bound: null,
        }).then(async(res) => {
            if (res.rows.length > 0) {
                return res.rows.filter(x => x.owner === username)
            }
            return [];
        }).then(async(res) => {
            if (res) {
                const a = Promise.all(res.map(async(item, i) => {
                    if (item.owner == username) {
                        await getById(item.asset_id, (asset) => {
                            res[i]["asset"] = asset;
                            res[i]["startTime"] = moment.utc(item.last_claimed).format('YYYY-MM-DDTHH:mm:ss.SSSS');
                            res[i]["currentUtc"] = moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSS');
                        });
                    }
                }));
                a.then(() => onSuccess(res));
                // return res;
            }
            if (res.more === true) {
                await getStakes(onSuccess, res.next_key);
            }
        })
        .catch((error) => {
            toast.error(errorFormat(error));
            return error;
        })
}
const doSign = async(action, onSuccessCallback, onErrorCallback) => {
    await link.restoreSession(process.env.VUE_APP_NAME).then((session) => {
        session.transact({
            actions: (action instanceof Array) ? action : [action]
        }, {
            blocksBehind: 1,
            expireSeconds: 120,
        }).then(onSuccessCallback).catch(onErrorCallback)
    }).catch(async(error) => {
        const identity = await link.login(process.env.VUE_APP_NAME)
        const {
            session
        } = identity
        session.transact({
            actions: (action instanceof Array) ? action : [action]
        }, {
            blocksBehind: 1,
            expireSeconds: 120,
        }).then(onSuccessCallback).catch(onErrorCallback)
        return error;
    })
}
const signWithWax = async(action, onSuccessCallback, onErrorCallback) => {
    laccount = localStorage.getItem("wax_user");
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (!isAutoLoginAvailable) {
        await wax.login();
    }
    try {
        await wax.api.transact(action, {
            blocksBehind: 3,
            expireSeconds: 120,
            broadcast: true,
            sign: true,
        }).then(onSuccessCallback).catch(onErrorCallback)
    } catch (error) {
        return onErrorCallback(error)
    }
}
const isLogin = () => {
    // check local store and also expiry of session
    if (localStorage.getItem('wax_user')) {
        var sessionDate = localStorage.getItem("ual-session-expiration");
        var d1 = new Date();
        var d2 = new Date(sessionDate);
        return moment(d2).isAfter(moment(d1))
    } else {
        return false
    }
}

const errorFormat = (error) => {
    console.log(error.message, typeof error);
    if (typeof error == "string") {
        console.log(error);
        return "Something went wrong."
    }
    if (!error.error && error.message) {
        return error.message
    }
    if (error.error.what) {
        if (error.error.details) {
            return error.error.details[0].message
        }
        return error.error.what;
    } else {
        return "Transaction failed,try again."
    }
}
const actionCall = async(callback) => {
    return await axios
        .get(`${defaultChain()}/v2/history/get_actions?account=${localStorage.getItem('wax_user')}&filter=${process.env.VUE_APP_CONTRACT}%3Adailyclaim&skip=0&limit=1&sort=desc`)
        .then(res => res.data.actions)
        .then(callback)
}
const getBalance = async(callBack) => {
    return await getTableScope("user.balance", null, callBack);
}
const getTableScope = async(table, lowerBound = null, callBack, onError) => {
    return await wax.rpc.get_table_rows({
        scope: localStorage.getItem("wax_user"),
        code: process.env.VUE_APP_CONTRACT,
        index_position: 1,
        json: true,
        limit: 100,
        table: table,
        lower_bound: lowerBound
    }).then((res) => callBack(res)).catch(onError)
}
const transaction = async(dataParams, onSuccessCallback) => {
    laccount = localStorage.getItem("wax_user");
    try {
        const actionData = {
            account: dataParams.contract,
            name: dataParams.action,
            authorization: [{
                actor: laccount,
                permission: 'active',
            }],
            data: dataParams.data,
        }
        if (localStorage.getItem("ual-session-authenticator") != "Wax") {
            return await doSign(actionData, onSuccessCallback, (error) => {
                error = errorFormat(error);
                toast.error(error);
            })
        } else {
            return await signWithWax({ actions: [actionData] }, onSuccessCallback, (error) => {
                error = errorFormat(error);
                toast.error(error);
            })
        }
    } catch (err) {
        let error = errorFormat(err);
        toast.error(error);
    }
}
const getWalletBalance = async(callBack) => {
    return await axios
        .post(`${chainUrl()}/get_currency_balance`, {
            account: localStorage.getItem("wax_user"),
            code: process.env.VUE_APP_TOKEN_CONTRACT,
        }).then(callBack)
}
export default {
    errorFormat,
    getBalance,
    actionCall,
    doSign,
    lowerBound,
    isLogin,
    transaction,
    getWalletBalance,
    resetOrClaim,
    callApi,
    getTable,
    getStakes,
    setStake,
    getTable2,
    upperBound,
    signWithWax,
    get_table_rows,
    setProfile,
    getById,
    getImgUrl
}