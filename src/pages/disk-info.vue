<template>
  <div>
    <el-descriptions
      title="云盘基本信息"
      direction="vertical"
      :column="4"
      border
    >
      <el-descriptions-item label="账号">{{
        disk_info_data.UserId
      }}</el-descriptions-item>
      <el-descriptions-item label="用户名">{{
        disk_info_data.UserName
      }}</el-descriptions-item>
      <el-descriptions-item label="云盘总空间" :span="2">{{
        calStorage(disk_info_data.DiskSpace)
      }}</el-descriptions-item>
      <el-descriptions-item label="用户类型">
        <el-tag size="small">{{ userType }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="用户动态信息"
        >Kuang 于2021年9月创建账户...</el-descriptions-item
      >
    </el-descriptions>
    <div class="el-descriptions__title">云盘空间使用情况</div>
    <el-row>
      <el-col :span="24"
        ><div class="grid-content bg-blue" align="center">
          <div>总空间使用情况</div>
          <el-progress
            type="dashboard"
            :percentage="percentage"
            :color="colors"
          ></el-progress>
          <div>
            {{ calStorage(disk_info_data.AllocatedSpace) }} /
            {{ calStorage(disk_info_data.DiskSpace) }}
          </div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
const apiok = 200;
const _GB = 1024 * 1024;
import { getDiskInfoApi } from "@/api";
export default {
  name: "diskInfo",

  data() {
    return {
      disk_info_data: {
        UserName: "",
        UserId: "",
        DiskSpace: 16384,
        AllocatedSpace: 0,
        Level: 0,
      },
      colors: [
        { color: "#f56c6c", percentage: 100 },
        { color: "#e6a23c", percentage: 80 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 40 },
        { color: "#6f7ad3", percentage: 20 },
      ],
    };
  },
  methods: {
    calStorage(size) {
      if (size === null) return "-";
      if (size < 1024) {
        // 1024以下显示kb
        return size + "KB";
      }
      if (size < _GB) {
        // 1024*1024
        let _mb = (size / 1024).toFixed(2);
        return parseFloat(_mb) + "MB";
      }
      let _gb = (size / _GB).toFixed(2);
      return parseFloat(_gb) + "GB";
    },
  },
  props: {},
  computed: {
    percentage() {
      return (
        (this.disk_info_data.AllocatedSpace / this.disk_info_data.DiskSpace) *
        100
      ).toFixed(2);
    },
    userType() {
      if (this.disk_info_data.Level == 0) return "普通用户";
      else return "超级用户";
    },
  },
  created() {
    getDiskInfoApi().then(({ data, status }) => {
      if (status === apiok) {
        this.disk_info_data = data;
      }
    });
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-blue {
  background: #ecf5ff;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>