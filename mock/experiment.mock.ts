import { defineMock } from "./base";
import type { MockHttpItem } from "vite-plugin-mock-dev-server";

// 声明 mock 数组的类型
export default defineMock([
  {
    url: "experiments/page",
    method: ["GET"],
    auth: true,
    body: ({ query }) => {
      const { pageNum = 1, pageSize = 10, goal, experimenter, dateRange } = query;
      let list = [
        {
          id: 1,
          goal: "测试新型算法性能",
          experimenter: "张三",
          date: "2024-03-15",
          steps: "1. 准备测试数据\n2. 运行算法\n3. 收集结果",
          expectedResult: "算法处理速度提升30%",
          actualResult: "实际提升25%，基本达到预期",
          nextTodo: "优化内存占用",
        },
        {
          id: 2,
          goal: "验证系统稳定性",
          experimenter: "李四",
          date: "2024-03-14",
          steps: "1. 模拟高并发\n2. 监控系统资源\n3. 分析日志",
          expectedResult: "系统可持续运行24小时无异常",
          actualResult: "运行18小时后出现内存泄漏",
          nextTodo: "排查内存泄漏原因",
        },
        {
          id: 3,
          goal: "新功能可用性测试",
          experimenter: "王五",
          date: "2024-03-13",
          steps: "1. 制定测试用例\n2. 执行功能测试\n3. 收集用户反馈",
          expectedResult: "功能正常，用户反馈良好",
          actualResult: "发现3个小bug，整体表现良好",
          nextTodo: "修复已知bug",
        },
      ];

      // 筛选处理
      if (goal) {
        list = list.filter((item) => item.goal.includes(goal));
      }
      if (experimenter) {
        list = list.filter((item) => item.experimenter.includes(experimenter));
      }
      if (dateRange && dateRange.length === 2) {
        list = list.filter((item) => item.date >= dateRange[0] && item.date <= dateRange[1]);
      }

      return {
        code: "00000",
        data: {
          list: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          total: list.length,
        },
        msg: "一切ok",
      };
    },
  } as MockHttpItem,

  {
    url: "experiments",
    method: ["POST"],
    auth: true,
    body() {
      return {
        code: "00000",
        data: null,
        msg: "新增实验记录成功",
      };
    },
  } as MockHttpItem,

  {
    url: "experiments/:id",
    method: ["PUT"],
    auth: true,
    body() {
      return {
        code: "00000",
        data: null,
        msg: "修改实验记录成功",
      };
    },
  } as MockHttpItem,

  {
    url: "experiments/:id",
    method: ["DELETE"],
    auth: true,
    body({ params: { id } }) {
      return {
        code: "00000",
        data: null,
        msg: `删除实验记录${id}成功`,
      };
    },
  } as MockHttpItem,
] as MockHttpItem[]);
