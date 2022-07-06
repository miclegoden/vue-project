<template>
  <ul class="navbar-nav mr-auto" :class="`${isOpen ? 'show' : ''}`" v-if="!loader">
    <li class="nav-item mt-2">
      <div class="d-flex align-items-center" v-if="balance && coinToken !== 0">
        <img src="/images/coin-token.png" class="nav-item__img" />:
        <strong>{{ formatToken(coinToken) }} Coins</strong>
      </div>
      <div class="d-flex align-items-center" v-else>
        <img src="/images/coin-token.png" class="nav-item__img" />:
        <strong>0 Coins</strong>
      </div>
    </li>
    <li class="nav-item mt-2">
      <div class="d-flex align-items-center" v-if="balance && bunToken!==0">
        <img src="/images/bun-token.png" class="nav-item__img" />:
        <strong>{{ formatToken(bunToken) }} Bun</strong>
      </div>
      <div class="d-flex align-items-center" v-else>
        <img src="/images/bun-token.png" class="nav-item__img" />:
        <strong>0 Bun</strong>
      </div>
    </li>
    <li class="nav-item mt-2">
      <div class="d-flex align-items-center" v-if="balance && pattyToken !== 0">
        <img src="/images/patty-token.png" class="nav-item__img" />:
        <strong>{{ formatToken(pattyToken) }} Patty</strong>
      </div>
      <div class="d-flex align-items-center" v-else>
        <img src="/images/patty-token.png" class="nav-item__img" />:
        <strong>0 Patty</strong>
      </div>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" @click="optionDropdown(isOpen)" href="#" id="navbarDropdown" role="button"
        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{ logUser }} <i class="fa fa-user-circle-o" aria-hidden="true"></i>
      </a>
      <div class="dropdown-menu" :class="`${isOpen ? 'show' : ''}`" aria-labelledby="navbarDropdown">
        <a href="#" class="dropdown-item" @click="showWModal = true">Withdraw</a>
        <a href="#" class="dropdown-item" @click="showModal = true">Deposit</a>
        <a href="#" class="dropdown-item" @click="showChargeModal = true">Charge</a>
        <a class="dropdown-item" href="/login">logout</a>
      </div>
    </li>
  </ul>
  <DepositModal v-if="showModal" v-on:w-modal-hide-click="showModal = false" />
  <WithdrawModal v-if="showWModal" v-on:w-modal-hide-click="showWModal = false" />
  <ChargeModal v-if="showChargeModal" v-on:w-modal-hide-click="showChargeModal = false" />
</template>

<script>
// import router from "../router";
import { mapGetters } from "vuex";
import DepositModal from "@/components/DepositModal";
import WithdrawModal from "@/components/WithdrawModal";
import ChargeModal from "@/components/ChargeModal";
import ApiService from "@/services"
export default {
  name: "dropdown",
  components:{
    WithdrawModal,
    DepositModal,
    ChargeModal,
  },
  computed: {
    ...mapGetters(["balance","bunToken","coinToken","pattyToken"]),
  },
  data() {
    return {
      isOpen: false,
      showItem: "",
      showModal: false,
      showWModal: false,
      loader:true,
      showChargeModal: false,
    };
  },
  props: {
    logUser: {
      required: true,
    },
  },
  async created() {
    await ApiService.getBalance((res) =>{
      this.$store.commit("addBalance", res.rows[0])
      this.loader = false;
    });
  },
  // mounted(){
  //   console.log("coinToken",this.bunToken)
  // },
  methods: {
    formatToken(token){
      if (token[0]!==undefined)
      return Number(token[0].value / 10000).toFixed(2);
      else
      return 0.00
    },
    optionDropdown(isOpen) {
      this.isOpen = !isOpen;
    },
    logout: function () {
      this.$router.replace("/login");
    },
  },
};
</script>

<style>
.dropdown-wrapper {
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
}
.menu-item svg {
  width: 25px;
  height: 25px;
  padding: 5px;
  border-radius: 50%;
  color: #291c0c;
  background: #bf9563;
  transition: all 0.3s ease-in-out;
}
.menu-item svg:hover {
  color: #fff;
}

.menu-item {
  color: #fff;
  position: relative;
  text-align: center;
  border-bottom: 3px solid transparent;
  display: flex;
  transition: 0.4s;
}
.menu-item .sub-menu {
  position: absolute;
  background-color: #222;
  top: 19px;
  left: 52%;
  transform: translateX(-50%);
  width: max-content;
  border-radius: 0px 0px 16px 16px;
  transition: all 0.3s ease-in-out;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}
.menu-item.active,
.menu-item:hover {
  color: #645c52;
}
.menu-item a {
  padding: 1px 17px;
  font-size: 13px;
  text-align: center;
  color: inherit;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.nav-item img {
  width: 30px;
}
</style>
