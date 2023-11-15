<template>
    <v-dialog
    @click:outside="closeDialog"
    v-model="datetimeDialog"
    :persistent="persistent"
    width="290px"
    :fullscreen="fullscreen"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field :value="datetimeFormatted" readonly v-bind="{ ...attrs, ...$attrs }" v-on="on"></v-text-field>
    </template>
    <v-card class="t-datetime-picker white">
      <v-toolbar height="36" color="primary" dark flat>
        <v-tabs v-model="tab" grow height="36">
          <v-tabs-slider color="white"></v-tabs-slider>
          <v-tab href="#date">
            <v-icon>mdi-calendar</v-icon>
          </v-tab>
          <v-tab href="#time">
            <v-icon>mdi-clock</v-icon>
          </v-tab>
          <v-btn depressed text class="rounded-0" @click="closeDialog">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-tabs>
      </v-toolbar>

      <v-tabs-items v-model="tab">
        <v-tab-item value="date">
          <v-date-picker v-model="date" class="rounded-0" @input="tab = 'time'" full-width> </v-date-picker>
        </v-tab-item>
        <v-tab-item value="time">
          <v-time-picker
            :key="tab"
            v-model="time"
            format="24hr"
            class="rounded-0"
            full-width
            @click:minute="closeDialog"
          >
          </v-time-picker>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
  </template>
  
  <script>
  import {DateTime} from 'luxon';

  export default {
    name: "DateTimeField",
    components: {
    
    },
    props: {
        value: {
            type: String
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        persistent: {
            type: Boolean,
            default: false
        },
        dateFormat: {
            type: String,
            default: "dd/MM/yyyy"
        },
        timeFormat: {
            type: String,
            default: "HH:mm"
        }
  },
  data: () => ({
    date: null,
    time: null,
    tab: false,
    datetimeDialog: false
  }),
  computed: {
    datetimeFormatted() {
      return this.value
        ? DateTime.fromISO(this.value)
            .setLocale("es-ES")
            .toFormat(`${this.dateFormat} ${this.timeFormat}`)
        : "";
    }
  },
  watch: {
    datetimeDialog: function (val) {

      // load into separated models as dialog opens
      if (val && this.value) {
        
        this.date = DateTime.fromISO(this.value)
          .setLocale("es-ES")
          .toFormat("yyyy-MM-dd");

        this.time = DateTime.fromISO(this.value)
          .setLocale("es-ES")
          .toFormat(this.timeFormat);
      }
    }
  },
  methods: {
    closeDialog() {
      this.datetimeDialog = false;

      this.$emit(
        "input",
        DateTime.fromFormat(
          `${this.date} ${this.time}`,
          "yyyy-MM-dd HH:mm",
          {
            locale: "es-ES"
          }
        ).toISO()
      );

      // prevents animate to date tab when closing
      setTimeout(() => (this.tab = "date"), 300);
    }
  }
}
  </script>
  