<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-exception">
            <i class="el-icon-warning card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日线下单数量
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.orderOfflineNum"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-exception-ok">
            <i class="el-icon-edit-outline card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日修改评价数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.handleCommentNum"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-hang">
            <i class="el-icon-info card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日售后数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.afterSaleNum"
              :duration="800"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-hang-ok">
            <i class="el-icon-success card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日服务请求数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.serviceRequestNum"
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
            <el-form-item>
              <el-date-picker
                v-model="queryForm.dateRange"
                size="small"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="roles.indexOf('SYS_ADMIN') > -1" label="">
              <el-select v-model="queryForm.operator" clearable placeholder="操作员">
                <el-option label="胡敏" value="35"></el-option>
                <el-option label="李金花" value="38"></el-option>
                <el-option label="龙利" value="39"></el-option>
                <el-option label="周汝洁" value="44"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="queryHandle()">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="userDatas">
            <el-table-column label="日期" width="95" align="center" prop="signDate" />
            <el-table-column label="操作员" width="80" align="center" prop="userName" />
            <el-table-column label="线下单" width="70" align="center" prop="offLineNum" />
            <el-table-column label="线下单成功" width="95" align="center" prop="offLineNumS" />
            <el-table-column label="线下单未发货" width="110" align="center" prop="offLineNumW" />
            <el-table-column label="服务请求" align="center" prop="serviceNum" />
            <el-table-column label="售后" width="50" align="center" prop="afterSaleNum" />
            <el-table-column label="售后成功" align="center" prop="afterSaleNumS" />
            <el-table-column label="线上售后" align="center" prop="afterSaleNumOnLine" />
            <el-table-column
              label="线上售后成功"
              width="110"
              align="center"
              prop="afterSaleNumOnLineS"
            />
            <el-table-column label="评论处理" align="center" prop="handleCommentNum" />
            <el-table-column
              label="评论处理成功"
              width="110"
              align="center"
              prop="handleCommentNumS"
            />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'
import Pagination from '@/components/Pagination/index'
import { getDailyCustomerStatistics, getCustomerStatistics } from '@/api/order-service.js'
import { parseTime } from '@/utils'

export default {
  components: {
    CountTo,
    Pagination
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    const currentDate = parseTime(new Date(), '{y}-{m}-{d}')

    return {
      queryForm: {
        dateRange: [currentDate, currentDate]
      },
      stasticsData: {
        orderOfflineNum: 0,
        handleCommentNum: 0,
        afterSaleNum: 0,
        serviceRequestNum: 0
      },
      userDatas: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0
    }
  },
  methods: {
    queryHandle() {
      this.userHandle(this.perpageNumber, this.currentPage)
    },
    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.userHandle(perPage, currPage)
    },
    groupPanelInfo() {
      getDailyCustomerStatistics({}).then(res => {
        this.stasticsData = res.data
      })
    },
    userHandle(numPerPage, pageNum) {
      let startDate = ''
      let endDate = ''
      if (this.queryForm.dateRange) {
        startDate = this.queryForm.dateRange[0]
        endDate = this.queryForm.dateRange[1]
      }
      const param = {
        timeStart: startDate,
        timeEnd: endDate,
        userId: this.queryForm.operator,
        numPerPage: numPerPage,
        pageNum: pageNum
      }
      getCustomerStatistics(param).then(res => {
        this.userDatas = res.data.result.recordList
        this.total = res.data.result.totalCount
      })
    }
  },
  create() {},
  mounted() {
    this.groupPanelInfo()
    this.queryHandle()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
}

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
