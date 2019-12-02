<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.wayBillStatus" placeholder="运单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="妥投" value="妥投"></el-option>
            <el-option label="拒收" value="拒收"></el-option>
            <el-option label="客户取消" value="客户取消"></el-option>
            <el-option label="终止揽收" value="终止揽收"></el-option>
            <el-option label="订单入站" value="订单入站"></el-option>
            <el-option label="配送员收货" value="配送员收货"></el-option>
            <el-option label="协商再投结果" value="协商再投结果"></el-option>
            <el-option label="分拣中心发货" value="分拣中心发货"></el-option>
            <el-option label="分拣中心验货" value="分拣中心验货"></el-option>
            <el-option label="站点验货" value="站点验货"></el-option>
            <el-option label="站点再投" value="站点再投"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
            <el-option label="再投后退回" value="再投后退回"></el-option>
          </el-select>
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
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            v-model="queryForm.orderTimeRange"
            placeholder="下单时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle">查询</el-button>
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
        <el-table-column prop="wayBillNo" label="运单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="changeWayBillNo" label="换单号" align="center"> </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="200" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="channel" label="渠道" align="center"> </el-table-column>
        <el-table-column prop="isReject" label="是否拒收" align="center"> </el-table-column>
        <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="exceptionType" label="异常类型" align="center"> </el-table-column>
        <el-table-column prop="problemDesc" label="问题描述" width="120" align="center">
        </el-table-column>
        <el-table-column prop="processTime" label="处理时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="processStatus" label="处理状态" width="110" align="center">
        </el-table-column>
        <el-table-column prop="hangReason" label="挂起原因" width="300" align="left">
          <template slot-scope="scope">
            <ul v-if="scope.row.hangReason">
              <li :key="item.index" v-for="item in scope.row.hangReason.split(',')">
                <span>{{ item }}</span>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="option" width="130" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="wayTrace(scope.row)" type="text" size="small">轨迹</el-button>
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
      title="运单轨迹"
      :close-on-click-modal="false"
      :visible.sync="wayTraceVisible"
    >
      <div v-html="traceHtml"></div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listReceivables, trace } from '@/api/waybill-controller.js'


export default {
  name: 'Receivable',
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
        orderTimeRange: [],
        processTimeRange: []
      },
      wayTraceVisible: false,
      traceHtml: ''
    }
  },
  methods: {
    queryHandle() {
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
        orderNo: this.queryForm.orderNo,
        wayBillNo: this.queryForm.wayBillNo,
        wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus,
        goodsName: this.queryForm.goodsName,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        receiverMobile: this.queryForm.receiverMobile
      }
      listReceivables(param).then(res => {
          this.tableDataSearch = res.data.recordList
          this.total = res.data.totalCount
      })
    },
    wayTrace(row) {
      this.wayTraceVisible = true

      const param = {
        wayBillNo: row.wayBillNo
      }
      trace(param).then(res => {
        this.traceHtml = res.data ? res.data : '未查询到运单轨迹'
      })
    }
  },
  create() {

  },
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
