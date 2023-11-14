<template class="client">
  <div>
    <h1 class="fontPrincipal">Empresas</h1>
    <CompanyListComponent title="Todas las empresas"/>
  </div>
</template>

<script>
import CompanyListComponent from "@/components/CompanyListComponent";

export default {
  name: "CompanyMonitoring",
  data: () => ({}),
  methods: {},

  components: {
    CompanyListComponent,
  },
};
</script>