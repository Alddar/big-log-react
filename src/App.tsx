import "./App.css";
import { FixedSizeList as List } from "react-window";

import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

const Row =
  (getLine: (a: number) => string) =>
  ({ index, style }: { index: number; style: React.CSSProperties }) => {
    return <div style={style} className="row">{getLine(index)}</div>;
  };

const App = () => {
  const [state, setState] = useState<{
    getLine: (a: number) => string;
    numLines: number;
  } | null>(null);

  useEffect(() => {
    document.addEventListener("logLoaded", () => {
      console.log("Loaded log!");
      console.log(Module._num_lines());
      setState({
        getLine: (lineIndex: number) => {
          const line = UTF8ToString(Module._get_line(lineIndex));
          return line;
        },
        numLines: Module._num_lines(),
      });
    });
  }, []);

  if (!state) {
    return <span>Loading...</span>;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={state.numLines}
          itemSize={22}
          width={width}
        >
          {Row(state.getLine)}
        </List>
      )}
    </AutoSizer>
  );
};
export default App;
