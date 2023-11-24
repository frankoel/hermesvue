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

    <v-row
          style="margin-top: 20px;">
          <v-col>
            <v-autocomplete
              v-model="code_selection"
              :items="comps_complete"                                            
              rounded
              filled
              dense
              label="Selecciona la empresa"
              color="#175380"
              item-color="black"
              @change="getAllCompanies"
            ></v-autocomplete> 
          </v-col>
          <v-spacer></v-spacer>
          <v-col align-self="start">
            <v-btn class="btnPrincipal" text @click="show_create_company_dialog">
                    <v-icon class="mr-2" @click="show_create_company_dialog()">
                      mdi-plus
                    </v-icon>
                    <span class="white--text">Crear Empresa</span>                                
            </v-btn>
          </v-col>          
     </v-row>  

    <v-data-table
      
      :headers="headers"
      :items="comps"
      show-expand
    >

      <template v-slot:top>         
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
                      label="Empresa"
                      filled
                      color="#175380"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Código"
                      filled
                      color="#175380"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field> 
      
                    <v-checkbox
                      v-model="active_selected"
                      label="Activa"
                      color="#175380"
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
                      label="Empresa"
                      filled
                      readonly
                      color="#175380"
                      rounded
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Código"
                      filled
                      readonly
                      color="#175380"
                      rounded                    
                      dense>
                    </v-text-field> 
                    <v-checkbox
                      v-model="active_selected"
                      label="Activa"
                      color="#175380"
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
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon class="mr-2" v-on="on" @click="getUrlProject(item)">
                mdi-briefcase
              </v-icon>
            </template>
            <span>Gestionar Proyectos</span>
          </v-tooltip> 
        </v-btn>  

        <v-btn icon id="no-background-hover"
            :href= getUrlUser(item)
            >
            <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon class="mr-2" v-on="on" @click="getUrlUser(item)">
                mdi-account
              </v-icon>
            </template>
            <span>Gestionar Usuarios</span>
          </v-tooltip>        
        </v-btn>          

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_edit_company_dialog(item)">
              mdi-table-edit
            </v-icon>
          </template>
          <span>Editar Empresa</span>
        </v-tooltip> 

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_delete_company_dialog(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar Empresa</span>
        </v-tooltip> 

      </template>    
    </v-data-table>
  </div>
</template>

<script>
//import { Datetime } from 'vue-datetime';
import Vue from "vue";
import TokenService from '../services/TokenService.js';

export default {
  name: "CompanyListComponent",
  props: ["title"],

  components: {
   
    //Datetime,
  },

  data: () => ({
    itokens: 0,
    comps: [],
    comps_complete: [],
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
    code_selection:"",
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

    TokenService.getToken();
    this.code_selection = 'Todas';
    setTimeout(() => this.getAllCompanies(), 1000);
  
  },
  methods: {

    async getAllCompanyByCode() 
    {
        try {
          let code_filter = "";
          if (this.code_selection != 'Todas')
          {
            let arr = this.code_selection.split('--');
            code_filter = arr[1].trim();
          }

          const response = await fetch(Vue.prototype.$urlhermes + '/company/getCompanyByCode?code=' + code_filter, 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                        'Authorization':'Bearer ' + Vue.prototype.$token,
                      }), 
                      mode: 'cors', 
                      method: 'GET',
                    });
          const res_json = await response.json();
          console.log(res_json);

          if (response.ok)
          { 
            this.itokens = 0;
            this.comps = [];
            this.comps.push(res_json);
          }
          else if(response.status == '403' && res_json.details.includes('expired') && this.itokens < 3)
          {            
            this.itokens = this.itokens + 1;
            TokenService.getToken();
            setTimeout(() => this.getAllCompanies(), 1000);                  
          }   

        } catch (error) {
          console.log("Error occurred:", error);
          this.comps = [];
        }
    },

    async getAllCompanies() 
    {
        if (this.code_selection == 'Todas')
        {

          try {
        
            const response = await fetch(Vue.prototype.$urlhermes + '/company/getAllCompany', 
                      {
                        headers: new Headers({
                          'Content-Type': 'application/json;charset=UTF-8',
                          'Accept': '*/*',
                          'Authorization':'Bearer ' + Vue.prototype.$token,
                        }), 
                        mode: 'cors', 
                        method: 'GET',
                      });
            const res_json = await response.json();
            console.log(res_json);


            if (response.ok)
            {  
              this.itokens = 0;
              this.comps = res_json;

              this.comps_complete = [];
              this.comps_complete.push('Todas');
              res_json.forEach(element => {
                this.comps_complete.push(element.name + " -- " + element.code);
              });
            }
            else if(response.status == '403' && res_json.details.includes('expired') && this.itokens < 3)
            {            
              this.itokens = this.itokens + 1;
              TokenService.getToken(); 
              setTimeout(() => this.getAllCompanies(), 1000);                  
            }            

          } catch (error) {
            console.log("Error occurred:", error);
            this.comps = [];
          }
        }
        else
        {
            this.getAllCompanyByCode();
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
          const response = await fetch(Vue.prototype.$urlhermes + '/company', 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                        'Authorization':'Bearer ' + Vue.prototype.$token,
                      }), 
                      mode: 'cors', 
                      method: 'POST',
                      body: JSON.stringify(data),
                    });
          const res_json = await response.text();
          console.log(res_json);

          if (response.ok)
          {          
            this.code_selection == 'Todas';
            this.getAllCompanies();     
            
            this.close();

            this.texto = "Empresa creada correctamente";
            this.snackbar = true;
          }
          else if(response.status == '403' && res_json.includes('expired'))
          {
              TokenService.getToken();        
          }

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
          const response = await fetch(Vue.prototype.$urlhermes + '/company', 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                        'Authorization':'Bearer ' + Vue.prototype.$token,
                      }), 
                      mode: 'cors', 
                      method: 'PUT',
                      body: JSON.stringify(data),
                    });
          const res_json = await response.text();
          console.log(res_json);
          
          if (response.ok)
          {  
              this.code_selection == 'Todas';
              this.getAllCompanies();      
              
              this.close();

              this.texto = "Empresa actualizada correctamente";
              this.snackbar = true;
          }
          else if(response.status == '403' && res_json.includes('expired'))
          {
            TokenService.getToken();        
          } 

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },
   
    async deleteCompany() 
    {
        try {

          const response = await fetch(Vue.prototype.$urlhermes + '/company/' + this.id_selected, 
                    {
                      headers: new Headers({
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': '*/*',
                        'Authorization':'Bearer ' + Vue.prototype.$token,
                      }), 
                      mode: 'cors', 
                      method: 'DELETE',
                    });
          const res_json = await response.text();
          console.log(res_json);
          
          if(response.status == 400)
          {
            this.texto = "Empresa no eliminada por dependencias";
            this.close_delete();
            this.snackbar = true;
          }
          else if (response.ok)
          {
            this.code_selection = "Todas";
            this.getAllCompanies(); 
            this.texto = "Empresa eliminada correctamente";  
            this.close_delete();
            this.snackbar = true;
          }
          else if(response.status == '403' && res_json.includes('expired'))
          {
            TokenService.getToken();        
          } 

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