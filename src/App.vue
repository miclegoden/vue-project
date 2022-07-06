<template>
  <router-view />
</template>

<script>
export default {
  data() {
    return {
      dropdownItem: [
        {
          title: "Logout",
          link: "#",
        },
      ],
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
