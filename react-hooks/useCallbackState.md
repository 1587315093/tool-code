# useCallbackState

> 基于 useState 封装的带有回调函数的 state

```ts
import { useEffect, useState, useRef } from "react";

function useCallbackState(od: any) {
  const cbRef = useRef<any>();
  const [data, setData] = useState(od);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (d: any, callback: any) {
      cbRef.current = callback;
      setData(d);
    },
  ];
}

export { useCallbackState };
```

使用：

```ts
import { useCallbackState } from "@/hooks";

function FunComponents() {
  const [data, setData] = useCallbackState({});
  return (
    <div>
      <button
        onClick={() => {
          setData({ a: 1 }, (val) => {});
        }}
      >
        点击
      </button>
    </div>
  );
}
export default FunComponents;
```
