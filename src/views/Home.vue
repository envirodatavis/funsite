<template>
  <div class="home">
    <v-container fluid>
      <v-row justify="center" align="center">
        <v-col v-for="n in links" :key="n.title" cols="6" sm="3" lg="2">
          <v-card
            :to="n.link"
            max-width="200"
            outlined
            color="rgba(0,0,0,0)"
            class="flex-grow-1"
            style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
            :target="n.tab"
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
      <div class="separator">Nonsense:</div>
      <v-row justify="center" align="center">
        <v-col v-for="n in sillyLinks" :key="n.title" cols="6" sm="3" lg="2">
          <v-card
            :to="n.link"
            max-width="200"
            outlined
            color="rgba(0,0,0,0)"
            class="flex-grow-1"
            style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
            :target="n.tab"
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
      <div class="separator">Older Videos:</div>
      <v-row justify="center" align="center">
        <v-col v-for="n in oldLinks" :key="n.title" cols="6" sm="3" lg="2">
          <v-card
            :to="n.link"
            max-width="200"
            outlined
            color="rgba(0,0,0,0)"
            class="flex-grow-1"
            style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
            :target="n.tab"
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
        title: "Flopy Groundwater Model",
        link: "/triangle-model",
        description:
          "Python to build groundwater models quickly. (Opens in new tab.)",
        source: require("../assets/galleryThumbs/triangleModflow.jpg"),
        tab: "_blank", // open a new tab
      },
      {
        title: "Two-axis Plot",
        link: "/two-axis-plot",
        description: "Using D3 to compare alternatives to two-axis plots",
        source: require("../assets/galleryThumbs/twoAxisPlot.jpg"),
        tab: "",
      },
      {
        title: "Tomato Product Cycle",
        link: "/tomato-product-cycle",
        description: "Major inputs and wastes of tomato production in the US",
        source: require("../assets/mapArt/Tomatos.jpg"),
        tab: "",
      },
      // tomato-product-cycle
      {
        title: "Random D3 sin wave",
        link: "/random-wave",
        description:
          "made this when learning D3 animations. Sharing it because it's kinda nice",
        source: require("../assets/galleryThumbs/randomSin.jpg"),
        tab: "",
      },
      {
        title: "Some Map Art - NJ",
        link: "/map-art-nj",
        description: "Stumbled on a nice dataset for a remediation project",
        source: require("../assets/mapArt/NjMapArt.jpg"),
        tab: "",
      },
      {
        title: "Map Art - Boston",
        link: "/map-art-bos",
        description: "Tiles that look pretty nice together",
        source: require("../assets/mapArt/BostonMapArt_1.jpg"),
        tab: "",
      },
    ],
    sillyLinks: [
      {
        title: "Map - Radiohead Style",
        link: "/map-art-radiohead",
        description:
          "A map of US minnow species styalized like a Radiohead album cover",
        source: require("../assets/mapArt/htt_minnow.jpg"),
        tab: "",
      },
      {
        title: "MAFS-1",
        link: "/mafs1",
        description: "a tool to visualize TV show predictions",
        source: require("../assets/galleryThumbs/Mafs1.jpg"),
        tab: "",
      },
      {
        title: "MAFS-2",
        link: "/mafs2",
        description: "another tool to visualize TV show predictions",
        source: require("../assets/galleryThumbs/Mafs2.jpg"),
        tab: "",
      },
      {
        title: "A Bad Metronome",
        link: "/bad-metronome",
        description: "(by design) it is very inconsistent.",
        source: require("../assets/galleryThumbs/badMetronome.jpg"),
        tab: "",
      },
    ],
    oldLinks: [
      {
        title: "Groundwater Depletion",
        link: "/gw-vol-deplete-vid",
        description: "(2016) made a video to show groundwater depletion",
        source: require("../assets/galleryThumbs/GwDepleteVideo.jpg"),
        tab: "",
      },
      {
        title: "Groundwater Volume Comparison",
        link: "/gw-vol-compare-vid",
        description: "(2015) made a video to show groundwater volumes",
        source: require("../assets/galleryThumbs/GwCompareVideo.jpg"),
        tab: "",
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
