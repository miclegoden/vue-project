<template>
  <div class="container">
    <loading v-model:active="isLoading" />
    <transition name="modal fade">
      <div class="modal-mask modal-backdrop">
        <div class="">
          <div class="modal-wrapper modal" style="display: block">
            <div
              class="modal-dialog modal-dialog-centered text-center"
              role="document"
            >
              <div class="modal-content">
                <h1 class="tm5 modal-title d-inline-block">Set Worker</h1>
                <a
                  href="JavaScript:void(0)"
                  class="btn-cross text-right close-modal"
                  @click="hideModal($event)"
                  >&times;</a
                >
                <div class="modal-body mdScroll">
                  <p v-if="error">{{ error }}</p>
                  <div class="scrollbar px-5 py-3">
                    <div class="row">
                      <WorkerCard v-for="(item, index) in info" :key="index" :row="index" v-on:refresh="dataReload"
                        :rec="item" />
                      <h1 v-if="!info" class="text-white text-center">No record found.</h1>
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
import WorkerCard from "@/components/WorkerCard";
import "vue-loading-overlay/dist/vue-loading.css";
import ApiService from "../services";
// import VueLoadImage from "vue-load-image";
import "vue-loading-overlay/dist/vue-loading.css";
import { useToast } from "vue-toastification";
import axios from "axios";
import { mapGetters } from "vuex";
const toast = useToast();
export default {
  name: "ChargeModal",
  components: {
    Loading,
    WorkerCard,
  },
  computed: {
    ...mapGetters(["profile", "bunToken", "pattyToken"]),
  },
  props: ["error", "showChargeModal"],
  showChargeModal: true,
  data() {
    return {
      info: [],
      apiRes: [],
    };
  },
  mounted() {
    this.init(`&schema_name=worker,pass`);
  },
  methods: {
    hideModal(e) {
      this.$emit("w-modal-hide-click", e);
    },
    init(param) {
      axios
        .get(
          `${process.env.VUE_APP_API_ASSET_URL}?owner=${localStorage.getItem(
            "wax_user"
          )}&collection_name=burgerzworld&page=1&limit=100${param}`
        )
        .then((response) => {
          let res = response["data"];
          if (res["success"]) {
            this.apiRes = res["data"];
            this.info = res["data"];
          } else {
            this.info = [];
          }
          // this.isLoading = false;
        });
    },
    async charge() {
      // this.price = this.amount/5;
      const data = {
        contract: process.env.VUE_APP_CONTRACT,
        action: "charge",
        data: {
          account: localStorage.getItem("wax_user"),
          cost: this.cost + " " + this.type,
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
            this.$store.dispatch("getProfile");
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

.close-modal {
  font-size: 26px !important;
  position: absolute;
  top: 7px;
  right: 20px;
  color: #ffffff;
  z-index: 1;
}
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.66);
}
.modal-dialog {
  max-width: 100%;
  width: 750px;
}
.modal-body .scrollbar {
  overflow-y: scroll;
  height: 400px;
}
.btn:hover {
  color: #fff !important;
}
.btn-selected {
  color: #fff !important;
}
.btn-selected:hover {
  color: #000 !important;
}
.modal-content {
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
}
.modal-body__btn-container .btn {
  margin-right: 10px;
}
.charge_btn {
  display: flex;
  justify-content: center;
}
</style>
