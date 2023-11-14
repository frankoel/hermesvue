<template>
  <div class="home">
    <FirstComponent />
    <SecondComponent />
    <ThirdComponent />
    <FourthComponent />
  </div>
</template>

<script>
import FirstComponent from "@/components/landing/FirstComponent";
import SecondComponent from "@/components/landing/SecondComponent";
import ThirdComponent from "@/components/landing/ThirdComponent";
import FourthComponent from '../components/landing/FourthComponent.vue';

export default {
  name: "Home",

  components: {
    FirstComponent,
    SecondComponent,
    ThirdComponent,
    FourthComponent
  },
};
</script>
