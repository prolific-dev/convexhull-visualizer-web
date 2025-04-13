import { Point2D } from './math';

export class QuickHull3D {
  private constructor() {}

  public static hull(points: Set<Point2D>): Point2D[] {
    points.forEach((p) => {
      console.log(`(${p.x}, ${p.y})`);
    });
    return [];
  }
}
