<template>
  <div class="app-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :span="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-exception">
            <i class="el-icon-warning card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当日总数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.total"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-exception-ok">
            <i class="el-icon-edit-outline card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当日成功数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.success"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-hang">
            <i class="el-icon-info card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当日失败数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.fail"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :span="24">
        <el-card>
          <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
            <el-form-item label="">
              <el-input
                v-model="queryForm.wayBillNo"
                placeholder="运单号"
                :editable="false"
              ></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="queryForm.goodsName" placeholder="物品名"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="queryForm.receiverMobile" placeholder="收件人手机号"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-date-picker
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="queryForm.orderTimeRange"
                placeholder="操作日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
              <el-button size="small" type="primary" @click="addBtnHandle">扫码退货</el-button>
            </el-form-item>
          </el-form>

          <el-table
            :data="tableDataSearch"
            border
            size="mini"
            center
            style="width: 100%;font-size: 13px;"
            highlight-current-row
          >
            <el-table-column prop="wayBillNo" label="运单号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="changeWayBillNo" label="换单号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="goodsName" label="物品名" width="120" align="center">
            </el-table-column>
            <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
            <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
            </el-table-column>
            <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
            </el-table-column>
            <el-table-column prop="collectionFee" label="代收货款" align="center">
            </el-table-column>
            <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
            </el-table-column>
            <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
            </el-table-column>
            <el-table-column prop="wayBillStatus" label="运单状态" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="扫码操作时间" width="90" align="center">
            </el-table-column>
            <div slot="empty" v-if="total <= 0">
              <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
            </div>
          </el-table>
          <Pagination
            :total="total"
            :perpages="perpageNumber"
            :currentPage="currentPage"
            @currentPage="getCurrentPage"
          ></Pagination>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="addFormVisible">
      <el-form :model="addForm" :inline="true" label-width="120px" @submit.native.prevent>
        <el-form-item label="运单号">
          <el-input
            v-model="addForm.wayBillNo"
            placeholder=""
            ref="wayBillInput"
            @keyup.enter.native="addHandle"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import CountTo from 'vue-count-to'
import Pagination from '@/components/Pagination/index'
import { listPage, add, getGroupPanelInfo } from '@/api/refund.js'

export default {
  components: {
    CountTo,
    Pagination
  },
  data() {
    return {
      stasticsData: {
        total: 0,
        success: 0,
        fail: 0
      },
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: []
      },
      addForm: {
        wayBillNo: ''
      },
      addFormVisible: false
    }
  },
  methods: {
    queryHandle(page) {
      this.groupPanelInfo()
      if (page) {
        this.currentPage = page
      }
      this.getListByPage(this.perpageNumber, this.currentPage)
    },
    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.getListByPage(perPage, currPage)
    },
    groupPanelInfo() {
      getGroupPanelInfo({}).then(res => {
        this.stasticsData = res.data
      })
    },
    // 异步获取数据
    getListByPage(numPerPage, pageNum) {
      let startDate = ''
      let endDate = ''
      if (this.queryForm.orderTimeRange) {
        startDate = this.queryForm.orderTimeRange[0]
        endDate = this.queryForm.orderTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        expressType: this.queryForm.expressType,
        goodsName: this.queryForm.goodsName,
        receiverMobile: this.queryForm.receiverMobile,
        startDate: startDate,
        endDate: endDate
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 扫码操作开始 */
    addBtnHandle() {
      this.addFormVisible = true

      this.addForm.wayBillNo = ''
      this.$nextTick(function() {
        this.$refs['wayBillInput'].focus()
      })
    },
    addHandle() {
      const param = {
        wayBillNo: this.addForm.wayBillNo
      }
      add(param)
        .then(res => {
          this.addForm.wayBillNo = ''
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryHandle()
        })
        .catch(() => {
          this.addForm.wayBillNo = ''
          this.queryHandle()
        })
    }
    /** 扫码操作结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.queryHandle()
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-exception {
        background: #f4516c;
      }

      .icon-exception-ok {
        background: #40c9c6;
      }

      .icon-hang {
        background: #36a3f7;
      }

      .icon-hang-ok {
        background: #34bfa3;
      }
    }

    .icon-exception {
      color: #f4516c;
    }

    .icon-exception-ok {
      color: #40c9c6;
    }

    .icon-hang {
      color: #36a3f7;
    }

    .icon-hang-ok {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
