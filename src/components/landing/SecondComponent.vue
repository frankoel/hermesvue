<template>
    <v-container fluid class="colorPrincipal lighten-4">
      <v-row class="colorPrincipal">
        <v-col class="info" sm="5" md="5">
        <v-card class="pa-12 info"
          outlined
          align="center"
          justify="center"
        >
          <p class="white--text fontPrincipal">
            Regístrese gratuitamente y diganos lo que necesita:
          </p>
          <v-btn class="btnPrincipal" >
              <span class="white--text">Registrar</span>
              <v-icon color="info">mdi-gesture-tap</v-icon>
          </v-btn>          
        </v-card>
 
        </v-col>
        <v-col class="colorPrincipal" sm="7" md="7">
          <p style="font-size: 18px !important; margin-bottom:0px" class="white--text withborder titleComponent">
            Qué puede solucionar en All4Maritime:
          </p>            
          <p style="margin:1px" class="white--text withborder titleComponent">
            · Planifique reparaciones especializadas al menor precio.
          </p>
          <p style="margin:1px"  class="white--text withborder titleComponent">
            · Elija la recogida de residuos más respetuosa con el medio
            ambiente.
          </p>
          <p style="margin:1px"  class="white--text withborder titleComponent">
            · Reserve Bunkering más eficiente al menor precio.
          </p>
          <p style="margin:1px"  class="white--text withborder titleComponent">
            · Organice su estancia en Algeciras (alojamientos, compras...).
          </p>
          <p style="margin:1px"  class="white--text withborder titleComponent">
            · Si es proveedor de servicios, incluya su servicio o servicios en
            nuestro catálogo.
          </p>
        </v-col>
      </v-row>
    </v-container>
</template>

<style scoped lang="scss">
</style>


<script>

export default {
  name: "SecondComponent",

};
</script>

