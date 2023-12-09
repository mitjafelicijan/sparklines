dev:
	npx -y browser-sync start --watch --server --directory

minify:
	npx -y minify sparklines.js > sparklines.min.js
