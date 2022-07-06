<template>
  <nav class="navbar navbar-expand-lg top-0 fixed-top left-0">
    <div class="container-fluid">
      <a class="navbar-brand" href="https://burgerzworld.com">
        <img src="images/logo_52x.webp" alt="" class="logo_img" />
      </a>
      <button
        class="navbar-toggler"
        @click="optionDropdown(isOpen)"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
        <span class="" role="button"
          ><i class="fa fa-bars" aria-hidden="true" style="color: #e6e6ff"></i
        ></span>
      </button>
      <div
        class="collapse navbar-collapse"
        :class="`${isOpen ? 'show' : ''}`"
        id="navbarText"
      >
        <ul class="navbar-nav me-auto mb-lg-0">
          <li class="nav-item d-flex align-items-center" v-if="profile">
            <a href="#" class="nav-span mx-3" @click="showChargeModal = true"
              >Energy</a
            >
            <div class="progress" style="width: 200px">
              <div
                class="progress-bar progressbar energy"
                role="progressbar"
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {{ profile.energy }}
              </div>
            </div>
            <a href="#" class="nav-span mx-3" @click="showWorkerModal = true"
              >Set Worker</a
            >
            <span class="text-warning">It's a beta version please report us if you find any issue you face while using.</span>
          </li>
        </ul>
        <span class="navbar-text">
          <Dropdown :logUser="authentication.user_name" />
        </span>
      </div>
    </div>
  </nav>
  <ChargeModal
    v-if="showChargeModal"
    v-on:w-modal-hide-click="showChargeModal = false"
  />
  <SetWorkerModal
    v-if="showWorkerModal"
    v-on:w-modal-hide-click="showWorkerModal = false"
  />
</template>
<script>
import Dropdown from "@/views/Dropdown";
import ChargeModal from "@/components/ChargeModal";
import SetWorkerModal from "@/components/SetWorkerModal";
import { reactive } from "vue";
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  computed: {
    ...mapGetters(["profile"]),
  },
  components: {
    Dropdown,
    ChargeModal,
    SetWorkerModal,
  },

  data() {
    return {
      isOpen: false,
      showChargeModal: false,
      showWorkerModal: false,
      energy: "0%",
      dropdownItem: [
        {
          title: "Logout",
          link: "#",
        },
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      if (this.profile) this.energy = (this.profile.energy / 1000) * 100 + "%";
    }, 1000);
  },
  methods: {
    optionDropdown(isOpen) {
      this.isOpen = !isOpen;
    },
  },
  setup() {
    const authentication = reactive({
      user_name: localStorage.getItem("wax_user"),
    });
    return {
      authentication,
    };
  },
};
</script>
<style scoped>
.logo {
  width: 100px;
  float: left;
}
/* .logo_img {
  width: 203px;
} */

.navbar {
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 10px 0 10px rgb(249 243 243 / 50%);
}
.nav-span {
  font-weight: bold;
}
.nav-item .progress .progress-bar {
  background: #77b059;
}
.energy {
  width: v-bind(energy) !important;
}
</style>
