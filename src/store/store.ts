import { createGlobalState, useSessionStorage, useStorage } from '@vueuse/core';
import { Point2D, Point3D } from '../math/math';
import { GrahamScan } from '../math/graham';

interface GraphState {
  // Config
  config: {
    dimension: '2D' | '3D';
  };

  // Raw
  raw: {
    raw2D: Point2D[];
    raw3D: Point3D[];
  };

  // Calculated
  calculated: {
    regular2D: Point2D[];
    collinear2D: Point2D[];
    hull2D: Point2D[];
    calcTime2D?: number;

    regular3D: Point3D[];
    collinear3D: Point3D[];
    hull3D: Point3D[];
    calcTime3D?: number;
  };
}

export const useGlobalState = createGlobalState(() => {
  const state = useStorage<GraphState>('global-graph-state', {
    config: {
      dimension: '2D',
    },
    raw: {
      raw2D: [],
      raw3D: [],
    },
    calculated: {
      regular2D: [],
      collinear2D: [],
      hull2D: [],
      calcTime2D: undefined,

      regular3D: [],
      collinear3D: [],
      hull3D: [],
      calcTime3D: undefined,
    },
  });

  const setDimension = (dimension: '2D' | '3D') => {
    state.value.config.dimension = dimension;
  };

  const getDimension = (): '2D' | '3D' => state.value.config.dimension;

  const calculate2D = () => {
    const unique = Array.from(
      new Map(state.value.raw.raw2D.map((p) => [`${p.x},${p.y}`, p])).values()
    );
    const start = performance.now();
    const { hull, collinear, regular } = GrahamScan.scan(new Set<Point2D>(unique));
    const end = performance.now();

    state.value.calculated.hull2D = hull;
    state.value.calculated.collinear2D = collinear;
    state.value.calculated.regular2D = regular;
    state.value.calculated.calcTime2D = end - start;
  };

  const calculate3D = () => {
    // Placeholder for 3D calculation logic
    // state.value.calculated.calcTime3D = ...;
  };

  const addPoint2D = (point: Point2D) => {
    state.value.raw.raw2D.push(point);
    calculate2D();
  };

  const addPoint3D = (point: Point3D) => {
    state.value.raw.raw3D.push(point);
    calculate3D();
  };

  const addAllPoint2D = (points: Point2D[]) => {
    state.value.raw.raw2D.push(...points);
    calculate2D();
  };

  const addAllPoint3D = (points: Point3D[]) => {
    state.value.raw.raw3D.push(...points);
    calculate3D();
  };

  const removePoint2D = (point: Point2D) => {
    state.value.raw.raw2D = state.value.raw.raw2D.filter((p) => !p.equals(point));
    calculate2D();
  };

  const removePoint3D = (point: Point3D) => {
    state.value.raw.raw3D = state.value.raw.raw3D.filter((p) => !p.equals(point));
    calculate3D();
  };

  const clear2D = () => {
    state.value.raw.raw2D = [];
    state.value.calculated.regular2D = [];
    state.value.calculated.collinear2D = [];
    state.value.calculated.hull2D = [];
    state.value.calculated.calcTime2D = undefined;
  };

  const clear3D = () => {
    state.value.raw.raw3D = [];
    state.value.calculated.regular3D = [];
    state.value.calculated.collinear3D = [];
    state.value.calculated.hull3D = [];
    state.value.calculated.calcTime3D = undefined;
  };

  return {
    state,
    setDimension,
    getDimension,
    calculate2D,
    calculate3D,
    addPoint2D,
    addPoint3D,
    addAllPoint2D,
    addAllPoint3D,
    removePoint2D,
    removePoint3D,
    clear2D,
    clear3D,
  };
});

interface GraphSessionActivity {
  icon: string;
  text: string;
  time: string;
  color: string;
}

export const useGraphSessionStorage = createGlobalState(() => {
  const graphSessionActivity = useSessionStorage<GraphSessionActivity[]>(
    'graph-session-activity',
    []
  );

  return {
    graphSessionActivity,
  };
});
