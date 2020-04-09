<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="queryForm.merchantId" placeholder="商户名称">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.goodsName"
            placeholder="商品名称"
            :editable="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.orderStatus" placeholder="订单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in orderStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="订单开始日期"
            end-placeholder="订单结束日期"
            v-model="queryForm.orderTimeRange"
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
      >
        <el-table-column prop="orderDate" label="发货日期" align="center"> </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"> </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="订单状态"
          align="center"
          :formatter="orderStatusFormatter"
        >
        </el-table-column>
        <el-table-column prop="goodsAmount" label="平均金额" align="center"> </el-table-column>
        <el-table-column prop="totalNum" label="订单总数" align="center"> </el-table-column>
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
import { dailyStatistics } from '@/api/order.js'
import { parseTime } from '@/utils'
import { orderStatusArray, merchantArray } from '@/utils/const'

export default {
  components: {
    Pagination
  },
  data() {
    const date = new Date()
    const endDate = parseTime(date, '{y}-{m}-{d}')
    date.setDate(date.getDate() - 3)
    const startDate = parseTime(date, '{y}-{m}-{d}')

    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: [startDate, endDate]
      },
      orderStatusArray: orderStatusArray,
      merchantList: merchantArray
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
        merchantId: this.queryForm.merchantId === '-1' ? '' : this.queryForm.merchantId,
        goodsName: this.queryForm.goodsName,
        orderStatus: this.queryForm.orderStatus === '-1' ? '' : this.queryForm.orderStatus,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      dailyStatistics(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    orderStatusFormatter(row) {
      const item = this.orderStatusArray.find(item => item.value === row.orderStatus)
      return item ? item.label : row.orderStatus
    }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
