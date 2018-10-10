<template>
  <div class="fillContainer">
    <el-form :inline="true" ref="add_data" :model="search_data">
        <el-form-item label="按时间筛选:">
            <el-date-picker
                v-model="search_data.startTime"
                type="datetime"
                placeholder="选择开始时间"
                align="right"
                default-time="00:00:00"
                :picker-options="pickerOptions1">
            </el-date-picker>
            --
            <el-date-picker
                v-model="search_data.endTime"
                type="datetime"
                placeholder="选择结束时间"
                align="right"
                default-time="00:00:00"
                :picker-options="pickerOptions1">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" 
            icon="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
            <el-button type="primary" size="small" v-if="user.identity == 'manager'"
            icon="view" @click="handleAdd()">添加</el-button>
        </el-form-item>
    </el-form>
    <div class="tableContainer">
        <el-table v-if="tableData.length > 0" :data="tableData" style="width: 100%" max-height="450" border>
            <el-table-column
                type="index"
                label="序号"
                align='center'
                width="50">
            </el-table-column>
            <el-table-column prop="date" align='center' label="创建时间" width="200">
                <template slot-scope="scope">
                    {{ scope.row.date | convertTime('YYYY-MM-DD hh:mm:ss') }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="收支类型" align='center' width="110">
            </el-table-column>
            <el-table-column prop="describe" label="收支描述" align='center' width="130">
            </el-table-column>
            <el-table-column prop="income" label="收入" align='center' width="130"> 
                <template slot-scope="scope">  
                    <span style="color:#00d053">+ {{ scope.row.income }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="expend" label="支出" align='center' width="130">
                <template slot-scope="scope">  
                    <span style="color:#f56767">- {{ scope.row.expend }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="cash" label="账户现金" align='center' width="130">
                <template slot-scope="scope">  
                    <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" align='center' width="150">
            </el-table-column>
            <el-table-column 
                label="操作"
                prop="operation"
                align="center"
                fixed="right"
                v-if="user.identity == 'manager'"
                width="145">
                <template slot-scope="scope">
                    <el-button
                    type="warning"
                    size="small"
                    icon="edit"
                    v-if="user.identity == 'manager'"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    icon="delete"
                    v-if="user.identity == 'manager'"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <!-- element布局分为24列 -->
            <el-col :span="24">
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="paginations.page_index"
                        :page-sizes="paginations.page_sizes"
                        :page-size="paginations.page_size"
                        :layout="paginations.layout"
                        :total="paginations.total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
    </div>
    <my-dialog :formData="formData" :dialog="dialog" @update="getProfiles"/>
  </div>
</template>

<script>
export default {
  name: "fund-list",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      //需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前位于哪页
        total: 0, // 总数
        page_size: 5, // 1页显示多少条
        page_sizes: [5, 10, 15, 20], //每页显示多少条
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      search_data: {
        startTime: "",
        endTime: ""
      },
      pickerOptions1: {
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
  computed:{
      user(){
          return this.$store.getters.user;
      }
  },
  created() {
    this.getProfiles();
  },
  methods: {
    getProfiles() {
      // 获取表格数据
      this.$axios
        .get("/api/profiles")
        .then(res => {
          // console.log(res);
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    setPaginations() {
      // 分页属性设置
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleEdit(index, row) {
      // 编辑
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };

      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleAdd() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add"
      };

      this.formData = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleSizeChange(page_size) {
      // 切换size设置
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 获取目标页第一项索引
      let index = this.paginations.page_size * (page - 1);
      // 获取目标页最后一项数据的后一项索引（即包含目标页之前所有数据数）
      let nums = this.paginations.page_size * page;
      // 容器
      let tables = [];

      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    handleSearch() {
      // 筛选
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "请选择时间区间!"
        });
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分页数据
      this.setPaginations();
    }
  }
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
  margin: 0;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
