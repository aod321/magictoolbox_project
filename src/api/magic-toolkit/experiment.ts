import request from "@/utils/request";
import type { PageResult } from "@/types/global";

/**
 * 实验记录查询参数
 */
export interface ExperimentQuery {
  /** 页码 */
  pageNum: number;
  /** 每页数量 */
  pageSize: number;
  /** 实验目标 */
  goal?: string;
  /** 实验人员 */
  experimenter?: string;
  /** 日期范围 */
  dateRange?: string[];
}

/**
 * 实验记录视图对象
 */
export interface ExperimentVO {
  /** ID */
  id: number;
  /** 实验目标 */
  goal: string;
  /** 实验人员 */
  experimenter: string;
  /** 日期 */
  date: string;
  /** 实验步骤 */
  steps: string;
  /** 预期结果 */
  expectedResult: string;
  /** 实际结果 */
  actualResult: string;
  /** 下一步计划 */
  nextTodo: string;
}

/**
 * 实验记录表单对象
 */
export interface ExperimentForm {
  /** ID */
  id?: number;
  /** 实验目标 */
  goal: string;
  /** 实验人员 */
  experimenter: string;
  /** 日期 */
  date: string;
  /** 实验步骤 */
  steps: string;
  /** 预期结果 */
  expectedResult: string;
  /** 实际结果 */
  actualResult: string;
  /** 下一步计划 */
  nextTodo: string;
}

export default {
  /**
   * 获取实验记录分页列表
   *
   * @param queryParams
   */
  getPage(queryParams: ExperimentQuery) {
    return request
      .get<PageResult<ExperimentVO>>("/experiments/page", {
        params: queryParams,
      })
      .then(({ data }) => data);
  },

  /**
   * 获取实验记录表单数据
   *
   * @param id
   */
  getForm(id: number) {
    return request.get<ExperimentForm>(`/experiments/${id}/form`);
  },

  /**
   * 新增实验记录
   *
   * @param data
   */
  add(data: ExperimentForm) {
    return request.post("/experiments", data);
  },

  /**
   * 修改实验记录
   *
   * @param id
   * @param data
   */
  update(id: number, data: ExperimentForm) {
    return request.put(`/experiments/${id}`, data);
  },

  /**
   * 删除实验记录
   *
   * @param ids
   */
  delete(ids: number[]) {
    return request.delete(`/experiments/${ids[0]}`);
  },
};
