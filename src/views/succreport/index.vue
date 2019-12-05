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
          <el-select v-model="queryForm.expressCompany" placeholder="快递公司">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="京东快递(常用)" value="京东快递(常用)"></el-option>
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
          <el-button size="small" type="primary" @click="queryBtnHandle">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="waybill-tables">
      <el-table
        height="600"
        :data="tableDataSearch"
        border
        size="mini"
        center
        style="width: 100%;font-size: 13px;"
      >
        <el-table-column prop="orderDate" label="日期" align="center"> </el-table-column>
        <el-table-column prop="merchantName" label="商户名称" align="center"> </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" align="center"> </el-table-column>
        <el-table-column prop="total" label="总数" align="center"> </el-table-column>
        <el-table-column prop="totalSuc" label="已完成" align="center"> </el-table-column>
        <el-table-column label="成功率" align="center">
          <template slot-scope="scope">
            <span>{{ ((scope.row.totalSuc * 100) / scope.row.total).toFixed(2) + '%' }}</span>
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
import { successRate } from '@/api/order.js'

export default {
  name: 'SuccReport',
  components: {
    Pagination
  },
  data() {
    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: []
      }
    }
  },
  methods: {
    /** 分页查询订单开始 */
    queryBtnHandle() {
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
        expressCompany: this.queryForm.expressCompany === '-1' ? '' : this.queryForm.expressCompany,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      successRate(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
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

<style lang="scss" scoped>
.logWork-cont {
  .logWork-tables {
    margin-top: 20px;
  }
  .logWork-pages {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
