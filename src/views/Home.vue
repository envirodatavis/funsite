<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <first-mafs-plot />
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
    FirstMafsPlot: () => import("../components/MarriedAtFirstSightStatic.vue"),
  },
};
</script>
