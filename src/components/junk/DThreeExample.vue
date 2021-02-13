<template>
  <v-row justify="center">
    <v-card>
      dTHreeExample.vue
      <v-slider min="1" max="100" v-model="multiplierSlider"></v-slider>
      <svg id="dataviz_area" width="500" height="500" style="margin: 5px">
        <g>
          <rect
            width="300"
            height="300"
            style="fill:rgba(100,100,100,0.1); stroke-width:1; stroke:rgba(100, 100, 100,0.5);"
          />
          <path :d="line" />
        </g>
      </svg>
    </v-card>
  </v-row>
</template>

<script>
// TODO: re-write this from scratch in new component.
import * as d3 from "d3";
export default {
  name: "vue-line-chart",
  data() {
    return {
      line: "", //svg pathis initially blank
      multiplierSlider: 50,
    };
  },
  mounted() {
    this.calculatePath();
    this.initializeSvg();
  },
  watch: {
    multiplierSlider: function() {
      this.calculatePath();
      this.addDots();
    },
  },
  computed: {
    dataPlot: function() {
      let xArray = [...Array(100).keys()]; // make an array of 1 to 100
      return xArray.map((arr) => ({
        x_field: arr / 2.5,
        y_field: (arr * arr) / this.multiplierSlider / 4,
      }));
    },
    scales: function() {
      const x = d3.scaleLinear().range([0, 300]); // range is pixel values
      const y = d3.scaleLinear().range([300, 0]);
      x.domain([0, 30]); // domain is value
      y.domain([0, 30]);
      return { x, y };
    },
  },
  methods: {
    initializeSvg() {
      const svg = d3.select("#dataviz_area");
      d3.select("g").attr("transform", "translate(25,25)");
      svg
        .append("g")
        .call(d3.axisBottom(this.scales.x))
        .attr("transform", "translate(25,325)");
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y))
        .attr("transform", "translate(25,25)");

      svg // radnomly put a circle at 2,2 to understand margins and things
        .append("circle")
        .attr("cx", this.scales.x(2))
        .attr("cy", this.scales.y(2))
        .attr("r", 2)
        .style("fill", "blue")
        .attr("transform", "translate(25,25)");

      svg
        .append("g")
        .append("circle")
        .attr("cx", function(d) {
          return this.scales.x(d.x_field);
        })
        .attr("cy", function(d) {
          return this.scales.y(d.y_field);
        })
        .attr("r", 1.5)
        .style("fill", "#69b3a2");
    },
    calculatePath() {
      // function that calculates the path
      let dataPlot = this.dataPlot;
      const scale = this.scales;
      const path = d3 //converts the data into the path code
        .line()
        .x((arr) => scale.x(arr.x_field))
        .y((arr) => scale.y(arr.y_field));
      this.line = path(dataPlot);
    },
    addDots() {
      d3.selectAll("circle").remove();
      this.dataPlot.map((arr) =>
        d3
          .select("#dataviz_area")
          .append("circle")
          .attr("cx", this.scales.x(arr.x_field))
          .attr("cy", this.scales.y(arr.y_field))
          .attr("r", 3)
          .style("fill", "blue")
          .attr("transform", "translate(25,25)")
      );
    },
  },
};

// //
// <style lang="scss" scoped>
// // svg
// //   margin: 25px
// // path
// //   fill: none
// //   stroke: #76BF8A
// //   stroke-width: 3px
// //
// </style>
</script>
