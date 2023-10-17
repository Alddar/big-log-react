import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { useParams } from "@tanstack/react-router";
import { useLogStore } from "../state/log.state";
import { useEffect } from "react";

const Row =
  (getLine: (a: number) => string) =>
  ({ index, style }: { index: number; style: React.CSSProperties }) => {
    return (
      <div style={style} className="whitespace-nowrap">
        {getLine(index)}
      </div>
    );
  };

const Log = () => {
  const { logName } = useParams({ from: "/logs/$logName" });
  const [wasmInitialized, downloadLogs, getLine, numLines, logUrl] =
    useLogStore((state) => [
      state.wasmInitialized,
      state.downloadLog,
      state.getLine,
      state.numLines,
      state.logUrl,
    ]);

  useEffect(() => {
    if (wasmInitialized && logName) {
      downloadLogs(logName);
    }
  }, [wasmInitialized, logName]);

  if (!logUrl) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-full h-full">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={numLines}
              itemSize={22}
              width={width}
            >
              {Row(getLine)}
            </List>
          )}
        </AutoSizer>
      </div>
      <div className="w-8 h-full bg-red-800"></div>
    </div>
  );
};
export default Log;
