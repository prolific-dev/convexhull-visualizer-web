<template>
  <div class="layout-card">
    <div ref="plotlyChart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// @ts-expect-error IDK
import Plotly from 'plotly.js-dist-min';
// @ts-expect-error IDK
import { useLayout } from '../../composables/useLayout';

const { primary, surface, isDarkMode } = useLayout();

const plotlyChart = ref<HTMLDivElement | null>(null);

const trace1 = {
  x: [1, 1, 1, 1, 3, 3, 3, 3, 2],
  y: [1, 1, 3, 3, 1, 1, 3, 3, 2],
  z: [1, 3, 1, 3, 1, 3, 1, 3, 2],
  mode: 'markers',
  type: 'scatter3d',
  connectgaps: true,
  alphahull: 7,
  marker: {
    color: 'red',
    size: 12,
    line: {
      color: 'black',
      width: 2,
    },
  },
};

// Compute Convex Hull
//const set: Set<Point> = new Set();
//trace1.x.forEach((x, i) => set.add(new Point(x, trace1.y[i])));
//const hull = GrahamScan.scan(set);

// Hull Trace (Drawing the shape)
//const hullTrace = hull ? {
//  x: hull.map((p: Point ) => p.x),
//  y: hull.map((p: Point ) => p.y),
//  mode: 'lines+markers',
//  fill: 'toself',
//  name: 'Convex Hull',
//  line: {
//    color: 'transparent',
//    width: 1
//  },
//  marker: { size: 12 },
//  hoverinfo: 'skip'
//} : null;

//const data = [ trace1, hullTrace ];

const data = [trace1];

const layout = {
  xaxis: {
    range: [0, 10],
    backgroundcolor: 'rgba(50,23,120,20)',
    gridcolor: 'rgba(50,23,120,20)',
  },
  yaxis: {
    range: [0, 10],
  },
  zaxis: {
    range: [0, 10],
  },
  title: {
    text: 'Convex Hull Visualization 3D',
    automargin: true,
  },
  legend: {
    orientation: 'h',
  },
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0,
  },
  paper_bgcolor: 'rgba(50,23,120,20)',
  plot_bgcolor: 'rgba(50,23,120,20)',
};

const config = {
  responsive: true,
  displaylogo: false,
};

function restylePlot() {
  if (plotlyChart.value) {
    const documentStyle = getComputedStyle(document.documentElement);

    trace1.marker.color = documentStyle.getPropertyValue('--p-primary-200');

    Plotly.restyle(plotlyChart.value, {
      'marker.color': trace1.marker.color,
      'line.color': trace1.marker.color,
    });

    if (isDarkMode.value) {
      Plotly.relayout(plotlyChart.value, {
        paper_bgcolor: documentStyle.getPropertyValue('--p-surface-900'),
        plot_bgcolor: documentStyle.getPropertyValue('--p-surface-900'),
      });
    } else {
      Plotly.relayout(plotlyChart.value, {
        paper_bgcolor: 'white',
        plot_bgcolor: 'white',
      });
    }
  }
}

onMounted(() => {
  if (plotlyChart.value) {
    Plotly.newPlot(plotlyChart.value, data, layout, config);
    restylePlot();
  }
});

watch([primary, isDarkMode, surface], () => restylePlot());
</script>

<style scoped></style>
