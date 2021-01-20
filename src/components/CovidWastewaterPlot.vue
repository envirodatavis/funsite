<template>
  <v-container fluid>
    <v-card width="500">
      <v-row justify="center" no-gutters>
        <v-col align="center">
          Plot here:
        </v-col>
      </v-row>
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
      <!-- <v-row justify="center">
      <v-col align="center">
        <v-btn-toggle v-model="timeToggle" rounded dense>
          <v-btn value="time" x-small>Time plot</v-btn>
          <v-btn value="InHospital" x-small>Compare Metrics</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row> -->
      <v-row justify="center" no-gutters>
        <v-col align="center">
          <svg id="covidViz" />
        </v-col>
      </v-row>
      {{ scales }}
      <!-- {{ rawData[1] }} -->
    </v-card>
  </v-container>
</template>

<script>
import * as d3 from "d3";
import rawData from "../lib/data/covidData.json";

export default {
  components: {},
  data: () => ({
    margin: { top: 20, left: 30, right: 30, bottom: 20 },
    width: 250,
    height: 250,
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
        .domain([new Date(2020, 2, 28), new Date(2021, 1, 3)])
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
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8);

      svg
        .append("g")
        .call(d3.axisRight(this.scales.yRight).tickSize(2))
        .attr(
          "transform",
          "translate(" +
            (this.margin.left + this.width) +
            "," +
            (this.margin.top + this.height / 2) +
            ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8);

      // svg.selectAll(".domain").remove();
    },
    updateViz: async function() {},
  },
};
</script>

<style lang="sass" scoped></style>
