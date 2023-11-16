<template class="client">
  <div>
    <h1 class="fontPrincipal">Dedicaciones</h1>
    <DedicationListComponent title="Todos las dedicaciones del proyecto " :proyecto_name="this.name" 
    :proyecto_code="this.code" :empresa_code="this.codeCompany"/>
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
    this.codeCompany = this.$route.query.codeCompany;
  },  
  methods: {},

  components: {
    DedicationListComponent,
  },
};
</script>