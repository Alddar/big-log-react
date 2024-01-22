# Displaying big logs using React and Web Assembly

This is a work in progress library to display logs in a web browser. The library uses WebAssembly to cache large log files and make them display without performance drawbacks. The goal is to have a unique cross-tab synchronization of timestamps.

## Running locally

1. Install dependencies `npm i`
2. Add your testing log to ./public/log
3. Change `emscripten_fetch` url in `main` inside `cpp/main.cpp` to `log/[your-log-name.log]`
4. Watch and compile cpp changes `npm run dev:cpp`
5. Watch and compile website `npm run dev`
6. Profit!
