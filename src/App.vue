<template>
  <div id="app">
    <wlExplorer
      ref="wl-explorer-cpt"
      :header-dropdown="headerHandle"
      :upload-options="uploadOptions"
      :columns="file_table_columns"
      :all-path="all_folder_list"
      :is-folder-fn="isFolderFn"
      :folderType="rource_type"
      :data="file_table_data"
      :props="explorer_prop"
      size="small"
      @handleFolder="handleFolder"
      @upload="fileUpload"
      @download="download"
      @search="fileSearch"
      @del="fileDel"
      @closeFade="closeOtherLayout(fade)"
    >
      <!-- 操作文件夹滑入区 -->
      <fadeIn v-show="fade.folder">
        <h3 class="edit-header">
          <p>{{ folder_form.Id ? "编辑" : "新增" }}文件夹</p>
        </h3>
        <el-scrollbar class="scroll">
          <el-form
            size="medium"
            ref="folder_form"
            label-position="top"
            :model="folder_form"
            :rules="folder_rules"
            class="folder_form rule-form"
            @keyup.enter.native="submitFolderFrom('folder_form')"
          >
            <el-form-item label="文件路径" prop="ParentId">
              <WlTreeSelect
                class="u-full"
                nodeKey="Id"
                placeholder="请选择文件路径"
                :props="tree_select_prop"
                :data="tree_folder_list"
                v-model="folder_form.ParentId"
              ></WlTreeSelect>
            </el-form-item>
            <el-form-item label="文件夹名称 " prop="Name">
              <el-input
                v-model="folder_form.Name"
                placeholder="请输入文件夹名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注说明" prop="Describe">
              <el-input
                :rows="3"
                type="textarea"
                v-model="folder_form.Describe"
                placeholder="请输入备注说明"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div class="submit-btn-box">
          <submit-btn
            @btn="submitFolderFrom('folder_form')"
            :status="load.folder"
          ></submit-btn>
          <el-button size="medium" @click="fade.folder = false">取消</el-button>
        </div>
      </fadeIn>
    </wlExplorer>
  </div>
</template>

<script>
import WlExplorer from "@/pages/WlExplorer"; // 导入文件管理器
import fadeIn from "@/components/fade-in"; // 导入文件管理器
import submitBtn from "@/components/submit-btn"; // 导入防抖提交组件
import { closeOtherLayout, arrayToTree } from "@/util"; // 导入关闭其他弹出类视图函数
import {
  getFileListApi, // 1获取文件夹列表
  getAllFoldersApi, // 4获取全部文件夹
  delFileApi, // 6删除文件|文件夹
  testApi,
  downloadDataApi,
  addFolderApi,
} from "@/api"; // 导入接口
const apiok = 200;

export default {
  name: "app",
  components: {
    fadeIn,
    submitBtn,
    WlExplorer,
  },
  data() {
    const _GB = 1024 * 1024;
    // const vm = this;
    return {
      load: {
        folder: false,
      }, // loading管理
      fade: {
        folder: false,
      }, // 弹出类视图管理
      headerHandle: [{ name: "权限", command: "auth" }], // 头部按钮更多操作-自定义权限
      file_table_columns: [
        {
          label: "名称",
          prop: "Name",
          minWidth: 120,
        },
        {
          label: "修改日期",
          align: "center",
          width: 120,
          formatter(row) {
            return row.EditTime.split(" ")[0] || "-";
          },
        },
        {
          label: "类型",
          align: "center",
          width: 90,
          formatter(row) {
            return row.Type === 1 ? "文件夹" : row.SuffixName;
          },
        },
        {
          label: "大小",
          minWidth: 90,
          align: "center",
          formatter(row) {
            if (row.Size === null) return "-";
            if (row.Size < 1024) {
              // 1024以下显示kb
              return row.Size + "KB";
            }
            if (row.Size < _GB) {
              // 1024*1024
              let _mb = (row.Size / 1024).toFixed(2);
              return parseFloat(_mb) + "MB";
            }
            let _gb = (row.Size / _GB).toFixed(2);
            return parseFloat(_gb) + "GB";
          },
        },
        {
          label: "创建日期",
          align: "center",
          width: 120,
          formatter(row) {
            return row.CreateTime.split(" ")[0] || "-";
          },
        },
        {
          label: "作者",
          minWidth: 100,
          align: "center",
          formatter(row) {
            return row.CreateUserName || "-";
          },
        },
        {
          label: "描述",
          minWidth: 100,
          formatter(row) {
            return row.Describe || "-";
          },
        },
      ], // 自定义表格列
      file_table_data: [], // 表格数据
      all_folder_list: [], // 所有文件夹列表
      tree_folder_list: [], // 树形文件夹列表
      type: {
        //! 通过数字编号设置文件/文件夹类型？
        folder: 1,
        img: 2,
        video: 3,
        other: 4,
      }, // 文件类型
      rource_type: {
        self: 1, // 自建
      }, // 数据来源类型
      explorer_prop: {
        name: "Name",
        match: "Name",
        splic: true,
        suffix: "SuffixName",
        pathId: "Id",
        pathPid: "ParentId",
        pathName: "Name",
        pathChildren: "Children", // String 路径数据 children字段
        pathConnector: "\\", // String 路径父子数据拼接连接符,默认为'\'
        pathParents: "Parents", // String 路径数据所有直系祖先节点自增长identityId逗号拼接
        pathIdentityId: "IdentityId", // String 路径数据自增长id
      }, // 文件管理器配置项
      path: {}, // 路径数据
      folder_form: {
        Path: "",
        Name: "",
        preview: [],
        handle: [],
        Describe: "",
      }, // 文件夹表单
      folder_rules: {
        ParentId: [
          { required: true, message: "请选择文件路径", trigger: "blur" },
        ],
        Name: [
          { required: true, message: "请填写文件夹名称", trigger: "blur" },
        ],
      }, // 文件夹表单验证
      child_act_saved: {}, // 存储子组件数据，用于编辑更新
      tree_select_prop: {
        label: "Name",
        children: "Children",
      }, // 树形下拉框配置项
      uploadOptions: {
        path: "/",
      }, // 上传文件附加参数
    };
  },
  methods: {
    /**
     * @name 上传文件提交操作
     */
    fileUpload(file, cb) {
      // 设置文件上传连接的选项
      this.uploadOptions.user = "Peng";
      cb();
    },
    download(filePath, func) {
      //! 父组件APP只是打印子组件传递过来的数据与方法，并不执行
      console.log(filePath, func);
      console.log("use download api");
      // testApi(data).then(res => func(res));
      downloadDataApi(filePath[0].Path).then((res) =>
        func(res, filePath[0].Name)
      );
    },
    /**
     * 根据关键词搜索文件
     * file: Object 文件属性
     * update: Boolean 数据是否需要更新（不需要表示已存在）
     */
    fileSearch(file, update) {
      if (update) {
        this.path = file;
        console.log("updated this.path in APP: ", this.path);
        this.getFileList(file);
      }
    },
    // 获取文件夹列表 //! 调用后端API获取文件列表数据
    getFileList(file) {
      getFileListApi(file).then(({ data, status }) => {
        if (status === apiok) {
          this.file_table_data = data || [];
          //   console.log("file_table_data: ", this.file_table_data);
        }
      });
    },
    /**
     * 编辑文件夹
     * act:Object 当前选中文件夹
     * type:String 操作类型 add添加edit编辑
     * file:Object 当前路径信息
     */
    handleFolder(act, type, file) {
      //! 此处相应文件夹新建与编辑请求，弹出文件夹操作对话框
      console.log(act);
      console.log(type);
      console.log("file", file);
      this.path = file;
      this.fade.folder = true;
      if (type === "add") {
        this.$refs["folder_form"].resetFields(); // 清除文件夹新建表单的数据
        this.folder_form.Id = "";
        this.folder_form.ParentId = file.Path;
        console.log("handle add folder");
        return;
      }
      this.child_act_saved = act;
      this.folder_form = { ...act }; //* 将act数组展开赋值
      console.log("this.child_act_saved", this.child_act_saved);
      console.log("this.folder_form", this.folder_form);
    },
    // 提交文件夹表单
    submitFolderFrom(formName) {
      //! 正式提交完整文件夹请求表单
      console.log("submitFolderFrom");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //console.log("form is valid!")
          this.load.folder = true;
          addFolderApi(this.folder_form).then((res) => {
            this.load.folder = false;
            // let res_data = data.Data;

            //从文件夹创建表单获得的 this.folder_form
            // TODO 向服务器请求添加文件夹
            let res_data = res; // 由表单数据模拟服务器返回数据，此处应有服务器返回对应实体

            // res_data.EditTime = res_data.CreateTime = "2019-11-11 11:11:11";
            // res_data.Type = 1;
            console.log("res_data", res_data);
            // console.log("this.folder_form", this.folder_form);
            if (!this.folder_form.Id) {
              // 新增
              if (this.folder_form.Path === this.path.Path) {
                // 新增到当前路径
                console.log("新增到当前路径");
                this.file_table_data.unshift(res_data);
              } else {
                // 新增其他路径
                console.log("新增其他路径");
                let _new_data = {
                  id: res_data.Id,
                  pid: res_data.ParentId,
                  path: res_data.Name,
                };
                this.$refs["wl-explorer-cpt"].updateHistoryData(
                  { Id: res_data.ParentId },
                  [_new_data]
                );
              }
            } else {
              // 编辑
              this.child_act_saved.Name = res_data.Name;
              this.child_act_saved.Describe = res_data.Describe;
            }
            this.fade.folder = false;
            this.$message({
              showClose: true,
              message: "操作成功",
              type: "success",
            });
          });
          //   setTimeout(() => {
          //     }, 1000);
        } else {
          return false;
        }
      });
    },
    // 删除文件
    fileDel(data) {
      let cannot_del_data = []; // 收集不可删除数据
      let normal_data_file = []; // 收集可删除文件
      let normal_data_folder = []; // 收集可删除文件夹
      data.forEach((i) => {
        i.RourceType !== this.rource_type.self
          ? cannot_del_data.push(i) // 不可删除数据
          : i.Type === this.type.folder
          ? normal_data_folder.push(i.Id) // 可删除文件夹
          : normal_data_file.push(i.Id); // 可删除文件
      });
      // 不可删除数据进行提示
      if (cannot_del_data.length > 0) {
        let _msg = '<p class="title">以下文件或文件夹不可删除，已自动过滤</p>';
        cannot_del_data.forEach((i) => {
          _msg += `<p class="msg">${i.Name}</p>`;
        });
        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: _msg,
          type: "warning",
          customClass: "mulit-msg",
        });
      }
      if (normal_data_folder.length === 0 && normal_data_file.length === 0)
        return;
      // 可删除数据正常删除
      let _data = {
        FolderIds: normal_data_folder,
        FolderFileIds: normal_data_file,
      };
      delFileApi(_data).then(({ data, status }) => {
        if (status === apiok) {
          this.file_table_data = this.file_table_data.filter(
            (i) => ![...normal_data_file, ...normal_data_folder].includes(i.Id)
          );
          this.$message({
            showClose: true,
            message: data.Message,
            type: "success",
          });
        }
      });
    },
    // 获取所有文件夹
    getAllFolders() {
      getAllFoldersApi().then(({ data, status }) => {
        if (status === apiok) {
          this.all_folder_list = data || [];
          this.all_folder_list.forEach((item) => {
            // var pathStack = item.Path.split("/");
            // item.id = pathStack.slice(-1)[0];
            // item.pid = pathStack.length > 1 ? pathStack.slice(-2, -1)[0] : "./";
            //* 根据服务器返回的路径等数据，为文件添加其他相关属性
            var pathStack = item.Path.split("/");
            //   item.Id = pathStack.slice(-1)[0]; // Id 就是Path
            item.Parent =
              pathStack.length > 1 ? pathStack.slice(-2, -1)[0] : "./";
          });
          let _list = [...this.all_folder_list].filter(
            (item) => item.Type == 1
          );
          //   let options = {
          //     // 用于变量名到属性名字符串的转换，传入arrayToTree，但目前不需要
          //     id: this.explorer_prop.pathId,
          //     pid: this.explorer_prop.pathPid,
          //     children: "Children",
          //   };
          //   debugger;

          //   this.tree_folder_list = {
          //     Path: "./",
          //     Children: arrayToTree(_list),
          //   };
          debugger;
          this.tree_folder_list = arrayToTree(_list);
          console.log("this.tree_folder_list: ", this.tree_folder_list);
        }
      });
    },
    // 判断是否文件夹函数
    isFolderFn(row) {
      //! 为子组件方法赋值
      return row.Type === this.type.folder;
    },
  },
  created() {
    this.closeOtherLayout = closeOtherLayout;
    this.getAllFolders();
    this.getFileList();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  padding: 25px;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  box-sizing: border-box;
}
</style>
