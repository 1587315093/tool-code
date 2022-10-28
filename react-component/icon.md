# Icon 组件

> 基于 Antd 的 Icon 组件进行二次封装

```ts
import { createFromIconfontCN } from "@ant-design/icons";

interface IconProps {
  type: string; // 图标的class类名
}

const Icon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/**********", // 在 iconfont.cn 上生成
});

function IconComponent(props: IconProps) {
  return <Icon {...props} />;
}

export default IconComponent;
```

使用：

```ts
import Icon from "@/components/Icon";

function FunComponents() {
  return <Icon type="icon-test" />;
}
export default FunComponents;
```
