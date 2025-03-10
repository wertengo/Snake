<!-- <template>
<div>
  <h3>Babylon Task</h3>
  <canvas></canvas>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { BasicScene } from '@/BabylonTask/BabylonScene'; 

export default defineComponent({
  name: 'BabylonTask',
  mounted(){
    const canvas = document.querySelector("canvas")!;
    new BasicScene(canvas);
  }
});
</script>

Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>

canvas{
  width: 70%;
  height: 70%;
}

</style> -->

<template>
  <div>
    <h3>Babylon Task</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { BasicScene } from '@/BabylonTask/BabylonScene'; 

export default defineComponent({
  name: 'BabylonTask',
  props: {
    color: {
      type: String,
      required: true,
    },
  },
  emits: ['mesh-selected'],
  setup(props, { emit }) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let basicScene: BasicScene | null = null;

    onMounted(() => {
      if (canvas.value) {
        basicScene = new BasicScene(canvas.value);

        if (basicScene?.snake?.onMeshSelectedObservable) {
      basicScene.snake.onMeshSelectedObservable.add((id: string) => {
        emit('mesh-selected', id);
      });
    } else {
      console.error('Snake or onMeshSelectedObservable is not defined');
    }
      }
    });

    // Следим за изменением цвета и применяем его к выбранному мешу
    watch(() => props.color, (newColor) => {
      if (basicScene && basicScene.snake) {
        const selectedMeshId = basicScene.snake.lastSelectedMeshId; // Используем lastSelectedMeshId
        if (selectedMeshId) {
          basicScene.snake.changeMaterial(selectedMeshId, newColor);
        }
      }
    });

    return { canvas };
  }
});
</script>

<style scoped>
canvas {
  width: 70%;
  height: 70%;
}
</style>
