<template>
  <v-row justify="center">
    <v-card max-width="700">
      <v-card-title>Threshold Caculation</v-card-title>
      <v-card-text>
        If a non aqueous phase liquid (NAPL) is spilled on the ground, it will
        dissolve into different phases on the soil. This is a problem with many
        oil-like substances that we use to manufacture things. Soil is a mix of
        grains (tiny rocks), water, air, and organic matter. Polluting chemicals
        will dissolve over time into these different phases. It is difficult to
        tell if any amount of the NAPL phase remains years after a spill
        happens, and that can have a big effect on cleaning up the pollution.
        <br />
        <br />
        Soil samples are collected to determine how contaminated a site is. But
        because soil is actually air, water, soil grains, and organics, a sample
        tells us how much chemical is in all the phases. It is surprisingly hard
        to see the NAPL of an old spill, because the NAPL spreads out and
        becomes a very thin film or small blobs. but these can have a big effect
        on the evnironment. Once we have samples, we can tell if any NAPL
        remains by caluclating the maximum concentration that can exist in the
        three phases.
      </v-card-text>
      <v-card-text>
        <v-card tile outlined>
          <v-card-text>
            (This is what soil looks like)
            <br />
            options with toggle buttons: a really wet, organicy soil
            <br />
            {slider for soil - water - air poportions}
            <br />
            <v-radio-group v-model="soilType">
              <v-radio color="black" label="clean sand" value="cleanSand" />
              <v-radio color="black" label="sand" value="sand" />
              <v-radio color="black" label="peat" value="peat" />
            </v-radio-group>
            <div id="my_dataviz"></div>
          </v-card-text>
        </v-card>
        <br />
      </v-card-text>

      <v-card-title>
        Concentration Threshold
      </v-card-title>
      <v-card-text>
        <br />Ct = effectiveSolubility/bulk density x ( KdPb + Water Filled
        Porosity + Henry's constantxAir Porosity )
        <br />
        <br />
        <v-card tile outlined width="700px">
          <v-row no-gutters>
            <v-col>
              <v-card-title>Henry's Constant</v-card-title>
              <v-subheader
                >Is the amount that a compnound is going to be in the air phase
                over the water phase</v-subheader
              >
            </v-col>
            <v-col>
              THIS WILL BE A COMPONENT
              <svg
                id="dataviz_area1"
                width="300"
                height="100"
                style="margin: 15px"
              >
                <g>
                  <rect
                    width="300"
                    height="100"
                    style="fill:rgba(100,100,100,0.1); stroke-width:1; stroke:rgba(100, 100, 100,0.5);"
                  />
                </g>
              </svg>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col></v-col>
            <v-col>{{ unitlessHenrysConstant }}</v-col>
            <v-col cols="9">
              <v-slider
                v-model="unitlessHenrysConstantSlider"
                @input="sliderMethod(unitlessHenrysConstantSlider, 100)"
                min="20"
                max="130"
              ></v-slider>
            </v-col>
          </v-row>
        </v-card>
        <br />
        Effective Solubility: {{ effectiveSolublity }}
        <br />
        dry bulk density: {{ dryBulkDensity }}
        <br />
        water filled porosity: {{ waterFilledPorosity }}
        <br />
        air filled Porosity: {{ airFilledPorosity }}
        <br />
        koc Organic Carbon: {{ KocOrganicCarbon }}
        <br />
        Fraction organic carbon: {{ fOc }}
        <br />

        <br />
        the answer is: {{ cThreshold }}
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
// IDEA:
//  presets, like " a wet organic soil" "short explanaiton on what that means, how common that would be"
//  ""
import * as d3 from "d3";
// import {thing} from "../lib/utils/hydroCalculations.js"

export default {
  data() {
    return {
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
      // initial Ct should be 515
      // write a jest test for that, cool.
    };
  },
  mounted() {
    this.makeATreeMap();
  },
  watch: {
    soilType(next) {
      switch (next) {
        case "cleanSand":
          this.fOc = 0.03;

          break;
        case "sand":
          this.fOc = 0.05;

          break;
        case "peat":
          this.fOc = 0.2;
          break;
      }
      this.makeATreeMap();
      // this.updateATreeMap();
    },
  },
  computed: {
    soilCompositionTree: function() {
      let soil =
        1 - this.airFilledPorosity - this.waterFilledPorosity - this.fOc;
      let tree = {
        children: [
          {
            name: "Organic",
            value: this.fOc,
            colname: "level3",
          },
          {
            name: "Air",
            value: this.airFilledPorosity,
            colname: "level3",
          },
          {
            name: "Water",
            value: this.waterFilledPorosity,
            colname: "level3",
          },
          { name: "Mineral", value: soil, colname: "level3" },
        ],
      };
      return tree;
    },
    KdSoilWaterPartition: function() {
      return this.KocOrganicCarbon * this.fOc;
    },
    cThreshold: function() {
      return (
        (this.effectiveSolublity / this.dryBulkDensity) *
        (this.KdSoilWaterPartition * this.dryBulkDensity +
          this.waterFilledPorosity +
          this.unitlessHenrysConstant * this.airFilledPorosity)
      ).toFixed(1);
    },
    scales: function() {
      const x = d3.scaleLinear().range([0, 300]); // range is pixel values
      const y = d3.scaleLinear().range([300, 0]);
      x.domain([0, 30]); // domain is value
      y.domain([0, 30]);
      return { x, y };
    },
  },
  methods: {
    sliderMethod: function(e, divisor) {
      this.unitlessHenrysConstant = e / divisor;
    },

    // instantiates the tree:
    makeATreeMap: function() {
      let data = this.soilCompositionTree;

      let margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // remove the old schniz
      d3.select("#my_dataviz")
        .selectAll("*")
        .remove();

      // append the svg object to the body of the page

      let svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      // Give the data to this cluster layout:
      let root = d3.hierarchy(data).sum((d) => d.value); // Here the size of each leave is given in the 'value' field in input data

      // Then d3.treemap computes the position of each element of the hierarchy
      d3
        .treemap()
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
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", (d) => color(d.data.name));
      // .style("opacity", (d) => opacity(d.data.value));

      // and to add the text labels
      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", (d) => d.x0 + 5) // +10 to adjust position (more right)
        .attr("y", (d) => d.y0 + 20) // +20 to adjust position (lower)
        .text((d) => d.data.name)
        .attr("font-size", "13px")
        .attr("fill", "white");

      // and to add the value labels
      svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", (d) => d.x0 + 5) // +10 to adjust position (more right)
        .attr("y", (d) => d.y0 + 35) // +20 to adjust position (lower)
        .text((d) => d.data.value)
        .attr("font-size", "11px")
        .attr("fill", "white");
    },
    updateATreeMap: function() {
      //TODO make this work with an animation somehow
    },
  },
};
</script>

<style lang="sass" scoped></style>
