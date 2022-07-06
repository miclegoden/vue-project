<template>
  <Navbar />
  <router-view></router-view>
</template>

<script>
import router from "../router";
import Navbar from "./Navbar";
export default {
  name: "mainView",
  components: {
    Navbar,
  },
  data() {
    return {
      gameOver: null,
      hoursLeft: null,
      account: null,
      currentRoute: null,
      expiredDate: null,
      winningToken: 0,
    };
  },
  mounted() {
    // validate session on mounting page
    if (!localStorage.getItem("wax_user")) {
      router.push("/login");
    }
  },
  methods: {
    logout: function () {
      router.push("/login");
    },
  },
};
</script>