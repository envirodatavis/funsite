<template>
  <v-app>
    <template>
      <div id="app">
        <div id="nav">
          <v-row justify="center">
            <router-link to="/">Home</router-link>&nbsp;|
            <router-link to="/about">About</router-link>&nbsp;|
            <router-link to="/hydrogeology">HydroGeology</router-link>
          </v-row>
        </div>
        <router-view />
      </div>
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
