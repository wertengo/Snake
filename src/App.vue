<template>
  <BabylonTask />
  <input v-model="color" type="color">
  <input v-model="text" type="text">
  {{ color }}
  {{ text }}
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import BabylonTask from './components/BabylonTask.vue';

const color = ref();
const text = ref('text');

// export default defineComponent({
//   name: 'App',
//   components: {
//     BabylonTask
//   }
// });

// data(){
//   return{
//     color: ""
//   }
// }



</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
