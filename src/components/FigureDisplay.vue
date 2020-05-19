<template>
  <div>
    <v-row justify="center" align="center">
      <v-col v-for="n in imageGallery" :key="n.title" :cols="n.flex">
        <v-card tile outlined @click="galleryOpen=!galleryOpen; cardToOpen=n">
          <v-img :src="n.source" max-height="200" max-width="200">{{n.title}}</v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="galleryOpen" persistent max-width="600">
      <v-card>
        {{cardToOpen.title}}
        <br />
        <v-img :src="cardToOpen.source" max-width="600"></v-img>
        {{cardToOpen.description}}
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="galleryOpen = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
        title: "title-1",
        source: require("../assets/NjMapArt.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-2",
        source: require("../assets/LondonMapArt_1.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-21",
        source: require("../assets/LondonMapArt_2.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-23",
        source: require("../assets/LondonMapArt_3.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-3",
        source: require("../assets/OxbowLidar.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-4",
        source: require("../assets/Quabin_1.jpg"),
        description: "Stuff!",
        flex: 2
      },
      {
        title: "title-5",
        source: require("../assets/BostonMapArt_1.jpg"),
        description: "Stuff!",
        flex: 2
      }
      // {
      //   title: "title-6",
      //   source: require("../assets/CongrressionalWindyiness.jpg"),
      //   description: "Stuff!"
      // }
    ],
    galleryOpen: false,
    cardToOpen: ""
  })

  // https://vuetifyjs.com/en/components/cards/ grid example.
};
</script>



