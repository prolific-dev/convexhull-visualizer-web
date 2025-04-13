<template>
  <div class="layout-card">
    <div v-if="isRendering" class="loading-overlay">
      <ProgressSpinner
        style="width: 50px; height: 50px"
        stroke-width="8"
        fill="transparent"
        animation-duration="1s"
        aria-label="Custom ProgessSpinner"
      />
    </div>
    <div ref="plotlyChart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
// @ts-expect-error IDK
import Plotly from 'plotly.js-dist-min';
// @ts-expect-error IDK
import { useLayout } from '../../composables/useLayout';
import { useGlobalState } from '../../store/store';
import ProgressSpinner from 'primevue/progressspinner';
import { Point2D } from '../../math/math';

const { state, addAllPoint2D, clear2D } = useGlobalState();
const { primary, surface, isDarkMode } = useLayout();
const plotlyChart = ref<HTMLDivElement | null>(null);
const isInitialized = ref(false);
const isRendering = ref(false);

const documentStyle = computed(() => getComputedStyle(document.documentElement));

const layout = {
  xaxis: {},
  yaxis: {},
  title: { text: 'Convex Hull Visualization 2D' },
  legend: { orientation: 'h' },
  plot_bgcolor: '#fff',
  paper_bgcolor: '#fff',
};

const config = {
  modeBarButtonsToRemove: ['select2d', 'lasso2d'],
  displaylogo: false,
  responsive: true,
};

// Regular Data Points
const trace1 = {
  x: [0],
  y: [0],
  mode: 'markers',
  type: 'scatter',
  name: 'Data Points',
  marker: { color: documentStyle.value.getPropertyValue('--p-primary-200'), size: 12 },
};

// Collinear Points
const trace2 = {
  x: [0],
  y: [0],
  mode: 'markers',
  type: 'scatter',
  name: 'Collinear Points',
  marker: { color: documentStyle.value.getPropertyValue('--p-primary-700'), size: 12 },
};

// Convex Hull Points
const trace3 = {
  x: [0],
  y: [0],
  mode: 'lines+markers',
  fill: 'toself',
  name: 'Convex Hull Points',
  marker: { color: documentStyle.value.getPropertyValue('--p-primary-800'), size: 12 },
  line: { color: documentStyle.value.getPropertyValue('--p-primary-200'), width: 1 },
  hoverinfo: 'skip',
};

const renderPlot = () => {
  isRendering.value = true;

  const documentStyle = getComputedStyle(document.documentElement);

  const { hull2D: hull, collinear2D: collinear, regular2D: regular } = state.value.calculated;

  trace1.x = regular ? regular.map((p) => p.x) : [];
  trace1.y = regular ? regular.map((p) => p.y) : [];

  trace2.x = collinear ? collinear.map((p) => p.x) : [];
  trace2.y = collinear ? collinear.map((p) => p.y) : [];

  trace3.x = hull ? hull.map((p) => p.x) : [];
  trace3.y = hull ? hull.map((p) => p.y) : [];

  const data = [trace1, trace2, trace3];

  if (!isInitialized.value) {
    Plotly.newPlot(plotlyChart.value, data, layout, config);
    isInitialized.value = true;
  } else {
    const allX = regular
      .map((p) => p.x)
      .concat(collinear.map((p) => p.x))
      .concat(hull.map((p) => p.x));
    const allY = regular
      .map((p) => p.y)
      .concat(collinear.map((p) => p.y))
      .concat(hull.map((p) => p.y));

    const xMin = Math.min(...allX);
    const xMax = Math.max(...allX);
    const YMin = Math.min(...allY);
    const YMax = Math.max(...allY);

    layout.xaxis = { range: [xMin - 1, xMax + 1] };
    layout.yaxis = { range: [YMin - 1, YMax + 1] };

    Plotly.animate(
      plotlyChart.value,
      {
        data: data,
        layout: layout,
      },
      {
        transition: {
          duration: 500,
          easing: 'ease-in-out',
        },
        frame: {
          duration: 500,
          redraw: true,
        },
      }
    );
  }

  if (isDarkMode.value) {
    Plotly.relayout(plotlyChart.value, {
      xaxis: { gridcolor: 'white' },
      yaxis: { gridcolor: 'white' },
      paper_bgcolor: documentStyle.getPropertyValue('--p-surface-900'),
      plot_bgcolor: documentStyle.getPropertyValue('--p-surface-900'),
    });
  } else {
    Plotly.relayout(plotlyChart.value, {
      paper_bgcolor: 'white',
      plot_bgcolor: 'white',
    });
  }

  isRendering.value = false;
};

onMounted(() => {
  clear2D();

  const firstData = [
    new Point2D(1, 1),
    new Point2D(2, 2),
    new Point2D(1, 2),
    new Point2D(2, 2),
    new Point2D(1, 3),
    new Point2D(3, 3),
    new Point2D(3, 3),
    new Point2D(0, 3),
  ];

  addAllPoint2D(firstData);

  isInitialized.value = false;
  renderPlot();
  isInitialized.value = true;
});

watch(
  () => state.value.raw.raw2D,
  () => renderPlot(),
  { deep: true }
);

watch([primary, isDarkMode, surface], () => renderPlot());
</script>

<style scoped>
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
</style>
