<template>
  <div class="home">
    <v-container fluid class="ma-0 pa-0">
      <v-row justify="center">
        <v-col justify="center" cols="3">
          <v-card tile outlined height="100">
            <v-card-text>I will start making content here. I don't really have much to say yet.</v-card-text>
          </v-card>
        </v-col>
        <v-col justify="center" cols="3">
          <v-card tile outlined height="100">
            <v-card-text>Currently, I'm futzing with the framework for this webpage and the technology stack</v-card-text>
          </v-card>
        </v-col>
      </v-row>
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

export default {
  name: "Home",
  components: {
    // HelloWorld
  }
};
</script>
