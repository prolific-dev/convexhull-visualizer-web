import { Point2D, Point3D } from '../math/math';

/**
 * Parses a CSV string and converts it into an array of Point2D or Point3D objects.
 * @param csvContent - The CSV content as a string.
 * @returns An array of Point2D or Point3D objects.
 */
export function parseCSVToPoints(csvContent: string): (Point2D | Point3D)[] {
  const points: (Point2D | Point3D)[] = [];
  const rows = csvContent.split('\n');

  for (const row of rows) {
    const values = row.split(',').map((value) => parseFloat(value.trim()));
    if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
      points.push(new Point2D(values[0], values[1]));
    } else if (values.length === 3 && !isNaN(values[0]) && !isNaN(values[1]) && !isNaN(values[2])) {
      points.push(new Point3D(values[0], values[1], values[2]));
    }
  }

  return points;
}

/**
 * Processes a CSV file and converts it into an array of Point2D or Point3D objects.
 * @param file - The CSV file to process.
 * @returns A promise that resolves to an array of Point2D or Point3D objects.
 */
export async function processCSVFile(file: File): Promise<(Point2D | Point3D)[]> {
  const csvContent = await readFileAsText(file);

  /**
   * Reads a file and returns its content as a string.
   * @param file - The file to read.
   * @returns A promise that resolves to the file content as a string.
   */
  async function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
  return parseCSVToPoints(csvContent);
}
