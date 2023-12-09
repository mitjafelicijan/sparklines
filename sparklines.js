(() => {
  const sparklines = document.querySelectorAll('[data-sparkline="true"]');
  if (!sparklines) return; // Just stop and exit if nothing found.

  sparklines.forEach(sparkline => {
    let opts = null; // Global opts variable.

    function setup(sparkline) {
      let defaultOpts = {
        svg: null,
        width: parseIntWithDefault(sparkline.dataset.width, 100),
        height: parseIntWithDefault(sparkline.dataset.height, 30),
        gap: parseIntWithDefault(sparkline.dataset.gap, 5),
        strokeWidth: parseIntWithDefault(sparkline.dataset.strokeWidth, 2),
        type: sparkline.dataset.type || 'bar',
        colors: sparkline.dataset.colors || ['gray'],
        points: sparkline.dataset.points || null,
        labels: sparkline.dataset.labels || null,
        format: sparkline.dataset.format || null,
      };

      defaultOpts.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      defaultOpts.svg.setAttribute('width', defaultOpts.width);
      defaultOpts.svg.setAttribute('height', defaultOpts.height);

      return defaultOpts
    }

    function parseIntWithDefault(val, defaultValue) {
      let parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultValue : parsed;
    }

    function validate(sparkline, opts) {
      if (!Array.isArray(opts.colors)) {
        opts.colors = sparkline.dataset.colors.split(',');
      }

      if (!opts.points) { return }
      sparkline.innerHTML = '';
      opts.points = opts.points.split(',').map(item => parseInt(item, 10));
    }

    function formatString(format, point) {
      // TODO: Add string formatting.
    }

    function bar(sparkline, opts) {
      const columnWidth = (opts.gap/opts.points.length) + (opts.width/opts.points.length) - opts.gap;
      const maxValue = Math.max(...opts.points);

      opts.points.forEach((point, idx) => {
        const color = opts.colors[idx % opts.colors.length];
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const rectHeight = (point/maxValue)*opts.height;
        rect.setAttribute('x', (idx*columnWidth) + (idx*opts.gap));
        rect.setAttribute('y', opts.height-rectHeight);
        rect.setAttribute('width', columnWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('fill', color);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = point;
        rect.appendChild(title);

        opts.svg.appendChild(rect);
      });

      sparkline.appendChild(opts.svg);
    }

    function line(sparkline, opts) {
      const spacing = opts.width/(opts.points.length-1);
      const maxValue = Math.max(...opts.points);

      const pointsCoords = [];
      opts.points.forEach((point, idx) => {
        const maxHeight = (point/maxValue)*opts.height;
        const x = idx*spacing;
        const y = opts.height-maxHeight;
        pointsCoords.push(`${x},${y}`);
      });

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      line.setAttribute('points', pointsCoords.join(' '));
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke-width', opts.strokeWidth);
      line.setAttribute('stroke', opts.colors[0]);
      opts.svg.appendChild(line);

      sparkline.appendChild(opts.svg);
    }

    function pie(sparkline, opts) {
      const radius = Math.min(opts.width, opts.height) / 2;
      const centerX = opts.width / 2;
      const centerY = opts.height / 2;
      const total = opts.points.reduce((acc, val) => acc + val, 0);
      let startAngle = 0;

      opts.points.forEach((point, idx) => {
        const color = opts.colors[idx % opts.colors.length];
        const sliceAngle = (point / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
        const d = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', color);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${(point/total*100).toFixed(2)}%`;
        path.appendChild(title);

        opts.svg.appendChild(path);
        startAngle = endAngle;
      });

      sparkline.appendChild(opts.svg);
    }

    function stacked(sparkline, opts) {
      let total = opts.points.reduce((a, b) => a + b, 0);
      let totalGapWidth = (opts.points.length - 1) * opts.gap;
      let availableWidth = opts.width - totalGapWidth;

      let offset = 0;
      opts.points.forEach((point, idx) => {
        const color = opts.colors[idx % opts.colors.length];
        const rectWidth = (point / total) * availableWidth;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', offset);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', rectWidth);
        rect.setAttribute('height', opts.height);
        rect.setAttribute('fill', color);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = point;
        rect.appendChild(title);

        opts.svg.appendChild(rect);
        offset += rectWidth + opts.gap;
      });

      sparkline.appendChild(opts.svg);
    }

    function render(sparkline, opts) {
      switch (opts.type) {
      case 'bar': {
        bar(sparkline, opts);
        break;
      }
      case 'line': {
        line(sparkline, opts);
        break;
      }
      case 'pie': {
        pie(sparkline, opts);
        break;
      }
      case 'stacked': {
        stacked(sparkline, opts);
        break;
      }
      default: {
        console.error(`${type} is not a valid sparkline type`);
      }
      }
    }

    // Initializes and renders the chart.
    opts = setup(sparkline, opts);
    validate(sparkline, opts);
    render(sparkline, opts);

    // Listens to update event and then updated the chart.
    sparkline.addEventListener('update', (evt) => {
      opts = setup(sparkline, opts);
      validate(sparkline, opts);
      render(sparkline, opts);
    });
  });
})();
