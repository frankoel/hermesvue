<template class="client">
  <div>
    <h1 class="fontPrincipal">Proyectos</h1>
    <ProjectListComponent title="Todos los proyectos de la empresa" :empresa_name="this.name" :empresa_code="this.code"/>
  </div>
</template>

<script>
import ProjectListComponent from "@/components/ProjectListComponent";

export default {
  name: "ProjectMonitoring",
  data: () => ({
    name:"",
    code:""
  }),
  created() {
    this.name = this.$route.query.name;
    this.code = this.$route.query.code;
  },  
  methods: {},

  components: {
    ProjectListComponent,
  },
};
</script>