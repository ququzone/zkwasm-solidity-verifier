build:
	wasm-pack build --release --out-name rust-hello.wasm --out-dir pkg --features test
	wasm-opt -Oz -o pkg/output.wasm pkg/rust-hello.wasm

trace:
	wasm-interp pkg/output.wasm --run-all-exports  --trace > trace.log
	wc -l trace.log

clean:
	rm -rf pkg
