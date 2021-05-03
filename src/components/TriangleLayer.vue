<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-card-text class="pa-1" style="font-size: 0.75rem; text-align: center;">
        Click and drag to rotate, scroll to zoom, press 't' to reset the view.
      </v-card-text>
      <v-card
        outlined
        color="rgba(0,0,0,0)"
        :width="xDomWidth + 4"
        :height="xDomHeight + 4"
        style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
      >
        <x3d :width="xDomWidth" :height="xDomHeight" style="margin: 2pt">
          <triangles @loaded="modelLoaded" />
        </x3d>
        <v-overlay absolute :value="!loaded">
          <v-progress-circular indeterminate size="39"></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-row>
    <v-row justify="center" align="center">
      <v-card-text class="pa-2" style="font-size: 0.75rem; max-width: 450pt">
        <ul>
          <li>
            Top layer: a Digital elevation model, of the form X,Y,Z with
            thousands of points.
          </li>
          <li>
            Bottom green layer: a geologic layer, linearly interpolated by a
            dozen boreholes and some inferred points.
          </li>
          <li>
            Middle yellow layer: triangle finite element mesh in X and Y, with Z
            interpolated to each surface and joined.
          </li>
          <li>
            Purpose: to show what a Modflow 6 unstructured triangular grid looks
            like between two surfaces.
          </li>
          <li>
            From the Minette Region of southern Luxembourg, geologic layer
            <a href="http://doi.org/10.1127/1860-1804/2013/0025"
              >estimated from here.</a
            >
          </li>
          <li>
            10:1 (V:H) exaggeration, layers "exploded" apart to show them
            clearly.
          </li>
          <li>
            Made using the python packages Flopy and Vedo Borrows heavily from
            A. Pollack (SCRF)'s example of a geologic model from the Vedo
            examples.
          </li>
          <li>
            (Github links coming soon!)
          </li>
        </ul>
      </v-card-text>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "model",
  data: () => ({
    startLoading: false,
    loaded: false,
  }),
  components: {
    triangles: () => import("../assets/x3dModels/triangleLayer.vue"),
  },
  computed: {
    xDomWidth: function() {
      if (window.innerWidth > 830) return 730;
      if (window.innerWidth < 450) return window.innerWidth - 50;
      return window.innerWidth - 100;
    },
    xDomHeight: function() {
      if (window.innerHeight / window.innerWidth > 1) return this.xDomWidth;
      if (window.innerHeight > 830) return 530;
      return window.innerHeight - 300;
    },
  },
  methods: {
    modelLoaded: async function(value) {
      if (value) setTimeout(() => (this.loaded = true), 1500);
    },
  },
};
</script>
