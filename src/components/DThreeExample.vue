<template>
  <v-row justify="center">
    <v-card max-width="400px">
      <h1>Line Example</h1>
      <v-slider min="0" max="100" v-model="multiplierSlider"></v-slider>
      <p>{{ multiplierSlider }}</p>
      <svg id="dataviz_area" width="330" height="270">
        <g style="transform: translate(0, 0px)">
          <rect
            width="330"
            height="270"
            style="fill:none; stroke-width:2; stroke:rgb(100, 100, 100);"
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
      data: [0, 30, 78, 25, 36, 92, 150], //data startsout here
      line: "", //svg pathis initially blank
      multiplierSlider: 1
    };
  },
  mounted() {
    this.calculatePath();
    this.addSvgStuff();
  },
  watch: {
    multiplierSlider: function() {
      this.calculatePath();
    }
  },
  computed: {
    dataPlot: function() {
      return this.data.map(x => x * this.multiplierSlider);
    }
  },
  methods: {
    addSvgStuff() {
      console.log("I FIRED!");
      var svg = d3.select("#dataviz_area");
      var xScale = d3
        .scaleLinear()
        .domain([0, 100]) //min and max of data
        .range([0, 400]); //pixel values

      svg
        .append("circle")
        .attr("cx", xScale(20))
        .attr("cy", 100)
        .attr("r", 40)
        .style("fill", "blue");
      svg.call(d3.axisBottom(xScale)).attr("transform", "translate(10,50)");
    },
    getScales() {
      let dataPlot = this.dataPlot;
      const x = d3.scaleTime().range([0, 300]);
      const y = d3.scaleLinear().range([210, 0]);
      d3.axisLeft().scale(x);
      d3.axisBottom().scale(y);
      x.domain(d3.extent(dataPlot, (d, i) => i));
      y.domain([0, 3000]);
      return { x, y };
    },
    calculatePath() {
      // function that calculates the path
      let dataPlot = this.dataPlot;
      const scale = this.getScales();
      const path = d3 //converts the data into the path code
        .line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d));
      this.line = path(dataPlot);
    }

    // randn_bm: function(min, max, skew) {
    //   //https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    //   let u = 0,
    //     v = 0;
    //   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    //   while (v === 0) v = Math.random();
    //   let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    //   num = num / 10.0 + 0.5; // Translate to 0 -> 1
    //   // if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    //   num = Math.pow(num, skew); // Skew
    //   num *= max - min; // Stretch to fill range
    //   num += min; // offset to min
    //   return num;
    // }
  }
};
</script>

<style lang="sass" scoped>
svg
  margin: 25px
path
  fill: none
  stroke: #76BF8A
  stroke-width: 3px
</style>
