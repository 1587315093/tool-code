# SearchFrom 搜索表单组件

> > 基于 Antd 组件二次封装

```ts
import { forwardRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  TreeSelect,
  Cascader,
} from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;

function Search(props: any, ref: any) {
  const { searchFormList, initialValues, handleOnClickBtn } = props;
  const [form] = Form.useForm();
  // 按钮点击
  const hanldeOnBtnClick = (event: any, clickType: string) => {
    if (clickType === "reset") {
      form.resetFields();
      handleOnClickBtn(clickType);
    } else {
      const values = form.getFieldsValue();
      handleOnClickBtn(clickType, values);
    }
  };
  const getTreeNode = (treeData: any) => {
    return treeData.map((t: any) => {
      if (t.children) {
        return (
          <TreeNode key={t.id} value={t.id} title={t.name}>
            {getTreeNode(t.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={t.id} value={t.id} title={t.name}></TreeNode>;
    });
  };
  const getFormItemNodes = () => {
    return searchFormList.map((item: any, i: number) => {
      switch (item.type) {
        case "input":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label || null}
              key={i}
              name={item.name}
              rules={item.rules}
              style={{ paddingBottom: "20px" }}
            >
              <Input allowClear placeholder={item.placeholder} />
            </Form.Item>
          );
        case "rangedatepicker":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label || null}
              key={i}
              name={item.name}
              style={{ paddingBottom: "20px" }}
            >
              <RangePicker
                placeholder={item.placeholder}
                allowClear
                format="YYYY-MM-DD"
                {...item}
              />
            </Form.Item>
          );
        case "datepicker":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label || null}
              key={i}
              name={item.name}
              style={{ paddingBottom: "20px" }}
            >
              <DatePicker allowClear picker={item.picker} />
            </Form.Item>
          );
        case "select":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label || null}
              key={i}
              name={item.name}
              style={{ paddingBottom: "20px", width: item.width || "180px" }}
            >
              <Select
                mode={item.mode}
                maxTagCount={item.maxTagCount}
                maxTagTextLength={item.maxTagTextLength}
                placeholder={item.placeholder}
                onChange={item.onChange}
                style={{ width: item.width }}
                {...item.props}
                defaultValue={item.defaultValue}
                allowClear
              >
                {item.options.map((option: any, index: number) => {
                  return (
                    <Option
                      key={index}
                      value={option[item.valueName || "value"]}
                      disabled={option.disabled}
                    >
                      {option[item.labelName || "label"]}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          );
        case "treeselect":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label}
              key={i}
              name={item.name}
              style={{ paddingBottom: "20px" }}
            >
              <TreeSelect
                allowClear
                showSearch={true}
                treeNodeFilterProp="title"
                placeholder={item.placeholder}
                showArrow={true}
                treeLine={true && false}
                style={{ width: 300 }}
              >
                {getTreeNode(item.options)}
              </TreeSelect>
            </Form.Item>
          );
        case "cascader":
          return (
            <Form.Item
              initialValue={item.defaultValue}
              label={item.label}
              key={i}
              name={item.name}
              style={{ paddingBottom: "20px" }}
            >
              <Cascader
                options={item.options}
                onChange={item.onChange}
                placeholder={item.placeholder}
                style={{ width: item.width }}
                {...item}
              />
            </Form.Item>
          );
        case "btn":
          return (
            <Form.Item key={i} style={{ paddingBottom: "20px" }}>
              <Button
                type={item.btnType}
                loading={item.loading}
                onClick={() => hanldeOnBtnClick(event, item.clickType)}
              >
                {item.text}
              </Button>
            </Form.Item>
          );

        default:
          return;
      }
    });
  };
  return (
    <Form
      ref={ref}
      form={form}
      name="searchForm"
      layout="inline"
      colon={false}
      initialValues={initialValues}
    >
      {getFormItemNodes()}
    </Form>
  );
}
export default forwardRef(Search);
```

使用：

```ts
import Search from "@/components/Search";
import { useRef } from "react";
function FunCompoent() {
  const searchRef = useRef();
  const searchFormList = [
    {
      name: "name1",
      type: "input",
      placeholder: "请输入",
    },
    {
      name: "name2",
      type: "select",
      placeholder: "请输入",
      options: [
        { value: "v1", label: "l1" },
        { value: "v2", label: "l2" },
        { value: "v3", label: "l3" },
      ],
    },
    {
      name: "name3",
      type: "rangedatepicker",
      placeholder: ["请选择", "请选择"],
    },
    {
      type: "btn",
      text: "查询",
      btnType: "primary",
    },
    {
      type: "btn",
      text: "重置",
      clickType: "reset",
    },
  ];
  return (
    <div>
      <Search ref={searchRef} searchFormList={searchFormList} />
    </div>
  );
}
export default FunCompoent;
```
