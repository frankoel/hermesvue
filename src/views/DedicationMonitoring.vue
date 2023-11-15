<template class="client">
  <div>
    <h1 class="fontPrincipal">Dedicaciones</h1>
    <DedicationListComponent title="Todos las dedicaciones del proyecto " :proyecto_name="this.name" 
    :proyecto_code="this.code" :empresa_code="this.codeEmpresa"/>
  </div>
</template>

<script>
import DedicationListComponent from "@/components/DedicationListComponent";

export default {
  name: "DedicationMonitoring",
  data: () => ({
    name:"",
    code:""
  }),
  created() {
    this.name = this.$route.query.name;
    this.code = this.$route.query.code;
    this.codeEmpresa = this.$route.query.codeEmpresa;
  },  
  methods: {},

  components: {
    DedicationListComponent,
  },
};
</script>