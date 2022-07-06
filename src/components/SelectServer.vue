<template>
  <div class="dropdown">
    <button class="
        btn
        login-dropdown
        w-100
        d-flex
        justify-content-between
        align-items-center
      " @click="showMenu">
      {{ link }}
      <!-- <span class="down-arrow"><i class="fas fa-arrow-down"></i></span> -->
    </button>
    <div class="dropdown-menu w-100" :class="showDropDownMenu ? 'show' : ''" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item" href="#" @click.prevent="setRpc('greymass')">Greymass</a>
      <a class="dropdown-item" href="#" @click.prevent="setRpc('pink.gg')">pink.gg</a>
      <a class="dropdown-item" href="#" @click.prevent="setRpc('EOS Rio')">EOS Rio</a>
      <a class="dropdown-item" href="#" @click.prevent="setRpc('GreenEOSIO')">Green EOSIO</a>
    </div>
  </div>
</template>

<script>
export default {
  nam: "SelectServe",
  data() {
    return {
      showDropDownMenu: false,
      link: "Please select RPC Server",
    };
  },
  methods: {
    showMenu() {
      this.showDropDownMenu = !this.showDropDownMenu;
    },
    setRpc(producers) {
      if (producers == "EOS Rio") {
        localStorage.setItem("rpc-asset-key", "https://atomic.wax.eosrio.io");
        localStorage.setItem("rpc-link-key", "wax.eosrio.io");
      } else if (producers == "pink.gg") {
        localStorage.setItem("rpc-asset-key","https://wax-aa.eosdac.io");
        localStorage.setItem("rpc-link-key", "wax.pink.gg");
      } else if (producers == "greymass") {
        localStorage.setItem("rpc-asset-key","https://wax.api.atomicassets.io");
        localStorage.setItem("rpc-link-key", "wax.greymass.com");
      }
      this.link = producers;
      this.showDropDownMenu = !this.showDropDownMenu;
    },
  },
};
</script>

<style scoped>
.login-dropdown {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-transform: capitalize;
  padding: 0.375rem 1.75rem;
}
.dropdown-menu a:hover {
  color: rgba(226, 219, 219, 0.9);
  transition: color 0.4s linear;
}
.dropdown-menu .dropdown-item {
  text-transform: capitalize;
  font-size: 15px;
  font-weight: 500;
  display: inline-block;
}
</style>