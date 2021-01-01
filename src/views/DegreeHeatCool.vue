<template>
  <degree-heat />
</template>
<script>
// @ is an alias to /src

export default {
  // name: "ForWillow",
  components: {
    DegreeHeat: () => import("../components/DegreeHeat.vue"),
  },
  data: () => ({}),
};
</script>
