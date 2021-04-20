<template>
  <div class="home">
    <v-container fluid>
      <!-- Break -->
      <!-- <v-row>
        <v-col align="center">
          <b>Gallery</b>
        </v-col>
      </v-row> -->
      <!-- <div class="separator">Hydrogeology</div>
      <v-row>
        <v-col align="center">
          ... coming soon
         </v-col>
      </v-row> -->
      <!-- <div class="separator">Sillyness</div> -->
      <v-row justify="center" align="center">
        <v-col v-for="n in links" :key="n.title" cols="6" sm="3" md="3">
          <v-card
            :to="n.link"
            max-width="200"
            outlined
            color="rgba(0,0,0,0)"
            class="flex-grow-1"
            style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
          >
            <v-img
              :src="n.source"
              width="190"
              height="130"
              class="center"
            ></v-img>
            <v-card-text
              class="pa-2"
              style="
              font-size: 0.75rem;
              text-align: center; overflow-y: auto; height:100px"
            >
              <u>{{ n.title }}:</u>
              {{ n.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Break -->
      <!-- <div class="separator">Old</div>
      <v-row>
        <v-col align="center">
          <iframe
            width="200"
            height="200"
            src="https://www.youtube.com/embed/l8Ga6QP4wgc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </v-col>
      </v-row> -->
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  components: {},
  data: () => ({
    links: [
      {
        title: "Python Groundwater Model",
        link: "/triangle-model",
        description: "Python to build groundwater models quickly",
        source: require("../assets/galleryThumbs/triangleModflow.jpg"),
      },
      {
        title: "MAFS-1",
        link: "/mafs1",
        description: "a tool to visualize show predictions",
        source: require("../assets/galleryThumbs/Mafs1.jpg"),
      },
      {
        title: "MAFS-2",
        link: "/mafs2",
        description: "another tool to visualize show predictions",
        source: require("../assets/galleryThumbs/Mafs2.jpg"),
      },
      {
        title: "A Bad Metronome",
        link: "/bad-metronome",
        description: "it really doesn't work very well.",
        source: require("../assets/galleryThumbs/badMetronome.jpg"),
      },
      {
        title: "Random sin wave",
        link: "/random-wave",
        description:
          "born from learning D3 animations. Kept because it's kinda nice",
        source: require("../assets/galleryThumbs/randomSin.jpg"),
      },
    ],
  }),
};
</script>

<style scoped>
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 18pt;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.separator:not(:empty)::before {
  margin-right: 0.25em;
}

.separator:not(:empty)::after {
  margin-left: 0.25em;
}

.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
