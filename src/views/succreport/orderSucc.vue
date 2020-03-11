<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.merchantName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
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
        <el-table-column prop="orderDate" label="日期" width="100" align="center">
        </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" width="120" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="200" align="center">
        </el-table-column>
        <el-table-column prop="total" label="订单数" width="70" align="center"> </el-table-column>
        <el-table-column prop="cancel" label="总取消数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="cancelNotRepeat" label="非重复取消数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="notDeliver" label="未发货数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="jdDeliver" label="京东发货数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="jdExceed" label="京东超区数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="ztDeliver" label="中通发货数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="ztExceed" label="中通超区数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="allExceed" label="都超区数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="jdFinish" label="京东妥投数" width="70" align="center">
        </el-table-column>
        <el-table-column prop="ztFinish" label="中通妥投数" width="70" align="center">
        </el-table-column>
        <el-table-column label="京东妥投率" width="70" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.jdDeliver - scope.row.jdExceed === 0
                ? '-'
                : ((scope.row.jdFinish * 100) / (scope.row.jdDeliver - scope.row.jdExceed)).toFixed(
                    2
                  ) + '%'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="中通妥投率" width="70" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.ztDeliver - scope.row.ztExceed === 0
                ? '-'
                : ((scope.row.ztFinish * 100) / (scope.row.ztDeliver - scope.row.ztExceed)).toFixed(
                    2
                  ) + '%'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总妥投率" width="70" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.deliver - scope.row.allExceed === 0
                ? '-'
                : (
                    ((scope.row.jdFinish + scope.row.ztFinish) * 100) /
                    (scope.row.deliver - scope.row.allExceed)
                  ).toFixed(2) + '%'
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
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { orderSuccRate } from '@/api/order.js'
import { parseTime } from '@/utils'

export default {
  name: 'SuccReport',
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    const endDate = parseTime(date, '{y}-{m}-{d}')
    date.setDate(date.getDate() - 7)
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
        cancel: 0,
        cancelNotRepeat: 0,
        notDeliver: 0,
        deliver: 0,
        jdDeliver: 0,
        jdExceed: 0,
        jdFinish: 0,
        ztDeliver: 0,
        ztExceed: 0,
        ztFinish: 0
      }
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
      orderSuccRate(param).then(res => {
        this.sums.total = res.data.total
        this.sums.cancel = res.data.cancel
        this.sums.cancelNotRepeat = res.data.cancelNotRepeat
        this.sums.notDeliver = res.data.notDeliver
        this.sums.deliver = res.data.deliver
        this.sums.jdDeliver = res.data.jdDeliver
        this.sums.ztDeliver = res.data.ztDeliver
        this.sums.jdExceed = res.data.jdExceed
        this.sums.ztExceed = res.data.ztExceed
        this.sums.allExceed = res.data.allExceed
        this.sums.jdFinish = res.data.jdFinish
        this.sums.ztFinish = res.data.ztFinish
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
        sums[4] = this.sums.cancel
        sums[5] = this.sums.cancelNotRepeat
        sums[6] = this.sums.notDeliver
        sums[7] = this.sums.jdDeliver
        sums[8] = this.sums.jdExceed
        sums[9] = this.sums.ztDeliver
        sums[10] = this.sums.ztExceed
        sums[11] = this.sums.allExceed
        sums[12] = this.sums.jdFinish
        sums[13] = this.sums.ztFinish
        sums[14] =
          this.sums.jdDeliver - this.sums.jdExceed === 0
            ? '-'
            : ((this.sums.jdFinish * 100) / (this.sums.jdDeliver - this.sums.jdExceed)).toFixed(2) +
              '%'
        sums[15] =
          this.sums.ztDeliver - this.sums.ztExceed === 0
            ? '-'
            : ((this.sums.ztFinish * 100) / (this.sums.ztDeliver - this.sums.ztExceed)).toFixed(2) +
              '%'
        sums[16] =
          this.sums.deliver - this.sums.allExceed === 0
            ? '-'
            : (
                ((this.sums.jdFinish + this.sums.ztFinish) * 100) /
                (this.sums.deliver - this.sums.allExceed)
              ).toFixed(2) + '%'
      })

      return sums
    }
    /** 分页查询订单结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
