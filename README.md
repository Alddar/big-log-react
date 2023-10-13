# Displaying big logs using React and Web Assembly

## Running locally

1. Install dependencies `npm i`
2. Add your testing log to ./public/log
3. Change `emscripten_fetch` url in `main` inside `cpp/main.cpp` to `log/[your-log-name.log]`
4. Watch and compile cpp changes `npm run dev:cpp`
5. Watch and compile website `npm run dev`
6. Profit!
