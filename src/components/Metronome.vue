<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center" no-gutters>
      <v-col align="center" cols="12">
        <v-card class="mx-auto" max-width="600" flat outlined>
          <v-toolbar flat dense>
            <v-toolbar-title>
              <span class="subheading">A BAD METRONOME</span>
            </v-toolbar-title>
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
    <v-row justify="center" align="center" no-gutters>
      <v-col align="center">
        <v-card elevation="0" max-width="500">
          <v-card-text>
            This metronome is like practicing with a bass player in the Cantab
            basement jam who's a little tipsy and maybe trying to text and play
            at the same time. It is possible I have been this person at once.
            I'm sorry.
            <br />
            <br />
            It's bad because running a metronome on Javascript's main thread
            (the "UI" thread) results in inconsistent timeouts in the browser.
            Don't do this. Use a webworker instead.
            <br />
            <br />
            This person knows what's up:
            <a href="https://meowni.ca/posts/metronomes/">
              https://meowni.ca/posts/metronomes/ </a
            >. Her post is great. read it if you're trying to make a metronome.
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
    bpm: 69,
    interval: null,
    isPlaying: false,
    myInterval: null,
  }),
  watch: {
    bpm() {
      this.stopMetronome();
      this.scheduler();
    },
  },
  computed: {
    color() {
      if (this.bpm < 100) return "indigo";
      if (this.bpm < 125) return "teal";
      if (this.bpm < 140) return "green";
      if (this.bpm < 175) return "orange";
      return "red";
    },
    timeoutDuration() {
      return (60 / this.bpm) * 1000;
    },
  },
  methods: {
    scheduler: function() {
      if (this.isPlaying) {
        this.startMetronome();
      } else this.stopMetronome();
    },
    startMetronome() {
      this.myInterval = setInterval(this.play, this.timeoutDuration);
    },
    stopMetronome() {
      clearInterval(this.myInterval);
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
      var audio = new Audio(tickSound);
      audio.play();
    },
  },
};
</script>

