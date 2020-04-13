<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.wayBillNo"
            placeholder="运单号"
            @keyup.enter.native="queryHandle(1)"
          ></el-input>
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
          <el-input
            v-model="queryForm.receiverMobile"
            placeholder="收件人手机号"
            @keyup.enter.native="queryHandle(1)"
          ></el-input>
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
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.processTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="处理开始日期"
            end-placeholder="处理结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.processStatus" placeholder="处理状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="未处理" value="未处理"></el-option>
            <el-option label="未处理|挂起" value="未处理|挂起"></el-option>
            <el-option label="已处理|未提交" value="已处理|未提交"></el-option>
            <el-option label="已处理|已提交" value="已处理|已提交"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.deliveryMobile" placeholder="快递员手机号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.intentionLevel" placeholder="用户签收意向">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.hangReason" placeholder="挂起原因">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="客户联系不上" value="客户联系不上"></el-option>
            <el-option label="客户要求自提" value="客户要求自提"></el-option>
            <el-option
              label="客户要求快递员再次配送，已经与快递沟通"
              value="客户要求快递员再次配送，已经与快递沟通"
            ></el-option>
            <el-option
              label="客户同意签收，快递联系不上"
              value="客户同意签收，快递联系不上"
            ></el-option>
            <el-option
              label="快递未配送，客户要求再次配送"
              value="快递未配送，客户要求再次配送"
            ></el-option>
            <el-option label="客户要求延期配送" value="客户要求延期配送"></el-option>
            <el-option label="其他原因" value="其他原因"></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
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
        :row-class-name="tableRowClassName"
        highlight-current-row
      >
        <el-table-column prop="wayBillNo" label="运单号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="expressType"
          label="快递类型"
          align="center"
          :formatter="expressTypeFormatter"
        >
        </el-table-column>
        <el-table-column prop="hangReason" label="挂起原因" width="250" align="left">
          <template slot-scope="scope">
            <ol v-if="scope.row.hangReason">
              <li :key="item.index" v-for="item in scope.row.hangReason.split(',')">
                <span>{{ item }}</span>
              </li>
            </ol>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
          <template slot-scope="scope">
            <el-button @click="copy(scope.row.receiverMobile)" type="text" size="small">{{
              scope.row.receiverMobile
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column prop="channel" label="渠道" align="center"> </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="intentionLevel" label="用户签收意向" align="center">
        </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="processStatus" label="处理状态" width="110" align="center">
        </el-table-column>
        <el-table-column prop="processTime" label="处理时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="changeWayBillNo" label="换单号" align="center"> </el-table-column>
        <el-table-column prop="isReject" label="是否拒收" align="center"> </el-table-column>
        <el-table-column prop="exceptionType" label="异常类型" align="center"> </el-table-column>
        <el-table-column prop="problemDesc" label="问题描述" width="250" align="center">
        </el-table-column>
        <el-table-column prop="auditOpinion" label="审核意见" width="120" align="center">
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
import { listUserFinish, trace } from '@/api/waybill.js'
import { listUserAgents } from '@/api/user.js'
import { parseTime } from '@/utils/index'
import { expressArray } from '@/utils/const'

export default {
  name: 'ExceptionFinish',
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
      traceHtml: '',
      dropAgents: [],
      expressArray: expressArray
    }
  },
  methods: {
    queryHandle(page) {
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
      let processTimeStart = ''
      let processTimeEnd = ''
      if (this.queryForm.orderTimeRange) {
        orderTimeStart = this.queryForm.orderTimeRange[0]
        orderTimeEnd = this.queryForm.orderTimeRange[1]
      }
      if (this.queryForm.processTimeRange) {
        processTimeStart = this.queryForm.processTimeRange[0]
        processTimeEnd = this.queryForm.processTimeRange[1]
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
        processTimeStart: processTimeStart,
        processTimeEnd: processTimeEnd,
        receiverMobile: this.queryForm.receiverMobile,
        processStatus: this.queryForm.processStatus === '-1' ? '' : this.queryForm.processStatus,
        deliveryMobile: this.queryForm.deliveryMobile,
        intentionLevel: this.queryForm.intentionLevel === '-1' ? '' : this.queryForm.intentionLevel,
        hangReason: this.queryForm.hangReason === '-1' ? '' : this.queryForm.hangReason,
        agentId: this.queryForm.agentId
      }
      listUserFinish(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    tableRowClassName({ row }) {
      const currentDate = parseTime(new Date(), '{y}-{m}-{d}')
      const processDate = row.processTime && row.processTime.substr(0, 10)
      if (currentDate === processDate) {
        return 'success-row'
      }
      return ''
    },
    copy(value) {
      this.$copyText(value).then(
        () => {
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1000
          })
        },
        () => {
          this.$message({
            message: '复制失败，请手动复制',
            type: 'error',
            duration: 1000
          })
        }
      )
    },
    wayTrace(row) {
      this.traceHtml = '查询中...'
      this.wayTraceVisible = true

      const param = {
        wayBillNo: row.wayBillNo
      }
      trace(param).then(res => {
        this.traceHtml = res.data ? res.data : '未查询到运单轨迹'
      })
    },
    listUserAgents() {
      listUserAgents().then(res => {
        this.dropAgents = res.data
      })
    },
    expressTypeFormatter(row) {
      const item = this.expressArray.find(item => item.value === row.expressType)
      return item ? item.label : row.expressType
    }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
    this.listUserAgents()
  }
}
</script>

<style lang="scss" scoped>
.el-table >>> .success-row {
  background: #f0f9eb;
}
</style>
