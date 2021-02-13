<template>
  <v-container class="ma-0 pa-0">
    <v-row justify="center" no-gutters>
      <v-col align="center" cols="12">
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
    margin: { top: 100, right: 20, bottom: 100, left: 50 },
    // width: computed prop!
    height: 400,
    // x data range:
    data: { min: 0, max: 30 },
    discretization: 400,
    // axis:
    domain: { x: [0, 30], y: [1, -1] },
    //
    radioMultiplier: 1,
    //
    transitionDuration: 1300,
    windowWidth: window.innerWidth,
  }),
  mounted() {
    this.instantiateViz();
    this.scheduler();
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth;
    });
  },
  watch: {
    plotData() {
      this.updateViz();
    },
    width() {
      this.updateViz();
    },
  },
  computed: {
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 300;
        case "sm":
          return 500;
        case "md":
        case "lg":
        case "xl":
          return 700;
        default:
          return 500;
      }
    },
    plotData: function() {
      let x = [this.data.min]; // instantiate X
      let i = this.data.min;
      let delta = (this.data.max - this.data.min) / this.discretization; // how I like to think about the x-delta
      // generate the X data
      while (i < this.data.max) {
        x.push(i + delta);
        i += delta;
      }
      // here make y a function of x
      const frequency1 = 220 / 1000;
      const frequency2 = frequency1 * 1.498307;
      let data = x.map((e) => ({
        x: e,
        y1: Math.sin(2 * Math.PI * frequency1 * e),
        y2: Math.sin(2 * Math.PI * frequency2 * e),
      }));
      return data.map((e) => ({
        ...e,
        y3: e.y1 + e.y2,
      }));
    },
    scales: function() {
      const x = d3
        .scaleLinear()
        .range([0, this.width - this.margin.right - this.margin.left]) //pixles
        .domain(this.domain.x); // domains are hardcoded
      const y = d3
        .scaleLinear()
        .range([0, this.height - this.margin.bottom - this.margin.top]) //pixles
        .domain(this.domain.y);
      return { x, y };
    },
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      let svg = d3
        .select("#simpleViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 3);

      //axes:
      //   svg
      //     .append("g")
      //     .call(d3.axisTop(this.scales.x).tickSize(2))
      //     .attr(
      //       "transform",
      //       "translate(" + this.margin.left + "," + this.margin.top + ")"
      //     );

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y).tickSize(2))
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      // ----- Line ------
      // line first needs a line function that gets applied over the whole dataset.
      //   let lineFunction = d3
      //     .line()
      //     .x((e) => this.scales.x(e.x))
      //     .y((e) => this.scales.y(e.y1));

      //   svg
      //     .append("path")
      //     // don't need the "enter" convention, because it's one element, calulated with the line function
      //     .attr("d", lineFunction(this.plotData))
      //     .attr("stroke", "blue")
      //     .attr("stroke-width", 2)
      //     .attr("fill", "none")
      //     .attr(
      //       "transform",
      //       "translate(" + this.margin.left + "," + this.margin.top + ")"
      //     );

      //   let secondLineFunction = d3
      //     .line()
      //     .x((e) => this.scales.x(e.x))
      //     .y((e) => this.scales.y(e.y2));
      //   svg
      //     .append("path")
      //     .attr("d", secondLineFunction(this.plotData))
      //     .attr("stroke", "red")
      //     .attr("stroke-width", 2)
      //     .attr("fill", "none")
      //     .attr(
      //       "transform",
      //       "translate(" + this.margin.left + "," + this.margin.top + ")"
      //     );

      let thirdLineFunction = d3
        .line()
        .x((e) => this.scales.x(e.x))
        .y((e) => this.scales.y(e.y3));
      svg
        .append("path")
        .attr("d", thirdLineFunction(this.plotData))
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );
    },

    scheduler: function() {
      //   setInterval((this.updateViz, this.randomMultiplier), 2000);
    },
    randomMultiplier: function() {
      this.radioMultiplier = Math.random() * 2 + 0.5;
    },
    updateViz: function() {
      // not happening yet
    },
  },
};
</script>
