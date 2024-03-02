module.exports = (chart) => `
<html>
    <head>
        <title>AutoChart</title>
    </head>

    <body >
        <canvas id="chart"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
        <script>
            var ctx = document.getElementById('chart').getContext('2d');
            var chart = new Chart(ctx, JSON.parse(\`${JSON.stringify(chart)}\`));
        </script>
    </body>
</html>

`