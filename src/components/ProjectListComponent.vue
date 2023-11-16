<template>
  <div class="visitsListComponent">
    <h2 class="fontPrincipal">{{ title }} &lt; {{ empresa_name }} &gt; </h2>

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
              :items="projects_complete"                                            
              rounded
              filled
              dense
              label="Selecciona el proyecto"
              color="#175380"
              item-color="black"
              @change="getAllProjectsByCodeCompany"
            ></v-autocomplete> 
          </v-col>
          <v-spacer></v-spacer>
          <v-col align-self="start">
            <v-btn class="btnPrincipal" text @click="show_create_project_dialog">
                    <v-icon class="mr-2" @click="show_create_project_dialog()">
                      mdi-plus
                    </v-icon>
                    <span class="white--text">Crear Proyecto</span>                                
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
      :items="projects"
      show-expand
    >

      <template v-slot:top>
                    
          <v-dialog v-model="dialog" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Crear/Editar Proyecto</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Proyecto"
                      filled
                      color="#175380"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Code"
                      filled
                      color="#175380"
                      rounded
                      :rules="nameRules"
                      required
                      dense>
                    </v-text-field> 

                    <v-textarea
                      v-model="description_selected"
                      label="Descripción"
                      filled
                      color="#175380"
                      rounded
                      dense>
                    </v-textarea> 
      
                    <v-checkbox
                      v-model="active_selected"
                      label="Active"
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
                <v-btn class="btnPrincipal" text @click="updateProject" v-if="is_update()">
                    <span class="white--text">Actualizar</span>
                </v-btn>  
                <v-btn class="btnPrincipal" text @click="createProject" v-if="is_create()">
                    <span class="white--text">Crear</span>
                </v-btn>                 
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog_delete" max-width="550px">
            <v-card>
              <v-card-title class="colorPrincipal">
                <span class="white--text fontPrincipal word-break">Eliminar Proyecto</span>
              </v-card-title>
              
              <v-card-text class="pt-4">
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="name_selected"
                      label="Project"
                      filled
                      readonly
                      color="#175380"
                      rounded
                      dense>
                    </v-text-field>
                    <v-text-field
                      v-model="code_selected"
                      label="Code"
                      filled
                      readonly
                      color="#175380"
                      rounded                    
                      dense>
                    </v-text-field> 
                    <v-textarea
                      v-model="description_selected"
                      label="Descripción"
                      filled
                      color="#175380"
                      rounded
                      readonly
                      dense>
                    </v-textarea>                    
                    <v-checkbox
                      v-model="active_selected"
                      label="Active"
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
                <v-btn class="btnPrincipal" text @click="deleteProject">
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
      <template v-slot:[`item.description`]="{ item }">
        <v-chip>
          {{ item.description }}
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
          :href= getUrlDedication(item)
          >
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon class="mr-2" v-on="on" @click="getUrlDedication(item)">
                mdi-timetable
              </v-icon>
            </template>
            <span>Gestionar Dedicaciones</span>
          </v-tooltip> 

        </v-btn> 

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_edit_project_dialog(item)">
              mdi-table-edit
            </v-icon>
          </template>
          <span>Editar Proyecto</span>
        </v-tooltip> 

        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon class="mr-2" v-on="on" @click="show_delete_project_dialog(item)">
              mdi-delete
            </v-icon>
          </template>
          <span>Eliminar Proyecto</span>
        </v-tooltip>
      </template>    
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue";
import router from "../router";

export default {
  name: "ProjectListComponent",
  props: ["title","empresa_name","empresa_code"],

  components: {
   
  },

  data: () => ({
    projects: [],
    projects_complete: [],
    id_selected:"",
    name_selected:"",
    code_selected:"",
    description_selected:"",
    active_selected:true,
    edit_title: "",
    type:"create",
    texto:"",
    code_selection:"",
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
      { text: "Nombre Proyecto", value: "name", sortable: true },
      { text: "Código", value: "code", sortable: true },
      { text: "Descripción", value: "description", sortable: false },
      { text: "Activo", value: "active", sortable: true },
      { text: "", value: "actions", align: "left", sortable: false },
    ],
  }),
  created() {
    this.initialize();

    this.code_selection = "Todos";
    this.getAllProjectsByCodeCompany();

  },
  methods: {

    async getProjectByCode()
    {
       try{
          let code_filter = "";
          if (this.code_selection != 'Todos')
          {
            let arr = this.code_selection.split('--');
            code_filter = arr[1].trim();
          }

          const response = await fetch(Vue.prototype.$urlhermes + '/project/getProjectByCode?code='+ code_filter, 
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
          
          this.projects = [];
          this.projects.push(res_json);

        } catch (error) {
          console.log("Error occurred:", error);
          this.projects = [];
        }
    },

    async getAllProjectsByCodeCompany()
    {
      if(this.code_selection == "Todos")
      {
       try{
          const response = await fetch(Vue.prototype.$urlhermes + '/project/getProjectsByCodeCompany?codeCompany='+ this.empresa_code, 
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
          this.projects = res_json;

          this.projects_complete = [];
          this.projects_complete.push('Todos');
          res_json.forEach(element => {
            this.projects_complete.push(element.name + " -- " + element.code);
          });

        } catch (error) {
          console.log("Error occurred:", error);
          this.projects = [];
        }
      }
      else{
        this.getProjectByCode();
      }
    },

    async createProject() 
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
            "description":this.description_selected,
            "codeCompany":this.empresa_code,
            "active":this.active_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/project', 
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
          
          this.code_selection = "Todos";
          this.getAllProjectsByCodeCompany();     
          
          this.close();

          this.texto = "Proyecto creado correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },

    async updateProject() 
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
            "description":this.description_selected,
            "codeCompany":this.empresa_code,
            "active":this.active_selected
          }
          const response = await fetch(Vue.prototype.$urlhermes + '/project', 
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
          
          this.code_selection = "Todos";
          this.getAllProjectsByCodeCompany();     
          
          this.close();

          this.texto = "Proyecto actualizado correctamente";
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }
    },
   
    async deleteProject() 
    {
        try {

          const response = await fetch(Vue.prototype.$urlhermes + '/project/' + this.id_selected, 
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
          if(response.status == 400)
          {
            this.texto = "Proyecto no eliminado por dependencias";
          }
          else
          {
            this.code_selection = "Todos";
            this.getAllProjectsByCodeCompany(); 
            this.texto = "Proyecto eliminado correctamente";  
          }
          this.close_delete();
          this.snackbar = true;

        } catch (error) {
          console.log("Error occurred:", error);
        }

    },


    initialize() {

    },

    show_create_project_dialog() {
      this.id_selected = '';
      this.name_selected = '';
      this.code_selected = '';
      this.description_selected = '';
      this.active_selected = true;
      this.dialog = true;
      this.type = 'create';
    },


    show_edit_project_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.description_selected = item.description;
      this.active_selected = item.active;
      this.dialog = true;
      this.type = 'update';
    },

    show_delete_project_dialog(item) {
      this.id_selected = item.id;
      this.name_selected = item.name;
      this.code_selected = item.code;
      this.description_selected = item.description;
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

    getUrlDedication(item){
      return '/dedication?code=' + item.code + "&name=" + item.name + "&codeCompany="+this.empresa_code;
    },

    back(){
      router.go(-1);
    },
  
  },
};
</script>


<style lang="scss">
#no-background-hover::before {
   background-color: transparent !important;
}
</style>