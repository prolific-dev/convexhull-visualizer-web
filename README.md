# Graham Scan Web

Graham Scan Web is a visualization tool for convex hull algorithms, including 2D and 3D visualizations. It leverages modern web technologies like Vue.js, PrimeVue, and Plotly.js to provide an interactive and user-friendly experience.

## Features

- **2D Convex Hull Visualization**: Visualize convex hulls in 2D using the Graham Scan algorithm.
- **3D Convex Hull Visualization**: Explore convex hulls in 3D space (basic implementation).
- **Dynamic Data Input**: Add points manually, upload CSV files, or clear/reset data.
- **Dark Mode Support**: Toggle between light and dark themes.
- **Customizable Layout**: Modify primary and surface colors dynamically.
- **Real-Time Updates**: Automatically update visualizations and statistics when data changes.
- **Activity Tracking**: View recent actions in the "Recent Activity" widget.

## Technologies Used

- **Vue.js**: Frontend framework for building the user interface.
- **PrimeVue**: UI components for Vue.js.
- **Plotly.js**: Interactive plotting library for 2D and 3D visualizations.
- **Chart.js**: Used for additional chart visualizations.
- **TypeScript**: Strongly typed programming language for better code quality.
- **Vite**: Fast build tool for modern web projects.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/graham-scan-web.git
   cd graham-scan-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build

To build the project for production:

```bash
npm run build
```

## Preview

To preview the production build:

```bash
npm run preview
```

## Type Checking

To run TypeScript type checks:

```bash
npm run type-check
```

## Usage

1. **Add Points**: Use the form in the "Graph Settings" widget to add points manually.
2. **Upload CSV**: Upload a CSV file containing point data (supports both 2D and 3D points).
3. **Switch Dimensions**: Toggle between 2D and 3D visualizations using the dimension selector.
4. **Customize Theme**: Change primary and surface colors or toggle dark mode in the settings.
5. **View Statistics**: Check the "Graph Stats" widget for real-time statistics on the data.
6. **Track Activity**: View recent actions in the "Recent Activity" widget.

## File Structure

- **`src/components`**: Vue components for the UI.
  - **`dashboard`**: Widgets for the dashboard, including graph visualizations, stats, and settings.
- **`src/math`**: Algorithms for convex hull computation (e.g., Graham Scan).
- **`src/store`**: Global state management using VueUse.
- **`src/assets`**: Static assets like styles and images.
- **`src/composables`**: Reusable Vue composables for layout and theme management.
- **`src/io`**: Utility functions for processing CSV files.
- **`src/util`**: Helper classes like `Queue` and `Stack`.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vue.js](https://vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [Plotly.js](https://plotly.com/javascript/)
- [Chart.js](https://www.chartjs.org/)
- [Vite](https://vitejs.dev/)
