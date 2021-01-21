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
          <v-card tile elevation="0" width="400">
            <v-row no-gutters class="pa-0">
              <v-col align="left">
                <v-btn-toggle
                  mandatory
                  v-model="leftScale"
                  rounded
                  dense
                  color="red"
                >
                  <v-btn value="posNumber" x-small>Positive #</v-btn>
                  <v-btn disabled value="posRatio" x-small
                    >Positive Ratio</v-btn
                  >
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row no-gutters class="pa-2">
              <v-col align="right">
                <v-btn-toggle
                  mandatory
                  v-model="rightScale"
                  rounded
                  dense
                  color="blue"
                >
                  <v-btn value="wW" x-small>Wastewater</v-btn>
                  <v-btn disabled value="inHospital" x-small>In Hospital</v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col align="center">
                <v-btn-toggle mandatory v-model="timeToggle" rounded dense>
                  <v-btn value="time2Plots" x-small>Time plots</v-btn>
                  <v-btn value="time1Plot" x-small>Single plot</v-btn>
                  <v-btn value="noTime" x-small>Compare Metrics</v-btn>
                </v-btn-toggle>
                <br />
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
    margin: { top: 20, left: 60, right: 60, bottom: 40, plotPadding: 20 },
    width: 400,
    height: 400,
    rawData: rawData,
    leftScale: "posNumber",
    rightScale: "wW",
    timeToggle: "time2Plots",
    transitionDuration: 1700,
  }),
  mounted() {
    this.instantiateViz();
  },
  computed: {
    scales: function() {
      const yAxisRange = () => {
        switch (this.timeToggle) {
          case "time2Plots":
            return [0, this.height / 2];
          case "noTime":
          case "time1Plot":
            return [0, this.height + this.margin.plotPadding];
        }
      };

      // X and Y Depend on the data source selected:
      const yLeftExtents = d3
        .extent(this.plotData.map((e) => e.PositiveResults))
        .reverse();

      const yRightExtents = d3
        .extent(this.plotData.map((e) => e.WW_Daily_copiesPml))
        .reverse();

      const xTimeScale = d3
        .scaleTime()
        .domain([new Date(2020, 1, 1), new Date(2021, 1, 3)])
        .range([0, this.width]);

      const yLeft = d3
        .scaleLinear()
        .range(yAxisRange())
        .domain(yLeftExtents);

      const yRight = d3
        .scaleLinear()
        .range(yAxisRange())
        .domain(yRightExtents);

      return { x: xTimeScale, yLeft: yLeft, yRight: yRight };
    },
    plotData: function() {
      // calculate averages here!
      // https://jrsinclair.com/articles/2019/five-ways-to-average-with-js-reduce/
      return this.rawData;
    },
  },
  watch: {
    timeToggle(next, prev) {
      if (next && prev) this.updateViz(next, prev);
    },
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

      // Bound, remove eventualyl:
      // svg
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", this.width + this.margin.left + this.margin.right)
      //   .attr(
      //     "height",
      //     this.height +
      //       this.margin.top +
      //       this.margin.bottom +
      //       this.margin.plotPadding * 2
      //   )
      //   .style("stroke", "black")
      //   .style("fill", "none")
      //   .style("stroke-width", 1);

      // // ----- axes ----
      svg
        .append("g")
        .call(
          d3
            .axisBottom(this.scales.x)
            .tickSize(2)
            .tickFormat(d3.timeFormat("%m")) //-%d"))
        )
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.margin.plotPadding * 2 + this.height) +
            ")"
        )
        .attr("class", "xaxis")
        .selectAll(".tick text")
        .style("font-size", 8);
      // Left axis:
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.yLeft).tickSize(2))
        .attr("class", "leftaxis")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8)
        .style("color", "red");

      // Right axis:
      svg
        .append("g")
        .call(d3.axisRight(this.scales.yRight).tickSize(2))
        .attr("class", "rightaxis")
        .attr(
          "transform",
          "translate(" +
            (this.margin.left + this.width) +
            "," +
            (this.margin.top + this.margin.plotPadding + this.height / 2) +
            ")"
        )
        .selectAll(".tick text")
        .style("font-size", 8)
        .style("color", "blue");

      // Dots:
      svg
        .selectAll("dot")
        .data(this.plotData)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(new Date(e.Date)))
        .attr("cy", (e) => this.scales.yLeft(e.PositiveResults))
        .attr("r", 1)
        .style("fill", "red")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "redDots");
      svg
        .selectAll("dot")
        .data(this.plotData.filter((e) => e.WW_Daily_copiesPml))
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
            (this.margin.top + this.margin.plotPadding + this.height / 2) +
            ")"
        )
        .attr("id", "blueDots");
    },
    updateViz: async function(next, prev) {
      let rightAxisYTranslate =
        "translate(" +
        (this.margin.left + this.width) +
        "," +
        (this.margin.top + this.margin.plotPadding + this.height / 2) +
        ")";
      let rightDataYTranslate =
        "translate(" +
        this.margin.left +
        "," +
        (this.margin.top + this.margin.plotPadding + this.height / 2) +
        ")";

      switch (next) {
        case "time2Plots":
          break;
        case "noTime":
        case "time1Plot":
          rightAxisYTranslate =
            "translate(" +
            (this.margin.left + this.width) +
            "," +
            this.margin.top +
            ")";
          rightDataYTranslate =
            "translate(" + this.margin.left + "," + this.margin.top + ")";
          break;
      }

      const svg = d3.select("#covidViz");

      if (["time2Plots", "time1Plot"].includes(next)) {
        await svg
          .selectAll(".leftaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisLeft(this.scales.yLeft).tickSize(2));
        await svg
          .selectAll(".rightaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisRight(this.scales.yRight).tickSize(2))
          .attr("transform", rightAxisYTranslate);
        await d3
          .selectAll("#redDots")
          .data(this.plotData)
          .transition()
          .duration(this.transitionDuration)
          .attr("cy", (e) => this.scales.yLeft(e.PositiveResults))
          .attr(
            "transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")"
          );
        await d3
          .selectAll("#blueDots")
          .data(this.plotData.filter((e) => e.WW_Daily_copiesPml))
          .transition()
          .duration(this.transitionDuration)
          .attr("cy", (e) => this.scales.yRight(e.WW_Daily_copiesPml))
          .attr("transform", rightDataYTranslate);
      }
      if (next === "noTime") {
        await svg
          .selectAll(".xaxis")
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 0)
          .remove();
        await svg
          .selectAll(".rightaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisBottom(this.scales.yRight).tickSize(2))
          .attr(
            "transform",
            "translate(" +
              this.margin.left +
              "," +
              (this.margin.top + this.margin.plotPadding * 2 + this.height) +
              ")"
          );
        await d3
          .selectAll("#blueDots")
          .data(this.plotData.filter((e) => e.WW_Daily_copiesPml))
          .transition()
          .duration(this.transitionDuration)
          .attr("cy", (e) => this.scales.yLeft(e.PositiveResults))
          .attr("cx", (e) => this.scales.yRight(e.WW_Daily_copiesPml))
          .attr("transform", rightDataYTranslate);
        // await d3
        //   .selectAll("#redDots")
        //   .data(this.plotData.filter((e) => e.WW_Daily_copiesPml))
        //   .transition()
        //   .duration(this.transitionDuration)
        //   .attr("cy", (e) => this.scales.yLeft(e.PositiveResults))
        //   .attr("cx", (e) => this.scales.yRight(e.WW_Daily_copiesPml))
        //   .attr("transform", rightDataYTranslate);
      }
      if (prev === "noTime") {
        await svg
          .append("g")
          .call(
            d3
              .axisBottom(this.scales.x)
              .tickSize(2)
              .tickFormat(d3.timeFormat("%m")) //-%d"))
          )
          .attr(
            "transform",
            "translate(" +
              this.margin.left +
              "," +
              (this.margin.top + this.margin.plotPadding * 2 + this.height) +
              ")"
          )
          .attr("class", "xaxis")
          .style("font-size", 8)
          .style("opacity", 0)
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 1);

        await d3
          .selectAll("#blueDots")
          .data(this.plotData.filter((e) => e.WW_Daily_copiesPml))
          .transition()
          .duration(this.transitionDuration)
          .attr("cx", (e) => this.scales.x(new Date(e.Date)))
          .attr("cy", (e) => this.scales.yRight(e.WW_Daily_copiesPml))
          .attr("transform", rightDataYTranslate);
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
