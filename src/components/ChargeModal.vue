<template>
  <div class="container">
    <loading v-model:active="isLoading" />
    <transition name="modal fade">
      <div class="modal-mask modal-backdrop">
        <div class="">
          <div class="modal-wrapper modal" style="display: block;">
            <div class="modal-dialog modal-dialog-centered text-center" role="document">
              <div class="modal-content modal-xs">
                <h1 class="tm5 modal-title d-inline-block">Charge</h1>
                <a href="JavaScript:void(0)" class="btn-cross text-right close-modal"
                  @click="hideModal($event)">&times;</a>
                <div class="modal-body mdScroll px-5 pb-5">
                  <p v-if="error">{{ error }}</p>
                  <div class="form-group">
                    <input type="text" class="form-control" v-model="reqEnergy" placeholder="Please enter charge value"
                      @input="typeChanged()" />
                  </div>
                  <div class="form-group mt-4">
                    <select id="my-select" class="form-control" name="type" v-model="type"
                      @change="typeChanged($event)">
                        <option value="BZWB">Bun BZWB</option>
                        <option value="BZWP">Patty BZWP</option>
                    </select>
                  </div>
                  <div class="modal-body__btn-container mt-3">
                    <div class="d-flex mb-2">
                      <button class="btn" @click="addToCart(4)"
                        :class="selectedQty==4?'btn-selected':'btn-dark'">25%</button>
                      <button class="btn" @click="addToCart(2)"
                        :class="selectedQty==2?'btn-selected':'btn-dark'">50%</button>
                      <button class="btn" @click="addToCart(1)"
                        :class="selectedQty==1?'btn-selected':'btn-dark'">100%</button>
                    </div>
                    <h3 class="text-success">Cost: <span>{{cost}} {{ type =="BZWP"?"Patty":"Bun"}}</span></h3>
                    <!-- <h5 class="text-info" v-if="bunToken">Balance: {{type=="patty"?bunToken[0].value/10000:pattyToken[0].value/10000}}</h5>
                    <h5 class="text-warning" v-if="bunToken">Balance Leftover: {{type=="patty"?Number(bunToken[0].value/10000)-price:Number(pattyToken[0].value/10000)-price}}</h5> -->
                    <div class="charge_btn">
                      <button class="btn btn-dark d-block" @click="charge()">charge</button>
                    </div>
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
import { mapGetters } from "vuex";
const toast = useToast();
export default {
  name: "ChargeModal",
  components: {
    Loading,
  },
  computed: {
    ...mapGetters(["profile","bunToken","pattyToken"]),
  },
  props: ["error", "showChargeModal"],
  showChargeModal: true,
  data() {
    return {
      currentEnergy: null,
      type: "energy",
      token: false,
      leftBal: 0,
      price: 0,
      selectedQty: 4,
      cost:0,
      multipliedValue:false,
      multipliedPrice:"0",
      reqEnergy:"0",
    };
  },
  mounted() {
    this.currentEnergy = this.profile.energy;
  },
  methods: {
    divideValue(){
     this.multipliedPrice = false;
     this.multipliedValue=true;
    },
    hideModal(e) {
      this.$emit("w-modal-hide-click", e);
    },
    typeChanged(){
      this.cost = this.reqEnergy / 5;
      if (this.type =="BZWP"){
        this.leftBal = (this.pattyToken[0].value / 10000) - this.cost;
      }else{
        this.leftBal = (this.bunToken[0].value / 10000) - this.cost;
      }
    },
    addToCart(val){
      const total = 1000;
      const userAmount = total - Number(this.currentEnergy);
      const requiredAmount = userAmount/val;
      this.reqEnergy = requiredAmount;
      this.cost = this.reqEnergy/5;
      if(this.bunToken && this.pattyToken){
        this.leftBal = this.type == "BZWB" ? (this.bunToken[0].value / 10000) - this.cost : (this.pattyToken[0].value / 10000) - this.cost;
      }

    },
    async charge() {
      // this.price = this.amount/5;
      const data = {
        contract: process.env.VUE_APP_CONTRACT,
        action: "charge",
        data: {
          account: localStorage.getItem("wax_user"),
          cost: Number(this.cost).toFixed(4)+" "+this.type,
        },
      };
      await ApiService.transaction(
        data,
        (res) => {
          if (res.processed) {
            toast.success("Transaction successfull");
            ApiService.getBalance((res) =>
              this.$store.commit("addBalance", res.rows[0])
            );
            this.$store.dispatch("getProfile")
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
  background-color: rgba(0,0,0,0.66);
}
.btn:hover{
  color: #fff !important;
}
.btn-selected{
  color: #fff !important;
}
.btn-selected:hover{
  color: #000 !important;
}
.modal-content{
  background-color: rgba(0,0,0,0.6);
  color: #fff;
}
.modal-body__btn-container .btn{
  margin-right: 10px;
}
.charge_btn{
  display: flex;
  justify-content: center;
}
</style>
