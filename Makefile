CC=em++

create-folder:
	mkdir -p src/generated

compile: create-folder cpp/main.cpp
	em++ cpp/main.cpp -o src/generated/main.js \
		-sEXPORTED_FUNCTIONS=_main,_get_line,_num_lines,_download_log,_log_url \
		-sEXPORTED_RUNTIME_METHODS=stringToNewUTF8,UTF8ToString \
		-sMODULARIZE=1 \
		-sEXPORT_ES6=1 \
		-sENVIRONMENT=web \
		-sFETCH=1 \
		-sALLOW_MEMORY_GROWTH

main: compile
	mv src/generated/main.wasm ./public
	