<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <married-at-first-sight />
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    MarriedAtFirstSight: () => import("../components/MarriedAtFirstSight.vue"),
  },
};
</script>
