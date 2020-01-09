<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="物品名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="addBtnHandle">扫码退货</el-button>
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
        highlight-current-row
      >
        <el-table-column prop="wayBillNo" label="运单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="changeWayBillNo" label="换单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="createTime" label="扫码操作时间" width="90" align="center">
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

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="addFormVisible">
      <el-form :model="addForm" :inline="true" label-width="120px" @submit.native.prevent>
        <el-form-item label="运单号">
          <el-input
            v-model="addForm.wayBillNo"
            placeholder=""
            ref="wayBillInput"
            @keyup.enter.native="addHandle"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, add } from '@/api/refund.js'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {},
      addForm: {
        wayBillNo: ''
      },
      addFormVisible: false
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
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        expressType: this.queryForm.expressType,
        goodsName: this.queryForm.goodsName
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 扫码操作开始 */
    addBtnHandle() {
      this.addFormVisible = true

      this.addForm.wayBillNo = ''
      this.$nextTick(function() {
        this.$refs['wayBillInput'].focus()
      })
    },
    addHandle() {
      const param = {
        wayBillNo: this.addForm.wayBillNo
      }
      add(param).then(res => {
        this.addFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    }
    /** 扫码操作结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
