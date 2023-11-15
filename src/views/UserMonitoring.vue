<template class="client">
  <div>
    <h1 class="fontPrincipal">Usuarios</h1>
    <UserListComponent title="Todos los usuarios de la empresa" :empresa_name="this.name" :empresa_code="this.code" />
  </div>
</template>

<script>
import UserListComponent from "@/components/UserListComponent";

export default {
  name: "UserMonitoring",
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
    UserListComponent,
  },
};
</script>