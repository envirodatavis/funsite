<template>
  <v-app style="background-color: #f2f0e6;">
    <template>
      <div id="app">
        <div id="nav">
          <v-row justify="center" style="padding: 12px">
            <router-link to="/">Gallery</router-link>
            <span style="padding-left: 5px;padding-right: 5px;">|</span>
            <router-link to="/about">About</router-link>
            <!-- TODO: get this going -->
            <!-- <span style="padding-left: 5px;padding-right: 5px;">|</span> -->
            <!-- <router-link to="/about">Resume</router-link> -->
            <!-- <span style="padding-left: 5px;padding-right: 5px;">|</span> -->
            <!-- Github link -->
          </v-row>
        </div>
        <v-divider />
        <router-view />
      </div>

      <!-- <v-row justify="center">
        <v-col align="center">
          <v-card outlined color="rgba(0,0,0,0)">
            <v-card-text> Here's a bottom bit if I want it.</v-card-text>
          </v-card>
        </v-col>
      </v-row> -->
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
