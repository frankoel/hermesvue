<template>
  <div class="visitsListComponent">
    <h2 class="fontPrincipal">{{ title }} &lt; {{ empresa_name }} &gt;</h2>

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
              :items="users_complete"                                            
              rounded
              filled
              dense
              label="Selecciona el usuario"
              color="#175380"
              item-color="black"
              @change="getAllUsersByCodeCompany"
            ></v-autocomplete> 
          </v-col>
          <v-spacer></v-spacer>
          <v-col align-self="start">
            <v-btn class="btnPrincipal" text @click="show_create_user_dialog">
                    <v-icon class="mr-2" @click="show_create_user_dialog()">
                      mdi-plus
                    </v-icon>
                    <span class="white--text">Crear Usuario</span>                                
            </v-btn>
          </v-col>          
          <v-col align-self="start">
            <v-btn class="btnPrincipal" text @click="back">
                    <v-icon class="mr-2" @click="back">
                      mdi-arrow-left
                    </v-icon>
                    <span class="white--text">Volver a empresas</span>
            </v-btn>
          </v-col>          
      </v-row> 


    <v-data-table
      
      :headers="headers"
      :items="users"
      show-expand
    >

      <template v-slot:top>
                    
          <v-dialog v-model="dialog" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Crear/Editar Usuario</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Usuario"
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
                    <v-text-field
                      v-model="email_selected"
                      label="Email"
                      filled
                      :rules="emailRules"
                      color="#175380"
                      rounded                    
                      dense>
                    </v-text-field> 
                    <v-checkbox
                      v-model="admin_selected"
                      label="Administrador"
                      color="#175380"
                      rounded
                      >    
                    </v-checkbox>

                    <v-checkbox
                      v-model="active_selected"
                      label="Activo"
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
                <v-btn class="btnPrincipal" text @click="updateUser" v-if="is_update()">
                    <span class="white--text">Actualizar</span>
                </v-btn>  
                <v-btn class="btnPrincipal" text @click="createUser" v-if="is_create()">
                    <span class="white--text">Crear</span>
                </v-btn>                 
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog_delete" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Eliminar Usuario</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Usuario"
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
                    <v-text-field
                      v-model="email_selected"
                      label="Email"
                      filled
                      readonly
                      color="#175380"
                      rounded                    
                      dense>
                    </v-text-field>                    
                    <v-checkbox
                      v-model="admin_selected"
                      label="Administrador"
                      color="#175380"
                      readonly
                      rounded
                      >                      
                    </v-checkbox>                   
                    <v-checkbox
                      v-model="active_selected"
                      label="Activo"
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
                <v-btn class="btnPrincipal" text @click="deleteUser">
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
      >
      <template v-slot:[`item.code`]="{ item }">
        <v-chip>
          {{ item.code }}
        </v-chip>
      </template>
      <template v-slot:[`item.email`]="{ item }">
        <v-chip>
          {{ item.email }}
        </v-chip>
      </template>      
      <template v-slot:[`item.admin`]="{ item }">
        <v-chip v-if="is_admin(item)">
          SI
        </v-chip>
        <v-chip v-if="is_noadmin(item)">
          NO
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
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_edit_user_dialog(item)">
              mdi-table-edit
            </v-icon>
          </template>
          <span>Editar Usuario</span>
        </v-tooltip> 

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_delete_user_dialog(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar Usuario</span>
        </v-tooltip>       
      </template>    
    </v-data-table>
  </div>
</template>

<script>
//import { Datetime } from 'vue-datetime';
import Vue from "vue";
import router from "../router";
import TokenService from '../services/TokenService.js';

export default {
  name: "UserListComponent",
  props: ["title","empresa_name","empresa_code"],

  components: {
    //Datetime,
  },

  data: () => ({
    itokens: 0,
    users: [],
    users_complete: [],
    id_selected:"",
    name_selected:"",
    code_selected:"",
    admin_selected:"",
    active_selected:true,
    email_selected:"",
    password_selected:"",
    edit_title: "",
    type:"create",
    texto:"",
    code_selection:"",
    dialog: false,
    dialog_delete: false,
    error: false,
    nameRules: [
      v => !!v || 'dato requerido',
    ],
    emailRules: [
        value => {
          if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) 
            return true
          
          return 'E-mail debe ser válido'
        },
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
      { text: "Nombre Usuario", value: "name", sortable: true },
      { text: "Código", value: "code", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Administrador", value: "admin", sortable: false },
      { text: "Activo", value: "active", sortable: false },
      { text: "", value: "actions", align: "left", sortable: false },
    ],
  }),
  created() {
    this.initialize();

    TokenService.getToken();
    this.code_selection = 'Todos';
    setTimeout(() => this.getAllUsersByCodeCompany(), 1000);

  },
  methods: {

    async getUserByCode()
    {
       try{
          let code_filter = "";
          if (this.code_selection != 'Todos')
          {
            let arr = this.code_selection.split('--');
            code_filter = arr[1].trim();
          }

          const response = await fetch(Vue.prototype.$urlhermes + '/user/getUserByCode?code='+ code_filter, 
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
            this.users = [];
            this.users.push(res_json);
          }
          else if(response.status == '403' && res_json.details.includes('expired') && this.itokens < 3)
          {            
            this.itokens = this.itokens + 1;
            TokenService.getToken();
            setTimeout(() => this.getAllUsersByCodeCompany(), 1000);                  
          }              

        } catch (error) {
          console.log("Error occurred:", error);
          this.users = [];
        }
    },

    async getAllUsersByCodeCompany()
    {
      if (this.code_selection == 'Todos')
        {

       try{
          const response = await fetch(Vue.prototype.$urlhermes + '/user/getUsersByCodeCompany?codeCompany='+ this.empresa_code, 
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
            this.users = res_json;
   
            this.users_complete = [];
            this.users_complete.push('Todos');
            res_json.forEach(element => {
              this.users_complete.push(element.name + " -- " + element.code);
            });
          }
          else if(response.status == '403' && res_json.details.includes('expired') && this.itokens < 3)
          {            
            this.itokens = this.itokens + 1;
            TokenService.getToken(); 
            setTimeout(() => this.getAllUsersByCodeCompany(), 1000);                  
          }              

        } catch (error) {
          console.log("Error occurred:", error);
          this.users = [];
        }
      }
      else
      {
        this.getUserByCode();
      }
    },

    async createUser() 
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
            "admin":this.admin_selected,
            "password":this.password_selected,
            "email": this.email_selected,
            "companyCode":this.empresa_code,
            "active":this.active_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/user', 
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
            this.code_selection = 'Todos';
            this.getAllUsersByCodeCompany();     
            
            this.close();

            this.texto = "Usuario creado correctamente";
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

    async updateUser() 
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
            "admin":this.admin_selected,
            "password":this.password_selected,
            "email": this.email_selected,
            "companyCode":this.empresa_code,
            "active":this.active_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/user', 
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
            this.code_selection = 'Todos';
            this.getAllUsersByCodeCompany();     
            
            this.close();

            this.texto = "Usuario actualizado correctamente";
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
   
    async deleteUser() 
    {
        try {

          const response = await fetch(Vue.prototype.$urlhermes + '/user/' + this.id_selected, 
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
            this.texto = "Usuario no eliminado por dependencias";
            this.close_delete();
            this.snackbar = true;            
          }
          else if (response.ok)
          {
            this.code_selection = "Todos";
            this.getAllUsersByCodeCompany(); 
            this.texto = "Usuario eliminado correctamente";
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

    show_create_user_dialog() {
      this.id_selected = '';
      this.name_selected = '';
      this.code_selected = '';
      this.admin_selected = true;
      this.password_selected = Math.ceil(Math.random()*100000000000);
      this.email_selected = '';
      this.active_selected = true;
      this.dialog = true;
      this.type = 'create';
    },


    show_edit_user_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.admin_selected = item.admin;
      this.password_selected = Math.ceil(Math.random()*100000000000);
      this.email_selected = item.email;
      this.active_selected = item.active;
      this.dialog = true;
      this.type = 'update';
    },

    show_delete_user_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.admin_selected = item.admin;
      this.email_selected = item.email;
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

    is_admin(item) {
      return item.admin; 
    },

    is_noadmin(item) {
      return !item.admin; 
    },

    validate() {
      return this.name_selected != '' && this.code_selected != '' && this.validateEmail();
    },

    validateEmail()
    {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.email_selected)) 
            return true;
      return false;
    },

    back(){
      router.go(-1);
    },
  
  },
};
</script>
