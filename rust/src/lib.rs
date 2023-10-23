use wasm_bindgen::prelude::*;

fn fib(n: i64) -> i64 {
    if n <= 1 {
        return n;
    }
    fib(n - 1) + fib(n - 2)
}

#[wasm_bindgen]
pub fn zkmain() -> i64 {
    fib(5)
}
