<template>
  <div id="app">
  <v-app id="inspire">
    <v-card class="mx-auto my-auto" max-width="400">
      <v-card-title>
        Vuetify DateTime Picker
      </v-card-title>
      <v-card-text>
        <DateTimeField id="t-datetime-picker" filled label="Published" v-model="published" append-icon="mdi-calendar" readonly></DateTimeField>

        <v-text-field hidden hide-details label="Raw value" v-model="published"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <span class="caption px-2">Set to</span>
        <v-btn depressed small @click="setToNull">null</v-btn>
        <v-btn depressed small @click="setToNow">now</v-btn>
        <v-btn depressed small @click="setToDate">date only</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</div>
</template>



<script>
import DateTimeField from "@/components/DateTimeField";
import {DateTime} from 'luxon';

export default {
  name: "AboutComponent",
  props: ["title"],

  components: {
    DateTimeField,
  },

  data: () => ({
    published: DateTime.local().toISO()
  }),
  methods: {
    setToNull() {
      this.published = null;
    },
    setToNow() {
      this.published = DateTime.local().toISO();
    },
    setToDate() {
      this.published = '2021-03-04';
    }
  }
}

</script>

<style lang="scss">
.DateTimeField {
  .v-tabs-slider-wrapper {
    top: 0;
  }
  .v-picker__title {
    height: 90px;
  }
  .v-time-picker-title__time * {
    font-size: 60px;
    height: 60px;
  }
  .v-picker__body {
    height: 290px;
  }
  .v-tabs-items {
    height: 380px;
  }
}

</style>