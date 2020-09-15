<template>
  <div>
    <v-row justify="center">
      <v-radio-group v-model="radioMultiplier">
        <v-radio color="black" label="One"></v-radio>
        <v-radio color="black" label="Two"></v-radio>
        <v-radio color="black" label="Three"></v-radio>
      </v-radio-group>
      {{radioMultiplier}}
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
  data() {
    return {
      margin: { top: 30, right: 20, bottom: 30, left: 40 },
      width: 400,
      height: 400,
      //
      // x data range:
      data: { min: 1, max: 20 },
      discretization: 100,
      //
      // axese:
      domain: { x: [0, 20], y: [10, -10] },
      //
      radioMultiplier: 1,
      //
      desctiptionText: "here",
      unitlessHenrysConstant: 0.31,
      unitlessHenrysConstantSlider: 31,
      effectiveSolublity: 1100,
      dryBulkDensity: 2.0,
      waterFilledPorosity: 0.15,
      airFilledPorosity: 0.1,
      KocOrganicCarbon: 126,
      fOc: 0.03,
      soilType: "cleanSand",
      henrysOptions: [
        {
          chemical: "TCE",
          h: 0.31
        },
        {
          chemical: "PCE",
          h: 0.41
        },
        {
          chemical: "DCE",
          h: 0.31
        }
      ]
      // initial Ct should be 515
      // write a jest test for that, cool.
    };
  },
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
      let x = [this.data.min];
      let i = this.data.min;
      let delta = (this.data.max - this.data.min) / this.discretization;
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
        .domain(this.domain.x);
      const y = d3
        .scaleLinear()
        .range([0, this.height - this.margin.bottom - this.margin.top]) //pixles
        .domain(this.domain.y);
      return { x, y };
    }
  },
  methods: {
    updateViz: function() {
      // ---- Dots ----
      d3.selectAll("#bunchaDots")
        .data(this.plotData)
        .transition()
        .duration(300)
        .attr("cx", e => this.scales.x(e.x))
        .attr("cy", e => this.scales.y(e.y));
      // general update pattern: don't need enter/exit because I'm just selecting and updating the dot's location
      // same number of dots

      // ----- LINE ------
      let lineFunction = d3
        .line()
        .x(e => this.scales.x(e.x))
        .y(e => this.scales.y(e.y));

      d3.select("#theLine")
        .transition()
        .duration(300)
        .attr("d", lineFunction(this.plotData));

      // ---- Bars ----
      d3.selectAll("#theBars")
        .data(this.plotData)
        .transition()
        .duration(300)
        .attr("x", e => this.scales.x(e.x))
        .attr("y", e => (e.y > 0 ? this.scales.y(e.y) : this.scales.y(0)))
        .attr("height", e =>
          e.y > 0
            ? (this.height - this.margin.top - this.margin.bottom) / 2 -
              this.scales.y(e.y)
            : this.scales.y(e.y) - this.scales.y(0)
        )
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
    },
    instantiateViz: function() {
      // make the svg:
      let svg = d3
        .select("#simpleViz")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height);

      // give it a backgound for layout( not the data area)
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

      // Add dots with the "enter" convention:
      svg
        .selectAll("dot")
        .data(this.plotData)
        .enter()
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

      // ----- LINE ------
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

      // ----- bars ----
      svg
        .selectAll("myBar")
        .data(this.plotData)
        .enter()
        .append("rect")
        .attr("x", e => this.scales.x(e.x))
        .attr("y", e => (e.y > 0 ? this.scales.y(e.y) : this.scales.y(0)))
        // ^ OHHHHH everything starts at the top, it's the delta in pixels between the top
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
    }
  }
};
</script>

<style lang="sass" scoped></style>
