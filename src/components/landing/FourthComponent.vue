<template>

<v-container fluid fill-height>
  <v-row justify="center" align="center" class="colorPrincipal">
    <v-col class="" sm="12" md="12">
      <v-card class="colorPrincipal" flat>
        <p class="white--text titleComponentCenter colorPrincipal">
          Todo lo que necesitas en tu estancia en Algeciras en All4Maritime
        </p>
        <p class="white--text titleComponentCenter colorPrincipal">
          ¿Cómo podemos ayudarte?
        </p>            
      </v-card>
    </v-col>
  </v-row>     
  <v-row>
    <v-col cols="12" class="" sm="12" md="12">
      <v-btn relative class="btnPrincipal" :style="{left: '50%', transform:'translateX(-50%)'}">
          <span class="white--text">Iniciar sesión</span>
          <v-icon color="info">mdi-gesture-tap</v-icon>
      </v-btn>
    </v-col>
  </v-row>         
  </v-container>  

</template>

<style scoped lang="scss">
</style>


<script>
export default {
  data() {
    return {};
  },
};
</script>