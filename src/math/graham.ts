import { Point2D } from './math';
import { Stack } from '../util/stack';

export class GrahamScan {
  //private static readonly SHIFT_DEGREE = 90.0;
  private static readonly MIN_POINTS = 3;

  private constructor() {}

  private static removeCollinearPoints(sorted: Point2D[]): {
    hull: Point2D[];
    collinear: Point2D[];
  } {
    const hull: Point2D[] = [];
    const collinear: Point2D[] = [];

    // Add the first point (p0) to the hull
    const p0 = sorted[0];
    hull.push(p0);

    // Group points by their angle relative to p0
    const angleGroups = new Map<number, Point2D[]>();
    for (const point of sorted) {
      const key = parseFloat(point.angleP0.toFixed(8));
      if (!angleGroups.has(key)) {
        angleGroups.set(key, []);
      }
      angleGroups.get(key)!.push(point);
    }

    // Process each group of points with the same angle
    for (const [, angleGroup] of angleGroups) {
      if (angleGroup.length === 1) {
        // If only one point exists for this angle, add it to the hull
        if (!angleGroup[0].equals(p0)) {
          hull.push(angleGroup[0]);
        }
        continue;
      }

      // Find the farthest point in the group (maximum distance from p0)
      const maxPoint = angleGroup.reduce(
        (max: Point2D, p: Point2D) => (p.distanceP0 > max.distanceP0 ? p : max),
        angleGroup[0]
      );

      // Add the farthest point to the hull if it's not p0
      if (maxPoint !== p0) {
        hull.push(maxPoint);
      }

      // Add all other points in the group to the collinear list
      for (const point of angleGroup) {
        if (!point.equals(maxPoint)) {
          collinear.push(point);
        }
      }
    }

    // Ensure points that are not the farthest are correctly classified as collinear
    return { hull: hull, collinear: collinear };
  }

  private static sort(points: Set<Point2D>): Point2D[] {
    let p0: Point2D | null = null;
    const sorted: Point2D[] = Array.from(points);

    for (const p of points) {
      if (p0 === null) {
        p0 = p;
        continue;
      }

      if (p0.y < p.y) continue;

      if (p0.y === p.y && p0.x < p.x) continue;

      p0 = p;
    }

    if (!p0) return [];

    for (const p of sorted) {
      p.angleP0 = Math.atan2(p.y - p0.y, p.x - p0.x);
      //p.angleP0 = p.angleP0 * (180.0 / Math.PI) + GrahamScan.SHIFT_DEGREE;
      //p.angleP0 = p.angleP0 * (180.0 / Math.PI) + GrahamScan.SHIFT_DEGREE;
      p.distanceP0 = Math.sqrt(Math.pow(p.x - p0.x, 2) + Math.pow(p.y - p0.y, 2));
    }

    sorted.sort((a, b) => {
      return a.compareTo(b);
    });

    const lastAngleP0 = sorted[sorted.length - 1].angleP0;
    let startIdx = sorted.length - 1;
    const EPS = 1e-10;
    //while (startIdx > 0 && sorted[startIdx - 1].angleP0 === lastAngleP0) {
    while (startIdx > 0 && Math.abs(sorted[startIdx - 1].angleP0 - lastAngleP0) < EPS) {
      startIdx--;
    }

    const lastAnglePoints = sorted.slice(startIdx, sorted.length).reverse();
    sorted.splice(startIdx, lastAnglePoints.length, ...lastAnglePoints);

    return sorted;
  }

  private static pointIsLeft(a: Point2D, b: Point2D, c: Point2D): boolean {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
  }

  public static scan(points: Set<Point2D>): {
    hull: Point2D[];
    collinear: Point2D[];
    regular: Point2D[];
  } {
    const sorted: Point2D[] = GrahamScan.sort(points);
    const n = sorted.length;
    const regular: Point2D[] = [];

    if (n < GrahamScan.MIN_POINTS) return { hull: [], collinear: [], regular: Array.from(points) };

    const hullStack: Stack<Point2D> = new Stack<Point2D>();

    hullStack.push(sorted[0]);
    hullStack.push(sorted[1]);

    let i = 2;

    while (i < n) {
      const si: Point2D = sorted[i];

      if (hullStack.size() === 2) {
        hullStack.push(si);
        i++;
        continue;
      }

      const pt1: Point2D | undefined = hullStack.peek();
      const pt2: Point2D | undefined = hullStack.get(hullStack.size() - 2);

      if (!pt1 || !pt2) return { hull: [], collinear: [], regular: Array.from(points) };

      if (this.pointIsLeft(pt2, pt1, si)) {
        hullStack.push(si);
        i++;
        continue;
      }

      //hullStack.pop();
      regular.push(hullStack.pop()!);
    }

    const { hull, collinear } = GrahamScan.removeCollinearPoints(hullStack.toArray());
    return {
      hull: hull,
      collinear: collinear,
      regular: regular,
    };
  }
}
