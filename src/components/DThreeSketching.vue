<template>
  <v-card dark tile outlined max-width="300">
    Here be my D3 BS:
    <h1>SAMPLE THING</h1>
    <p></p>
    <v-btn dark @click="d3Trigger">Click me</v-btn>
    <v-slider v-model="sliderValue" min="0" max="255" />
    <v-divider />
    <div>Here's a div</div>
  </v-card>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "DThreeSketching",
  data: () => ({
    title: "CharTitleDataProp",
    sliderValue: 100
  }),
  watch: {
    sliderValue: function() {
      this.d3Trigger();
      this.d3BarPlot();
    }
  },
  methods: {
    d3Trigger: function() {
      let color = "rgb(".concat(this.sliderValue, ",0,0)");
      d3.select("h1").style("color", color);
      d3.select("p").text(this.title);
      d3.select("p")
        .append("p")
        .text(this.sliderValue);
    },

    d3BarPlotShort: function() {
      const div = d3
        .create("div")
        .style("font", "10px sans-serif")
        .style("text-align", "right")
        .style("color", "white");
      div
        .selectAll("div")
        .data([4, 8, 15, 16, 23, 42])
        .join("div")
        .style("background", "steelblue")
        .style("padding", "3px")
        .style("margin", "1px")
        .style("width", d => `${d * 10}px`)
        .text(d => d);
      return div.node();
    }
  },
  computed: {
    // slider or whatever
  }
};
</script>
