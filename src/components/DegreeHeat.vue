<template>
  <v-container class="ma-0 pa-0">
    <v-row justify="center" no-gutters>
      <v-col align="center" cols="12">
        {{ plotData }}
        <svg style="display:block" id="simpleViz" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from "d3";

export default {
  components: {},
  data: () => ({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 300, // computed prop!
    height: 400,
    transitionDuration: 1300,
    windowWidth: window.innerWidth,
  }),
  mounted() {
    this.instantiateViz();
  },
  watch: {},
  computed: {
    plotData: function() {
      d3.csv("../lib/data/degreeHeatCool.csv", (e) => console.log(e));
      return [1, 2, 4, 5];
    },
    // scales: function() {
    //   const x = d3
    //     .scaleLinear()
    //     .range([0, this.width - this.margin.right - this.margin.left]) //pixles
    //     .domain(this.domain.x); // domains are hardcoded
    //   const y = d3
    //     .scaleLinear()
    //     .range([0, this.height - this.margin.bottom - this.margin.top]) //pixles
    //     .domain(this.domain.y);
    //   return { x, y };
    // },
  },
  methods: {
    instantiateViz: function() {
      console.log("done!");
      // // make the svg:
      // let svg = d3
      //   .select("#simpleViz")
      //   .attr("width", this.width + this.margin.left + this.margin.right)
      //   .attr("height", this.height + this.margin.top + this.margin.bottom);
      // svg
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", this.width + this.margin.left + this.margin.right)
      //   .attr("height", this.height + this.margin.top + this.margin.bottom)
      //   .style("fill", "none");

      // // ----- Bars ----
      // // bars are like points, because they use
      // svg
      //   .selectAll("myBar")
      //   .data(this.plotData)
      //   .enter()
      //   .append("rect")
      //   .attr("x", (e) => this.scales.x(e.x))
      //   .attr("y", (e) => this.scales.y(e.y))
      //   // ^ THis is wack, and takes some getting used to; everything starts at the top, it's the delta in pixels between the top
      //   //    and the 0 minus the bar
      //   .attr("width", 3)
      //   .attr("height", Math.random() * 200 + 20)
      //   // putting in a random color in the bars for fun.
      //   .attr(
      //     "fill",
      //     "rgb(" +
      //       Math.random() * 255 +
      //       "," +
      //       Math.random() * 255 +
      //       "," +
      //       Math.random() * 255 +
      //       ")"
      //   )
      //   .attr("id", "theBars");
    },
  },
};
</script>

<style lang="sass" scoped></style>
