<template>
  <v-row justify="center">
    <v-card tile outlined>
      HI!
      <svg id="dataviz_area" height="200" width="450" />
      <v-slider v-model="sliderValue" min="0" max="100" />
      <div class="row align-items-center">
        <div class="col-sm-2">
          <p id="value-simple"></p>
        </div>
        <!-- <div class="col-sm">
          <div id="slider-simple"></div>
        </div>-->
      </div>slidertown
      <p id="value"></p>
      <div id="slider"></div>
    </v-card>
  </v-row>
</template>

<script>
import * as d3 from "d3";
// // Simple
// var data = [0, 0.005, 0.01, 0.015, 0.02, 0.025];

// var sliderSimple = d3
//   // .sliderBottom()
//   .min(d3.min(data))
//   .max(d3.max(data))
//   .width(300)
//   .tickFormat(d3.format(".2%"))
//   .ticks(5)
//   .default(0.015)
//   .on("onchange", val => {
//     d3.select("p#value-simple").text(d3.format(".2%")(val));
//   });

// var gSimple = d3
//   .select("div#slider-simple")
//   .append("svg")
//   .attr("width", 500)
//   .attr("height", 100)
//   .append("g")
//   .attr("transform", "translate(30,30)");

// gSimple.call(sliderSimple);

// d3.select("p#value-simple").text(d3.format(".2%")(sliderSimple.value()));

export default {
  name: "DThreePlay",
  data: () => ({
    sliderValue: 100
  }),
  watch: {
    sliderValue: function() {
      this.d3Trigger();
    }
  },
  mounted() {
    this.d3Trigger();
  },
  methods: {
    d3Trigger: function() {
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
      svg
        .append("circle")
        .attr("cx", xScale(75))
        .attr("cy", 100)
        .attr("r", 40)
        .style("fill", "red");
      // Cool the following will append a million circles to the sVG, rather than re-drawing them.
      svg
        .append("circle")
        .attr("cx", xScale(this.sliderValue))
        .attr("cy", 100)
        .attr("r", 10)
        .style("fill", "black");

      svg.call(d3.axisBottom(xScale)).attr("transform", "translate(10,50)");
    }
  },
  computed: {
    // slider or whatever
  }
};
</script>
