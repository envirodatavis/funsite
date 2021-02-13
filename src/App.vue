<template>
  <v-app>
    <template>
      <div id="app">
        <div id="nav">
          <v-row justify="center" style="padding-top:10px">
            <router-link to="/">MAFS 1</router-link>
            <span style="padding-left: 5px;padding-right: 5px;">|</span>
            <router-link to="/mafs2">MAFS 2</router-link>
            <span style="padding-left: 5px;padding-right: 5px;">|</span>
            <router-link to="/bad-metronome">Bad Metronome</router-link>
            <span style="padding-left: 5px;padding-right: 5px;">|</span>
            <router-link to="/about">About</router-link>
            <!-- <span style="padding-left: 5px;padding-right: 5px;">|</span>
            <router-link to="/willow">Willow</router-link> -->
          </v-row>
        </div>
        <v-divider />
        <router-view />
      </div>
      <!-- <v-row justify="center">
        <v-col align="center">
          <v-card tile>
            <v-card-text> Here's a bottom bit if I want it.</v-card-text>
          </v-card>
        </v-col>
      </v-row>-->
    </template>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({}),
};
</script>
