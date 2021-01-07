import {build} from 'esbuild'

build({
  entryPoints: ['./src/index.js'],
  minify: false,
  sourcemap: false,
  bundle: true,
  platform: "neutral",
  outfile: `./dist/main.js`,
}).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});

build({
  entryPoints: ['./src/index.js'],
  minify: false,
  sourcemap: 'both',
  bundle: true,
  platform: "neutral",
  outfile: `./dist/main.mapped.js`,
}).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});

build({
  entryPoints: ['./src/index.js'],
  minify: true,
  sourcemap: false,
  bundle: true,
  platform: "neutral",
  outfile: `./dist/main.min.js`,
}).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});

build({
  entryPoints: ['./src/index.js'],
  minify: true,
  sourcemap: 'both',
  bundle: true,
  platform: "neutral",
  outfile: `./dist/main.min.mapped.js`,
}).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
