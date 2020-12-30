<template>
  <div class="about">
    <v-container fluid class="ma-0 pa-0">
      <!-- <random-sin-wave-fun /> -->
      <metronome />
      <v-row>
        <v-col align="center">
          <v-card flat max-width="400">
            <v-card-text>
              Please go to
              <a href="https://www.torymiles.com">torymiles.com</a>
              or
              <a href="https://www.lesliemiles.ca">lesliemiles.ca</a>
              for more great content.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: "About",
  components: {
    // RandomSinWaveFun: () => import("../components/RandomSinWaveFun.vue"),
    // MusicNotes: () => import("../components/MusicNotes.vue"),
    Metronome: () => import("../components/Metronome.vue"),
  },
};
</script>
