<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.expressType" clearable placeholder="快递类型">
            <el-option label="京东快递" value="1"></el-option>
            <el-option label="德邦快递" value="2"></el-option>
            <el-option label="韵达快递" value="3"></el-option>
            <el-option label="中通快递" value="4"></el-option>
            <el-option label="圆通快递" value="5"></el-option>
            <el-option label="顺丰快递" value="6"></el-option>
          </el-select>
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
        <el-form-item label="">
          <el-select v-model="queryForm.checkedStatus" clearable placeholder="结算状态">
            <el-option label="未结算" value="1"></el-option>
            <el-option label="已结算" value="2"></el-option>
            <el-option label="结算金额不一致" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="wayBillUploadHandle">结算单导入</el-button>
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
        <el-table-column prop="wayBillNo" label="运单号" align="center"> </el-table-column>
        <el-table-column prop="orderNo" label="订单号" align="center"> </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="goodsName" width="180" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column
          prop="isChecked"
          label="是否结算"
          :formatter="isCheckedFormatter"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="checkedCollectionFee" label="结算金额" align="center">
        </el-table-column>
        <el-table-column prop="checkTime" width="90" label="结算导入时间" align="center">
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
      @close="wayBillUploadClose"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillUploadVisible"
    >
      <el-form>
        <el-form-item label="快递类型：">
          <el-select v-model="waybillUploadForm.expressType" placeholder="">
            <el-option label="京东快递" value="1"></el-option>
            <el-option label="德邦快递" value="2"></el-option>
            <el-option label="韵达快递" value="3"></el-option>
            <el-option label="中通快递" value="4"></el-option>
            <el-option label="圆通快递" value="5"></el-option>
            <el-option label="顺丰快递" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="wayBillUpload"
            :limit="1"
            :multiple="false"
            :action="this.baseURL + '/file/upload'"
            :on-success="waybillUploadSuccess"
          >
            <el-button size="small">上传运单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="waybillUploadLoading"
            size="small"
            type="primary"
            @click="waybillUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { listPage, upload } from '@/api/wayBillCheck.js'

export default {
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
      waybillUploadVisible: false,
      waybillFileName: '',
      waybillUploadLoading: false,
      waybillUploadForm: {
        expressType: ''
      }
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
      let startDate = ''
      let endDate = ''
      if (this.queryForm.orderTimeRange) {
        startDate = this.queryForm.orderTimeRange[0]
        endDate = this.queryForm.orderTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        wayBillNo: this.queryForm.wayBillNo,
        startDate: startDate,
        endDate: endDate,
        receiverMobile: this.queryForm.receiverMobile,
        expressType: this.queryForm.expressType,
        checkedStatus: this.queryForm.checkedStatus
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    isCheckedFormatter(row) {
      switch (row.isChecked) {
        case '1':
          return '已结算'
        case '0':
          return '未结算'
        default:
          return row.isChecked
      }
    },
    wayBillUploadHandle() {
      this.waybillUploadVisible = true
    },
    wayBillUploadClose() {
      this.$refs['wayBillUpload'].clearFiles()
      this.waybillUploadForm.expressType = ''
    },
    waybillUploadSuccess(res) {
      this.waybillFileName = res.data.fileName
    },
    waybillUploadHandle() {
      if (!this.waybillFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        expressType: this.waybillUploadForm.expressType,
        fileName: this.waybillFileName
      }
      this.waybillUploadLoading = true
      upload(param)
        .then(res => {
          this.waybillUploadLoading = false
          this.waybillUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.queryHandle()
        })
        .catch(() => {
          this.waybillUploadLoading = false
        })
    }
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
