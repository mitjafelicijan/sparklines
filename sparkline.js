(() => {
  const sparklines = document.querySelectorAll('[data-sparkline="true"]');
  sparklines.forEach(sparkline => {
    const width = parseInt(sparkline.dataset.width, 10) || 100;
    const height = parseInt(sparkline.dataset.height, 10) || 30;
    const gap = parseInt(sparkline.dataset.gap, 10) || 5;
    const color = sparkline.dataset.color || 'blue';
    let points = sparkline.dataset.points || null;

    // Return if no data is provided.
    if (!points) { return }

    // Convert to integer point array.
    points = points.split(',').map(item => parseInt(item, 10));

    // Create SVG sparkline.
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const columnWidth = (gap/points.length) + (width/points.length) - gap;
    const maxValue = Math.max(...points);
    points.forEach((point, idx) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const rectHeight = (point/maxValue)*height;
      rect.setAttribute('x', (idx*columnWidth) + (idx*gap));
      rect.setAttribute('y', height-rectHeight);
      rect.setAttribute('width', columnWidth);
      rect.setAttribute('height', rectHeight);
      rect.setAttribute('fill', color);

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = point;
      rect.appendChild(title);

      svg.appendChild(rect);
    });

    sparkline.appendChild(svg);
  });
})();
