<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.orderTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="订单开始日期"
            end-placeholder="订单结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle">查询</el-button>
          <el-button size="small" type="warning" @click="uplaodBtnHandle">账单导入</el-button>
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
        <el-table-column prop="merchantName" label="商户名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" label="订单时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="chargeTime" label="计费时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="wayBillNo" label="运单号" align="center"> </el-table-column>
        <el-table-column prop="platformOrderNo" label="平台订单号" align="center">
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="origin" label="始发地" align="center"> </el-table-column>
        <el-table-column prop="destination" label="目的地" align="center"> </el-table-column>
        <el-table-column prop="province" label="省份" align="center"> </el-table-column>
        <el-table-column prop="chargeWeight" label="计费重量" align="center"> </el-table-column>
        <el-table-column prop="collectingMoney" label="代收金额" align="center"> </el-table-column>
        <el-table-column prop="accountsPayable" label="应付金额" align="center"> </el-table-column>
        <el-table-column prop="orderAccount" label="下单账户" align="center"> </el-table-column>
        <el-table-column prop="sender" label="寄件人" align="center"> </el-table-column>
        <el-table-column prop="senderMobile" label="寄件号码" align="center"> </el-table-column>
        <el-table-column prop="senderAddress" label="寄件地址" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号码" align="center">
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
      @close="() => this.$refs['billUpload'].clearFiles()"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="billUploadVisible"
    >
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            ref="billUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="billUploadSuccess"
          >
            <el-button size="small">上传账单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="billUploadLoading"
            size="small"
            type="primary"
            @click="billUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPageBill, uploadBill } from '@/api/waybill-order-controller.js'

export default {
  name: 'Bill',
  components: {
    Pagination
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: []
      },
      billUploadVisible: false,
      billFileName: '',
      billUploadLoading: false,
      uploadForm: {}
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
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      listPageBill(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    /** 分页查询订单结束 */

    /** 账单导入开始 */
    uplaodBtnHandle() {
      this.billUploadVisible = true
    },
    billUploadSuccess(res) {
      this.billFileName = res.data.fileName
    },
    billUploadHandle() {
      if (!this.billFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.billFileName,
        merchantId: this.uploadForm.merchantId
      }
      this.billUploadLoading = true
      uploadBill(param).then(res => {
        this.billUploadLoading = false
        this.billUploadVisible = false
        this.$message({
          message: res.msg || '数据导入成功',
          type: 'success'
        })
        this.queryBtnHandle()
      }).catch(() => {
        this.billUploadLoading = false
      })
    }
    /** 账单导入结束 */

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
