export class Point2D {
  x: number;
  y: number;
  angleP0: number = 0;
  distanceP0: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(p: Point2D): boolean {
    return this.x === p.x && this.y === p.y;
  }

  //compareTo(p: Point2D): number {
  //  const cmp = this.angleP0 - p.angleP0;
  //  if (cmp !== 0) return cmp;
  //  return this.distanceP0 - p.distanceP0;
  //}

  compareTo(p: Point2D): number {
    const EPS = 1e-10;
    if (Math.abs(this.angleP0 - p.angleP0) > EPS) {
      return this.angleP0 - p.angleP0;
    }
    return this.distanceP0 - p.distanceP0;
  }
}

export class Point3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  equals(p: Point3D): boolean {
    return this.x === p.x && this.y === p.y && this.z === p.z;
  }
}
