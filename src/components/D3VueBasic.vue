<template>
  <div>
    A basic vue component to test out good ways of integrating D3 and Vue.
    <v-row justify="center">
      <v-radio-group v-model="radioMultiplier">
        <v-radio color="black" label="One"></v-radio>
        <v-radio color="black" label="Two"></v-radio>
        <v-radio color="black" label="Three"></v-radio>
      </v-radio-group>
    </v-row>
    <v-row justify="center">
      <v-card :width="width" :height="height" tile outlined>
        <div id="simpleViz"></div>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  components: {},
  data: () => ({
    margin: { top: 30, right: 20, bottom: 30, left: 40 },
    width: 400,
    height: 400,
    // x data range:
    data: { min: 1, max: 20 },
    discretization: 100,
    // axis:
    domain: { x: [0, 20], y: [10, -10] },
    //
    radioMultiplier: 1,
    //
    transitionDuration: 1300
  }),
  mounted() {
    this.instantiateViz();
  },
  watch: {
    plotData() {
      this.updateViz();
    }
  },
  computed: {
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
      return x.map(e => ({
        x: e,
        y: Math.sin(e) * (this.radioMultiplier + 1) * 2 + 3
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
    }
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      let svg = d3
        .select("#simpleViz")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      // give it a backgound for layout (not the data area)
      svg
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "white");

      // give it a background for just the viz area
      svg
        .append("rect")
        .attr("width", this.width - this.margin.right - this.margin.left)
        .attr("height", this.height - this.margin.bottom - this.margin.top)
        .attr("fill", "white")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      // X and Y axis:
      svg
        .append("g")
        .call(d3.axisBottom(this.scales.x))
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.width - this.margin.bottom) +
            ")"
        );
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y))
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      // ----- Dots/Points --------
      svg
        .selectAll("dot")
        .data(this.plotData)
        .enter() // because we're adding a bunch of individual dots, we need the enter convetion
        .append("circle")
        .attr("cx", e => this.scales.x(e.x))
        .attr("cy", e => this.scales.y(e.y))
        .attr("r", 2)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .style("fill", "black")
        .attr("id", "bunchaDots");

      // ----- Line ------
      // line first needs a line function that gets applied over the whole dataset.
      let lineFunction = d3
        .line()
        .x(e => this.scales.x(e.x))
        .y(e => this.scales.y(e.y));
      svg
        .append("path")
        // don't need the "enter" convention, because it's one element, calulated with the line function
        .attr("d", lineFunction(this.plotData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "theLine");

      // ----- Bars ----
      // bars are like points, because they use
      svg
        .selectAll("myBar")
        .data(this.plotData)
        .enter()
        .append("rect")
        .attr("x", e => this.scales.x(e.x))
        .attr("y", e => (e.y > 0 ? this.scales.y(e.y) : this.scales.y(0)))
        // ^ THis is wack, and takes some getting used to; everything starts at the top, it's the delta in pixels between the top
        //    and the 0 minus the bar
        .attr("width", 3)
        .attr("height", e =>
          e.y > 0
            ? (this.height - this.margin.top - this.margin.bottom) / 2 -
              this.scales.y(e.y)
            : this.scales.y(e.y) - this.scales.y(0)
        )
        // .attr("height", 40)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "theBars");
    },

    updateViz: function() {
      // ---- update the Dots ----
      d3.selectAll("#bunchaDots")
        .data(this.plotData)
        .transition()
        .duration(this.transitionDuration)
        .attr("cx", e => this.scales.x(e.x))
        .attr("cy", e => this.scales.y(e.y));
      // general update pattern: don't need enter/exit because I'm just selecting and updating the dot's location
      // same number of dots

      // ----- update the line ------
      let lineFunction = d3
        .line()
        .x(e => this.scales.x(e.x))
        .y(e => this.scales.y(e.y));

      d3.select("#theLine")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", lineFunction(this.plotData));

      // ---- update the bars ----
      d3.selectAll("#theBars")
        .data(this.plotData)
        .transition()
        .duration(this.transitionDuration)
        .attr("x", e => this.scales.x(e.x))
        .attr("y", e => (e.y > 0 ? this.scales.y(e.y) : this.scales.y(0)))
        .attr("height", e =>
          e.y > 0
            ? (this.height - this.margin.top - this.margin.bottom) / 2 -
              this.scales.y(e.y)
            : this.scales.y(e.y) - this.scales.y(0)
        )
        // putting in a random color in the bars for fun.
        .attr(
          "fill",
          "rgb(" +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            ")"
        );
    }
  }
};
</script>

