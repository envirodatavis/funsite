<template>
  <div class="about">
    <v-container fluid>
      <v-row>
        <v-col align="center">
          <v-card flat max-width="500" color="rgba(0,0,0,0)">
            <v-card-text>
              I have a background in hydrogeology and more
              recently front end web development. I have an interest in science
              and data communication, and am using this site to experiment with tools and
              share some things, mostly for fun.
              <br />
              <br />
              This site is mostly written in Vue and D3, with some other cool
              packages that I will list eventually. I still have many TODOs.
              But this is for fun. Most content will look good on
              mobile too, some may not.
              <br />
              <br />
              <br />
              <div class="separator"></div>
              Big thanks to Steven Kalt, who patiently taught me all about the
              front end and how to program properly while at REsurety, and Peter
              Richardson for being a heck of a supportive manager there.
              <br />
              <br />
              <div class="separator">PS:</div>

              My mother and sister are great artists who also have their own
              sites:
              <a href="https://www.torymiles.com">torymiles.com</a>
              and
              <a href="https://www.lesliemiles.ca">lesliemiles.ca</a>
              for more great content.
              <br />
              <br />
              <div class="separator">PPS:</div>
              Here is a
              <a href="https://www.https://envirodatav.wordpress.com/.ca">
                janky old wordpress
              </a>
              site where I included some more map-y art.
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
  name: "About",
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
