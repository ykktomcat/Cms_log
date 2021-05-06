<template>
  <el-card class="box-card">
    <el-form
      ref="cmslogFrom"
      :model="cmslogFrom"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属公司" prop="ownername">
            <!-- ownername_options
            <el-input v-model="cmslogFrom.ownername" style="width:40%;"></el-input>-->
            <el-select v-model="cmslogFrom.ownername" placeholder="请选择所属公司" style="width:40%; ">
              <el-option
                v-for="(item,index) in ownername_options"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属部门" prop="deptname">
            <el-input v-model="cmslogFrom.deptname" style="width:40%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="事件类型" prop="event_system">
            <el-select v-model="cmslogFrom.event_system" placeholder="请选择事件类型" style="width:40%; ">
              <el-option
                v-for="(item,index) in event_system_options"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题归类" prop="event_type">
            <el-select v-model="cmslogFrom.event_type" placeholder="请选择问题归类" style="width:40%;">
              <el-option
                v-for="(item,index) in event_type_options"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="问题来源" prop="event_from">
            <el-select v-model="cmslogFrom.event_from" placeholder="请选择问题来源" style="width:40%;">
              <el-option
                v-for="(item,index) in event_from_options"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提出人" prop="proposer">
            <el-input v-model="cmslogFrom.proposer" style="width:40%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="处理人" prop="handler">
            <el-input v-model="cmslogFrom.handler" style="width:40%;" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期" prop="createdate">
            <el-date-picker
              type="date"
              placeholder="选择登记日期"
              v-model="cmslogFrom.createdate"
              style="width:40%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="当前状态" prop="status">
            <el-select v-model="cmslogFrom.status" placeholder="请选择当前状态" style="width:40%;">
              <el-option
                @click.native="isStatus()"
                v-for="(item,index) in status_options"
                :label="item.label"
                :value="item.value"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="解决日期" prop="resolventdate">
            <el-date-picker
              type="date"
              placeholder="选择解决日期"
              v-model="cmslogFrom.resolventdate"
              style="width:40%;"
              value-format="yyyy-MM-dd"
              :disabled="this.ifstatus"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="问题描述" prop="event_mark">
        <el-input type="textarea" v-model="cmslogFrom.event_mark"></el-input>
      </el-form-item>
      <el-form-item label="解决方案" prop="resolvent">
        <el-input type="textarea" v-model="cmslogFrom.resolvent"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="mark">
        <el-input type="textarea" v-model="cmslogFrom.mark"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('cmslogFrom')">立即保存</el-button>
        <el-button @click="resetForm('cmslogFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {
  addcmslogAxios,
  getOnecmslogAxios,
  updatecmslogAxios
} from "../../network/networks";
export default {
  data() {
    //当日志状态为‘已完成’，解决时间为必选项
    var validatePass = (cmslogFrom, value, callback) => {
      if (value === "" && this.cmslogFrom.status == "已完成") {
        callback(new Error("当前状态:'已完成'！请选择解决日期！"));
      } else callback();
    };

    return {
      //控制完成时间变量 是否能编辑 默认为不可编辑
      ifstatus: true,
      ifadd: false,
      ifupdate: false,
      getid: { id: "" },
      //父组件传过来的logid
      cmslogFrom: {
        ownername: "",
        deptname: "",
        event_system: "",
        event_mark: "",
        event_type: "",
        resolvent: "",
        event_from: "",
        handler: this.$local.get("username"),
        proposer: "",
        createdate: new Date(),
        resolventdate: "",
        status: "",
        mark: ""
      },

      rules: {
        ownername: [
          { required: true, message: "所属公司不能为空", trigger: "blur" }
        ],
        deptname: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        event_system: [
          { required: true, message: "事件类型不能为空", trigger: "change" }
        ],
        event_mark: [
          { required: true, message: "问题描述不能为空", trigger: "blur" }
        ],
        event_type: [
          { required: true, message: "问题归类不能为空", trigger: "change" }
        ],
        resolvent: [
          { required: true, message: "处理办法不能为空", trigger: "blur" }
        ],
        event_from: [
          { required: true, message: "系统不能为空", trigger: "change" }
        ],
        handler: [
          { required: true, message: "处理人不能为空", trigger: "change" }
        ],
        proposer: [
          { required: true, message: "提出人不能为空", trigger: "blur" }
        ],

        resolventdate: [{ validator: validatePass, trigger: "blur" }],
        status: [
          { required: true, message: "当前状态不能为空", trigger: "change" }
        ]
      },
      //公司名称下拉菜单
      ownername_options: [
        { id: 1, value: "湖南", label: "湖南" },
        { id: 2, value: "湖南器械", label: "湖南器械" },
        { id: 3, value: "株洲器械", label: "株洲器械" },
        { id: 4, value: "常德器械", label: "常德器械" },
        { id: 5, value: "衡阳器械", label: "衡阳器械" },
        { id: 6, value: "岳阳", label: "岳阳" },
        { id: 7, value: "郴州", label: "郴州" },
        { id: 8, value: "湘潭", label: "湘潭" },
        { id: 9, value: "湘西", label: "湘西" },
        { id: 10, value: "永州", label: "永州" },
        { id: 11, value: "大健康", label: "大健康" },
        { id: 12, value: "常德", label: "常德" },
        { id: 13, value: "株洲", label: "株洲" },
        { id: 14, value: "怀化", label: "怀化" },
        { id: 15, value: "邵阳", label: "邵阳" },
        { id: 16, value: "衡阳", label: "衡阳" },
        { id: 17, value: "医药发展", label: "医药发展" },
        { id: 18, value: "益阳", label: "益阳" },
        { id: 19, value: "娄底", label: "娄底" }
      ],
      //所属系统下拉菜单
      event_system_options: [
        { id: 1, value: "CMS系统", label: "CMS系统" },
        { id: 2, value: "WMS系统", label: "WMS系统" },
        { id: 3, value: "TMS系统", label: "TMS系统" },
        { id: 4, value: "DDI", label: "DDI" },
        { id: 5, value: "网上流向", label: "网上流向" },
        { id: 6, value: "CMS前置机", label: "CMS前置机" },
        { id: 7, value: "WMS前置机", label: "WMS前置机" },
        { id: 8, value: "赛飞平台", label: "赛飞平台" },
        { id: 9, value: "结算系统", label: "结算系统" },
        { id: 10, value: "机器人", label: "机器人" },
        { id: 11, value: "华招易联", label: "华招易联" },
        { id: 12, value: "五市联盟", label: "五市联盟" },
        { id: 13, value: "银企接口", label: "银企接口" }
      ],
      //问题归类下拉菜单
      event_type_options: [
        { id: 1, value: "需求", label: "需求" },
        { id: 2, value: "人为原因", label: "人为原因" },
        { id: 3, value: "系统原因", label: "系统原因" },
        { id: 4, value: "个人计划", label: "个人计划" },
        { id: 5, value: "其他", label: "其他" }
      ],
      //问题来源下拉菜单
      event_from_options: [
        { id: 1, value: "QQ", label: "QQ" },
        { id: 2, value: "微信", label: "微信" },
        { id: 3, value: "电话", label: "电话" },
        { id: 4, value: "OA", label: "OA" },
        { id: 5, value: "邮件", label: "邮件" },
        { id: 6, value: "自查", label: "自查" },
        { id: 7, value: "其它", label: "其它" }
      ],
      //日志状态下拉菜单
      status_options: [
        { id: 1, value: "未开始", label: "未开始" },
        { id: 2, value: "已取消", label: "已取消" },
        { id: 3, value: "进行中", label: "进行中" },
        { id: 4, value: "已完成", label: "已完成" }
      ]
    };
  },

  mounted() {},

  methods: {
    //加载下拉框默认选项
    setOption() {
      this.cmslogFrom.event_system = "CMS系统";
      this.cmslogFrom.event_type = "人为原因";
      this.cmslogFrom.event_from = "QQ";
      this.cmslogFrom.status = "未开始";
    },
    //状态为 已完成时 完成时间可编辑 反之不能编辑
    isStatus() {
      if (this.cmslogFrom.status === "已完成") {
        this.ifstatus = false;
      } else {
        this.ifstatus = true;
        this.cmslogFrom.resolventdate = "";
      }
    },
    //重置表单事件
    resetForm(formName) {
      //登录人不为提交人时 不允许修改
      if (this.cmslogFrom.handler === this.$local.get("username")) {
        this.$refs[formName].resetFields();
      } else {
        this.$message.error("当前登录人与当前日志提交人不一致，不允许修改");
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        //console.log("新增标识" + this.ifadd);
        //console.log("修改标识" + this.ifupdate);
        if (valid) {
          if (this.ifupdate) {
            //修改
            //登录人不为提交人时 不允许修改
            if (this.cmslogFrom.handler === this.$local.get("username")) {
              // console.log("进入公用表单 修改");
              this.updatecmslogFrom();
              this.resetForm("cmslogFrom");
            } else {
              this.$message.error(
                "当前登录人与当前日志提交人不一致，不允许修改"
              );
            }
          } else if (this.ifadd) {
            //新增
            // console.log("进入公用表单 新增");
            this.addcmslogFrom();
            this.resetForm("cmslogFrom");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //修改前调用，获得当前修改日志的明显填充到表单
    getOnecmslog(id) {
      this.$nextTick(() =>
        getOnecmslogAxios({ id: id }).then(res => {
          if (res.data.code === 1) {
            this.cmslogFrom = res.data.list;
          } else {
            this.$message.error(res.data.msg);
          }
        })
      );
    },
    //日志新增事件
    addcmslogFrom() {
      //封装后的用户请求接口
      //使用默认属性后，事件格式中会带T，提交到后台前进行格式化
      this.cmslogFrom.createdate = this.$moment(
        this.cmslogFrom.createdate
      ).format("YYYY-MM-DD");

      this.cmslogFrom.resolventdate = this.$moment(
        this.cmslogFrom.resolventdate
      ).format("YYYY-MM-DD");

      addcmslogAxios(this.cmslogFrom)
        .then(res => {
          if (res.data.code === 1) {
            this.$message.success("日志添加成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          //执行失败
          console.log(err);
          this.$message.error("修改时获取后端查询结果出现异常！");
        });
    },
    //修改日志事件
    updatecmslogFrom() {
      //使用默认属性后，事件格式中会带T，提交到后台前进行格式化
      this.cmslogFrom.createdate = this.$moment(
        this.cmslogFrom.createdate
      ).format("YYYY-MM-DD");

      this.cmslogFrom.resolventdate = this.$moment(
        this.cmslogFrom.resolventdate
      ).format("YYYY-MM-DD");
      updatecmslogAxios(this.cmslogFrom)
        .then(res => {
          //执行成功
          if (res.data.code === 1) {
            //进行提示
            this.$message.success("日志修改成功");
            //调用父组件 关闭修改弹窗
            this.$parent.$parent.$parent.changeVisible();

            //修改完后重新加载数据
            this.$parent.$parent.$parent.getCmslogs();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {
          //执行失败
          console.log(err);
          this.$message.error("修改时获取后端查询结果出现异常！");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>