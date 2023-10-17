#include <stdio.h>
#include <string.h>
#include <cstring>
#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <emscripten/console.h>

int rowsCount = 0;
int rowsSize = 1000;
char *logRows = NULL;
size_t *logRowStarts = (size_t *)malloc(rowsSize * sizeof(logRowStarts));
char* tempLine = NULL;
char* logUrl = NULL;
emscripten_fetch_t *fetchObject = NULL;

void downloadSucceeded(emscripten_fetch_t *fetch)
{
    printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
    logRows = const_cast<char*>(fetch->data);
    logRowStarts[0] = 0;
    for (int i = 0; i < fetch->numBytes - 1; i++)
    {
        if (logRows[i] == '\n')
        {
            rowsCount++;
            if (rowsCount >= rowsSize)
            {
                rowsSize *= 1.5;
                logRowStarts = (size_t *)realloc(logRowStarts, rowsSize * sizeof(logRowStarts));
            }

            logRows[i] = 0;
            logRowStarts[rowsCount] = i + 1;
        }
    }
    rowsCount++;
    // Not freeing, the buffer gets reused.
    fetchObject = fetch;
    emscripten_run_script("document.dispatchEvent(new Event('logLoaded'));");
}

void downloadFailed(emscripten_fetch_t *fetch)
{
    printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
    emscripten_fetch_close(fetch); // Also free data on failure.
}

int main()
{
    printf("WASM initialized\n");
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE char *get_line(int number)
{
    return logRows + logRowStarts[number];
}

EXTERN EMSCRIPTEN_KEEPALIVE int num_lines()
{
    return rowsCount;
}

EXTERN EMSCRIPTEN_KEEPALIVE char* log_url()
{
    return logUrl;
}

EXTERN EMSCRIPTEN_KEEPALIVE void download_log(char* _logUrl)
{
    free(logUrl);
    logUrl = _logUrl;
    printf("Downloading log '%s'...\n", logUrl);
    if(fetchObject) {
        emscripten_fetch_close(fetchObject);
        fetchObject = NULL;
    }
    rowsCount = 0;
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    strcpy(attr.requestMethod, "GET");
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
    attr.onsuccess = downloadSucceeded;
    attr.onerror = downloadFailed;
    emscripten_fetch(&attr, logUrl);
}