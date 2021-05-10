<template>
  <v-container>
    <v-btn @click="rankToggle = !rankToggle">
      Calculate Days
    </v-btn>
    <svg id="simpleViz" />
  </v-container>
</template>

<script>
import * as d3 from "d3";
import temperatureData from "../lib/data/degreeHeatCool.json";

export default {
  components: {},
  data: () => ({
    margin: { top: 50, right: 50, bottom: 50, left: 50 },
    width: 600, // computed prop!
    height: 400,
    transitionDuration: 1300,
    temperatureData: temperatureData,
    livingTemps: { low: 68, high: 70 },
    rankToggle: false,
  }),
  mounted() {
    this.instantiateViz();
  },
  watch: {
    rankToggle() {
      this.updateViz();
    },
  },
  computed: {
    degreeDays: function() {
      const heat = 50;
      const cool = 20;
      return { heat, cool };
    },
    plotData: function() {
      // make a new array of the data, needed because of the lazy way I am importing the data
      let orderArr = this.temperatureData.map((e) => ({
        Date: e.Date,
        AvgTemp: e.AvgTemp,
      }));
      // order and rank it for display:
      return (
        orderArr
          // order high to low:
          .sort((a, b) => parseFloat(b.AvgTemp) - parseFloat(a.AvgTemp))
          // add the rank:
          .map((e, index) => ({
            Date: new Date(e.Date),
            AvgTemp: e.AvgTemp,
            rank: index,
          }))
          // sort back on the date, not strictly neccessary, but keeps me sane:
          .sort((a, b) => a.Date - b.Date)
      );
    },
    domain: function() {
      return {
        // use d3.extent!
        xDate: [
          this.plotData.map((e) => e.Date)[0],
          this.plotData.map((e) => e.Date).slice(-1)[0],
        ],
        xRank: [
          Math.max(...this.plotData.map((e) => e.rank)),
          Math.min(...this.plotData.map((e) => e.rank)),
        ],
        y: [
          Math.max(...this.plotData.map((e) => e.AvgTemp)),
          Math.min(...this.plotData.map((e) => e.AvgTemp)),
        ],
      };
    },
    scales: function() {
      const xDate = d3
        .scaleUtc()
        .range([0, this.width]) //pixles
        .domain(this.domain.xDate);
      const xRank = d3
        .scaleLinear()
        .range([0, this.width]) //pixles
        .domain(this.domain.xRank);
      const y = d3
        .scaleLinear()
        .range([0, this.height])
        .domain(this.domain.y);
      return { xDate, xRank, y };
    },
  },
  methods: {
    updateViz: function() {
      if (this.rankToggle) {
        d3.selectAll("#myBars")
          .data(this.plotData)
          .transition()
          .duration(this.transitionDuration)
          .attr("x", (e) => this.scales.xRank(e.rank));
        d3.selectAll("#myPoints")
          .data(this.plotData)
          .transition()
          .duration(this.transitionDuration)
          .attr("cx", (e) => this.scales.xRank(e.rank));
        d3.select(".xaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisBottom(this.scales.xRank));
      } else {
        d3.selectAll("#myBars")
          .data(this.plotData)
          .transition()
          .duration(this.transitionDuration)
          .attr("x", (e) => this.scales.xDate(e.Date));
        d3.selectAll("#myPoints")
          .data(this.plotData)
          .transition()
          .duration(this.transitionDuration)
          .attr("cx", (e) => this.scales.xDate(e.Date));
        d3.select(".xaxis")
          .transition()
          .duration(this.transitionDuration)
          .call(d3.axisBottom(this.scales.Date));
      }
    },
    instantiateViz: function() {
      // // make the svg:
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
        .style("fill", "rgb(240,240,240)");

      svg
        .append("g")
        .call(d3.axisBottom(this.scales.xDate).tickFormat(d3.timeFormat("%m")))
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + this.height + 5) +
            ")"
        )
        .style("font-size", 12)
        .attr("class", "xaxis");
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y))
        .attr(
          "transform",
          "translate(" + (this.margin.left - 5) + "," + this.margin.top + ")"
        )
        .style("font-size", 12);
      //// Add some points to show the data:
      svg
        .selectAll("myPoints")
        .data(this.plotData)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.xDate(e.Date))
        .attr("cy", (e) => this.scales.y(e.AvgTemp))
        .attr("r", 1)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "myPoints");
      svg
        .selectAll("myBars")
        .data(this.plotData)
        .enter()
        .append("rect")
        .attr("x", (e) => this.scales.xDate(e.Date))
        .attr("y", (e) => {
          if (e.AvgTemp < this.livingTemps.low) {
            return this.scales.y(this.livingTemps.low);
          } else if (e.AvgTemp > this.livingTemps.high) {
            return this.scales.y(e.AvgTemp);
          } else {
            return this.scales.y(this.livingTemps.high);
          }
        })
        .attr("width", 2)
        .attr("height", (e) => {
          if (e.AvgTemp < this.livingTemps.low) {
            return (
              this.scales.y(e.AvgTemp) - this.scales.y(this.livingTemps.low)
            );
          } else if (e.AvgTemp > this.livingTemps.high) {
            return (
              this.scales.y(this.livingTemps.high) - this.scales.y(e.AvgTemp)
            );
          } else {
            return (
              this.scales.y(this.livingTemps.low) -
              this.scales.y(this.livingTemps.high)
            );
          }
        })
        .attr("fill", (e) => {
          if (e.AvgTemp < this.livingTemps.low) {
            return "rgba(255,0,0,0.4)";
          } else if (e.AvgTemp > this.livingTemps.high) {
            return "rgba(0,0,255,0.4)";
          } else {
            return "rgba(0,0,0,0)";
          }
        })
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "myBars");
    },
  },
};
</script>

<style lang="sass" scoped></style>
