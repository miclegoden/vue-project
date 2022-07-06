<template>
  <div class="text-center">
    <div class="large-card text-center">
      <div class="content-overlay"></div>
      <div class="img_wrapper">
        <a href="JavaScript:void(0)" class="img-position single-pic">
          <div class="img-prev">
            <template v-if="info.asset">
              <img v-show="isImageLoaded" :src="getImgUrl(info.asset.data.img)" alt="{{info.asset.data.name}}"
                @load="loaded" />
              <img v-if="!isImageLoaded" :src="'/images/loader.gif'" />
            </template>
          </div>
        </a>
      </div>
      <div class="content-wrapper">
        <div class="d-flex justify-content-between">
          <div class="content-text">
            <h3 class="title my-1">{{ info.asset.data.name }}</h3>
            <h3 class="title my-1">{{ info.asset.data.rarity }}</h3>
          </div>
          <div class="content-text">
            <h3 class="title text-right my-1">
              {{ info.durability - info.durability_used }}/{{ info.durability }}
            </h3>
            <h3 class="title my-1 text-right">Energy:{{ info.energy }}</h3>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <h3 class="title my-1 text-success">Reward : {{ info.reward }}</h3>
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn text-center mx-1 my-2 w-100" @click="repair(info.asset_id)">
            repair
          </button>
        </div>
        <div class="d-flex justify-content-between">
          <button class="btn text-center mx-1 my-2 btn-success w-100" @click.prevent="claim(info)"
            v-if="isEnoughDurability(info)">
            Claim (+{{ claimTimes() }})
          </button>
        </div>
        <Countdown :deadline="timeLeft(info.last_claimed)" countdownSize="0.4rem" labelSize="0.3rem" :showDays=false
          :showLabels="false" :mainColor="`#fff`" :flipAnimation="false" :showHours=true />
        <div class="d-flex justify-content-between">
          <button class="btn text-center mx-1 my-2 w-100" @click.prevent="reset(info)" v-if="isEnoughDurability(info)">
            Unset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services";
import moment from "moment";
import { useToast } from "vue-toastification";
import { Countdown } from "vue3-flip-countdown";
const toast = useToast();
export default {
  name: "StakeCard",
  props: ["rec", "row"],
  data() {
    return {
      isImageLoaded: false,
      showReadyButton: false,
      counter: "0",
      endTime: "",
      winningToken: 0,
      hoursLeft: 1,
      stakeOver: false,
    };
  },
  components: {
    Countdown,
  },
  computed: {
    info: function () {
      return this.rec;
    },
  },
  async mounted() {
    this.endTime = moment(this.info.last_claimed)
      .add(1, "hours")
      .format("YYYY-MM-DDTHH:mm:ss.SSSS");
    this.hoursLeft = Math.ceil(
      moment
        .duration(moment(this.endTime).diff(moment(this.info.currentUtc)))
        .asHours()
    );
    if (this.stakeOver) {
      clearInterval(this.countDown);
    }
  },
  methods: {
    timeLeft(last_claimed){
      this.hoursLeft = Math.ceil(
        moment
          .duration(moment(this.endTime).diff(moment(this.info.currentUtc)))
          .asHours()
      );
      const date = new Date();
      const offset = Math.abs(date.getTimezoneOffset()/60);
      console.log(moment(last_claimed).add(offset + 1, "hours")
        .format("YYYY-MM-DD HH:mm:ss"));
      return moment(last_claimed).add(offset+1, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
    },
    ispositive(n){
      return 1 / (n * 0) === 1 / 0
    },
    getImgUrl(pet, isVid) {
      return ApiService.getImgUrl(pet, isVid);
    },
    isEnoughDurability(info){
      const requiredDurability = Number(info.durability_used) + Number(info.durability_usage);
      return info.durability >= requiredDurability;
    },
    loaded() {
      this.isImageLoaded = true;
    },
    claimTimes(){
      if (this.hoursLeft>0){
        return 0;
      }
      return Number(Math.abs(this.hoursLeft) + 1) > 9 ? 9 : Number(Math.abs(this.hoursLeft) + 1)
    },
    async claim() {
      this.hoursLeft = Math.ceil(
        moment
          .duration(moment(this.endTime).diff(moment(this.info.currentUtc)))
          .asHours()
      );
      await ApiService.resetOrClaim(
        "claim",
        this.info.asset_id,
        (res) => {
          if (res.processed) {
            toast.success("Reward claimed");
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
    async reset() {
      await ApiService.resetOrClaim(
        "unset.tool",
        this.info.asset_id,
        (res) => {
          if (res.processed) {
            toast.success("Tool unset, refreshing...");
            setTimeout(() => {
              this.$emit("refresh");
            }, 3000);
          }
        },
        (error) => {
          this.error = ApiService.errorFormat(error);
          toast.error(this.error);
        }
      );
    },
    async repair(id){
      const data = {
        contract: process.env.VUE_APP_CONTRACT,
        action: "repair.tool",
        data: {
          owner: localStorage.getItem("wax_user"),
          tool_id: id,
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
    }
  },
};
</script>

<style>
.content {
  height: 70%;
}
.select-card {
  width: 250px;
  position: absolute;
}
.rowBlock {
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: -1px 8px 19px 4px rgb(222 215 215 / 30%);
  padding: 10px;
}

.imgBlock {
  height: 100px;
}
.rowBlock .imgBlock img {
  height: 100%;
}
.txtBlock h1,
h5,
.timeBlock h2 {
  color: #fff;
  text-align: center;
}
.txtBlock h1 {
  font-size: 30px;
}
.btn {
  width: 150px;
  letter-spacing: 1px;
  font-weight: bold;
  transition: all 0.4s;
  border: 2px solid #fff !important;
}
.btn:hover {
  background: white;
  color: black !important;
  transform: translateY(-4px);
  box-shadow: 10px 15px 20px rgba(0, 0, 0, 0.7);
}
.btn-cancel {
  border-radius: 4px;
  color: #fff !important;
}
</style>
