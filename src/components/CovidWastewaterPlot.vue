<template>
  <v-container fluid>
    <v-row justify="center" no-gutters>
      <v-card outlined width="600" color="rgba(0,0,0,0)">
        <v-row justify="center" no-gutters>
          <v-col align="center">
            <svg id="covidViz" />
          </v-col>
        </v-row>
        <!-- <v-row no-gutters class="pa-0">
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
            </v-row> -->
        <v-row justify="center" no-gutters>
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
  </v-container>
</template>

<script>
import * as d3 from "d3";
import rawData from "../lib/data/covidData.json";

export default {
  components: {},
  data: () => ({
    margin: {
      top: 20,
      left: 100,
      right: 100,
      bottom: 60,
      betweenPlotPadding: 20,
    },
    width: 300,
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
            return [0, this.height + this.margin.betweenPlotPadding];
        }
      };
      // X and Y Depend on the data source selected:
      const yLeftExtents = d3.extent(this.plotData.map((e) => e.y1));
      let yRightExtents = d3.extent(this.plotData.map((e) => e.y2));

      let xDomain = [new Date(2020, 1, 1), new Date(2021, 3, 3)];
      if (this.timeToggle === "noTime") {
        xDomain = d3.extent(this.plotData.map((e) => e.x));
      }
      const xScale = d3
        .scaleTime()
        .range([0, this.width])
        .domain(xDomain);
      const yLeft = d3
        .scaleLinear()
        .range(yAxisRange())
        .domain(yLeftExtents.reverse());
      const yRight = d3
        .scaleLinear()
        .range(yAxisRange())
        .domain(yRightExtents.reverse());

      if (this.timeToggle === "noTime")
        return { x: xScale, yLeft: yLeft, yRight: yLeft };

      return { x: xScale, yLeft: yLeft, yRight: yRight };
    },
    plotData: function() {
      function average(nums) {
        return nums.reduce((a, b) => a + b) / nums.length;
      }

      // If statements here choose the X1 Y1 Y2, with Floating averages.
      let data = [];
      let y1Avg, y2Avg;
      let y1AvgArray = [],
        y2AvgArray = [];

      // iterate through the array, creating a floating average:
      this.rawData.forEach((e, index) => {
        // floating average starts on the 7th data point:
        if (index > 13) {
          y1AvgArray = this.rawData
            .slice(index - 13, index + 1)
            .map((e) => e.PositiveResults)
            .filter(function(el) {
              return el != "";
            });

          y2AvgArray = this.rawData
            .slice(index - 13, index + 1)
            .map((e) => e.WW_Daily_copiesPml)
            .filter(function(el) {
              return el != "";
            });
        }

        y1AvgArray.length > 0 ? (y1Avg = average(y1AvgArray)) : (y1Avg = "");
        y2AvgArray.length > 0 ? (y2Avg = average(y2AvgArray)) : (y2Avg = "");

        data.push({
          x:
            this.timeToggle === "noTime"
              ? e.WW_Daily_copiesPml
              : new Date(e.Date),
          y1: e.PositiveResults,
          y1Avg: y1Avg,
          y2:
            this.timeToggle === "noTime"
              ? e.PositiveResults
              : e.WW_Daily_copiesPml,
          y2Avg: y2Avg,
        });
      });

      // Plot then is limited to the X and Y
      return data;
    },
    avgLines() {
      const avgLineRed = d3
        .line()
        .x((e) => this.scales.x(e.x))
        .y((e) => this.scales.yLeft(e.y1Avg))
        .defined((d) => d.y1Avg !== "");
      const avgLineBlue = d3
        .line()
        .x((e) => this.scales.x(e.x))
        .y((e) => this.scales.yRight(e.y2Avg))
        .defined((d) => d.y2Avg !== "");

      const avgBothLines = d3
        .line()
        .x((e) => this.scales.x(e.y2Avg))
        .y((e) => this.scales.yLeft(e.y1Avg))
        .defined((d) => d.y1Avg !== "")
        .defined((d) => d.y2Avg !== "");

      if (["time2Plots", "time1Plot"].includes(this.timeToggle))
        return { avgLineRed: avgLineRed, avgLineBlue: avgLineBlue };
      else
        return {
          avgLineRed: avgBothLines,
          avgLineBlue: avgBothLines,
        };
    },
    translations() {
      const leftAxis =
        "translate(" + this.margin.left + "," + this.margin.top + ")";
      const xAxis =
        "translate(" +
        this.margin.left +
        "," +
        (this.margin.top + this.margin.betweenPlotPadding * 2 + this.height) +
        ")";
      const xAxisTitle =
        "translate(" +
        (this.margin.left + this.width / 2) +
        "," +
        (this.margin.top +
          this.margin.betweenPlotPadding * 2 +
          this.height +
          30) +
        ")";

      let rightYAxis =
        "translate(" +
        (this.margin.left + this.width) +
        "," +
        (this.margin.top + this.margin.betweenPlotPadding + this.height / 2) +
        ")";
      let rightYAxisTitle =
        "translate(" +
        (this.margin.left + this.width + 5) +
        "," +
        (this.margin.top + this.margin.betweenPlotPadding + this.height / 4) +
        "),rotate(-90)";
      let leftAxisTitle =
        "translate(" +
        this.margin.left +
        "," +
        (this.margin.top + this.height / 4) +
        "),rotate(-90)";
      let rightData =
        "translate(" +
        this.margin.left +
        "," +
        (this.margin.top + this.margin.betweenPlotPadding + this.height / 2) +
        ")";
      if (["noTime", "time1Plot"].includes(this.timeToggle)) {
        rightYAxis =
          "translate(" +
          (this.margin.left + this.width) +
          "," +
          this.margin.top +
          ")";
        rightData =
          "translate(" + this.margin.left + "," + this.margin.top + ")";
      }

      switch (this.timeToggle) {
        case "noTime":
          rightYAxisTitle =
            "translate(" +
            this.margin.left +
            "," +
            (this.margin.top +
              this.margin.betweenPlotPadding * 2 +
              this.height) +
            ")";

          break;
        case "time1Plot":
          rightYAxisTitle =
            "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.height / 2) +
            "),rotate(-90)";
          break;
        // case "time2Plots":
      }
      return {
        rightYAxis,
        rightYAxisTitle,
        rightData,
        leftAxis,
        leftAxisTitle,
        xAxis,
        xAxisTitle,
      };
    },
    dataOpactity() {
      if (["time2Plots", "time1Plot"].includes(this.timeToggle)) return 1;
      return 0.5;
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
            this.margin.betweenPlotPadding * 2
        );
      // Bound, remove eventualyl:
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
            this.margin.betweenPlotPadding * 2
        )
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", 1);

      // // ----- axes ----
      svg
        .append("g")
        .call(
          d3
            .axisBottom(this.scales.x)
            .tickSize(2)
            .tickFormat(d3.timeFormat("%m"))
            .ticks(8)
        )
        .attr("transform", this.translations.xAxis)
        .attr("class", "xaxis")
        .selectAll(".tick text")
        .style("font-size", 12);
      svg
        .append("text")
        .attr("transform", this.translations.xAxisTitle)
        .attr("class", "xaxistitle")
        .style("text-anchor", "middle")
        .text("Month")
        .style("font-size", 12);

      // Left axis:
      svg
        .append("g")
        .call(
          d3
            .axisLeft(this.scales.yLeft)
            .tickSize(2)
            .ticks(5)
        )
        .attr("class", "leftaxis")
        .attr("transform", this.translations.leftAxis)
        .style("color", "red")
        .selectAll(".tick text")
        .style("font-size", 12);
      svg
        .append("text")
        .attr("transform", this.translations.leftAxisTitle)
        .attr("class", "leftaxistitle")
        .style("text-anchor", "middle")
        .text("Positive Cases per Day")
        .style("font-size", 12);
      // Right axis:
      svg
        .append("g")
        .call(
          d3
            .axisRight(this.scales.yRight)
            .tickSize(2)
            .ticks(5)
        )
        .attr("class", "rightaxis")
        .attr("transform", this.translations.rightYAxis)
        .style("color", "blue")
        .selectAll(".tick text")
        .style("font-size", 12);
      svg
        .append("text")
        .attr("transform", this.translations.rightYAxisTitle)
        .style("text-anchor", "middle")
        .text("Copies per Ml")
        .style("font-size", 12)
        .attr("id", "leftAxisTitle");

      // Dots:
      svg
        .selectAll("dot")
        .data(this.plotData)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("cy", (e) => this.scales.yLeft(e.y1))
        .attr("r", 1)
        .style("fill", "red")
        .attr("transform", this.translations.leftAxis)
        .attr("id", "redDots");
      svg
        .selectAll("dot")
        .data(this.plotData.filter((e) => e.y2))
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("cy", (e) => this.scales.yRight(e.y2))
        .attr("r", 1)
        .style("fill", "blue")
        .attr("transform", this.translations.rightData)
        .attr("id", "blueDots");
      svg
        .append("path")
        .attr("d", this.avgLines.avgLineRed(this.plotData))
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", this.translations.leftAxis)
        .attr("id", "theRedLine");
      svg
        .append("path")
        .attr("d", this.avgLines.avgLineBlue(this.plotData))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("transform", this.translations.rightData)
        .attr("id", "theBlueLine");
    },
    updateViz: async function(next, prev) {
      await d3
        .selectAll("#redDots")
        .data(this.plotData)
        .transition()
        .duration(this.transitionDuration)
        .attr("cy", (e) => this.scales.yLeft(e.y1))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.leftAxis)
        .style("opacity", this.dataOpactity);
      await d3
        .selectAll("#blueDots")
        .data(this.plotData.filter((e) => e.y2))
        .transition()
        .duration(this.transitionDuration)
        .attr("cy", (e) => this.scales.yRight(e.y2))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.rightData)
        .style("opacity", this.dataOpactity);
      await d3
        .selectAll("#theRedLine")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.avgLines.avgLineRed(this.plotData))
        .attr("transform", this.translations.leftAxis)
        .style("opacity", this.dataOpactity);
      await d3
        .selectAll("#theBlueLine")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.avgLines.avgLineBlue(this.plotData))
        .attr("transform", this.translations.rightData)
        .style("opacity", this.dataOpactity);

      const svg = d3.select("#covidViz");

      await svg
        .selectAll(".leftaxistitle")
        .transition()
        .duration(this.transitionDuration)
        .attr("transform", this.translations.xAxisTitle);

      await svg
        .selectAll(".leftaxis")
        .transition()
        .duration(this.transitionDuration)
        .call(
          d3
            .axisLeft(this.scales.yLeft)
            .tickSize(2)
            .ticks(5)
        );
      await svg
        .selectAll(".rightaxis")
        .transition()
        .duration(this.transitionDuration)
        .call(
          d3
            .axisRight(this.scales.yRight)
            .tickSize(2)
            .ticks(5)
        )
        .attr("transform", this.translations.rightYAxis);
      if (next === "noTime") {
        await svg
          .selectAll(".xaxis")
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 0)
          .remove();
        await svg
          .selectAll(".xaxistitle")
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 0);
        await svg
          .selectAll(".rightaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(
            d3
              .axisBottom(this.scales.x)
              .tickSize(2)
              .tickFormat(d3.format(",.0f"))
              .tickPadding(10)
              .ticks(5)
          )
          .style("color", "blue")
          .attr("transform", this.translations.xAxis);
      }
      if (prev === "noTime") {
        await svg
          .append("g")
          .call(
            d3
              .axisBottom(this.scales.x)
              .tickSize(2)
              .tickFormat(d3.timeFormat("%m"))
              .ticks(8) //-%d"))
          )
          .attr("transform", this.translations.xAxis)
          .attr("class", "xaxis")
          .style("font-size", 12)
          .style("opacity", 0)
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 1);

        await svg
          .selectAll(".xaxistitle")
          .transition()
          .duration(this.transitionDuration)
          .style("opacity", 1);
      }
    },
  },
};
</script>

<style lang="sass" scoped></style>
