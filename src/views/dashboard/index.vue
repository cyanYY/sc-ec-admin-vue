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
              累计异常妥投数
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
          <span>统计日期：</span>
          <el-date-picker
            v-model="queryForm.dateRange"
            size="small"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="datechange"
          >
          </el-date-picker>
          <el-table :data="userDatas" show-summary>
            <el-table-column label="操作员" align="center" prop="operator" />
            <el-table-column label="总办理数" align="center" prop="totalHandle" />
            <el-table-column label="新单办理数" align="center" prop="newHandle" />
            <el-table-column label="老单办理数" align="center" prop="oldHandle" />
            <el-table-column label="妥投数" align="center" prop="totalFinish" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getGroupPanelInfo, listUserHandle } from '@/api/dashboard.js'
import { parseTime } from '@/utils'

const currentDate = parseTime(new Date(), '{y}-{m}-{d}}')

export default {
  components: {
    CountTo
  },
  data() {
    return {
      queryForm: {
        dateRange: [currentDate, currentDate]
      },
      stasticsData: {
        currentException: 0,
        currentHandle: 0,
        totalException: 0,
        totalFinish: 0
      },
      userDatas: []
    }
  },
  methods: {
    groupPanelInfo() {
      getGroupPanelInfo().then(res => {
        this.stasticsData = res.data
      })
    },
    userHandle() {
      let startDate = ''
      let endDate = ''
      if (this.queryForm.dateRange) {
        startDate = this.queryForm.dateRange[0]
        endDate = this.queryForm.dateRange[1]
      }
      const param = {
        startDate: startDate,
        endDate: endDate
      }
      listUserHandle(param).then(res => {
        this.userDatas = res.data
      })
    },
    datechange() {
      this.userHandle()
    }
  },
  create() {},
  mounted() {
    this.groupPanelInfo()
    this.userHandle()
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
        font-size: 16px;
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
