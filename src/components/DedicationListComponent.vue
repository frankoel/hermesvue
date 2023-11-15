<template>
  <div class="visitsListComponent">
    <h2 class="fontPrincipal">{{ title }} {{ proyecto_name }}</h2>

    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
      width="400px"
    >
      <v-text-field v-model="texto"></v-text-field>

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbar = false"
          class="white--text"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <v-data-table
      
      :headers="headers"
      :items="dedications"
      show-expand
    >

      <template v-slot:top>
        <v-toolbar flat>
      
          <v-spacer></v-spacer>

          <v-row
          style="margin-top: 20px;">
            <v-autocomplete
              v-model="user_selection"
              :items="users"                                            
              rounded
              filled
              dense
              label="Selecciona el usuario"
              color="#175380"
              item-color="black"
              @change="getAllDedicationsByUserAndCodeCompany"
            ></v-autocomplete> 
          </v-row>   

          <v-row
            align="center"
            no-gutters
            style="height: 150px;"
          >
          <v-col class="pa-8 ma-8">
          </v-col>
            <v-col align-self="end">              
              <v-sheet class="pa-6 ma-6">
                <span class="fontPrincipal word-break" @click="show_create_dedication_dialog()">Crear Dedicación</span>
                <v-icon  class="mr-2" @click="show_create_dedication_dialog()">
                mdi-plus
              </v-icon>  
              </v-sheet>
            </v-col>                        
          </v-row>
                    
          <v-dialog v-model="dialog" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Crear/Editar Dedicación</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>                  
                  <v-row>
                    <DateTimeField id="t-datetime-picker" filled label="Hora inicial" 
                    v-model="hours_init_selected" append-icon="mdi-calendar" readonly></DateTimeField>
                  </v-row> 
                 <v-row>                   
                  <DateTimeField id="t-datetime-picker" filled label="Hora final" 
                  v-model="hours_end_selected" append-icon="mdi-calendar" readonly></DateTimeField>
                 </v-row> 
                <v-row> 
                    <v-textarea
                      v-model="description_selected"
                      label="Descripción"
                      filled
                      color="#175380"
                      rounded
                      dense>
                    </v-textarea> 
                  </v-row>                    
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="btnPrincipal" text @click="close">
                    <span class="white--text">Cancelar</span>
                </v-btn>                
                <v-btn class="btnPrincipal" text @click="updateDedication" v-if="is_update()">
                    <span class="white--text">Actualizar</span>
                </v-btn>  
                <v-btn class="btnPrincipal" text @click="createDedication" v-if="is_create()">
                    <span class="white--text">Crear</span>
                </v-btn>                 
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog_delete" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Eliminar Dedicación</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field label="Hora inicial" v-model="hours_init_selected_format" readonly></v-text-field>
                  </v-row> 
                  <v-row>
                    <v-text-field label="Hora final" v-model="hours_end_selected_format" readonly></v-text-field>
                  </v-row> 
                <v-row> 
                    <v-textarea
                      v-model="description_selected"
                      label="Descripción"
                      filled
                      color="#175380"
                      rounded
                      readonly
                      dense>
                    </v-textarea> 
                  </v-row>                 
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="btnPrincipal" text @click="close_delete">
                    <span class="white--text">Cancelar</span>
                </v-btn>                
                <v-btn class="btnPrincipal" text @click="deleteDedication">
                    <span class="white--text">Eliminar</span>
                </v-btn>  
              </v-card-actions>
            </v-card>
          </v-dialog>          
        </v-toolbar>
      </template>
      <template v-slot:[`item.id`]="{ item }">
        <v-chip>
          {{ item.id }}
        </v-chip> 
      </template>      
      <template v-slot:[`item.hoursInit`]="{ item }">
        <v-chip>
          {{ getValue(item.hoursInit) }}
        </v-chip> </template
      >
      <template v-slot:[`item.hoursEnd`]="{ item }">
        <v-chip>
          {{ getValue(item.hoursEnd) }}
        </v-chip>
      </template>
      <template v-slot:[`item.description`]="{ item }">
        <v-chip>
          {{ item.description }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" @click="show_edit_dedication_dialog(item)">
          mdi-table-edit
        </v-icon>
        <v-icon class="mr-2" @click="show_delete_dedication_dialog(item)">>
          mdi-delete
        </v-icon>        
      </template>    
    </v-data-table>
  </div>
</template>

<script>
  //import {DateTime} from 'luxon';
  import Vue from "vue";
  import DateTimeField from '@/components/DateTimeField'
  import {DateTime} from 'luxon';

export default {
  name: "DedicationListComponent",
  props: ["title","proyecto_name","proyecto_code", "empresa_code"],

  components: {
    
    DateTimeField,
  },

  data: () => ({
    dedications: [],
    id_selected:"",
    hours_init_selected: "",
    hours_end_selected: "",
    hours_init_selected_format: "",
    hours_end_selected_format: "",
    description_selected:"",

    user_selection:"",
    user_selected:"",
    users:[],

    edit_title: "",
    type:"create",
    texto:"",
    dialog: false,
    dialog_delete: false,
    nameRules: [
      v => !!v || 'dato requerido',
    ],
    snackbar: false,
    timeout: 4000,
    headers: [
      {
        text: "Id",
        align: "left",
        sortable: true,
        value: "id",
      },
      { text: "Hora inicial", value: "hoursInit", sortable: true },
      { text: "Hora final", value: "hoursEnd", sortable: true },
      { text: "Descripción", value: "description", sortable: false },
      { text: "", value: "actions", align: "left", sortable: false },
    ],
  }),
  created() {
    this.initialize();

    this.getAllUsersByCodeCompany();

  },
  computed: {

  },
  methods: {

    getValue(e){
      return DateTime.fromISO(e)
            .setLocale("es-ES")
            .toFormat(`dd/MM/yyyy HH:mm`);
    },
    async getAllUsersByCodeCompany()
    {
       try{
          const response = await fetch(Vue.prototype.$urlhermes + '/user/getUsersByCodeCompany?codeCompany='+ this.empresa_code, 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'GET',
                    });
          const res_json = await response.json();
          console.log(res_json);
          
          res_json.forEach(element => {
            this.users.push(element.code + " -- " + element.name);
          });
        } catch (error) {
          console.log("Error occurred:", error);
          this.users = [];
        }
    },

    async getAllDedicationsByUserAndCodeCompany()
    {
       try{

          if (this.user_selection != '')
          {
            let arr = this.user_selection.split('--');
            this.user_selected = arr[0].trim();
          }
            
          const response = await fetch(Vue.prototype.$urlhermes + '/dedication/getDedicationByProjectAndUser?codProject='+ 
                    this.proyecto_code + "&codUser=" + this.user_selected, 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'GET',
                    });
          const res_json = await response.json();
          console.log(res_json);
          this.dedications = res_json;
        } catch (error) {
          console.log("Error occurred:", error);
          this.dedications = [];
        }
    },

    async createDedication() 
    {

        if (this.validate() == false)
        {
          this.texto = "Datos incompletos";
          this.snackbar = true;
          return;
        }

        try {

          let data = {
            "hoursInit":this.hours_init_selected,
            "hoursEnd":this.hours_end_selected,
            "description":this.description_selected,
            "projectCode":this.proyecto_code,
            "user":this.user_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/dedication', 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'POST',
                      body: JSON.stringify(data),
                    });
          const res_json = await response.text();
          console.log(res_json);
          
          this.getAllDedicationsByUserAndCodeCompany();     
          
          this.close();

          this.texto = "Dedicación creada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },

    async updateDedication() 
    {
        if (this.validate() == false)
        {
          this.texto = "Datos incompletos";
          this.snackbar = true;
          return;
        }

        try {

          let data = {
            "id": this.id_selected,
            "hoursInit":this.hours_init_selected,
            "hoursEnd":this.hours_end_selected,
            "description":this.description_selected,
            "projectCode":this.proyecto_code,
            "user":this.user_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/dedication', 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'PUT',
                      body: JSON.stringify(data),
                    });
          const res_json = await response.text();
          console.log(res_json);
          
          this.getAllDedicationsByUserAndCodeCompany();     
          
          this.close();

          this.texto = "Dedicación actualizada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },
   
    async deleteDedication() 
    {
        try {

          const response = await fetch(Vue.prototype.$urlhermes + '/dedication/' + this.id_selected, 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                      }), 
                      mode: 'cors', 
                      method: 'DELETE',
                    });
          const res_json = await response.text();
          console.log(res_json);
          
          this.getAllDedicationsByUserAndCodeCompany();   
          
          this.close_delete();

          this.texto = "Dedicación eliminada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }

    },


    initialize() {

    },

    show_create_dedication_dialog() {
      this.id_selected = '';
      this.hours_init_selected = '';
      this.hours_end_selected = '';
      this.description_selected = '';
      this.dialog = true;
      this.type = 'create';
    },


    show_edit_dedication_dialog(item) {
      this.id_selected = item.id;
      this.hours_init_selected = item.hoursInit;
      this.hours_end_selected = item.hoursEnd;
      this.description_selected = item.description;
      this.dialog = true;
      this.type = 'update';
    },

    show_delete_dedication_dialog(item) {
      this.id_selected = item.id;
      this.hours_init_selected = item.hoursInit;
      this.hours_end_selected = item.hoursEnd;
      this.hours_init_selected_format = this.getValue(item.hoursInit);
      this.hours_end_selected_format = this.getValue(item.hoursEnd);      
      this.description_selected = item.description;
      this.dialog_delete = true;
    },

    close() {
      this.dialog = false;
    },

    close_delete() {
      this.dialog_delete = false; 
    },

    is_create() {
      return this.type == 'create'; 
    },

    is_update() {
      return this.type == 'update'; 
    },

    is_active(item) {
      return item.active; 
    },

    is_inactive(item) {
      return !item.active; 
    },

    validate() {
      return this.hours_init_selected != '' && this.hours_end_selected != ''; 
    },
  
  },
};
</script>


<style lang="scss">
#no-background-hover::before {
   background-color: transparent !important;
}
</style>