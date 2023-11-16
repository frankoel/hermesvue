<template>

  <v-toolbar class="colorPrincipal" style="max-height: 66px">

    <!--<v-img
      lazy-src="@/assets/logo-all.png"
      max-height="80"
      max-width="80"
      src="@/assets/logo-all.png">
    </v-img>-->

    <span class="white--text title fontPrincipal">HERMES TEAM SPHERE</span>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">

      <v-btn class="btnPrincipal"
        v-for="item in get_all_items()"
        :key="item.text"
        :to="item.link"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      {{ item.text }} 
      </v-btn>

      <v-btn class="btnPrincipal">
        <v-icon>
            mdi-account-circle
        </v-icon>
        <span class="white--text">
          John Doe
        </span>
        <v-avatar style="margin-left: 4px;">
          <v-img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          >
          </v-img>
        </v-avatar>
      </v-btn>

    </v-toolbar-items>

    <v-menu class="hidden-md-and-up">
      <template v-slot:activator="{ on, attrs }">      
        <v-app-bar-nav-icon v-bind="attrs" v-on="on" class="hidden-md-and-up" style="color: white !important;"></v-app-bar-nav-icon>
      </template>
      <v-list class="btnPrincipal">
        <v-list-item
          v-for="item in get_all_items()"
          :key="item.text"
          router
          :to="item.link" 
          class="btnPrincipal"         
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="btnPrincipal"         
        >
          <v-list-item-title>Account Jonh Doe</v-list-item-title>
        </v-list-item>        
      </v-list>
    </v-menu>

  </v-toolbar>

</template>



<script>


export default {
  data: () => ({
    drawer: null,
    selectedItem: 1,
    items: [
      { text: "INICIO", icon: "mdi-clock", link: "/", show_always: false },
      { text: "COMPAÑÍAS", icon: "mdi-bank", link: "/company", show_always: true },
      { text: "CONTACTO", icon: "mdi-account", link: "/about", show_always: false },
    ],
  }),

  computed: {
    username() {
      //const user = store.getters.user;
      let username = "Fran";
      //if (user.loggedIn) {
      //  username = user.data.email;
      //}

      return username;
    },
  },

  methods: {
    show_element(item) {
      return  item.show_always;
    },

    get_all_items() {
      return this.items.filter((v) => this.show_element(v));
    },
  },

  components: {
    
  },
};
</script>

<style scoped>
.my-span {
  background-color: blue;
  color: white;
  font-weight: bold;
  margin-right: 0;
  float: right;
}
</style>
