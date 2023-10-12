#include <stdio.h>
#include <string.h>
#include <cstring>
#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>

int rowsCount = 0;
int rowsSize = 1000;
const char *logRows = NULL;
size_t *logRowStarts = (size_t *)malloc(rowsSize * sizeof(logRowStarts));
bool dataLoaded = false;
char* tempLine = NULL;

void downloadSucceeded(emscripten_fetch_t *fetch)
{
    printf("Finished downloading %llu bytes from URL %s.\n", fetch->numBytes, fetch->url);
    int lastLineStart = 0;
    for (int i = 0; i < fetch->numBytes - 1; i++)
    {
        if (fetch->data[i] == '\n')
        {
            // std::memcpy(logRows[rowsCount], fetch->data + lastLineStart, (i - lastLineStart) * sizeof(char));
            logRowStarts[rowsCount] = i;
            lastLineStart = i + 1;

            rowsCount++;
            if (rowsCount >= rowsSize)
            {
                rowsSize *= 1.5;
                logRowStarts = (size_t *)realloc(logRowStarts, rowsSize * sizeof(logRowStarts));
            }
        }

        logRows = fetch->data;
    }
    // The data is now available at fetch->data[0] through fetch->data[fetch->numBytes-1];
    //   emscripten_fetch_close(fetch); // Free data associated with the fetch.
    dataLoaded = true;
    emscripten_run_script("document.dispatchEvent(new Event('logLoaded'));");
}

void downloadFailed(emscripten_fetch_t *fetch)
{
    printf("Downloading %s failed, HTTP failure status code: %d.\n", fetch->url, fetch->status);
    emscripten_fetch_close(fetch); // Also free data on failure.
}

int main()
{
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    strcpy(attr.requestMethod, "GET");
    attr.attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
    attr.onsuccess = downloadSucceeded;
    attr.onerror = downloadFailed;
    emscripten_fetch(&attr, "https://frovdfc4o1re.objectstorage.eu-frankfurt-1.oci.customer-oci.com/n/frovdfc4o1re/b/test-bucket/o/normal_trace.csv");
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE char *get_line(int number)
{
    free(tempLine);
    size_t length = logRowStarts[number + 1] -  logRowStarts[number];
    tempLine = (char*) malloc(length + 1);
    std::memcpy(tempLine, logRows, length);
    tempLine[length] = 0;
    return tempLine;
}

EXTERN EMSCRIPTEN_KEEPALIVE bool data_loaded()
{
    return dataLoaded;
}

EXTERN EMSCRIPTEN_KEEPALIVE int num_lines()
{
    return rowsCount;
}