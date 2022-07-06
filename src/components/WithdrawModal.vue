<template>
  <div class="container">
    <loading v-model:active="isLoading" />
    <transition name="modal fade">
      <div class="modal-mask modal-backdrop">
        <div class="">
          <div class="modal-wrapper modal" style="display: block;">
            <div class="modal-dialog modal-dialog-centered text-center" role="document">
              <div class="modal-content modal-xs">
                <h1 class="tm5 modal-title d-inline-block">Withdraw Amount</h1>
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
                      <input
                        type="text"
                        class="form-control"
                        v-model="amount"
                        placeholder="Please enter withdraw amount, e.g 1"
                      />
                    </div>
                    <div class="form-group mb-4">
                      <select
                        id="my-select"
                        class="form-control"
                        name="type"
                        v-model="symbol"
                        @change="symbolChanged($event)"
                      >
                          <option value="BZWC" selected>Coins BZWC</option>
                          <option value="BZWP">Patty BZWP</option>
                          <option value="BZWB">Bun BZWB</option>
                      </select>
                    </div>
                    <div class="modal-body__btn-container my-3">
                      <div class="d-flex">
                        <button
                          class="btn"
                          @click="addToCart(4)"
                          :class="
                            selectedQty == 4 ? 'btn-selected' : 'btn-dark'
                          "
                        >
                          25%
                        </button>
                        <button
                          class="btn"
                          @click="addToCart(2)"
                          :class="
                            selectedQty == 2 ? 'btn-selected' : 'btn-dark'
                          "
                        >
                          50%
                        </button>
                        <button
                          class="btn"
                          @click="addToCart(1)"
                          :class="
                            selectedQty == 1 ? 'btn-selected' : 'btn-dark'
                          "
                        >
                          100%
                        </button>
                      </div>
                    </div>
                    <div class="help-block text-danger" v-if="profile.pass_id>0">
                      Withdraw Fee 5%
                    </div>
                    <div class="help-block text-danger" v-else>
                      Withdraw Fee 8%
                    </div>
                    <button class="btn btn-dark mt-3" @click="transfer()">
                      Withdraw
                    </button>
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
import { mapGetters } from "vuex";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  name: "WithdrawModal",
  components: {
    Loading,
  },
  computed: {
    ...mapGetters(["balance", "coinToken", "pattyToken", "bunToken","profile"]),
  },

  props: ["error", "showWModal"],
  showModal: true,
  data() {
    return {
      amount: null,
      token: false,
      symbol: "BZWC",
      type: null,
      selectedQty: 4,
    };
  },

  methods: {
    hideModal(e) {
      this.$emit("w-modal-hide-click", e);
    },
    symbolChanged() {
      if (this.amount) {
        let total = 0;
        if (this.symbol == "BZWC") {
          total = this.coinToken[0].value / 10000;
        } else if (this.symbol == "BZWB") {
          total = this.bunToken[0].value / 10000;
        } else if (this.symbol == "BZWP") {
          total = this.pattyToken[0].value / 10000;
        }
        const requiredAmount = total / this.selectedQty;
        this.amount = requiredAmount;
      }
    },
    addToCart(val) {
      let total = 0;
      if (this.symbol == "BZWC") {
        total = this.coinToken[0].value / 10000;
      } else if (this.symbol == "BZWB") {
        total = this.bunToken[0].value / 10000;
      } else if (this.symbol == "BZWP") {
        total = this.pattyToken[0].value / 10000;
      }
      this.selectedQty = val;
      const requiredAmount = total / val;
      this.amount = requiredAmount;
    },

    async transfer() {
      if (!this.symbol || !this.amount) {
        toast.error("Please select amount and token type.");
        return;
      }
      const data = {
        contract: process.env.VUE_APP_CONTRACT,
        action: "withdraw",
        data: {
          account: localStorage.getItem("wax_user"),
          token: Number(this.amount).toFixed(4) + " " + this.symbol,
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
</style>
