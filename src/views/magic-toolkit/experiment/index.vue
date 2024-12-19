<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="实验目标" prop="goal">
          <el-input
            v-model="queryParams.goal"
            placeholder="请输入实验目标"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="实验人员" prop="experimenter">
          <el-input
            v-model="queryParams.experimenter"
            placeholder="请输入实验人员"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="日期范围" prop="dateRange">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="success" icon="plus" @click="handleAdd">新增</el-button>
          <el-button
            type="danger"
            icon="delete"
            :disabled="!selectedIds.length"
            @click="handleDelete(selectedIds)"
          >
            删除
          </el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="experimentList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column label="实验目标" prop="goal" />
        <el-table-column label="实验人员" prop="experimenter" width="120" />
        <el-table-column label="日期" prop="date" width="120" />
        <el-table-column label="预期结果" prop="expectedResult" show-overflow-tooltip />
        <el-table-column label="实际结果" prop="actualResult" show-overflow-tooltip />
        <el-table-column label="Next TODO" prop="nextTodo" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 新增/修改对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="800px"
      @close="handleCloseDialog"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="实验目标" prop="goal">
          <el-input v-model="formData.goal" placeholder="请输入实验目标" />
        </el-form-item>
        <el-form-item label="实验人员" prop="experimenter">
          <el-input v-model="formData.experimenter" placeholder="请输入实验人员" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="实验步骤" prop="steps">
          <el-input
            v-model="formData.steps"
            type="textarea"
            :rows="3"
            placeholder="请输入实验步骤"
          />
        </el-form-item>
        <el-form-item label="预期结果" prop="expectedResult">
          <el-input
            v-model="formData.expectedResult"
            type="textarea"
            :rows="2"
            placeholder="请输入预期结果"
          />
        </el-form-item>
        <el-form-item label="实际结果" prop="actualResult">
          <el-input
            v-model="formData.actualResult"
            type="textarea"
            :rows="2"
            placeholder="请输入实际结果"
          />
        </el-form-item>
        <el-form-item label="Next TODO" prop="nextTodo">
          <el-input
            v-model="formData.nextTodo"
            type="textarea"
            :rows="2"
            placeholder="请输入下一步计划"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import ExperimentAPI from "@/api/magic-toolkit/experiment";
import type { ExperimentVO, ExperimentForm, ExperimentQuery } from "@/api/magic-toolkit/experiment";

defineOptions({
  name: "Experiment",
});

// 查询参数
const queryParams = reactive<ExperimentQuery>({
  pageNum: 1,
  pageSize: 10,
  goal: "",
  experimenter: "",
  dateRange: [],
});

// 表格数据
const experimentList = ref<ExperimentVO[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 弹窗控制
const dialog = reactive({
  visible: false,
  title: "",
});

// 表单数据
const formRef = ref<FormInstance>();
const formData = reactive<ExperimentForm>({
  id: undefined,
  goal: "",
  experimenter: "",
  date: "",
  steps: "",
  expectedResult: "",
  actualResult: "",
  nextTodo: "",
});

// 表单校验规则
const rules = reactive<FormRules>({
  goal: [{ required: true, message: "请输入实验目标", trigger: "blur" }],
  experimenter: [{ required: true, message: "请输入实验人员", trigger: "blur" }],
  date: [{ required: true, message: "请选择日期", trigger: "blur" }],
  steps: [{ required: true, message: "请输入实验步骤", trigger: "blur" }],
});

// 查询方法
const handleQuery = () => {
  loading.value = true;
  ExperimentAPI.getPage(queryParams)
    .then(({ list, total: totalCount }) => {
      experimentList.value = list;
      total.value = totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 重置查询
const handleResetQuery = () => {
  queryParams.goal = "";
  queryParams.experimenter = "";
  queryParams.dateRange = [];
  handleQuery();
};

// 表格多选
const handleSelectionChange = (selection: ExperimentVO[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 新增按钮
const handleAdd = () => {
  dialog.title = "新增实验记录";
  dialog.visible = true;
  Object.assign(formData, {
    id: undefined,
    goal: "",
    experimenter: "",
    date: "",
    steps: "",
    expectedResult: "",
    actualResult: "",
    nextTodo: "",
  });
};

// 修改按钮
const handleUpdate = (row: ExperimentVO) => {
  dialog.title = "修改实验记录";
  dialog.visible = true;
  Object.assign(formData, row);
};

// 删除按钮
const handleDelete = (ids: number[]) => {
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ExperimentAPI.delete(ids).then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
  });
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      const submitForm = () => {
        return formData.id
          ? ExperimentAPI.update(formData.id, formData)
          : ExperimentAPI.add(formData);
      };

      submitForm().then(() => {
        ElMessage.success(formData.id ? "修改成功" : "新增成功");
        dialog.visible = false;
        handleQuery();
      });
    }
  });
};

// 关闭弹窗
const handleCloseDialog = () => {
  dialog.visible = false;
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 初始化
handleQuery();
</script>
