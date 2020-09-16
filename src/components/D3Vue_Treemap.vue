<template>
  <div>
    A basic vue component to test out good ways of integrating D3 and Vue.
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
  data: () => ({
    margin: { top: 30, right: 20, bottom: 30, left: 40 },
    width: 400,
    height: 400,
    //
    radioMultiplier: 1,
    //
    transitionDuration: 1300,
    //
    tree: {
      children: [
        {
          name: "Organic",
          value: 10,
          colname: "level3"
        },
        {
          name: "Air",
          value: 20,
          colname: "level3"
        },
        {
          name: "Water",
          value: 20,
          colname: "level3"
        },
        { name: "Mineral", value: 50, colname: "level3" }
      ]
    }
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
    instantiateTree: function() {
      let data = this.soilCompositionTree;

      let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // remove the old schniz
      d3.select("#soilTreeMap")
        .selectAll("*")
        .remove();

      // append the svg object to the body of the page
      let svg = d3
        .select("#soilTreeMap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Give the data to this cluster layout:
      let root = d3.hierarchy(data).sum(d => d.value);
      // Here the size of each leave is given in the 'value' field in input data

      // Then d3.treemap computes the position of each element of the hierarchy
      d3
        .treemap() // this can happen to the root on update?
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)(
        // Padding between each rectangle
        //.paddingOuter(6)
        //.padding(20)
        root
      );

      // // prepare a color scale
      let color = d3
        .scaleOrdinal()
        .domain(["Air", "Water", "Mineral", "Organic"])
        .range(["#c9c9c9", "#3449eb", "#8a6950", "#242424"]);

      // use this information to add rectangles:
      svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .transition()
        .duration(2000)
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", d => color(d.data.name));
      // .style("opacity", (d) => opacity(d.data.value));

      // and to add the text labels
      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5) // +10 to adjust position (more right)
        .attr("y", d => d.y0 + 20) // +20 to adjust position (lower)
        .text(d => d.data.name)
        .attr("font-size", "13px")
        .attr("fill", "white");

      // and to add the value labels
      svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5) // +10 to adjust position (more right)
        .attr("y", d => d.y0 + 35) // +20 to adjust position (lower)
        .text(d => d.data.value)
        .attr("font-size", "11px")
        .attr("fill", "white");
    },
    updateViz: function() {}
  }
};
</script>

<style lang="sass" scoped></style>
