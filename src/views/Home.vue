<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <!-- make regular flex size. bind in the image source. bind in other stuff? image size, desizred popup open card thing.  -->
      <!-- figure gallery: -->
      <!-- <figure-display /> -->
      <!-- <basic-chart /> -->
<br />
<br />
<br />

      <random-sin-wave-fun />
      <br />
<br />
<br />
<br />

      <!-- <d-three-sketching /> -->
      <!-- <threshold-calc /> -->
      <!-- <d-three-example /> -->
      <!-- <d-three-play /> -->
      <!-- <v-row>
        <v-col align="center">
          <v-card flat max-width="500">
            <v-card-text>
              Please go to
              <a href="https://www.torymiles.com">torymiles.com</a>
              or
              <a href="https://www.lesliemiles.ca">lesliemiles.ca</a>
              for
              more great content.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import FigureDisplay from "../components/FigureDisplay.vue";
// import ExampleModal from "../components/ExampleModal.vue";
// import DThreeSketching from "../components/DThreeSketching.vue";
// import DThreeExample from "../components/DThreeExample.vue"; // THIs IS GOOD
// import DThreePlay from "../components/DThreePlay.vue";
// import ThresholdCalc from "../components/HydroToolThresholdCalc.vue";
// import BasicChart from "../components/D3VueBasic.vue";
import RandomSinWaveFun from "../components/RandomSinWaveFun.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
    // FigureDisplay,
    // ExampleModal
    // DThreeSketching,
    // DThreeExample, //THIS IS GOOD
    // ThresholdCalc,
    // BasicChart,
    RandomSinWaveFun
    // DThreePlay,
  }
};
</script>
