<template>
  <div class="container">
    <loading v-model:active="isLoading" />
    <transition name="modal fade">
      <div class="modal-mask modal-backdrop">
        <div class="">
          <div class="modal-wrapper modal" style="display: block;">
            <div class="modal-dialog modal-dialog-centered text-center" role="document">
              <div class="modal-content modal-xs">
                <h1 class="tm5 modal-title d-inline-block">Deposit Amount</h1>
                <a
                  href="JavaScript:void(0)"
                  class="btn-cross text-right close-modal"
                  @click="hideModal($event)"
                  >&times;</a
                >
                <div class="modal-body mdScroll px-5 pb-5">
                  <p v-if="error">{{ error }}</p>
                  <div class="text-center"></div>
                  <div class="row">
                    <div class="form-group mb-4">
                      <input type="number" class="form-control" v-model="amount" placeholder="Please enter deposit amount, e.g 1">
                    </div>
                    <div class="form-group mb-4">
                        <select id="my-select" class="form-control" name="type" v-model="symbol">
                            <option value="BZWC" selected>Coins BZWC</option>
                            <option value="BZWP">Patty BZWP</option>
                            <option value="BZWB">Bun BZWB</option>
                        </select>
                    </div>
                   <template v-if="!loading && walletBalance.length>0">
                     <div v-for="(bal, i) in walletBalance" :key="i">
                      <span class="help-block" :class="(bal.replace(/[\d\., ]/g, '')).toLowerCase()">Wallet Balance: {{bal}}</span>
                     </div>
                   </template>
                  <button class="btn btn-dark mt-4" @click="transfer()">Deposit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import ApiService from "../services";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import ApiService from "../services";
// import VueLoadImage from "vue-load-image";
import "vue-loading-overlay/dist/vue-loading.css";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  name: "DepositModal",
  components: {
    Loading,
  },
  props: ["error", "showModel"],
  showModal: true,
  data() {
    return {
      amount: null,
      token: false,
      loading:true,
      symbol: "BZWC",
      walletBalance:null
    };
  },
  mounted() {
    this.getBal();
  },
  methods: {
    hideModal(e) {
      this.$emit("w-modal-hide-click", e);
    },
    getBal(){
    ApiService.getWalletBalance((response)=>{
      this.loading=false
      this.walletBalance=response.data;
    });
    },
    async transfer() {
      const data = {
        contract:"burgerztoken",
        action:"transfer",
        data:{
            from: localStorage.getItem("wax_user"),
            quantity: Number(this.amount).toFixed(4)+" "+this.symbol,
            to:process.env.VUE_APP_CONTRACT,
            memo:"deposit:coins"
          }
        };
      await ApiService.transaction(
        data,
        (res) => {
          if (res.processed) {
            toast.success("Transaction successfull");
            ApiService.getBalance((res) =>{
              this.$store.commit("addBalance", res.rows[0])
              this.getBal();
            });
          }
        },
        (error) => {
          toast.error(ApiService.errorFormat(error));
        }
      );
    },
  },
};
</script>

<style scoped>
.progress-cont .progress__bar {
  height: 9px !important;
}
.close-modal{
  font-size: 26px !important;
  position: absolute;
  top: 7px;
  right: 20px;
  color: #ffffff;
  z-index: 1;
}
.modal-backdrop{
  background-color: rgba(0,0,0,0.6);
}
.btn:hover{
  color: #fff !important;
}
.selected:hover{
  color: #000 !important;
}
.modal-content{
  background-color: rgba(0,0,0,0.66);
  color: #fff;
}
/*.modal-body__btn-container .btn{
  margin-right: 10px;
}*/
</style>
