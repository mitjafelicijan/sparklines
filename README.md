# Simple SVG Sparklines

![Preview](https://github.com/mitjafelicijan/sparklines/assets/296714/48b46813-3cd7-4eed-971a-24f92f957922)

Self-contained tiny SVG sparkline chart library written in vanilla JS with zero dependencies.

Add `sparklines.js` to your HTML file and use proper data attributes and that is about it.

## Basic usage

```html
<div
	data-sparkline="true"
	data-points="6,2,3,4,5"
	data-width="300"
	data-height="50"
	data-gap="15"
	data-colors="#ff0000"
	data-type="bar"></div>

<script src="sparklines.js" defer></script>
```

Check `kitchensink.html` for more examples.

> To create minified version of `sparklines.js` use `npx minify sparklines.js > sparklines.min.js`.

## Bar charts

| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| data-sparkline | If sparkline is enabled on this element | None |
| data-points | List of numbers / data | [] |
| data-width | Width of the container in px | 100 |
| data-height | Height of the container in px | 30 |
| data-gap | Gap between the bars in px | 5 |
| data-colors | List of colors of the bars in HEX or color name | gray |

```html
<div data-sparkline="true" data-points="14,19,7,9,18,20,17" data-colors="white,blue"></div>
<div data-sparkline="true" data-points="18,13,19,14,14,3,4,8,7,9,2,8,0,20,7,3,2,5,12,15" data-width="300" data-height="50" data-gap="5"></div>
<div data-sparkline="true" data-points="16,2,5,5,20,11,12,19,17,18,13,8,3,5,14,19,6,1,12,4" data-width="100" data-height="50" data-gap="2" data-colors="purple"></div>
<div data-sparkline="true" data-points="20,14,4,3,17,2,8,12,19,11,6,17,5,8,13,12,17,9,1,0" data-width="300" data-height="50" data-gap="15" data-colors="#ffff00"></div>
<div data-sparkline="true" data-points="4,8,10,3,16,15,0,0,8,18,11,14,14,0,11,14,16,14,15,6" data-width="200" data-height="50"></div>
<div data-sparkline="true" data-points="10,4,10,15,18,10,12,8,11,4,13,14,6,18,17,12,0,13,14,3" data-width="200" data-height="50"></div>
```

## Line charts

| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| data-sparkline | If sparkline is enabled on this element | None |
| data-points | List of numbers / data | [] |
| data-width | Width of the container in px | 100 |
| data-height | Height of the container in px | 30 |
| data-stroke-width | Size of the line in px | 2 |
| data-colors | Color of the line in HEX or color name | gray |

```html
<div data-sparkline="true" data-points="15,3,17,15,7,11,11,5,0,16,1,13,1,12,13,8,16,4,0,0" data-width="200" data-height="30" data-colors="white" data-stroke-width="3" data-type="line"></div>
<div data-sparkline="true" data-points="3,8,0,14,11,0,7,1,15,15,20,12,8,13,13,5,1,12,1,11" data-width="200" data-height="30" data-colors="gray" data-stroke-width="1" data-type="line"></div>
<div data-sparkline="true" data-points="2,16,8,18,2,11,19,12,7,12,12,15,0,0,18,1,7,18,1,13" data-width="200" data-height="30" data-colors="yellow" data-stroke-width="2" data-type="line"></div>
```

## Pie charts

| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| data-sparkline | If sparkline is enabled on this element | None |
| data-points | List of numbers / data | [] |
| data-width | Width of the container in px | 100 |
| data-height | Height of the container in px | 30 |
| data-colors | List of colors of the slices in HEX or color name | gray |

```html
<div data-sparkline="true" data-points="10,16,8,18,5,11" data-width="40" data-height="40" data-colors="blue,brown,aqua,yellow" data-type="pie"></div>
<div data-sparkline="true" data-points="11,14,20,21,37" data-width="40" data-height="40" data-colors="indigo,silver,linen,khaki,crimson" data-type="pie"></div>
<div data-sparkline="true" data-points="20,44,23" data-width="40" data-height="40" data-colors="olive,green,#FFB6C1" data-type="pie"></div>
```
## Stacked charts

| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| data-sparkline | If sparkline is enabled on this element | None |
| data-points | List of numbers / data | [] |
| data-width | Width of the container in px | 100 |
| data-height | Height of the container in px | 30 |
| data-gap | Gap between the bars in px | 5 |
| data-colors | List of colors of the bars in HEX or color name | gray |

```html
<div data-sparkline="true" data-points="33,23,44" data-width="300" data-height="20" data-colors="white,purple,orange" data-type="stacked"></div>
<div data-sparkline="true" data-points="14,19,44" data-width="300" data-height="20" data-gap="0" data-colors="white,purple,orange" data-type="stacked"></div>
<div data-sparkline="true" data-points="14,19" data-width="300" data-height="20" data-gap="0" data-colors="white,gray" data-type="stacked"></div>
```

## Programmatic update

Each initialized sparkline chart is also listening to a custom event called
`update` that triggers re-rendering of the chart.

Let's assume we have a basic chart like this.

```html
<div id="chart1" data-sparkline="true" data-points="14,19,7,9,18,20,17"></div>
```

Then we can update `data-points` attribute and emit update event.

```js
const chart = document.getElementById('chart1');
chart.dataset.points = '6,44,21,95,11';
chart.dispatchEvent(new Event('update'));
```

You can also change colors or any `data-*` attribute. There are no restrictions.

## Notes

- `transparent` is a valid option for `data-colors` attribute.

## Additional reading material

- https://www.w3.org/2002/Talks/www2002-svgtut-ih/hwtut.pdf
- https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Introduction
- https://www.w3schools.com/graphics/svg_intro.asp
- https://tutorial.math.lamar.edu/pdf/Trig_Cheat_Sheet_Reduced.pdf

## License

[sparklines](https://github.com/mitjafelicijan/sparklines) was written by [Mitja
Felicijan](https://mitjafelicijan.com) and is released under the BSD two-clause
license, see the LICENSE file for more information.
