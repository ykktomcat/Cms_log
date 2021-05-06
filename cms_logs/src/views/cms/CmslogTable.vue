<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form :inline="true" :model="queryForm" class="demo-form-inline" ref="queryForm">
          <el-form-item label="模糊查询">
            <el-input v-model="queryForm.inputStr" placeholder="模糊查询" prop="inputStr"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.inputBegdate"
              style="width: 140px;"
              align="left"
              type="date"
              placeholder="起始日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              prop="inputBegdate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.inputEnddate"
              style="width: 140px;"
              align="left"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              prop="inputEnddate"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryCmslogs">查询</el-button>
            <el-button type="primary" icon="el-icon-document" @click="allButton()">全部</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-button @click="exportToExcle" type="primary">导出excel</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="pageCmslogs" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="所属公司">
              <span>{{ props.row.ownername }}</span>
            </el-form-item>
            <el-form-item label="所属部门">
              <span>{{ props.row.deptname }}</span>
            </el-form-item>
            <el-form-item label="事件类型">
              <span>{{ props.row.event_system }}</span>
            </el-form-item>
            <el-form-item label="问题归类">
              <span>{{ props.row.event_type }}</span>
            </el-form-item>
            <el-form-item label="问题来源">
              <span>{{ props.row.event_from }}</span>
            </el-form-item>
            <el-form-item label="提出人">
              <span>{{ props.row.proposer }}</span>
            </el-form-item>
            <el-form-item label="处理人">
              <span>{{ props.row.handler }}</span>
            </el-form-item>
            <el-form-item label="当前状态">
              <span>{{ props.row.status }}</span>
            </el-form-item>
            <el-form-item label="问题描述">
              <span
                style="display :inline-block;width:320px;overflow:hidden;text-Overflow:ellipsis;white-Space:nowrap;"
              >{{ props.row.event_mark }}</span>
            </el-form-item>
            <el-form-item label="解决方案">
              <span
                style="display :inline-block;width:320px;overflow:hidden;text-Overflow:ellipsis;white-Space:nowrap;"
              >{{ props.row.resolvent }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span
                style="display :inline-block;width:320px;overflow:hidden;text-Overflow:ellipsis;white-Space:nowrap;"
              >{{ props.row.mark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="60"></el-table-column>
      <el-table-column label="处理人" prop="handler" width="80"></el-table-column>
      <el-table-column label="事件类型" prop="event_system" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="问题归类" prop="event_type" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="问题描述" prop="event_mark" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="登记日期" prop="createdate" :formatter="dateFormat" width="120"></el-table-column>
      <el-table-column label="解决日期" prop="resolventdate" :formatter="dateFormat" width="120"></el-table-column>
      <el-table-column label="当前状态" prop="status" width="80"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click="updateCmslogs(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></el-button>
          <el-button
            @click="Deletecmslog(scope.row)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--下半部分-->
    <!--批量删除-->
    <el-row style="margin-top: 10px;  padding-bottom:40px;">
      <el-col :span="8" style="text-align: left;">
        <el-button type="danger" @click="Deletecmslogs()" icon="el-icon-delete" size="medium">批量删除</el-button>
      </el-col>
      <!--分页模块-->
      <el-col :span="16" style="text-align: right;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlhaneCurrentChange"
          :current-page="currentpage"
          :page-sizes="[5, 10, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <CmslogFrom ref="CmslogFrom" />
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </el-card>
</template>

<script>
import CmslogFrom from "./CmslogFrom.vue";
import {
  cmslogsAxios,
  deletecmslogAxios,
  deletecmslogsAxios,
  exportAxios,
  querycmslogsAxios
} from "../../network/networks";
export default {
  data() {
    return {
      //默认dialog不显示
      dialogVisible: false,
      selectCmslogs: [], //多选日志时的集合
      //////////////////////////////////////////////////////////////分页相关变量///////////////////////////////////////
      pageCmslogs: [], //分页后当前页的数据
      total: 0, //数据的总行
      currentpage: 1, //当前所在的页
      pagesize: 10, //每页显示多少行
      //////////////////////////////////////////////////////////////分页相关变量///////////////////////////////////////
      //用户自定义查询参数
      queryForm: {
        inputStr: "",
        inputBegdate: null,
        inputEnddate: null,
        handler: this.$local.get("username"),
        admin: this.$local.get("admin")
      },
      cmslogs: [],
      //时间选择器扩展
      pickerOptions: {
        disabledDate(time) {
          //return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  //多组件嵌套
  components: {
    CmslogFrom
  },
  mounted() {
    //自动加载数据 进行分页
    this.getCmslogs();
  },

  methods: {
    //时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      //空字符串返回空
      if (date === undefined) {
        return "";
        //为null返回未填写
      } else if (date === null) {
        return "未填写";
      } else {
        return this.$moment(date).format("YYYY-MM-DD");
      }
    },
    //显示全部按钮
    allButton() {
      this.queryForm.inputStr = "";
      this.queryForm.inputBegdate = null;
      this.queryForm.inputEnddate = null;
      this.getCmslogs();
    },
    //获取当前用户下所有日志
    getCmslogs() {
      cmslogsAxios({
        handler: this.$local.get("username"),
        admin: this.$local.get("admin")
      })
        .then(res => {
          //请求成功后执行
          // console.log(res)
          if (res.data.code === 1) {
            //把数据给cmslogs
            this.cmslogs = res.data.data;
            //获取返回记录的总行数
            this.total = res.data.data.length;
            //获取当前页的数据
            this.getPageCmslogs();
            //进行提示
            this.$message.success("数据加载成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          //请求失败后执行
          console.log(err);
        });
    },
    //选择复选框时触发的操作
    handleSelectionChange(data) {
      this.selectCmslogs = data;
    },

    //导出excel
    exportToExcle() {
      //封装后的用户请求接口
      exportAxios().then(res => {
        if (res.data.code === 1) {
          //let url = "http://172.16.138.65:1111/" + "media/" + res.data.name;
          let url = "http://192.168.0.166:8000/" + "media/" + res.data.name;

          window.open(url);
          this.$message.success("导出Exce成功");
        } else {
          this.$message.error("导出Excel出现异常");
        }
      });
    },
    //实现cmslog信息的查询
    queryCmslogs() {
      //使用ajax请求 post ->传递 inputstr
      if (
        this.queryForm.inputStr == "" &&
        this.queryForm.inputBegdate == null &&
        this.queryForm.inputEnddate == null
      ) {
        this.$message.error("请先输入查询条件");
        return false;
      }
      querycmslogsAxios(this.queryForm)
        .then(res => {
          if (res.data.code === 1) {
            this.cmslogs = res.data.data;
            this.total = res.data.data.length;
            this.getPageCmslogs();
            this.$message.success("查询数据加载成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          console.log(err);
          this.$message.error("获取后端查询结果出现异常！");
        });
    },
    //修改弹窗关闭时的函数
    handleClose() {
      //清空子组件里的表单
      this.$nextTick(() => this.$refs.CmslogFrom.resetForm("cmslogFrom"));
      //关闭弹窗
      this.dialogVisible = false;
    },

    changeVisible() {
      this.dialogVisible = !this.dialogVisible;
    },
    updateCmslogs(row) {
      //点击编辑按钮，显示弹窗，
      this.changeVisible();
      //将子组件中修改日志标识激活
      this.$nextTick(() => (this.$refs.CmslogFrom.ifupdate = true));
      //执行子组件中获取待修改的日志方法，将明显填充到表单中 进行修改
      this.$nextTick(() => this.$refs.CmslogFrom.getOnecmslog(row.id));
    },

    //删除一条日志
    Deletecmslog(row) {
      //登录人不为提交人时 不允许删除
      if (row.handler === this.$local.get("username")) {
        //等待确认
        this.$confirm("是否确认删除日志ID为" + row.id + "的记录？", "提示", {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deletecmslogAxios({ id: row.id }).then(res => {
              if (res.data.code === 1) {
                this.$message.success("日志删除成功");
                this.getCmslogs();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.error("当前登录人与当前日志提交人不一致，不允许删除");
      }
    },
    //批量删除多条日志
    Deletecmslogs() {
      //等待确认
      //判断是否勾选他人的日志
      for (var i = 0; i < this.selectCmslogs.length; i++) {
        if (this.selectCmslogs[i].handler != this.$local.get("username")) {
          this.$message.error("所选数据中包含其他人的日志，无法删除");
          return false;
        }
      }

      if (this.selectCmslogs.length == 0) {
        this.$message({
          type: "warning",
          message: "请先勾选要删除的数据"
        });
      } else {
        this.$confirm(
          "是否确认批量删除" + this.selectCmslogs.length + "条日志记录？",
          "提示",
          {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            //确认删除响应事件
            deletecmslogsAxios({
              cmslogs: this.selectCmslogs
            }).then(res => {
              if (res.data.code === 1) {
                this.$message.success("日志批量删除成功");
                //批量删除后重新获取数据
                this.getCmslogs();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },

    /////////////////////////////////////////////////以下代码实现表格分页 /////////////////////////////////////////////////
    //获取当前页cmslog的信息
    getPageCmslogs() {
      //清空pageCmslogs中的数据
      this.pageCmslogs = [];
      //获得当前页的数据
      for (
        let i = (this.currentpage - 1) * this.pagesize;
        i < this.total;
        i++
      ) {
        //遍历数据添加到pageCmslos中
        this.pageCmslogs.push(this.cmslogs[i]);
        //判断是否达一页的要求
        if (this.pageCmslogs.length === this.pagesize) break;
      }
    },
    //分页时修改每页的行数
    handleSizeChange(size) {
      this.pagesize = size;
      //分页数据重新加载
      this.getPageCmslogs();
    },
    //调整当前的页码
    handlhaneCurrentChange(pageNumber) {
      //修改当前页码
      this.currentpage = pageNumber;
      //分页数据重新加载
      this.getPageCmslogs();
    }
    /////////////////////////////////////////////////以上代码实现表格分页 /////////////////////////////////////////////////
  }
};
</script>


<style >
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
