<template>
  <v-container fluid>
    <v-row justify="center" no-gutters>
      <v-card tile outlined width="600">
        <v-row justify="center" no-gutters>
          <v-col align="center">
            <svg id="covidViz" />
          </v-col>
        </v-row>
        <v-row justify="center" no-gutters>
          <v-card tile outlined width="400">
            <v-row no-gutters class="pa-0">
              <v-col align="left">
                <v-btn-toggle v-model="leftScale" rounded dense>
                  <v-btn value="PosNumber" x-small>Positive #</v-btn>
                  <v-btn value="PosRatio" x-small>Positive Ratio</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row no-gutters class="pa-2">
              <v-col align="right">
                <v-btn-toggle v-model="rightScale" rounded dense>
                  <v-btn value="WW" x-small>Wastewater</v-btn>
                  <v-btn value="InHospital" x-small>In Hospital</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col align="center">
                <v-btn-toggle v-model="timeToggle" rounded dense>
                  <v-btn value="time" x-small>Time plots</v-btn>
                  <v-btn value="time" x-small>Single plot</v-btn>
                  <v-btn value="InHospital" x-small>Compare Metrics</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from "d3";
import rawData from "../lib/data/covidData.json";

export default {
  components: {},
  data: () => ({
    margin: { top: 50, left: 60, right: 60, bottom: 20, plotPadding: 10 },
    width: 400,
    height: 400,
    rawData: rawData,
    leftScale: "",
    rightScale: "",
    timeToggle: "",
  }),
  mounted() {
    this.instantiateViz();
  },
  computed: {
    scales: function() {
      // X and Y Depend on the data source selected:
      const yLeftExtents = d3
        .extent(this.rawData.map((e) => e.PositiveResults))
        .reverse();

      const yRightExtents = d3
        .extent(this.rawData.map((e) => e.WW_Daily_copiesPml))
        .reverse();

      const xTimeScale = d3
        .scaleTime()
        .domain([new Date(2020, 1, 1), new Date(2021, 1, 3)])
        .range([0, this.width]);

      const yLeft = d3
        .scaleLinear()
        .range([0, this.height / 2])
        .domain(yLeftExtents);

      const yRight = d3
        .scaleLinear()
        .range([0, this.height / 2])
        .domain(yRightExtents);

      return { x: xTimeScale, yLeft: yLeft, yRight: yRight };
    },
  },
  watch: {
    // groupBy(next, prev) {
    //   if (next && prev) this.updateViz();
    // },
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      const svg = d3
        .select("#covidViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr(
          "height",
          this.height +
            this.margin.top +
            this.margin.bottom +
            this.margin.plotPadding * 2
        );

      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr(
          "height",
          this.height +
            this.margin.top +
            this.margin.bottom +
            this.margin.plotPadding * 2
        )
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 3);

      // // ----- axes ----
      svg
        .append("g")
        .call(
          d3
            .axisTop(this.scales.x)
            .tickSize(2)
            .tickFormat(d3.timeFormat("%m")) //-%d"))
        )
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8);

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.yLeft).tickSize(2))
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.margin.plotPadding) +
            ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8)
        .style("color", "red");

      svg
        .append("g")
        .call(d3.axisRight(this.scales.yRight).tickSize(2))
        .attr(
          "transform",
          "translate(" +
            (this.margin.left + this.width) +
            "," +
            (this.margin.top + this.margin.plotPadding * 2 + this.height / 2) +
            ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8)
        .style("color", "blue");

      svg
        .selectAll("dot")
        .data(this.rawData)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(new Date(e.Date)))
        .attr("cy", (e) => this.scales.yLeft(e.PositiveResults))
        .attr("r", 1)
        .style("fill", "red")
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.margin.plotPadding) +
            ")"
        )
        .attr("id", "redDots");

      svg
        .selectAll("dot")
        .data(this.rawData)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(new Date(e.Date)))
        .attr("cy", (e) => this.scales.yRight(e.WW_Daily_copiesPml))
        .attr("r", 1)
        .style("fill", "blue")
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.margin.plotPadding * 2 + this.height / 2) +
            ")"
        )
        .attr("id", "blueDots");
    },
    updateViz: async function() {},
  },
};
</script>

<style lang="sass" scoped></style>
