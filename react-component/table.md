# Table 组件

> 基于 Antd 的 Table 组件二次封装

1. 分页器
2. columns 的加工和 render 处理

```ts
import { Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { memo } from "react";

interface PageProps {
  hideOnSinglePage?: boolean;
  showTotal?: Function;
  total?: number;
  columns?: Array<any>;
  dataSource?: object;
  rowSelection?: object;
  handleTableChange?: Function;
  pagination?: PageType;
  notPagination?: boolean;
}

// 分页器接口
interface PageType {
  current: number;
  pageSize: number;
  hideOnSinglePage?: boolean;
  showTotal?: Function;
  total?: number;
}

const TableComponent = (props: PageProps): JSX.Element => {
  const {
    columns = [],
    dataSource,
    handleTableChange,
    pagination,
    rowSelection,
    notPagination,
  } = props;
  // 分页器
  const handlePage: Function = () => {
    const paginationRender: PageType = {
      current: 1,
      pageSize: 10,
      total: 0,
      hideOnSinglePage: false,
    };
    if (pagination) {
      const { current = 1, pageSize = 10, total = 0 } = pagination;
      paginationRender.current = current * 1;
      paginationRender.pageSize = pageSize * 1;
      paginationRender.total = total * 1;
      paginationRender.showTotal = (total: number) => {
        return `共 ${total} 条记录`;
      };
    }
    return paginationRender;
  };
  const handleList = () => {
    return columns.map((item: any) => {
      return {
        ...item,
        align: item.align ? item.align : "center",
        render: (text: any, record: any, index: number) => {
          if (
            text ||
            typeof text === "boolean" ||
            item["dataIndex"] === "operation"
          ) {
            if (item.render) {
              return item.render(text, record, index);
            } else if (item?.ellipsis) {
              return (
                <Tooltip
                  placement="topLeft"
                  color="#98B5FC"
                  title={item?.format ? dayjs(+text).format(item.format) : text}
                >
                  <span>
                    {item?.format ? dayjs(+text).format(item.format) : text}
                  </span>
                </Tooltip>
              );
            } else if (item?.format) {
              return dayjs(+text).format(item.format);
            } else if (item?.isBoolean) {
              return (
                <span>
                  {text === true ? "是" : text === false ? "否" : "-"}
                </span>
              );
            } else {
              return text;
            }
          } else {
            return "-";
          }
        },
      };
    });
  };
  const attrData: any = {
    ...props,
    columns: handleList(),
    dataSource,
    rowSelection: rowSelection ? rowSelection : null,
    pagination: notPagination ? false : handlePage(),
    onChange: (pagination: any, filter: any) => {
      handleTableChange && handleTableChange(pagination, filter);
    },
  };

  return (
    <div>
      <Table {...attrData} />
    </div>
  );
};

export default memo(TableComponent);
```

使用：

1. 添加请求接口逻辑
2. 查询条件表单逻辑

```ts
import { FC, useState } from "react";
import Table from "@/components/Table";

const FunctionComponent: FC = (): JSX.Element => {
  const [data, setData] = useState<Array<any>>([]);
  const [pagination, setPagination] = useCallbackState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const columns: Array<object> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 120,
    },
    {
      title: "ID2",
      dataIndex: "id2",
      key: "id2",
      width: 120,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      fixed: "right",
      align: "center",
      width: 180,
      render: (text: string, record: any) => <button>操作1</button>,
    },
  ];
  const handleTableChange = (page: any) => {
    //   获取查询条件
    const { current, pageSize, total } = page;
    setPagination({ current, pageSize, total }, () => {
      //  请求接口
    });
  };
  const tablelist = {
    columns,
    rowKey: (item: any) => item.id,
    dataSource: data,
    scroll: { x: 1500 },
    pagination,
    handleTableChange: handleTableChange,
  };
  return <Table {...tablelist} />;
};
export default FunctionComponent;
```
