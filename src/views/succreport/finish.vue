<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="queryForm.agentId" placeholder="代理商">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
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
        <el-table-column prop="finishDate" label="妥投日期" align="center"> </el-table-column>
        <el-table-column prop="jdNum" label="京东妥投数" align="center"> </el-table-column>
        <el-table-column prop="jdAmount" label="京东妥投金额" align="center"> </el-table-column>
        <el-table-column prop="ztNum" label="中通妥投数" align="center"> </el-table-column>
        <el-table-column prop="ztAmount" label="中通妥投金额" align="center"> </el-table-column>
        <el-table-column prop="ytNum" label="圆通妥投数" align="center"> </el-table-column>
        <el-table-column prop="ytAmount" label="圆通妥投金额" align="center"> </el-table-column>
        <el-table-column prop="totalNum" label="总妥投数" align="center"> </el-table-column>
        <el-table-column prop="totalAmount" label="总妥投金额" align="center"> </el-table-column>
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
import { listPageStasticsFinish } from '@/api/waybill.js'
import { listUserAgents } from '@/api/user.js'
import { parseTime } from '@/utils'

export default {
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
        orderTimeRange: [startDate, endDate],
        agentId: '1'
      },
      dropAgents: []
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
      let startDate = ''
      let endDate = ''
      if (this.queryForm.orderTimeRange) {
        startDate = this.queryForm.orderTimeRange[0]
        endDate = this.queryForm.orderTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        agentId: this.queryForm.agentId,
        startDate: startDate,
        endDate: endDate
      }
      listPageStasticsFinish(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    listUserAgents() {
      listUserAgents().then(res => {
        this.dropAgents = res.data
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
