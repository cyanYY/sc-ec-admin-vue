<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.userName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.buyerTel" placeholder="客户手机号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.applyTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="申请开始日期"
            end-placeholder="申请结束日期"
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
        highlight-current-row
      >
        <el-table-column prop="orderNo" label="订单号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="150" align="center">
        </el-table-column>
        <el-table-column prop="userName" label="客户姓名" align="center"> </el-table-column>
        <el-table-column prop="buyerTel" label="客户电话" align="center"> </el-table-column>
        <el-table-column prop="userExpectation" label="客户期望" align="center"> </el-table-column>
        <el-table-column
          prop="applyStatus"
          label="申请状态"
          :formatter="applyStatusFormatter"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" align="center"> </el-table-column>
        <el-table-column prop="checkTime" label="审核时间" align="center"> </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="confirmBtnHandle(scope.row)" type="text" size="small"
              >同意</el-button
            >
            <el-button @click="rejectBtnHandle(scope.row)" type="text" size="small">拒绝</el-button>
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

    <el-dialog title="" :close-on-click-modal="false" :visible.sync="rejectHandleVisible">
      <el-form :model="rejectForm" label-width="160px">
        <el-form-item label="订单号">
          <el-input v-model="rejectForm.orderNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="rejectForm.orderStatus" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="拒绝理由">
          <el-select v-model="rejectForm.rejectReason" placeholder="">
            <el-option label="1" value="未收到货(未填写退货单号)"></el-option>
            <el-option label="2" value="退货与原订单不符(商品不符,退货地址不符)"></el-option>
            <el-option
              label="3"
              value="退货商品影响二次销售,订单超出售后时效(订单完成超7天)"
            ></el-option>
            <el-option label="4" value="买家误操作/取消申请"></el-option>
            <el-option label="5" value="已与买家协商补偿,包括差价,赠品,额外补偿"></el-option>
            <el-option label="6" value="已与买家协商补发商品,已与买家协商换货"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片:">
          <el-upload
            class="avatar-uploader"
            :action="this.baseURL + '/file/uploadImg'"
            :show-file-list="false"
            :on-success="uploadImgSuccess"
            :before-upload="beforeImgUpload"
          >
            <img v-if="rejectForm.rejectAttach" :src="rejectForm.rejectAttach" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleExceptionCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { reFundListPage, agreeRefund, refuseRefund } from '@/api/order.js'

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
      queryForm: {
        applyTimeRange: []
      },
      rejectHandleVisible: false,
      rejectForm: {
        orderNo: '',
        orderStatus: '',
        rejectReason: '',
        rejectAttach: ''
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
      let applyTimeStart = ''
      let applyTimeEnd = ''
      if (this.queryForm.applyTimeRange) {
        applyTimeStart = this.queryForm.applyTimeRange[0]
        applyTimeEnd = this.queryForm.applyTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        orderNo: this.queryForm.orderNo,
        userName: this.queryForm.userName,
        buyerTel: this.queryForm.buyerTel,
        applyTimeStart: applyTimeStart,
        applyTimeEnd: applyTimeEnd
      }
      reFundListPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    applyStatusFormatter(row) {
      switch (row.applyStatus) {
        case '6':
          return '待审核'
        case '7':
          return '待收货'
        case '8':
          return '未解决'
        case '9':
          return '已完成'
        case '23':
          return '待审核'
        case '10':
          return '待收货'
        case '11':
          return '待收货'
        case '13':
          return '未解决'
        case '12':
          return '已完成'
        case '14':
          return '已完成'
        case '22':
          return '已完成'
        case '24':
          return '已完成'
        default:
          return row.applyStatus
      }
    },
    /** 分页查询订单结束 */

    /** 同意订单开始 */
    confirmBtnHandle(row) {
      this.$confirm('确认同意?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        const param = {
          orderNo: row.orderNo
        }
        agreeRefund(param).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryHandle()
        })
      })
    },
    /** 同意订单结束 */

    /** 拒绝处理开始 */
    rejectBtnHandle(row) {
      this.rejectHandleVisible = true
      this.rejectForm.orderNo = row.orderNo
      this.rejectForm.orderStatus = row.orderStatus
      this.rejectForm.rejectReason = ''
      this.rejectForm.rejectAttach = ''
    },
    rejectCommit() {
      const param = {
        orderNo: this.rejectForm.orderNo,
        orderStatus: this.rejectForm.orderStatus,
        rejectReason: this.rejectForm.rejectReason,
        rejectAttach: this.rejectForm.rejectAttach
      }
      refuseRefund(param).then(res => {
        this.rejectHandleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    beforeImgUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadImgSuccess(res) {
      this.rejectForm.rejectAttach = res.data.fileName
    }
    /** 拒绝处理结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 178px;
  height: 178px;
  line-height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
