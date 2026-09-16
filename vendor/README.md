FilePrint generators and audio player copied unchanged from the local FilePrint v0.2.4 checkout.
Upstream: https://github.com/gijs-hulsebos/FilePrint
License: MIT; included in dist/LICENSE-FilePrint.txt.
src/demo.ts adapts the browser controls without importing the Obsidian host.
Bundle with esbuild: src/demo.ts --bundle --minify --format=iife --outfile=dist/script.js
