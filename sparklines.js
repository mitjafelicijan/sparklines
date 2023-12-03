(() => {
  const sparklines = document.querySelectorAll('[data-sparkline="true"]');
  sparklines.forEach(sparkline => {
    const width = parseInt(sparkline.dataset.width, 10) || 100;
    const height = parseInt(sparkline.dataset.height, 10) || 30;
    const gap = parseInt(sparkline.dataset.gap, 10) || 5;
    const strokeWidth = parseInt(sparkline.dataset.strokeWidth, 10) || 2;
    const type = sparkline.dataset.type || 'bar';
    let colors = sparkline.dataset.colors || ['gray'];
    let points = sparkline.dataset.points || null;

    if (!Array.isArray(colors)) {
      colors = sparkline.dataset.colors.split(',');
    }

    // Return if no data is provided.
    if (!points) { return }

    // Convert to integer point array.
    points = points.split(',').map(item => parseInt(item, 10));

    // Create SVG sparkline.
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    function bar(sparkline, svg, points, width, height, colors, gap) {
      const columnWidth = (gap/points.length) + (width/points.length) - gap;
      const maxValue = Math.max(...points);
      points.forEach((point, idx) => {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const rectHeight = (point/maxValue)*height;
        rect.setAttribute('x', (idx*columnWidth) + (idx*gap));
        rect.setAttribute('y', height-rectHeight);
        rect.setAttribute('width', columnWidth);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('fill', colors[0]);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = point;
        rect.appendChild(title);

        svg.appendChild(rect);
      });
      sparkline.appendChild(svg);
    }

    function line(sparkline, svg, points, width, height, colors, strokeWidth) {
      const spacing = width/(points.length-1);
      const maxValue = Math.max(...points);
      const pointsCoords = [];
      points.forEach((point, idx) => {
        const maxHeight = (point/maxValue)*height;
        const x = idx*spacing;
        const y = height-maxHeight;
        pointsCoords.push(`${x},${y}`);
      });

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      line.setAttribute('points', pointsCoords.join(' '));
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke-width', strokeWidth);
      line.setAttribute('stroke', colors[0]);
      svg.appendChild(line);

      sparkline.appendChild(svg);
    }

    function pie(sparkline, svg, points, width, height, colors, gap) {
      const radius = Math.min(width, height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const total = points.reduce((acc, val) => acc + val, 0);
      const gapRadians = (gap / radius); // Convert gap size to radians
      let startAngle = 0;

      points.forEach((point, idx) => {
        const sliceAngle = (point / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        let color = colors[idx % colors.length];

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
        const d = `M ${centerX},${centerY} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', color);

        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${(point/total*100).toFixed(2)}%`;
        path.appendChild(title);

        svg.appendChild(path);
        startAngle = endAngle;
      });

      sparkline.appendChild(svg);
    }

    switch (type) {
    case 'bar': {
      bar(sparkline, svg, points, width, height, colors, gap);
      break;
    }
    case 'line': {
      line(sparkline, svg, points, width, height, colors, strokeWidth);
      break;
    }
    case 'pie': {
      pie(sparkline, svg, points, width, height, colors, gap);
      break;
    }
    }
  });
})();
