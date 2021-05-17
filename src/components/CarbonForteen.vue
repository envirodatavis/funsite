<template>
  <v-container fluid>
    <v-card tile outlined max-width="700" color="rgba(0,0,0,0.1)"> 
    <v-row justify="center">
      <svg id="carbonViz" style="margin: 0 auto;" />
    </v-row>
    <v-row justify="center">
      <v-btn-toggle mandatory v-model="timeScale" rounded dense>
        <v-btn value="linear" x-small style="background-color: #f2f0e6"
          >Linear Time
        </v-btn>
        <v-btn value="log" x-small style="background-color: #f2f0e6"
          >Log Time
        </v-btn>
      </v-btn-toggle>
    </v-row>
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="12" sm="3" style="font-size: 0.75rem;">
        Estimated C14 Depletion (per mil)
      </v-col>
      <v-col cols="8" sm="5" style="transform: scale(0.85)">
        <v-slider
          v-model="inputPerMilDepleted"
          :max="995"
          :min="10"
          color="black"
          hide-details
          dense
          track-color="grey"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model="inputPerMilDepleted"
              hide-details
              class="mt-0 pt-0"
              type="number"
              style="width: 60px; "
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" no-gutters>
      <v-col cols="12" sm="3" style="font-size: 0.75rem;">
        Standard Deviation of Estimate (per mil)
      </v-col>
      <v-col cols="8" sm="5" style="transform: scale(0.85)">
        <v-slider
          v-model="standardDeviation"
          :max="25"
          :min="2"
          color="black"
          track-color="grey"
          class="align-center"
        >
          <template v-slot:append>
            <v-text-field
              v-model="standardDeviation"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
    </v-row>
    </v-card>
  </v-container>
</template>

<script>
import * as d3 from "d3";
// import rawData from "../lib/data/covidData.json";

const carbon14Calc = (depletion) => {
  return -8033 * Math.log(1 + depletion);
};

const normalDist = (sigma, mean, e) => {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp((-0.5 * (e - mean) ** 2) / sigma ** 2)
  );
};

export default {
  components: {},
  data: () => ({
    margin: {
      top: 20,
      left: 140,
      right: 50,
      bottom: 80,
      xAxis: 30,
      yAxis: 10,
    },
    inputPerMilDepleted: 500,
    standardDeviation: 5,
    height: 300,
    timeScale: "linear",
    transitionDuration: 1000,
  }),
  mounted() {
    this.instantiateViz();
  },
  computed: {
    estimatedRCAge() {
      return carbon14Calc(-this.inputPerMilDepleted / 1000);
    },
    width() {
      if (window.innerWidth > 800) return 550;
      return window.innerWidth - 250;
    },
    estRadiocarbonDates() {
      let inputdata = [this.inputPerMilDepleted];
      return inputdata.map((e) => ({
        x: carbon14Calc(-e / 1000),
        y: e,
      }));
    },
    distroMax() {
      const mean = this.inputPerMilDepleted;
      const sigma = this.standardDeviation;
      return normalDist(sigma, mean, mean);
    },
    yDistroData() {
      const mean = this.inputPerMilDepleted;
      const sigma = this.standardDeviation;
      let binsStart = this.inputPerMilDepleted - 3 * sigma;
      const binsEnd = this.inputPerMilDepleted + 3 * sigma;
      let bins = [];
      const binSize = (binsEnd - binsStart) / 20;
      while (binsStart < binsEnd) {
        bins.push(binsStart);
        binsStart = binsStart + binSize;
      }
      return bins.map((e) => ({
        bin: e,
        dist: normalDist(sigma, mean, e),
      }));
    },
    xDistroData() {
      function clampDate(depletion) {
        if (depletion >= 998) return 998;
        if (depletion <= 12) return 12;
        return depletion;
      }
      return this.yDistroData.map((e) => ({
        bin: carbon14Calc(-clampDate(e.bin) / 1000),
        dist: e.dist,
      }));
    },
    scales() {
      const xLinear = d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, 50000]);
      const xLog = d3
        .scaleLog()
        .range([0, this.width])
        .domain([100, 50000]);
      const yScale = d3
        .scaleLinear()
        .range([0, this.height])
        .domain([100, 0]);
      const y2 = d3
        .scaleLinear()
        .range([0, this.height])
        .domain([0, 1000]);
      const ydistrox = d3
        .scaleLinear()
        .range([0, 25])
        .domain([0, this.distroMax]);

      const xdistroy = d3
        .scaleLinear()
        .range([0, 25])
        .domain([this.distroMax, 0]);

      if (this.timeScale === "log")
        return {
          x: xLog,
          y: yScale,
          y2: y2,
          ydistrox: ydistrox,
          xdistroy: xdistroy,
        };
      return {
        x: xLinear,
        y: yScale,
        y2: y2,
        ydistrox: ydistrox,
        xdistroy: xdistroy,
      };
    },
    radiocarbonLineData() {
      let depletion = [
        -0.0125,
        -0.02,
        -0.05,
        -0.07,
        -0.1,
        -0.2,
        -0.3,
        -0.4,
        -0.5,
        -0.6,
        -0.7,
        -0.8,
        -0.9,
        -0.95,
        -0.99,
        -0.998,
      ];
      return depletion.map((e) => ({
        x: carbon14Calc(e),
        y: -e * 1000,
      }));
    },
    carbonLine() {
      return d3
        .line()
        .x((e) => this.scales.x(e.x))
        .y((e) => this.scales.y2(e.y))
        .curve(d3.curveMonotoneX);
    },
    distroLines() {
      const y = d3
        .line()
        .x((e) => this.scales.ydistrox(e.dist))
        .y((e) => this.scales.y2(e.bin))
        .curve(d3.curveMonotoneX);

      const x = d3
        .line()
        .x((e) => this.scales.x(e.bin))
        .y((e) => this.scales.xdistroy(e.dist))
        .curve(d3.curveMonotoneX);
      return { y, x };
    },

    translations() {
      let margin = this.margin;
      const yAxis =
        "translate(" +
        (margin.left - margin.yAxis - 50) +
        "," +
        margin.top +
        ")";
      const yAxis2 =
        "translate(" + (margin.left - margin.yAxis) + "," + margin.top + ")";
      const yAxisTitle =
        "translate(" +
        (margin.left - margin.yAxis - 50) +
        "," +
        margin.top +
        ")";
      const yAxis2Title =
        "translate(" + (margin.left - margin.yAxis) + "," + margin.top + ")";
      const xAxis =
        "translate(" +
        margin.left +
        "," +
        (margin.top + this.height + margin.xAxis) +
        ")";
      const xAxisDistro =
        "translate(" +
        margin.left +
        "," +
        (margin.top + this.height + margin.xAxis - 25) +
        ")";
      const data = "translate(" + margin.left + "," + margin.top + ")";
      const xAxisTitle =
        "translate(" +
        (margin.left + this.width / 2) +
        "," +
        (margin.top + this.height + margin.xAxis + 40) +
        ")";
      return {
        yAxis,
        yAxis2,
        xAxis,
        yAxisTitle,
        yAxis2Title,
        xAxisDistro,
        data,
        xAxisTitle,
      };
    },
  },
  watch: {
    timeScale(next, prev) {
      if (next && prev) this.updateScales();
    },
    inputPerMilDepleted(next, prev) {
      if (next && prev) this.updateRCEstimate();
    },
    standardDeviation() {
      this.updateRCEstimate();
    },
    estRadiocarbonDates() {
      this.updateRCEstimate();
    },
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      const svg = d3
        .select("#carbonViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);

      // // ----- axes ----
      svg
        .append("g")
        .call(d3.axisBottom(this.scales.x).ticks(6))
        .attr("transform", this.translations.xAxis)
        .attr("class", "xaxis");

      svg
        .append("text")
        .attr("transform", this.translations.xAxisTitle)
        .style("text-anchor", "middle")
        .text("Radiocarbon Age")
        .style("font-size", 12);

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y))
        .attr("class", "leftaxis")
        .attr("transform", this.translations.yAxis);

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y2))
        .attr("class", "leftaxis2")
        .attr("transform", this.translations.yAxis2);

      // data: the carbon line
      svg
        .append("path")
        .attr("d", this.carbonLine(this.radiocarbonLineData))
        .attr("stroke", "red")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.data)
        .attr("id", "theline");
      // data: the distro line
      svg
        .append("path")
        .attr("d", this.distroLines.y(this.yDistroData))
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.yAxis2)
        .attr("id", "theydistroline");

      svg
        .append("path")
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro)
        .attr("id", "thexdistroline");

      svg
        .selectAll("thedots")
        .data(this.estRadiocarbonDates)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("r", 2)
        .style("fill", "black")
        .attr("transform", this.translations.data)
        .attr("id", "thedots");
    },
    updateScales: async function() {
      const svg = d3.select("#carbonViz");
      await svg
        .selectAll(".xaxis")
        .transition()
        .duration(this.transitionDuration)
        .call(
          d3
            .axisBottom(this.scales.x)
            .tickFormat((x) => (/[15]/.test(x) ? x : "")) // just show 1s and 5s in the ticks
          // .ticks()
        ); // TODO: fix the tick format when returning to linear
      await d3
        .selectAll("#thedots")
        .data(this.estRadiocarbonDates)
        .transition()
        .duration(this.transitionDuration)
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#theline")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.carbonLine(this.radiocarbonLineData))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#thexdistroline")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro);
    },
    updateRCEstimate: async function() {
      await d3
        .selectAll("#thedots")
        .data(this.estRadiocarbonDates)
        .transition()
        .duration(50)
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#theydistroline")
        .transition()
        .duration(50)
        .attr("d", this.distroLines.y(this.yDistroData))
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.yAxis2);

      await d3
        .selectAll("#thexdistroline")
        .transition()
        .duration(50)
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", "blue")
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro);
    },
  },
};
</script>
