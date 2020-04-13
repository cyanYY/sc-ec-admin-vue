<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="queryForm.agentId" clearable placeholder="代理商">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.merchantName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.expressType" placeholder="快递类型">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.orderTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="waybill-tables">
      <el-table
        :data="tableDataSearch"
        border
        size="mini"
        center
        style="width: 100%;font-size: 13px;"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="orderDate" label="日期" align="center"> </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="showLineChart(scope.row)" type="text" size="small">{{
              scope.row.goodsName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总数" align="center"> </el-table-column>
        <el-table-column prop="totalNotExceed" label="总数(除超区)" align="center">
        </el-table-column>
        <el-table-column prop="totalSuc" label="已完成" align="center"> </el-table-column>
        <el-table-column label="成功率" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.total == 0
                ? '-'
                : ((scope.row.totalSuc * 100) / scope.row.total).toFixed(2) + '%'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalException" label="异常数" align="center"> </el-table-column>
        <el-table-column label="异常率" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.total == 0
                ? '-'
                : ((scope.row.totalException * 100) / scope.row.total).toFixed(2) + '%'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="exceptionSuc" label="异常妥投数" align="center"> </el-table-column>
        <el-table-column prop="totalCancel" label="超区数" align="center"> </el-table-column>
        <el-table-column label="成功率(除超区)" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.totalNotExceed == 0
                ? '-'
                : ((scope.row.totalSuc * 100) / scope.row.totalNotExceed).toFixed(2) + '%'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货天数" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.deliverDays && scope.row.total != 0
                ? (scope.row.deliverDays / scope.row.total).toFixed(2)
                : '-'
            }}</span>
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>
    <div class="waybill-pages" v-if="total > 0">
      <Pagination
        :total="total"
        :perpages="perpageNumber"
        :currentPage="currentPage"
        @currentPage="getCurrentPage"
      ></Pagination>
    </div>

    <el-dialog
      size="small"
      title="妥投数图表"
      :close-on-click-modal="false"
      :visible.sync="lineChartVisible"
    >
      <div id="finishChart" :style="{ width: '100%', height: '350px' }"></div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { successRate, selectDateFinish } from '@/api/order.js'
import { listUserAgents } from '@/api/user.js'
import { parseTime } from '@/utils'
import { expressArray } from '@/utils/const'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  name: 'SuccReport',
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    const endDate = parseTime(date, '{y}-{m}-{d}')
    date.setDate(date.getDate() - 14)
    const startDate = parseTime(date, '{y}-{m}-{d}')

    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: [startDate, endDate]
      },
      sums: {
        total: 0,
        totalNotExceed: 0,
        totalSuc: 0,
        totalExc: 0
      },
      dropAgents: [],
      expressArray: expressArray,
      lineChartVisible: false,
      lineChartData: {}
    }
  },
  methods: {
    /** 分页查询订单开始 */
    queryBtnHandle(page) {
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
    // 异步获取数据
    getListByPage(numPerPage, pageNum) {
      let orderTimeStart = ''
      let orderTimeEnd = ''
      if (this.queryForm.orderTimeRange) {
        orderTimeStart = this.queryForm.orderTimeRange[0]
        orderTimeEnd = this.queryForm.orderTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        merchantName: this.queryForm.merchantName,
        goodsName: this.queryForm.goodsName,
        expressType: this.queryForm.expressType === '-1' ? '' : this.queryForm.expressType,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        agentId: this.queryForm.agentId
      }
      successRate(param).then(res => {
        this.sums.total = res.data.total
        this.sums.totalNotExceed = res.data.totalNotExceed
        this.sums.totalSuc = res.data.totalSuc
        this.sums.totalExc = res.data.totalExc
        this.sums.exceptionSuc = res.data.exceptionSuc
        this.sums.totalCancel = res.data.totalCancel
        this.sums.deliverDays = res.data.deliverDays
        this.tableDataSearch = res.data.result.recordList
        this.total = res.data.result.totalCount
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
        sums[3] = this.sums.total
        sums[4] = this.sums.totalNotExceed
        sums[5] = this.sums.totalSuc
        sums[6] =
          this.sums.total == 0
            ? '-'
            : ((this.sums.totalSuc * 100) / this.sums.total).toFixed(2) + '%'
        sums[7] = this.sums.totalExc
        sums[8] =
          this.sums.total == 0
            ? '-'
            : ((this.sums.totalExc * 100) / this.sums.total).toFixed(2) + '%'
        sums[9] = this.sums.exceptionSuc
        sums[10] = this.sums.totalCancel
        sums[11] =
          this.sums.totalNotExceed == 0
            ? '-'
            : ((this.sums.totalSuc * 100) / this.sums.totalNotExceed).toFixed(2) + '%'
        sums[12] =
          this.sums.deliverDays && this.sums.total != 0
            ? (this.sums.deliverDays / this.sums.total).toFixed(2)
            : '-'
      })

      return sums
    },
    /** 分页查询订单结束 */
    listUserAgents() {
      listUserAgents().then(res => {
        this.dropAgents = res.data
      })
    },
    showLineChart(row) {
      this.lineChartVisible = true

      let orderTimeStart = ''
      let orderTimeEnd = ''
      if (this.queryForm.orderTimeRange) {
        orderTimeStart = this.queryForm.orderTimeRange[0]
        orderTimeEnd = this.queryForm.orderTimeRange[1]
      }
      const param = {
        goodsName: row.goodsName,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      selectDateFinish(param).then(res => {
        const xData = []
        const yData = []
        res.data.forEach(item => {
          xData.push(item.finishDate)
          yData.push(item.finishNum)
        })

        let chart = echarts.init(document.getElementById('finishChart'))
        chart.setOption({
          xAxis: {
            data: xData
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          series: [
            {
              name: '妥投数',
              itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  }
                }
              },
              smooth: false,
              type: 'line',
              data: yData
            }
          ]
        })
      })
    }
  },
  create() {},
  mounted() {
    this.listUserAgents()
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
