<template>
  <v-row>
    <v-col align="center">
      <v-card tile outlined width="280" height="200">
        <v-img :src="require('../assets/OxbowLidar.jpg')" max-height="200" max-width="250"></v-img>
      </v-card>
    </v-col>
    <!-- stuff -->
    <v-col v-for="n in imageGallery" :key="n.title" cols="3">
      <v-card tile outlined width="280">
        <v-img
          :src="require('../assets/OxbowLidar.jpg')"
          max-height="100"
          max-width="100"
        >{{n.title}}</v-img>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "FigureDisplay",
  components: {
    // HelloWorld
  },
  data: () => ({
    imageGallery: [
      {
        title: "title!",
        source: "../assets/OxbowLidar.jpg",
        description: "Stuff!"
      },
      {
        title: "title1",
        source: "../assets/OxbowLidar.jpg",
        description: "Stuff!"
      },
      {
        title: "title2",
        source: "../assets/OxbowLidar.jpg",
        description: "Stuff!"
      }
    ]
  })

  // https://vuetifyjs.com/en/components/cards/ grid example.
};
</script>
