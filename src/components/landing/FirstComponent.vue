<template>
    <v-container fluid class="white lighten-2">
      <v-row class="white" >
        <v-col cols="12" sm="5">
          <h1 class="soloColorPrincipal fontPrincipal">All4Maritime</h1>
          <h2 class="soloColorPrincipal fontPrincipal">ADVANCED DIGITAL AGENT</h2>
          <p class="black--text fontPrincipal">
            Compare y Reserve todo lo que necesite en su estancia en Algeciras
            al mejor precio
          </p>
          <v-container class="lighten-2">
            <v-row align-content="center" no-gutters>
              <v-col cols="12" sm="12">
                <v-btn relative class="btnPrincipal" :style="{left: '50%', transform:'translateX(-50%)'}">
                  <span class="white--text">Iniciar sesión</span>
                  <v-icon color="info">mdi-gesture-tap</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="12" sm="7" style="padding: 0">
          <v-card flat class="lighten-2">
            <v-img
              src="@/assets/portada.jpg"
              class="white--text align-end"
              height="300px"
            >
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped>

</style>

<script>
export default {
  data() {
    return {
      dialog: false,
      playing: false,
      ready: false,
      value: false
    };
  },
};
</script>
