import { createStore } from 'vuex'
import ApiService from "../services"
export default createStore({
    state: {
        stakes: null,
        stakePower: null,
        profile: null,
        loaded: false,
        stakeLoaded: false,
        balance: 0
    },
    actions: {
        getProfile: function({ commit }) {
            commit("loadingStart");
            ApiService.getTable("user.profile", null, async(row) => {
                if (row) {
                    commit("setProfile", row.rows[0]);
                    commit("loadingEnd");
                }
            }, null)
        },
        getStakes: function({ commit }) {
            ApiService.getStakes(async(row) => {
                if (row) {
                    commit("addStake", row);
                }
            })
        },
        getBalance: function({ commit }) {
            ApiService.getBalance((res) =>
                commit("addBalance", res.data[0])
            );
        },
    },
    mutations: {
        setProfile: (state, payload) => {
            if (payload) {
                state.profile = payload;
                return state.profile;
            }
        },
        addStake: (state, payload) => {
            if (payload) {
                state.stakes = payload;
                // state.stakeLoaded = true;
                return state.stakes;
            }
        },
        addBalance(state, val) {
            if (val) {
                // val = parseFloat(val.toString());
                state.balance = val
            }
        },
        loadingStart(state) {
            state.loaded = false;
        },
        loadingEnd(state) {
            state.loaded = true;
        },
        stakeLoadedEnded(state) {
            state.stakeLoaded = true;
        },
    },
    // getters: {
    //     stakePower: state => state.stakePower,
    //     stakes: state => state.stakes,
    //     profile: state => state.profile,
    //     loaded: state => state.loaded,
    //     stakeLoaded: state => state.stakeLoaded,
    //     balance: state => {
    //         if (state.balance) {
    //             let numberVal = state.balance
    //             return new Intl.NumberFormat().format(numberVal)
    //         }
    //         return 0;
    //     },
    //     bunToken: state => {
    //         if (state.balance) {
    //             var found = state.balance.find(function(element) {
    //                 return element.includes("BZWB")
    //             });
    //             if (found !== undefined) {
    //                 const numberVal = parseFloat(found.toString());
    //                 return new Intl.NumberFormat().format(numberVal)
    //             } else {
    //                 return 0;
    //             }
    //         }
    //         return 0;
    //     },
    //     pattyToken: state => {
    //         if (state.balance) {
    //             var found = state.balance.find(function(element) {
    //                 return element.includes("BZWP")
    //             });
    //             if (found !== undefined) {
    //                 const numberVal = parseFloat(found.toString());
    //                 return new Intl.NumberFormat().format(numberVal)
    //             } else {
    //                 return 0;
    //             }
    //         }
    //         return 0;
    //     },
    //     coinToken: state => {
    //         if (state.balance) {
    //             var found = state.balance.find(function(element) {
    //                 return element.includes("BZWC")
    //             });
    //             if (found !== undefined) {
    //                 const numberVal = parseFloat(found.toString());
    //                 return new Intl.NumberFormat().format(numberVal)
    //             } else {
    //                 return 0;
    //             }
    //         }
    //         return 0;
    //     },
    // }
    getters: {
        balance: state => {
            if (state.balance) {
                return state.balance.balances;
                // return new Intl.NumberFormat().format(numberVal)
            }
            return 0;
        },
        bunToken: state => {
            if (state.balance) {
                let numberVal = state.balance.balances;
                return numberVal.filter((row) => row.key == "4,BZWB");
            }
            return 0;
        },
        pattyToken: state => {
            if (state.balance) {
                let numberVal = state.balance.balances;
                return numberVal.filter((row) => row.key == "4,BZWP");
            }
            return 0;
        },
        coinToken: state => {
            if (state.balance) {
                let numberVal = state.balance.balances;
                return numberVal.filter((row) => row.key == "4,BZWC");
            }
            return 0;
        },
        level: state => state.level,
        tokenPrice: state => {
            if (state.tokenPrice) {
                let numberVal = state.tokenPrice
                return parseFloat(numberVal)
            }
            return 0;
        },
        myAssets: state => {
            if (state.myAssets) {
                return state.myAssets.filter((row) => row.data.type == state.profile.my_token);
            }
            return [];
        },
        stakePower: state => state.stakePower,
        stakes: state => state.stakes,
        profile: state => state.profile,
        loaded: state => state.loaded,
        stakeLoaded: state => state.stakeLoaded,
    }
})