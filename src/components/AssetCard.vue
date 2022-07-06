<template>
  <div class="col-lg-3 col-md-4 my-4 m">
    <div class="large-card text-center">
      <div class="content-overlay"></div>
      <div class="img_wrapper" :class="{ selected: info.selected }">
        <template v-if="'img' in info.data">
          <a href="JavaScript:void(0)" class="img-position single-pic">
            <div class="img-prev">
              <img
                v-show="isImageLoaded"
                :src="getImgUrl(info.data.img)"
                @load="loaded"
              />
            </div>
            <div class="img-prev" v-if="!isImageLoaded">
              <img :src="'/images/loader.gif'" @load="loaded" />
            </div>
          </a>
        </template>
      </div>
      <div class="content-wrapper">
        <h3 class="title my-1 text-truncate">{{ info.data.name }}</h3>
        <h4 class="title text-warning">{{ info.data.grade }}</h4>
        <span class="asset-price text-success">{{ info.data.rarity }}</span>
        <button
          class="btn btn-block w-100 text-center my-2"
          @click.prevent="setTool(info)"
        >
          Set
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services";
import { useToast } from "vue-toastification";
const toast = useToast();
export default {
  name: "AssetCard",
  props: ["rec", "row", "power"],
  data() {
    return {
      isImageLoaded: false,
      showReadyButton: false,
    };
  },
  computed: {
    info: function () {
      return this.rec;
    },
  },
  methods: {
    getImgUrl(pet, isVid) {
      return ApiService.getImgUrl(pet, isVid);
    },
    loaded() {
      this.isImageLoaded = true;
    },
    async setTool(rec) {
      const data = {
        from: localStorage.getItem("wax_user"),
        to: process.env.VUE_APP_CONTRACT,
        asset_ids: [rec.asset_id],
        memo: `tool:stake`,
      };
      await ApiService.setStake(
        data,
        (res) => {
          if (res.processed) {
            toast.success("Stake has been made.");
            setTimeout(() => {
              this.$emit("refresh");
            }, 2000);
          }
        },
        (error) => {
          this.error = ApiService.errorFormat(error);
          toast.error(this.error);
        }
      );
    },
  },
};
</script>

<style scope>
a {
  text-decoration: none !important;
}
.card {
  box-shadow: -1px 8px 19px 4px rgba(0, 0, 0, 0.3);
}
.select-btn {
  border: 1px solid gray;
  width: 100px;
  text-align: center;
  height: 36px;
  margin: 0 auto;
  font-size: 20px;
  color: #fff;
  border-radius: 10px;
  line-height: 30px;
}
</style>
