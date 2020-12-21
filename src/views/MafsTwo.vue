<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <second-mafs-plot />
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "MafsTwo",
  components: {
    SecondMafsPlot: () => import("../components/MarriedAtFirstSightStatic.vue"),
  },
};
</script>
