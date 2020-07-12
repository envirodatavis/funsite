<template>
  <v-row justify="center">
    <v-card>
      HydroToolThresholdCalc.vue
      <br />Ct = effectiveSolubility/bulk density x ( KdPb + Water Filled Porosity + Henry's constantxAir Porosity )
      <br />
      the answer is: {{cThreshold}}
    </v-card>
  </v-row>
</template>


<script>
// IDEA:
//  presets, like " a wet organic soil" "short explanaiton on what that means, how common that would be"
//  ""
// import * as d3 from "d3";
export default {
  name: "vue-line-chart",
  data() {
    return {
      desctiptionText: "here",
      unitlessHenrysConstant: 0.31,
      effectiveSolublity: 1100,
      dryBulkDensity: 2.0,
      waterFilledPorosity: 0.15,
      airFilledPorosity: 0.1,
      KocOrganicCarbon: 126,
      fOc: 0.003
      // initial Ct should be 515
      // write a jest test for that, cool.
    };
  },
  mounted() {},
  watch: {},
  computed: {
    KdSoilWaterPartition: function() {
      return this.KocOrganicCarbon * this.fOc;
    },
    cThreshold: function() {
      return (
        (this.effectiveSolublity / this.dryBulkDensity) *
        (this.KdSoilWaterPartition * this.dryBulkDensity +
          this.waterFilledPorosity +
          this.unitlessHenrysConstant * this.airFilledPorosity)
      );
    }
  },
  methods: {}
};
</script>

<style lang="sass" scoped>
</style>
