<template>
  <covid-plot />
</template>

<script>
export default {
  name: "CovidWastewater",
  components: {
    CovidPlot: () => import("../components/CovidWastewaterPlot.vue"),
  },
};
</script>
