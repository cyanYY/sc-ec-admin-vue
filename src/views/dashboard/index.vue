<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-exception">
            <i class="el-icon-warning card-panel-icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              当日异常数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.currentException"
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
              当日办理数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.currentHandle"
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
              累计异常数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.totalException"
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
              异常妥投数
            </div>
            <count-to
              :start-val="0"
              :end-val="stasticsData.totalFinish"
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
            <el-form-item v-if="roles.indexOf('SYS_ADMIN') > -1">
              <el-select
                v-model="queryForm.dimension"
                placeholder="统计维度"
                @change="dimensionChange"
              >
                <el-option label="按用户" value="1"></el-option>
                <el-option label="按日期" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="queryForm.agentId" clearable placeholder="代理商">
                <el-option
                  v-for="item in dropAgents"
                  :key="item.agentId"
                  :label="item.agentName"
                  :value="item.agentId"
                ></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="">
              <el-input
                v-if="queryForm.dimension === '1'"
                v-model="queryForm.operator"
                placeholder="操作员"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="primary" @click="queryHandle()">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="userDatas" show-summary :summary-method="getSummaries">
            <el-table-column label="处理日期" align="center" prop="processDate" />
            <el-table-column
              v-if="queryForm.dimension === '1'"
              label="操作员"
              align="center"
              prop="operator"
            />
            <el-table-column label="总办理数" align="center" prop="totalHandle" />
            <el-table-column label="新单办理数" align="center" prop="newHandle" />
            <el-table-column label="老单办理数" align="center" prop="oldHandle" />
            <el-table-column label="妥投数" align="center" prop="totalFinish" />
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
import { getGroupPanelInfo, listUserHandle, listHandle } from '@/api/dashboard.js'
import { listUserAgents } from '@/api/user.js'
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
        dateRange: [currentDate, currentDate],
        dimension: '1'
      },
      stasticsData: {
        currentException: 0,
        currentHandle: 0,
        totalException: 0,
        totalFinish: 0
      },
      userDatas: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      sums: {
        totalHandle: 0,
        newHandle: 0,
        oldHandle: 0,
        totalFinish: 0
      },
      dropAgents: []
    }
  },
  methods: {
    queryHandle() {
      this.groupPanelInfo()
      this.userHandle(this.perpageNumber, this.currentPage)
    },
    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.userHandle(perPage, currPage)
    },
    groupPanelInfo() {
      let startDate = ''
      let endDate = ''
      if (this.queryForm.dateRange) {
        startDate = this.queryForm.dateRange[0]
        endDate = this.queryForm.dateRange[1]
      }
      const param = {
        agentId: this.queryForm.agentId,
        startDate: startDate,
        endDate: endDate
      }
      getGroupPanelInfo(param).then(res => {
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
        startDate: startDate,
        endDate: endDate,
        agentId: this.queryForm.agentId,
        operator: this.queryForm.operator,
        numPerPage: numPerPage,
        pageNum: pageNum
      }
      if (this.queryForm.dimension === '1') {
        listUserHandle(param).then(res => {
          this.userDatas = res.data.list.recordList
          this.total = res.data.list.totalCount

          this.sums.totalHandle = res.data.totalHandle
          this.sums.newHandle = res.data.newHandle
          this.sums.oldHandle = res.data.oldHandle
          this.sums.totalFinish = res.data.totalFinish
        })
      } else {
        listHandle(param).then(res => {
          this.userDatas = res.data.list.recordList
          this.total = res.data.list.totalCount

          this.sums.totalHandle = res.data.totalHandle
          this.sums.newHandle = res.data.newHandle
          this.sums.oldHandle = res.data.oldHandle
          this.sums.totalFinish = res.data.totalFinish
        })
      }
    },
    listUserAgents() {
      listUserAgents().then(res => {
        this.dropAgents = res.data
      })
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        if (this.queryForm.dimension === '1') {
          sums[2] = this.sums.totalHandle
          sums[3] = this.sums.newHandle
          sums[4] = this.sums.oldHandle
          sums[5] = this.sums.totalFinish
        } else {
          sums[1] = this.sums.totalHandle
          sums[2] = this.sums.newHandle
          sums[3] = this.sums.oldHandle
          sums[4] = this.sums.totalFinish
        }
      })

      return sums
    },
    dimensionChange() {
      this.userDatas = []
      this.total = 0
      this.$nextTick(this.userHandle(this.perpageNumber, this.currentPage))
    }
  },
  create() {},
  mounted() {
    if (this.roles.indexOf('ADMIN') > -1) {
      this.queryForm.dimension = '2'
    }
    this.listUserAgents()
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
