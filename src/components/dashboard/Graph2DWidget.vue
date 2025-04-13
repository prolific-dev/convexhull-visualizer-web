<template>
  <div class="layout-card">
    <div class="chart-header">
      <span class="chart-title">Data Graph</span>
    </div>
    <Scatter :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Scatter } from 'vue-chartjs';
import { useGlobalState } from '../../store/store';
import { Point2D } from '../../math/math';
//import ProgressSpinner from 'primevue/progressspinner';
import { useLayout } from '../../composables/useLayout';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const { primary, surface, isDarkMode } = useLayout();
const { state, addAllPoint2D, clear2D } = useGlobalState();

const calc = computed(() => state.value.calculated);

const hull = computed(() => calc.value.hull2D);
const collinear = computed(() => calc.value.collinear2D);
const data = computed(() => calc.value.regular2D);

const chartData = ref({
  labels: ['Label 1', 'Label 2', 'Label 3'],
  datasets: [],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
    },
    y: {
      type: 'linear',
      position: 'left',
    },
  },
});

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  const hullData = hull.value.map((point) => ({ x: point.x, y: point.y })) || [];
  const hullShapeData =
    hullData.length > 0 ? [...hullData, { x: hullData[0].x, y: hullData[0].y }] : [];

  console.log('hullData', hullData);
  console.log('hullShapeData', hullShapeData);

  const collinearData = collinear.value.map((point) => ({ x: point.x, y: point.y }));
  const dataPoints = data.value.map((point) => ({ x: point.x, y: point.y }));

  return {
    //labels: ['Convex Hull Points', 'Collinear', 'Data Points'],
    datasets: [
      {
        label: 'Hull Points',
        data: hullData,
        backgroundColor: documentStyle.getPropertyValue('--p-primary-600'),
        hoverOffset: 4,
        pointRadius: 8,
      },
      {
        label: 'Hull Shape',
        data: hullShapeData,
        backgroundColor: `${documentStyle.getPropertyValue('--p-primary-100').trim()}80`,
        borderColor: documentStyle.getPropertyValue('--p-primary-100'),
        borderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 0,
        hoverOffset: 0,
        showLine: true,
        fill: 'shape',
      },
      {
        label: 'Collinear',
        data: collinearData,
        backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
        hoverOffset: 4,
        pointRadius: 8,
      },
      {
        label: 'Data Points',
        data: dataPoints,
        backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
        hoverOffset: 4,
        pointRadius: 8,
      },
    ],
  };
}

function setChartOptions() {
  const minX = Math.min(...state.value.raw.raw2D.map((point) => point.x));
  const maxX = Math.max(...state.value.raw.raw2D.map((point) => point.x));
  const minY = Math.min(...state.value.raw.raw2D.map((point) => point.y));
  const maxY = Math.max(...state.value.raw.raw2D.map((point) => point.y));

  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: minX - 1,
        max: maxX + 1,
      },
      y: {
        type: 'linear',
        position: 'left',
        min: minY - 1,
        max: maxY + 1,
      },
    },
  };
}

onMounted(() => {
  clear2D();

  const firstData = [
    new Point2D(1, 1),
    new Point2D(1, 2),
    new Point2D(2, 2),
    new Point2D(2, 2),
    new Point2D(1, 3),
    new Point2D(3, 1),
    new Point2D(3, 3),
    new Point2D(0, 3),
    new Point2D(0, 1),
  ];

  addAllPoint2D(firstData);

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

<style scoped>
/*
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}
*/
</style>
