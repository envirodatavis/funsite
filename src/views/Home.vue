<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <!-- make regular flex size. bind in the image source. bind in other stuff? image size, desizred popup open card thing.  -->
      <figure-display />
      <v-divider />
      <d-three-sketching />
      <v-divider />
      <d-three-example />
      <v-divider />
      <!-- <d-three-play /> -->
      <v-divider />
      <v-row>
        <v-col align="center">
          <v-card flat max-width="450">
            <v-card-text>
              Please go to
              <a href="https://www.torymiles.com">torymiles.com</a>
              or
              <a href="https://www.lesliemiles.ca">lesliemiles.ca</a>
              for
              really great content. They're both excellent artists.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import FigureDisplay from "../components/FigureDisplay.vue";
// import ExampleModal from "../components/ExampleModal.vue";
import DThreeSketching from "../components/DThreeSketching.vue";
import DThreeExample from "../components/DThreeExample.vue";
// import DThreePlay from "../components/DThreePlay.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
    FigureDisplay,
    // ExampleModal
    DThreeSketching,
    DThreeExample
    // DThreePlay
  }
};
</script>
