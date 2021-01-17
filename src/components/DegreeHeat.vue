<template>
  <v-container class="ma-0 pa-0">
    <v-row justify="center" no-gutters>
      <v-col align="center" cols="12">
        {{ livingTemps }}
        <br />
        {{ degreeDays }}
        <br />
        {{ rankToggle }}
        <v-btn @click="rankToggle = !rankToggle">
          Calculate Days
        </v-btn>
        <svg style="display:block" id="simpleViz" />
        {{ plotData }}
      </v-col>
    </v-row>
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
    livingTemps: { low: 60, high: 72 },
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
    orderData: function() {
      let orderArr = this.temperatureData.map((e) => ({
        Date: e.Date,
        AvgTemp: e.AvgTemp,
      }));
      orderArr = orderArr.slice(0, 500);
      orderArr.sort((a, b) => parseFloat(b.AvgTemp) - parseFloat(a.AvgTemp));
      return orderArr.map((e, index) => ({
        Date: new Date(e.Date),
        AvgTemp: e.AvgTemp,
        rank: index,
      }));
    },
    plotData: function() {
      let data = this.orderData;
      return data.sort((a, b) => a.Date - b.Date);
      // return data.slice(0, 500);
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
    // perfect for webWorker!
    // why doent myBars update fully? am I reaching a limit?
    updateViz: function() {
      let duration = 4000;
      if (this.rankToggle) {
        d3.selectAll("#myBars")
          .data(this.plotData)
          .transition()
          .duration(duration)
          .attr("x", (e) => this.scales.xRank(e.rank));
        d3.selectAll("#myPoints")
          .data(this.plotData)
          .transition()
          .duration(duration)
          .attr("cx", (e) => this.scales.xRank(e.rank));
        d3.select(".xaxis")
          .transition()
          .duration(duration)
          .call(d3.axisBottom(this.scales.xRank));
      } else {
        d3.selectAll("#myBars")
          .data(this.plotData)
          .transition()
          .duration(duration)
          .attr("x", (e) => this.scales.xDate(e.Date));
        d3.selectAll("#myPoints")
          .data(this.plotData)
          .transition()
          .duration(duration)
          .attr("cx", (e) => this.scales.xDate(e.Date));
        d3.select(".xaxis")
          .transition()
          .duration(duration)
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
            return "rgba(0,0,0,0.1)";
          }
        })
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "myBars");
      // ////////////////
      // svg
      //   .selectAll("myRedBars")
      //   .data(this.plotData.filter((d) => d.AvgTemp < this.livingTemps.low))
      //   .enter()
      //   .append("rect")
      //   .attr("x", (e) => this.scales.xDate(e.Date))
      //   .attr("y", this.scales.y(this.livingTemps.low))
      //   .attr("width", 2)
      //   .attr(
      //     "height",
      //     (e) => this.scales.y(e.AvgTemp) - this.scales.y(this.livingTemps.low)
      //   )
      //   .attr("fill", "rgba(255,0,0,0.2)")
      //   .attr(
      //     "transform",
      //     "translate(" + this.margin.left + "," + this.margin.top + ")"
      //   )
      //   .attr("id", "myBars");
      // svg
      //   .selectAll("myBlueBars")
      //   .data(this.plotData.filter((d) => d.AvgTemp > this.livingTemps.high))
      //   .enter()
      //   .append("rect")
      //   .attr("x", (e) => this.scales.xDate(e.Date))
      //   .attr("y", (e) => this.scales.y(e.AvgTemp))
      //   .attr("width", 2)
      //   .attr(
      //     "height",
      //     (e) => this.scales.y(this.livingTemps.high) - this.scales.y(e.AvgTemp)
      //   )
      //   .attr("fill", "rgba(0,0,255,0.1)")
      //   .attr(
      //     "transform",
      //     "translate(" + this.margin.left + "," + this.margin.top + ")"
      //   )
      //   .attr("id", "myBars");
    },
  },
};
</script>

<style lang="sass" scoped></style>
