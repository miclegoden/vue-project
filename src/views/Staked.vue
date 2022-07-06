<template>
  <div class="home">
    <section class="card_sections">
      <div class="container">
        <loading
          v-model:active="isLoading"
          :can-cancel="true"
          :is-full-page="true"
        />
        <div
          class="row justify-content-center align-items-center"
          v-if="!isLoading"
        >
          <h4 class="top-heading">Oasis Rewards</h4>
           <button
                class="btn btn-cancel pulse xs-btn"
                @click.prevent="claimAll()"
                v-show="actionData.length"
              >
                Claim All
              </button>
          <StakeCard
            v-for="(item, index) in stakes"
            :key="index"
            :row="index"
            :rec="item"
            v-on:refresh="dataReload"
          />
          <h1 v-if="stakes == null" class="text-center text-white">
            No stake found.
          </h1>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import router from "@/router";
import ApiService from "@/services";
import { mapState } from "vuex";
import StakeCard from "@/components/StakeCard";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import moment from "moment";
export default {
  name: "staked",
  components: {
    StakeCard,
    Loading,
  },
  data() {
    return {
      countryStrokeColor: "#fa0909",
      legendBorderRadius: 1,
      showReadyButton: false,
      isLoading: true,
      actionData: [],
      authenticator: null,
    };
  },
  computed: mapState(["stakes"]),
  async created() {
    await this.dataReload();
  },
  mounted() {
    if (!localStorage.getItem("wax_user")) {
      router.push("/login");
    }
    this.authenticator = localStorage.getItem("ual-session-authenticator");
    if(this.isLoading == false){
      console.log(this.actionData);
    }
  },
  methods: {
    getImgUrl(pet, isVid) {
      return ApiService.getImgUrl(pet, isVid);
    },
    async dataReload() {
      this.isLoading = true;
      await ApiService.getStake((row) => {
        this.$store.commit("addStake", row);
        setTimeout(() => {
          this.isLoading = false;
          const laccount = localStorage.getItem("wax_user");
          for (let i = 0; i < this.stakes.length; i++) {
            const row = this.stakes[i];
            const lastClaim = row.last_claimed;
            const claimTimeLeft = moment(lastClaim).add(6, 'hours');
            const startTime = Math.ceil(moment.duration(moment(claimTimeLeft).diff(moment(moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSS')))).asHours());
            if(!Object.is(Math.abs(startTime), +startTime) || startTime==0){
                this.actionData.push({
                    account: process.env.VUE_APP_CONTRACT,
                    name: 'claim',
                    authorization: [{
                        actor: laccount,
                        permission: 'active',
                    }],
                    data: {
                        owner: laccount,
                        asset_id: row.asset_id,
                    },
                });
            }
          }
        }, 2500);
      });
    },
    async claimAll(){
      if(this.actionData.length==0)return;
       if (localStorage.getItem("ual-session-authenticator") != "Wax") {
            return await ApiService.doSign(this.actionData, (res)=>{
              if(res.processed.id){
                this.actionData=[];
                this.dataReload();
              }
            }, ApiService.defaultErrorCallback)
        } else {
            return await ApiService.signWithWax({ actions: this.actionData }, (res)=>{
              if(res.processed.id){
                this.actionData=[];
                this.dataReload();
              }
            }, ApiService.defaultErrorCallback)
        }
    }
  },
};
</script>
<style scoped>
.content {
  height: 70%;
}
.nft {
  width: 120px;
}
.select-card {
  width: 250px;
  position: absolute;
}
.text-white {
  color: #fff;
}
.xs-btn{
  width: 150px;
  margin-bottom: 20px;
}
</style>