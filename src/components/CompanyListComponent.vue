<template>
  <div class="visitsListComponent">
    <h2 class="fontPrincipal">{{ title }}</h2>

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
      :items="comps"
      show-expand
    >

      <template v-slot:top>
        <v-toolbar flat>
      
          <v-row
            align="center"
            no-gutters
            style="height: 150px;"
          >
          <v-col class="pa-8 ma-8">
          </v-col>
            <v-col align-self="end">              
              <v-sheet class="pa-6 ma-6">
                <span class="fontPrincipal word-break" @click="show_create_company_dialog()">Crear Empresa</span>
                <v-icon  class="mr-2" @click="show_create_company_dialog()">
                mdi-plus
              </v-icon>  
              </v-sheet>
            </v-col>                        
          </v-row>
                    
          <v-dialog v-model="dialog" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Crear/Editar Empresa</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Company"
                      filled
                      color="#cccc00"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Code"
                      filled
                      color="#cccc00"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field> 
      
                    <v-checkbox
                      v-model="active_selected"
                      label="Active"
                      color="#cccc00"
                      rounded
                      >                      
                    </v-checkbox>              
                  </v-row>                    
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="btnPrincipal" text @click="close">
                    <span class="white--text">Cancelar</span>
                </v-btn>                
                <v-btn class="btnPrincipal" text @click="updateCompany" v-if="is_update()">
                    <span class="white--text">Actualizar</span>
                </v-btn>  
                <v-btn class="btnPrincipal" text @click="createCompany" v-if="is_create()">
                    <span class="white--text">Crear</span>
                </v-btn>                 
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog_delete" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Eliminar Empresa</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Company"
                      filled
                      readonly
                      color="#cccc00"
                      rounded
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Code"
                      filled
                      readonly
                      color="#cccc00"
                      rounded                    
                      dense>
                    </v-text-field> 
                    <v-checkbox
                      v-model="active_selected"
                      label="Active"
                      color="#cccc00"
                      readonly
                      rounded
                      >                      
                    </v-checkbox>                      
                  </v-row>                    
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="btnPrincipal" text @click="close_delete">
                    <span class="white--text">Cancelar</span>
                </v-btn>                
                <v-btn class="btnPrincipal" text @click="deleteCompany">
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
      <template v-slot:[`item.name`]="{ item }">
        <v-chip>
          {{ item.name }}
        </v-chip> </template
      ><template v-slot:[`item.code`]="{ item }">
        <v-chip>
          {{ item.code }}
        </v-chip>
      </template>
      <template v-slot:[`item.active`]="{ item }">
        <v-chip v-if="is_active(item)">
          SI
        </v-chip>
        <v-chip v-if="is_inactive(item)">
          NO
        </v-chip>        
      </template>  
      <template v-slot:[`item.actions`]="{ item }">    
        <v-btn icon id="no-background-hover"
          :href= getUrlProject(item)
          >
          <v-icon class="mr-2">
          mdi-briefcase
        </v-icon>
      </v-btn>  
        <v-btn icon id="no-background-hover"
          :href= getUrlUser(item)
          >
          <v-icon class="mr-2">
          mdi-account
        </v-icon>         
      </v-btn>          
        <v-icon class="mr-2" @click="show_edit_company_dialog(item)">
          mdi-table-edit
        </v-icon>
        <v-icon class="mr-2" @click="show_delete_company_dialog(item)">>
          mdi-delete
        </v-icon>        
      </template>    
    </v-data-table>
  </div>
</template>

<script>
//import { Datetime } from 'vue-datetime';

export default {
  name: "CompanyListComponent",
  props: ["title"],

  components: {
    //Datetime,
  },

  data: () => ({
    comps: [],
    id_selected:"",
    name_selected:"",
    code_selected:"",
    active_selected:true,
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
      { text: "Nombre Empresa", value: "name", sortable: true },
      { text: "Código", value: "code", sortable: true },
      { text: "Activa", value: "active", sortable: true },
      { text: "", value: "actions", align: "left", sortable: false },
    ],
  }),
  created() {
    this.initialize();

    /*let a = {"id":4,
      "name": "ejemplo",
      "code": "LAQUESEA",
      "active":"True",
    }
    this.comps.push(a);*/

    this.getAllCompanies();

  },
  methods: {
    async getAllCompanies() 
    {
        try {
       
          const response = await fetch('http://localhost:8080/company/getAllCompany', 
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
          this.comps = res_json;
        } catch (error) {
          console.log("Error occurred:", error);
          this.comps = [];
        }
    },

    async createCompany() 
    {

        if (this.validate() == false)
        {
          this.texto = "Datos incompletos";
          this.snackbar = true;
          return;
        }

        try {

          let data = {
            "code":this.code_selected,
            "name":this.name_selected,
            "active":this.active_selected
          }
          const response = await fetch('http://localhost:8080/company', 
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
          
          this.getAllCompanies();     
          
          this.close();

          this.texto = "Empresa creada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },

    async updateCompany() 
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
            "code":this.code_selected,
            "name":this.name_selected,
            "active":this.active_selected
          }
          const response = await fetch('http://localhost:8080/company', 
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
          
          this.getAllCompanies();      
          
          this.close();

          this.texto = "Empresa actualizada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },
   
    async deleteCompany() 
    {
        try {

          const response = await fetch('http://localhost:8080/company/' + this.id_selected, 
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
          
          this.getAllCompanies();   
          
          this.close_delete();

          this.texto = "Empresa eliminada correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }


    },


    initialize() {

    },

    show_create_company_dialog() {
      this.id_selected = '';
      this.name_selected = '';
      this.code_selected = '';
      this.active_selected = true;
      this.dialog = true;
      this.type = 'create';
    },


    show_edit_company_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.active_selected = item.active;
      this.dialog = true;
      this.type = 'update';
    },

    show_delete_company_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.active_selected = item.active;
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
      return this.name_selected != '' && this.code_selected != ''; 
    },

    getUrlProject(item){
      return this.getUrl('project', item);
    },

    getUrlUser(item){
      return this.getUrl('user', item);
    },

    getUrl(destino, item){
      return "/" + destino +"?code=" + item.code + "&name=" + item.name;
    }

  
  },
};
</script>

<style lang="scss">
#no-background-hover::before {
   background-color: transparent !important;
}
</style>