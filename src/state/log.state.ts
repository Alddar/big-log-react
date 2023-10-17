import { create } from "zustand";
import { combine } from "zustand/middleware";
import Module from "../generated/main.js";

// const useLogStore = create((set) => {

//   return {
//     wasmInitialized: false
//   };
// });

var module = null

export const useLogStore = create(
  combine(
    {
      wasmInitialized: false,
      logUrl: null as string | null,
      logLoading: false,
      numLines: 0,
    },
    (set, get) => {
      Module({
        locateFile: () => "/main.wasm"
      }).then((_module) => {
        module = _module
        set((state) => ({
          ...state,
          wasmInitialized: true,
        }));
      })

      document.addEventListener("logLoaded", () => {
        console.log("Loaded log!");
        set({
          wasmInitialized: true,
          logUrl: module.UTF8ToString(module._log_url()),
          logLoading: false,
          numLines: module._num_lines(),
        });
      });

      return {
        downloadLog: (logName: string): void => {
          const state = get();
          const logUrl = `/big-log-react/log/${logName}.log`
          if (state.wasmInitialized && (!state.logUrl || state.logUrl != logUrl) && !state.logLoading) {
            set((state) => ({ ...state, logLoading: true }));
            module._download_log(module.stringToNewUTF8(logUrl));
          }
        },
        getLine: (line: number): string => {
          const state = get();
          if (state.wasmInitialized && state.logUrl) {
            return module.UTF8ToString(module._get_line(line));
          }

          return "";
        },
      };
    }
  )
);
