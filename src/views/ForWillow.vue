<template>
  <div>
    <v-row>
      <v-col align="center">
        <v-card flat>
          In memory of Willow:
          <v-img :src="source" max-width="400" max-height="400"></v-img>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: "ForWillow",
  components: {},
  data: () => ({
    source: require("../assets/ForWillow.jpg"),
  }),
};
</script>
