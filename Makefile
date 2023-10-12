CC=em++

main: cpp/main.cpp
	em++ cpp/main.cpp -o public/main.js -sEXPORTED_FUNCTIONS=_main,_get_line,_data_loaded,_num_lines -sENVIRONMENT=web -sFETCH=1 -sALLOW_MEMORY_GROWTH
