<template>

    <v-container fluid>
      <v-row>
        <v-col v-for="card in cards" :key="card.title" sm="12" md="4">
          <v-card class="white lighten-2" flat>
            <v-img
              :src="require('@/assets/'+ card.src)"
              class="white--text align-center lighten-5"
              height="100px"
              width="100px"
              style="margin: 0 auto; padding-bottom: 10px; margin-top: 20px;"
            >
            </v-img>
            <p class="black--text titleComponent white lighten-2" style="margin-top: 20px;">
              {{ card.text }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  
</template>

<style scoped></style>

<script>
export default {
  data: () => ({
    cards: [
      {
        title: "Reserva",
        text: "Reserve sus servicios: reparaciones, recogida de residuos, avituallamiento, bunkering, etc.",
        src: "reserva.jpg",
        flex: 4,
      },
      {
        title: "Seguimiento",
        text: "Realice seguimiento de sus reservas y de la prestación de sus servicios en directo",
        src: "seguimiento.jpg",
        flex: 4,
      },
      {
        title: "Búsqueda",
        text: "Busque sus reservas en hoteles, alquiler de vehículos, compras",
        src: "busqueda.jpg",
        flex: 4,
      },
    ],
  }),
};
</script>
