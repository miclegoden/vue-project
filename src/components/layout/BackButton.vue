<template>
  <div class="main_backBtn global_btn">
    <div class="btn-container">
    <router-link :to="link" class="small-btn">
        <div class="btn-container__img">
          <img src="images/backBtn.png" alt="" />

          <div class="btn-container__text">
            <h4 class="ml-3">{{text}}</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        </router-link>
    </div>
  </div>
</template>

<script>
export default {
    name:"BackButton",
    props:["text",'link'],
}
</script>

<style>

</style>