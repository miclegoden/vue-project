import {
    UALJs
} from "ual-plainjs-renderer";
import {
    Anchor
} from "ual-anchor";
import {
    Wax
} from "@eosdacio/ual-wax";
// import { Wombat } from 'wombat-ual'
// // login functio
// var ual = null
/*global UAL:writable,loggedInUser:writable*/
/*eslint no-undef: "error"*/
export default class LoginService {
    constructor() {
        this.chain = {
            chainId: process.env.VUE_APP_CHAIN_ID,
            rpcEndpoints: [{
                protocol: "https",
                host: process.env.VUE_APP_CHAIN_URL,
                port: '443',
            }, ],
        };

        this.appName = process.env.VUE_APP_NAME;
        this.wax = new Wax([this.chain], {
            appName: this.appName
        });
        this.anchor = new Anchor([this.chain], {
            appName: this.appName
        });
        // this.wombat = new Wombat([this.chain], { appName: this.appName })
        UAL = new UALJs(this.loginCallBack, [this.chain], this.appName, [this.wax, this.anchor]);
        this.handle_login();
    }
    setUal(myAppRoot) {
        UAL = new UALJs(this.loginCallBack, [this.chain], this.appName, [this.wax, this.anchor], myAppRoot);
    }
    loginCallBack(users) {
        loggedInUser = users[0];
        if (loggedInUser.session) {
            localStorage.setItem("session-authenticator", "Anchor")
        } else {
            localStorage.setItem("session-authenticator", "Wax")
        }
        localStorage.setItem('wax_user', loggedInUser.accountName)
        localStorage.setItem(UALJs.SESSION_ACCOUNT_NAME_KEY, loggedInUser.accountName)
        window.location.href = '/dashboard'
    }
    handle_login() {

        //auth partners
        // login component load to HTML
        const myAppRoot = {
            containerElement: document.getElementById('ual-div')
        }

        // validate authentication
        this.setUal(myAppRoot);
        (async() => {
            await UAL.init();
        })()

        // hide UAL button load from liabary after click
        // const [buttonUAL] = document.body.getElementsByClassName('ual-button-gen');
        // buttonUAL.click();
        // var popups = document.getElementsByClassName('ual-button-gen'),
        //     i = popups.length;
        // if (i) {
        //     try {
        //         do {
        //             i--;
        //             if (popups)
        //                 popups[i].remove();
        //         } while (i >= 0)
        //     } catch (error) {
        //         console.warn(error)
        //     }
        // }
        return UAL
    }
    getSession() {
        // validate authentication
        const auth = UAL.getAuthenticators()
        UAL.attemptSessionLogin(auth.availableAuthenticators);
        return UAL
    }
    getLoginUser() {
        const activeUser = localStorage.getItem("wax_user");
        if (UAL) {
            if (localStorage.getItem("session-authenticator") == "Wax") {
                UAL.loginUser(this.wax)
            } else {
                UAL.loginUser(this.anchor, activeUser)
            }
            return UAL
        }
        return UAL
    }
    sessionLogin() {
        const authenticators = UAL.getAuthenticators();
        const authenticatorName = localStorage.getItem(UALJs.SESSION_AUTHENTICATOR_KEY);
        const sessionAuthenticator = authenticators.availableAuthenticators.find((authenticator) => authenticator.constructor.name === authenticatorName);
        const accountName = localStorage.getItem("wax_user") || undefined;
        UAL.loginUser(sessionAuthenticator, accountName).then(res => console.log(res));
    }

}