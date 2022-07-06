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
                <h1 class="tm5 modal-title d-inline-block">Craft</h1>
                <a
                  href="JavaScript:void(0)"
                  class="btn-cross text-right close-modal"
                  @click="hideModal($event)"
                  >&times;</a
                >
                <div class="modal-body">
                  <div class="row">
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/bunstoppable.webp" class="img-fluid">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">10500</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">16300</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">4800</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511455')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/bunderful.webp" class="img-fluid">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">2600</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">5300</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">1700</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511454')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/bunOven.webp" class="img-fluid">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">1060</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">1600</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">540</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511453')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/pat3000.webp" class="img-fluid" alt="pat3000">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">10500</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">16300</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">4800</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511458')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/pattylicious.webp" class="img-fluid" alt="pattylicious">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">2600</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">5300</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">1700</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511457')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/pattyo.webp" class="img-fluid" alt="pattyo">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">1060</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">1600</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">540</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511456')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/minter.webp" class="img-fluid" alt="minter">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">9500</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">19000</div>
                            <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">9500</div>
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('511459')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/master.webp" class="img-fluid" alt="minter">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">3500</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">3500</div>
                            <!-- <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">9500</div> -->
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('499632')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/sous.webp" class="img-fluid" alt="minter">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">2200</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">2200</div>
                            <!-- <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">9500</div> -->
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('499630')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/demi.webp" class="img-fluid" alt="minter">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">1400</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">1400</div>
                            <!-- <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">9500</div> -->
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('499629')"> Craft </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 mb-4">
                      <div class="large-card text-center">
                        <div class="content-overlay"></div>
                        <div class="img_wrapper">
                          <a href="JavaScript:void(0)" class="img-position single-pic">
                            <div class="img-prev">
                              <img src="images/intern.webp" class="img-fluid" alt="minter">
                            </div>
                          </a>
                        </div>
                        <div class="content-wrapper coins_details">
                          <div class="title my-1 text-center d-inline-block">
                            <div class="coin_detail"><img src="images/bun-token.png" alt="coins" class="img-fluid">600</div>
                            <div class="coin_detail"><img src="images/patty-token.png" alt="coins" class="img-fluid">600</div>
                            <!-- <div class="coin_detail"><img src="images/coin-token.png" alt="coins" class="img-fluid">9500</div> -->
                          </div>
                          <button class="btn btn-block w-100 text-center my-2" @click="craft('499604')"> Craft </button>
                        </div>
                      </div>
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
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import ApiService from "../services";
// import VueLoadImage from "vue-load-image";
// import "vue-loading-overlay/dist/vue-loading.css";
import { useToast } from "vue-toastification";
// import axios from "axios";
// import { mapGetters } from "vuex";
const toast = useToast();
export default {
  name: "ChargeModal",
  components: {
    Loading,
  },
  data() {
    return {
      // info: [],
      // apiRes: [],
    };
  },
  methods: {
    hideModal(e) {
      this.$emit("w-modal-hide-click", e);
    },
    async craft(templateId){
      const data = {
        contract: process.env.VUE_APP_CONTRACT,
        action: "craft.tool",
        data: {
          account: localStorage.getItem("wax_user"),
          template_id: templateId,
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
    }
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
.btn:hover {
  background: white;
  color: black !important;
  transform: translateY(-4px);
  box-shadow: 10px 15px 20px rgb(0 0 0 / 70%);
}
.coins_details{
  padding: 0px 5px;
}
.coin_detail img {
  width: 22px;
}
.coin_detail {
  float: left;
  font-size: 14px;
}
</style>
