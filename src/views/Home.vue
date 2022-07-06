<template>
  <div class="home">
    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <nav class="navbar-expand-lg leftSidebar">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
              @click="leftSideBar = !leftSideBar">
              <i class="fa fa-bars" aria-hidden="true" style="color: #ffffff"></i>
            </button>
            <div class="collapse navbar-collapse" :class="leftSideBar ? 'show' : ''" id="navbarNavDropdown">
              <div class="left-bar text-lg-left text-center">
                <span @click="leftSideBar = !leftSideBar" class="closeSidebar d-inline-block d-lg-none">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
                <h4 class="title">Workers</h4>
                <div class="scrollbar">
                  <WorkerStake v-for="(item, index) in workers" :key="index" :category="item.key" :row="item.value"
                    v-on:refresh="workerReload" />
                </div>
              </div>
            </div>
          </nav>
          <nav class="navbar-expand-lg navbar-light rightSidebar">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
              @click="rightSideBar = !rightSideBar">
              <i class="fa fa-bars" aria-hidden="true" style="color: #ffffff"></i>
            </button>
            <div class="collapse navbar-collapse" :class="rightSideBar ? 'show' : ''" id="navbarNavDropdown">
              <div class="right-bar text-left " v-if="stakeLoaded">
                <span @click="rightSideBar = !rightSideBar" class="closeSidebar d-inline-block d-lg-none">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
                <h4 class="title">Tools</h4>
                <div class="scrollbar" v-if="stakeLoaded">
                  <StakeCard v-for="(item, index) in stakes" :key="index" :row="index" :rec="item"
                    v-on:refresh="dataReload" />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
    <section class="card_section">
      <div class="container text-center">
        <div class="row justify-content-center align-item-center">
          <div class="craft_btn d-inline-block">
            <a href="#" @click="showCraftModal = true">Craft</a>
          </div>
          <h4 class="top-heading mb-4" v-if="info != null">Your inventory</h4>
          <AssetCard v-for="(item, index) in info" :key="index" :row="index" v-on:refresh="dataReload" :rec="item" />
          <h1 v-if="!info" class="text-white text-center">No record found.</h1>
        </div>
      </div>
    </section>
    <CraftModal v-if="showCraftModal" v-on:w-modal-hide-click="showCraftModal = false" />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import { mapGetters } from "vuex";
import AssetCard from "@/components/AssetCard";
import StakeCard from "@/components/StakeCard";
import WorkerStake from "@/components/WorkerStake";
import CraftModal from "@/components/CraftModal";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import ApiService from "@/services";
import moment from "moment";
export default {
  name: "Home",
  components: {
    AssetCard,
    WorkerStake,
    StakeCard,
    Loading,
    CraftModal,
  },
  computed: {
    ...mapGetters(["stakes", "profile", "loaded", "stakeLoaded"]),
  },
  data() {
    return {
      userFilter: null,
      authenticator: null,
      showReadyButton: false,
      info: null,
      apiRes: null,
      workers: null,
      collections: null,
      searchTerm: "All Weapons",
      isLoading: true,
      fullPage: true,
      showCraftModal: false,
      status: false,
      leftSideBar: false,
      rightSideBar: false,
      assetId: "",
      row: {},
      currentTime: 0,
    };
  },
  async created() {
    this.workerReload();
  },
    async mounted() {
      this.init("&schema_name=tools");
      window.setInterval(() => {
        let date = new Date();
        this.currentTime = date.getMinutes() + ":" + date.getSeconds();
      }, 1000);
      setTimeout(() => {
        if (this.profile == null) {
          ApiService.setProfile();
        }
        this.isLoading = false;
      }, 3000);
    },
  methods: {
    async dataReload() {
      this.isLoading = true;
      await this.$store.dispatch("getStakes");
      await this.$store.dispatch("getProfile");
      await this.init("&schema_name=tools");
      setTimeout(() => {
        this.isLoading = false;
      }, 3000);
    },
    async workerReload() {
      this.isLoading = true;
      await this.$store.dispatch("getProfile");
      await this.$store.dispatch("getStakes");
      const worker = await ApiService.get_table_rows({
        table: "workers"
      });
      this.workers = worker.length!==0 ? worker.meta : [];
      if (this.profile && this.profile.pass_id>0){
        this.workers.push({value:[{worker_id:this.profile.pass_id}],key:"pass"});
      }
      var a = Promise.all([]);
      for (let i = 0; i < this.workers.length; i++) {
        const element = this.workers[i];
        a=Promise.all(element.value.map(async (record,r) => {
          const asset = await ApiService.getById(record.worker_id, (res) => {
            return res.data;
          }, (err) => { console.log(err) })
          const future = moment(record.set_at).add(record.duration, "days");
          this.workers[i].value[r].asset = asset
          this.workers[i].value[r].expired = moment().isAfter(future);
          return record.value;
        }));
      }
      a.then(() => {this.isLoading = false; this.$store.commit("stakeLoadedEnded");});
      
    },
    async init(param) {
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
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.inputBox {
  position: relative;
  top: 70px;
}
.home {
  margin-top: 5rem;
}
select:focus {
  outline: none;
  box-shadow: none;
}

.left-bar,
.right-bar {
  height: 100vh;
  box-shadow: 0 -20px 30px rgb(2, 2, 2);
  width: 250px;
}
.left-bar {
  float: left;
  position: fixed;
  left: 0;
  border-right: 2px solid rgb(82, 118, 12);
  top: 80px;
}
.right-bar {
  position: fixed;
  right: 0;
  border-left: 2px solid rgb(82, 118, 12);
  top: 80px;
}
.title {
  text-align: center;
  color: #fff;
  font-weight: bold;
  margin: 10px 0;
  letter-spacing: 1px;
}
.left-bar .large-card {
  display: block !important;
  width: 180px;
}
.left-bar .large-card .img_wrapper {
  height: 148px;
}
.left-bar .scrollbar,.right-bar .scrollbar {
  height: 85%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 30px;
}
</style>
