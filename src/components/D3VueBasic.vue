<template>
  <v-row justify="center">
    <v-card :width="width" :height="height" tile outlined>
      <!-- D3 subcomponent!
      {{plotData.x}}-->
      <div id="simpleViz"></div>
    </v-card>
  </v-row>
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
      data: { min: 4, max: 14 },
      discretization: 10,
      //
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
  watch: {},
  computed: {
    plotData: function() {
      let x = [this.data.min];
      let y = [];
      let i = this.data.min;
      let delta = (this.data.max - this.data.min) / this.discretization;
      while (i < this.data.max) {
        x.push(i + delta);
        y.push(i * i);
        i += delta;
      }
      return { x: x, y: y };
    },
    domain: function() {
      return { x: [1, 20], y: [50, -50] };
    },
    scales: function() {
      const x = d3
        .scaleLinear()
        .range([0, this.width - this.margin.right - this.margin.left]) //pixles
        .domain(this.domain.x);
      // .domain([1, 20]);
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

      // give it a backgound for layout( not the data area)
      svg
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "pink");
      svg
        .append("rect")
        .attr("width", this.width - this.margin.right - this.margin.left)
        .attr("height", this.height - this.margin.bottom - this.margin.top)
        .attr("fill", "grey")
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

      // .attr("width", this.width + this.margin.left + this.margin.right)
      // .attr("height", this.height + this.margin.top + this.margin.bottom)
      // .append("g")
      // .attr(
      //   "transform",
      //   "translate(" + this.margin.left + "," + this.margin.top + ")"
      // );

      // svg.select()
    }
  }
};
</script>

<style lang="sass" scoped></style>
