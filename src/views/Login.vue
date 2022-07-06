<template>
  <div class="login-wrapper">
    <div class="login">
      <div class="login-logo">
        <img src="/images/logo.webp" alt="" class="img-fluid" />
      </div>
      <div class="login-content">
        <h4 class="login-title mb-0">Login with</h4>
        <img src="/images/wax-logo-black.png" alt="" />
      </div>
      <div class="login-select_option">
        <div class="form-group">
          <h4>Choose RPC Server</h4>
          <SelectServer />
        </div>
        <button
          class="btn btn-primary w-100 mt-3 login-btn"
          @click="handle_login()"
        >
          Start Playing
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginService from "../services/LoginService";
import SelectServer from "../components/SelectServer.vue";
export default {
  name: "Login",
  data() {
    return {
      ual: null,
      showPopup: false,
      showDropDownMenu: false,
      link: "Please select RPC Server",
    };
  },
  components: { SelectServer },
  inheritAttrs: false,
  mounted() {
    localStorage.clear();
    this.handle_login();
  },
  methods: {
    handle_login: function () {
      if (this.ual) {
        this.ual.init();
        var [buttonUAL] =
          document.body.getElementsByClassName("ual-button-gen");
        buttonUAL.click();
        let elements = document.body.getElementsByClassName("ual-button-gen");
        while (elements.length > 0) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      } else {
        localStorage.clear();
        const loginService = new LoginService();
        this.ual = loginService.handle_login();
      }
    },
  },
};
</script>

<style>
.login {
  width: 450px;
  background: rgba(0, 0, 0, 0.8);
  margin: 40px auto;
  padding: 30px;
  border-radius: 13px;
  box-shadow: inset 0 0 10px #fff;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.login select {
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.login .login-select_option h4 {
  font-size: 18px;
  text-align: center;
}
.login-btn {
  font-weight: bold !important;
}
.ual-button-gen {
  display: none !important;
}

#ual-modal {
  top: 0 !important;
}
.ual-auth-icon-wrapper {
  padding: 4px 10px 6px 10px !important;
}

.ual-auth-text {
  display: inline-block !important;
  padding: 20px 4px 17px 10px !important;
  font-size: 10px !important;
  width: 137px !important;
}

.fa-chevron-right {
  font-size: 16px !important;
  float: right;
  margin: 12px 6px;
}

.ual-modal-content-description {
  /* color: #fff !important; */
  width: 246px !important;
  font-size: 1.2em !important;
  margin: 0.7em auto;
}
.ual-modal-close {
  display: none;
}
/* #ual-modal {
  top: 78px !important;
} */
</style>