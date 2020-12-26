<template>
  <v-container class="ma-0 pa-0">
    <v-row justify="center" no-gutters>
      <v-col align="center" cols="12">
        <v-card class="mx-auto" max-width="600" flat outlined>
          <v-toolbar flat dense>
            <v-toolbar-title>
              <span class="subheading">METRONOME</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-row class="mb-4" justify="space-between">
              <v-col class="text-left">
                <span class="display-3 font-weight-light" v-text="bpm"></span>
                <span class="subheading font-weight-light mr-1">BPM</span>
              </v-col>
              <v-col class="text-right">
                <v-btn :color="color" dark depressed fab @click="toggle">
                  <v-icon large>
                    {{ isPlaying ? "mdi-pause" : "mdi-play" }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-slider
              v-model="bpm"
              :color="color"
              track-color="grey"
              always-dirty
              min="40"
              max="218"
            >
              <template v-slot:prepend>
                <v-icon :color="color" @click="decrement">
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon :color="color" @click="increment">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import * as d3 from "d3";
import tickSound from "../assets/click.mp3"; // Tell webpack this JS file uses this image

export default {
  components: {},
  data: () => ({
    bpm: 40,
    interval: null,
    isPlaying: false,
  }),
  mounted() {
    // this.scheduler();
  },
  watch: {},
  computed: {
    color() {
      if (this.bpm < 100) return "indigo";
      if (this.bpm < 125) return "teal";
      if (this.bpm < 140) return "green";
      if (this.bpm < 175) return "orange";
      return "red";
    },
    animationDuration() {
      return `${60 / this.bpm}s`;
    },
  },
  methods: {
    scheduler: function() {
      var interval;
      console.log(this.isPlaying);
      if (this.isPlaying) interval = setInterval(this.play, 1000);
      if (!this.isPlaying) clearInterval(interval);
    },
    decrement() {
      this.bpm--;
    },
    increment() {
      this.bpm++;
    },
    toggle() {
      this.isPlaying = !this.isPlaying;
      this.scheduler();
    },
    play() {
      // this works! so set a duration on mount, if click,
      var audio = new Audio(tickSound);
      //   setInterval(audio.play(), 1000);

      audio.play();
    },
  },
};
</script>

<style lang="sass" scoped></style>
