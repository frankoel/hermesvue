<template>
  <v-app id="inspire">
  
    <HeaderComponent />

    <v-main class="mx-5 my-5 hero">
      <router-view></router-view>
    </v-main>

    <FooterComponent />

  </v-app>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Aldrich");

.withborder 
{
  padding: 10px 10px 10px 20px;
}

.colorPrincipal
{
    color: #175380 !important;
    background-color:#175380 !important;
}

.soloBckColorPrincipal
{
    background-color: #175380 !important;
}

.soloColorPrincipal
{
    color: #175380 !important;
}

.btnPrincipal
{
    background-color: #175380 !important;
    color: white !important;
}

.word-break
{ 
    word-break:break-word !important;
}

.titleComponent {
  font-family: "Aldrich";
  font-size: 15px;
  text-align: left;
}

.titleComponentCenter {
  font-family: "Aldrich";
  font-size: 15px;
  text-align: center;
}

.fontPrincipal {
  font-family: "Aldrich" !important;
}
</style>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

export default {
  data: () => ({
  }),

  components: {
    HeaderComponent,
    FooterComponent
  },
};
</script>
