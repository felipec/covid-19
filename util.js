var number = new Intl.NumberFormat();

var chart = new Chart('chart', {
  type: 'line',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    resposive: true,
    maintainAspectRatio: false,
    aspectRatio: 0.5,
    elements: {
      line: {
        fill: false,
        borderWidth: 2,
        lineTension: 0,
      },
    },
    tooltips: {
      mode: 'x',
      bodyAlign: 'right',
      itemSort: (a, b) => b.yLabel - a.yLabel,
      callbacks: {
        label: (item, data) => {
          return data.datasets[item.datasetIndex].label + ': ' + number.format(item.yLabel);
        },
      },
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days after 100 cases',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: '',
        },
      }],
    },
  },
});

async function start(callback) {
  const response = await fetch('https://pomber.github.io/covid19/timeseries.json');
  const data = await response.json();

  let countries = [
    { id: 'Italy', color: 'hsl(0, 75%, 50%)' },
    { id: 'Iran', color: 'hsl(40, 75%, 50%)' },
    { id: 'Spain', color: 'hsl(80, 75%, 50%)' },
    { id: 'US', color: 'hsl(120, 75%, 50%)' },
    { id: 'United Kingdom', color: 'hsl(160, 75%, 50%)' },
    { id: 'Korea, South', color: 'hsl(200, 75%, 50%)' },
    { id: 'Japan', color: 'hsl(240, 75%, 50%)' },
  ];

  if (r = window.location.href.match(/[?&]extra=([^&]+)/)) {
    const extra = r[1].split(',');
    for (const id of extra) {
      const n = {
        id: id,
        color: 'hsl(320, 75%, 50%, 50%)',
        params: { pointStyle: 'rect' },
      };
      countries.push(n);
    }
  }

  if (r = window.location.href.match(/[?&]country=([^&]+)/)) {
    const n = {
      id: r[1],
      color: 'hsl(280, 75%, 50%)',
      params: { borderWidth: 4, pointStyle: 'rectRot' },
    };
    countries = countries.filter(e => e.id != n.id);
    countries.unshift(n);
  }

  for (const {id, color, params} of countries) {

    const dataset = {
      label: id,
      data: callback(data[id]),
      borderColor: color,
      backgroundColor: color,
    };

    if (params) Object.assign(dataset, params);
    chart.data.datasets.push(dataset);
  }

  const max_days = chart.data.datasets.reduce((accum, e) => Math.max(accum, e.data.length), 0);
  chart.data.labels = Array.apply(null, Array(max_days)).map((e, i) => i + 1);
  chart.update();
}
