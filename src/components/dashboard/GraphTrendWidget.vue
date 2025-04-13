<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ref, computed, watch, onMounted } from 'vue';
import { useLayout } from '../../composables/useLayout';
import { useGlobalState } from '../../store/store';

ChartJS.register(ArcElement, Tooltip, Legend);

const { primary, surface, isDarkMode } = useLayout();

const { state } = useGlobalState();

const calc = computed(() => state.value.calculated);

const numHullPoints = computed(() => calc.value.hull2D.length);
const numCollinearPoints = computed(() => calc.value.collinear2D.length);
const numDataPoints = computed(() => calc.value.regular2D.length);

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = ref({
  plugins: {
    legend: {
      position: 'top',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['Convex Hull Points', 'Collinear', 'Data Points'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [numHullPoints.value, numCollinearPoints.value, numDataPoints.value],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-primary-400'),
          documentStyle.getPropertyValue('--p-primary-300'),
          documentStyle.getPropertyValue('--p-primary-200'),
        ],
        hoverOffset: 4,
      },
    ],
  };
}

function setChartOptions() {
  return {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
}

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

watch(
  () => state.value.raw.raw2D,
  () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  },
  { immediate: true, deep: true }
);

watch([primary, surface, isDarkMode], () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>

<template>
  <div class="layout-card col-item-2">
    <div class="chart-header">
      <span class="chart-title">Data Trend</span>
    </div>
    <div class="chart-content" v-if="chartData && chartOptions">
      <Doughnut :data="chartData" :options="chartOptions" style="height: 300px" />
    </div>
  </div>
</template>
