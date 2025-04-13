<template>
  <div class="loading-dialog">
    <p class="bold">Loading...</p>
    <ProgressBar :value="progressValue" :style="{ width: '100%' }" />
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { ProgressBar } from 'primevue';

const dialogRef = inject('dialogRef');

const progressValue = ref(0);

const simulateProgress = () => {
  if (progressValue.value < 100) {
    progressValue.value += 25;
    setTimeout(simulateProgress, 350);
  }

  if (progressValue.value >= 100) {
    setTimeout(() => {
      progressValue.value = 0;
      dialogRef.value.close();
    }, 850);
  }
};

simulateProgress();
</script>

<style scoped>
.loading-dialog {
  width: 30vw;
  height: 20vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-dialog p {
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
