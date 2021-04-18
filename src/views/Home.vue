<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <br />
      <br />
      <v-row justify="center" align="center">
        <v-card height="605" width="505" outlined tile>
          <v-card-text> 
            Click and drag to rotate, press 't' to reset the view to top</v-card-text>
          <x3d height="500px" width="500px">
            <test />
          </x3d>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Test from "../components/TestModel.vue";

export default {
  name: "Home",
  components: {
    Test,
  },
};
</script>
