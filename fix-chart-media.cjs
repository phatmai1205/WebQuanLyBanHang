const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const additionalMedia = `
    @media (max-width: 900px) {
      .chart-card {
        height: auto;
      }
      .chart-card canvas {
        height: 250px !important;
        max-height: 250px !important;
      }
    }
    @media (max-width: 768px) {
      .chart-card {
        height: auto;
      }
      .chart-card canvas {
        height: 220px !important;
        max-height: 220px !important;
      }
    }
`;

html = html.replace('  </style>', additionalMedia + '\n  </style>');

html = html.replace(
  'let cMonthChart, cRegionChart, cCityChart, cStatusChart, cHieuSuatChart;',
  'let cMonthChart, cRegionChart, cCityChart, cStatusChart, cHieuSuatChart;\n    if (typeof Chart !== "undefined") { Chart.defaults.maintainAspectRatio = false; Chart.defaults.responsive = true; }'
);

fs.writeFileSync('index.html', html);
console.log('Update chart done.');
