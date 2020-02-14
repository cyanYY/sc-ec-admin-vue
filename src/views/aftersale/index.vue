<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.merchantName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.userName" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.buyerTel" placeholder="客户手机号"></el-input>
        </el-form-item>
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
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div>
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
        <el-table-column prop="merchantName" label="商户名称" align="center"> </el-table-column>
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
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleBtnHandle(scope.row)" type="text" size="small">处理</el-button>
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>
    <div v-if="total > 0">
      <Pagination
        :total="total"
        :perpages="perpageNumber"
        :currentPage="currentPage"
        @currentPage="getCurrentPage"
      ></Pagination>
    </div>

    <el-dialog
      width="70%"
      title="退货处理"
      :close-on-click-modal="false"
      :visible.sync="returnHandleVisible"
    >
      <el-card header="订单信息">
        <el-row :gutter="10">
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单号：</label>
              <div class="el-form-item__content">{{ returnInfo.orderNo }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">申请状态：</label>
              <div class="el-form-item__content">
                {{ applyStatusFormatter({ applyStatus: returnInfo.applyStatus }) }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">申请时间：</label>
              <div class="el-form-item__content">{{ returnInfo.applyTime }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">客户姓名：</label>
              <div class="el-form-item__content">{{ returnInfo.userName }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">客户电话：</label>
              <div class="el-form-item__content">{{ returnInfo.buyerTel }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">下单时间：</label>
              <div class="el-form-item__content">{{ returnInfo.orderTime }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商户名称：</label>
              <div class="el-form-item__content">{{ returnInfo.merchantName }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商品名称：</label>
              <div class="el-form-item__content">{{ returnInfo.goodsName }}</div>
            </div></el-col
          >
        </el-row>
      </el-card>
      <div style="margin-top: 10px; text-align: right;">
        <el-button size="small" type="success" @click="agreeReturnHandle">同意退货</el-button>
        <el-button size="small" type="primary" @click="refuseReturnHandle">拒绝退货</el-button>
      </div>
    </el-dialog>

    <el-dialog title="拒绝退货" :close-on-click-modal="false" :visible.sync="returnVisible">
      <el-form :model="returnForm" label-width="160px">
        <el-form-item label="拒绝原因">
          <el-select v-model="returnForm.reason" placeholder="">
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
        <el-form-item label="图片凭证:">
          <el-upload
            class="avatar-uploader"
            :action="this.baseURL + '/file/uploadImg'"
            :show-file-list="false"
            :on-success="returnImgSuccess"
            :before-upload="beforeImgUpload"
          >
            <img v-if="returnForm.img" :src="returnForm.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="color: red;">
          请核对您上传的图片信息 收件人：{{ returnForm.userName }},订单号：{{ returnForm.orderNo }}
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="returnCommit">确定拒绝</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      width="70%"
      title="退款处理"
      :close-on-click-modal="false"
      :visible.sync="refundHandleVisible"
    >
      <el-card header="订单信息">
        <el-row :gutter="10">
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单号：</label>
              <div class="el-form-item__content">{{ refundInfo.orderNo }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单状态：</label>
              <div class="el-form-item__content">{{ refundInfo.orderStatus }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">申请时间：</label>
              <div class="el-form-item__content">{{ refundInfo.applyTime }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">客户姓名：</label>
              <div class="el-form-item__content">{{ refundInfo.userName }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">客户电话：</label>
              <div class="el-form-item__content">{{ refundInfo.buyerTel }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">下单时间：</label>
              <div class="el-form-item__content">{{ refundInfo.orderTime }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商户名称：</label>
              <div class="el-form-item__content">{{ refundInfo.merchantName }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商品名称：</label>
              <div class="el-form-item__content">{{ refundInfo.goodsName }}</div>
            </div></el-col
          >
        </el-row>
      </el-card>
      <el-card header="售后日志" style="margin-top: 10px">
        <el-table :data="afterSaleData" size="mini" center>
          <el-table-column prop="operType" label="操作类型" align="center"> </el-table-column>
          <el-table-column prop="operContent" label="操作内容" width="150" align="center">
          </el-table-column>
          <el-table-column prop="operator" label="操作人" align="center"> </el-table-column>
          <el-table-column prop="operTime" label="操作时间" align="center"> </el-table-column>
        </el-table>
      </el-card>
      <div style="margin-top: 10px; text-align: right;">
        <el-button size="small" type="success" @click="agreeRefundHandle">同意退款</el-button>
        <el-button size="small" type="primary" @click="refuseRefundHandle">拒绝退款</el-button>
      </div>
    </el-dialog>

    <el-dialog title="拒绝退款" :close-on-click-modal="false" :visible.sync="refundVisible">
      <el-form :model="refundForm" label-width="160px">
        <el-form-item label="拒绝原因">
          <el-select v-model="refundForm.reason" placeholder="">
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
        <el-form-item label="图片凭证:">
          <el-upload
            class="avatar-uploader"
            :action="this.baseURL + '/file/uploadImg'"
            :show-file-list="false"
            :on-success="refundImgSuccess"
            :before-upload="beforeImgUpload"
          >
            <img v-if="refundForm.img" :src="refundForm.img" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item style="color: red;">
          请核对您上传的图片信息 收件人：{{ refundForm.userName }},订单号：{{ refundForm.orderNo }}
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="refundCommit">确定拒绝</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import {
  reFundListPage,
  agreeReturn,
  refuseReturn,
  agreeRefund,
  refuseRefund
} from '@/api/order.js'

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
      returnHandleVisible: false,
      returnInfo: {
        orderNo: '',
        orderStatus: '',
        applyTime: '',
        userName: '',
        buyerTel: '',
        orderTime: '',
        merchantName: '',
        goodsName: ''
      },
      refundHandleVisible: false,
      refundInfo: {
        orderNo: '',
        orderStatus: '',
        applyTime: '',
        userName: '',
        buyerTel: '',
        orderTime: '',
        merchantName: '',
        goodsName: ''
      },
      afterSaleData: [],
      returnVisible: false,
      returnForm: {
        orderNo: '',
        userName: '',
        reason: '',
        img: ''
      },
      refundVisible: false,
      refundForm: {
        orderNo: '',
        userName: '',
        reason: '',
        img: ''
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
        orderNo: this.queryForm.orderNo,
        merchantName: this.queryForm.merchantName,
        goodsName: this.queryForm.goodsName,
        userName: this.queryForm.userName,
        buyerTel: this.queryForm.buyerTel,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
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

    handleBtnHandle(row) {
      if (row.userExpectation === '退货') {
        this.returnHandleVisible = true

        this.returnInfo.orderNo = row.orderNo
        this.returnInfo.orderStatus = row.orderStatus
        this.returnInfo.applyTime = row.applyTime
        this.returnInfo.userName = row.userName
        this.returnInfo.buyerTel = row.buyerTel
        this.returnInfo.orderTime = row.orderTime
        this.returnInfo.merchantName = row.merchantName
        this.returnInfo.goodsName = row.goodsName
      } else if (row.userExpectation === '待退款') {
        this.refundHandleVisible = true

        this.refundInfo.orderNo = row.orderNo
        this.refundInfo.orderStatus = row.orderStatus
        this.refundInfo.applyTime = row.applyTime
        this.refundInfo.userName = row.userName
        this.refundInfo.buyerTel = row.buyerTel
        this.refundInfo.orderTime = row.orderTime
        this.refundInfo.merchantName = row.merchantName
        this.refundInfo.goodsName = row.goodsName
        // TODO 获取售后日志信息
      }
    },

    /** 同意退货开始 */
    agreeReturnHandle() {
      const param = {
        orderNo: this.returnInfo.orderNo
      }
      agreeReturn(param).then(res => {
        this.returnHandleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 同意退货结束 */

    /** 拒绝退货开始 */
    refuseReturnHandle() {
      this.returnVisible = true
      this.returnForm.orderNo = this.returnInfo.orderNo
      this.returnForm.userName = this.returnInfo.userName
      this.returnForm.reason = ''
      this.returnForm.img = ''
    },
    returnCommit() {
      const param = {
        orderNo: this.returnForm.orderNo,
        reason: this.returnForm.reason,
        img: this.returnForm.img
      }
      refuseReturn(param).then(res => {
        this.returnVisible = false
        this.returnHandleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
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
    returnImgSuccess(res) {
      this.returnForm.img = res.data.fileName
    },
    /** 拒绝退货结束 */

    /** 同意退款开始 */
    agreeRefundHandle() {
      const param = {
        orderNo: this.refundInfo.orderNo
      }
      agreeRefund(param).then(res => {
        this.refundHandleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 同意退款结束 */

    /** 拒绝退货开始 */
    refuseRefundHandle() {
      this.refundVisible = true
      this.refundForm.orderNo = this.refundInfo.orderNo
      this.refundForm.userName = this.refundInfo.userName
      this.refundForm.reason = ''
      this.refundForm.img = ''
    },
    refundCommit() {
      const param = {
        orderNo: this.refundForm.orderNo,
        reason: this.refundForm.reason,
        img: this.refundForm.img
      }
      refuseRefund(param).then(res => {
        this.refundVisible = false
        this.refundHandleVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    refundImgSuccess(res) {
      this.refundForm.img = res.data.fileName
    }
    /** 拒绝退款结束 */
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
