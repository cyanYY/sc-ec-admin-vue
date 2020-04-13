<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.goodsName"
            placeholder="商品名称"
            :editable="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="queryForm.receiverMobile"
            placeholder="收件人手机号"
            :editable="false"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
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
        <el-form-item label="">
          <el-select v-model="queryForm.merchantId" placeholder="商户">
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
          <el-select v-model="queryForm.orderStatus" placeholder="订单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="已完成" value="5"></el-option>
            <el-option label="已取消" value="4"></el-option>
          </el-select>
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
          <el-select v-model="queryForm.noOrderStatus" placeholder="订单非状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="已完成" value="5"></el-option>
            <el-option label="已取消" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.noWayBillStatus" placeholder="运单非状态">
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
          <el-select v-model="queryForm.orderType" placeholder="订单类型">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="线下" value="线下"></el-option>
            <el-option label="售后" value="售后"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.operator" placeholder="操作员" :editable="false"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
          <!-- <el-button size="small" type="info" @click="addBtnHandle">新增订单</el-button>
          <el-button size="small" type="warning" @click="uplaodBtnHandle">订单导入</el-button> -->
          <el-button size="small" type="primary" @click="offUplaodBtnHandle"
            >线下订单导入</el-button
          >
          <!-- <el-button size="small" type="warning" @click="exrUplaodBtnHandle"
            >超区订单导入</el-button
          >
          <el-button size="small" type="success" @click="exportBtnHandle">订单导出</el-button> -->
          <el-button size="small" type="primary" @click="exportInvoiceHandle">导出发货单</el-button>
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
        <el-table-column prop="merchantName" label="商户名称" width="100" align="center">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" width="150" align="center">
        </el-table-column>
        <el-table-column prop="goodsAmount" label="商品单价" align="center"> </el-table-column>
        <el-table-column prop="goodsNum" label="数量" align="center"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收款" align="center"> </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" align="center">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="150" align="center">
        </el-table-column>
        <el-table-column
          prop="payMethod"
          :formatter="payMethondFormatter"
          label="支付方式"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="expressCompany" label="快递公司" align="center"> </el-table-column>
        <el-table-column prop="wayBillNo" label="快递单号" align="center"> </el-table-column>
        <el-table-column prop="orderTime" label="订单提交时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="finishTime" label="完成时间" align="center"> </el-table-column>
        <el-table-column prop="orderStatusString" label="订单状态" align="center"></el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="userRemark" label="用户留言" align="center"> </el-table-column>
        <el-table-column prop="merchantRemark" label="商户留言" width="150" align="center">
        </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateBtnHandle(scope.row)" type="text" size="small">备注</el-button>
            <el-button @click="cancelBtnHandle(scope.row)" type="text" size="small">取消</el-button>
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
      @close="() => this.$refs['orderUpload'].clearFiles()"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="orderUploadVisible"
    >
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="选择商户">
          <el-select v-model="uploadForm.merchantId" placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="orderUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="orderUploadSuccess"
          >
            <el-button size="small">上传订单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="orderUploadLoading"
            size="small"
            type="primary"
            @click="orderUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => (this.addForm = {})"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="addFormVisible"
    >
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="订单号">
          <el-input v-model="addForm.orderNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="运单号">
          <el-input v-model="addForm.wayBillNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-input v-model="addForm.expressCompany" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="addForm.orderStatus" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="选择商户">
          <el-select v-model="addForm.merchantId" placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收件人">
          <el-input v-model="addForm.receiver" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="收件人手机号">
          <el-input v-model="addForm.receiverMobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商品信息">
          <el-input v-model="addForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-date-picker
            v-model="addForm.orderTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addOrderHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="updateFormVisible"
    >
      <el-form :model="updateForm" label-width="120px">
        <el-form-item label="订单号">{{ updateForm.orderNo }}</el-form-item>
        <el-form-item label="订单状态">{{ updateForm.orderStatusString }}</el-form-item>
        <el-form-item label="备注">
          <el-input v-model="updateForm.merchantRemark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateOrderHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => this.$refs['offOrderUpload'].clearFiles()"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="offOrderUploadVisible"
    >
      <el-form :model="offOrderUploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            ref="offOrderUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="offOrderUploadSuccess"
          >
            <el-button size="small">上传线下订单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="offOrderUploadLoading"
            size="small"
            type="primary"
            @click="offOrderUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => this.$refs['exrOrderUpload'].clearFiles()"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="exrOrderUploadVisible"
    >
      <el-form :model="exrOrderUploadForm" label-width="120px">
        <el-form-item label="选择商户">
          <el-select v-model="exrOrderUploadForm.merchantId" placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="exrOrderUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="exrOrderUploadSuccess"
          >
            <el-button size="small">上传超区订单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="exrOrderUploadLoading"
            size="small"
            type="primary"
            @click="exrOrderUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title="导出发货单"
      :close-on-click-modal="false"
      :visible.sync="exportInvoiceVisible"
    >
      <el-form :model="exrOrderUploadForm" label-width="120px">
        <el-form-item label="选择商户">
          <el-select v-model="exportInvoiceForm.merchantId" placeholder="" @change="merchantChange">
            <el-option
              v-for="item in exportMerchantList"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="exportInvoiceForm.payMethod" placeholder="" @change="merchantChange">
            <el-option label="货到付款" value="0"></el-option>
            <el-option label="在线支付" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品">
          <el-select v-model="exportInvoiceForm.goodsId" placeholder="">
            <el-option
              v-for="item in exportGoodsList"
              :key="item.goodsId"
              :label="item.goodsName"
              :value="item.goodsId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择快递">
          <el-select v-model="exportInvoiceForm.expressType" placeholder="">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="exportInvoiceForm.orderTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            :loading="exportInvoiceLoading"
            @click="exportInvoice"
            >确认导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      width="70%"
      title="取消订单"
      :close-on-click-modal="false"
      :visible.sync="cancelFormVisible"
    >
      <el-card header="订单信息">
        <el-row :gutter="10">
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单号：</label>
              <div class="el-form-item__content">{{ cancelForm.orderNo }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商户名称</label>
              <div class="el-form-item__content">
                {{ cancelForm.merchantName }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">商品名称</label>
              <div class="el-form-item__content">
                {{ cancelForm.goodsName }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">下单时间：</label>
              <div class="el-form-item__content">
                {{ cancelForm.orderTime }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人：</label>
              <div class="el-form-item__content">{{ cancelForm.receiver }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人手机号：</label>
              <div class="el-form-item__content">{{ cancelForm.receiverMobile }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">收件人地址：</label>
              <div class="el-form-item__content">{{ cancelForm.receiverAddress }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">实收款：</label>
              <div class="el-form-item__content">{{ cancelForm.actualAmount }}</div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">支付方式</label>
              <div class="el-form-item__content">
                {{ payMethondFormatter({ payMethod: cancelForm.payMethod }) }}
              </div>
            </div></el-col
          >
          <el-col :span="8"
            ><div>
              <label class="el-form-item__label">订单状态：</label>
              <div class="el-form-item__content">{{ cancelForm.orderStatusString }}</div>
            </div></el-col
          >
        </el-row>
      </el-card>
      <div style="margin-top: 10px; text-align: right;">
        <el-button size="small" type="primary" @click="cancelHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import {
  listPage,
  uploadOrder,
  addOrder,
  uploadOffOrder,
  uploadExrOrder,
  exportMerchant,
  exportGoodsId,
  orderRepeatCancel,
  remarkOrder
} from '@/api/order.js'
import axios from 'axios'
import { merchantArray, expressArray } from '@/utils/const'

export default {
  name: 'Waybill',
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
        orderTimeRange: [],
        merchantId: '-1'
      },
      orderUploadVisible: false,
      orderFileName: '',
      orderUploadLoading: false,
      uploadForm: {},
      addForm: {},
      updateForm: {
        orderNo: '',
        orderStatus: '',
        merchantRemark: ''
      },
      addFormVisible: false,
      updateFormVisible: false,
      offOrderUploadVisible: false,
      offOrderFileName: '',
      offOrderUploadLoading: false,
      offOrderUploadForm: {},
      exrOrderUploadVisible: false,
      exrOrderFileName: '',
      exrOrderUploadLoading: false,
      exrOrderUploadForm: {},
      merchantList: merchantArray,
      expressArray: expressArray,
      exportInvoiceVisible: false,
      exportInvoiceLoading: false,
      exportInvoiceForm: {
        merchantId: '',
        goodsId: '',
        payMethod: '',
        orderTimeRange: [],
        expressType: '1'
      },
      exportMerchantList: [],
      exportGoodsList: [],
      cancelFormVisible: false,
      cancelForm: {
        orderNo: '',
        merchantName: '',
        goodsName: '',
        orderTime: '',
        receiver: '',
        receiverMobile: '',
        receiverAddress: '',
        actualAmount: '',
        payMethod: '',
        orderStatusString: ''
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
        goodsName: this.queryForm.goodsName,
        receiverMobile: this.queryForm.receiverMobile,
        wayBillNo: this.queryForm.wayBillNo,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        merchantId: this.queryForm.merchantId === '-1' ? '' : this.queryForm.merchantId,
        orderStatus: this.queryForm.orderStatus === '-1' ? '' : this.queryForm.orderStatus,
        wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus,
        noOrderStatus: this.queryForm.noOrderStatus === '-1' ? '' : this.queryForm.noOrderStatus,
        noWayBillStatus:
          this.queryForm.noWayBillStatus === '-1' ? '' : this.queryForm.noWayBillStatus,
        orderType: this.queryForm.orderType === '-1' ? '' : this.queryForm.orderType,
        operator: this.queryForm.operator
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    payMethondFormatter(row) {
      switch (row.payMethod) {
        case '0':
          return '货到付款'
        case '1':
          return '在线支付'
        case '2':
          return '在线支付'
        default:
          return row.payMethod
      }
    },
    /** 分页查询订单结束 */

    /** 订单导入开始 */
    uplaodBtnHandle() {
      this.orderUploadVisible = true
    },
    orderUploadSuccess(res) {
      this.orderFileName = res.data.fileName
    },
    orderUploadHandle() {
      if (!this.orderFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.orderFileName,
        merchantId: this.uploadForm.merchantId
      }
      this.orderUploadLoading = true
      uploadOrder(param)
        .then(res => {
          this.orderUploadLoading = false
          this.orderUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.queryBtnHandle()
        })
        .catch(() => {
          this.orderUploadLoading = false
        })
    },
    /** 订单导入结束 */

    /** 订单导出开始 */
    exportBtnHandle() {
      this.$confirm('确认导出订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let orderTimeStart = ''
        let orderTimeEnd = ''
        if (this.queryForm.orderTimeRange) {
          orderTimeStart = this.queryForm.orderTimeRange[0]
          orderTimeEnd = this.queryForm.orderTimeRange[1]
        }
        var param = {
          orderNo: this.queryForm.orderNo,
          goodsName: this.queryForm.goodsName,
          receiverMobile: this.queryForm.receiverMobile,
          wayBillNo: this.queryForm.wayBillNo,
          orderTimeStart: orderTimeStart,
          orderTimeEnd: orderTimeEnd,
          merchantId: this.queryForm.merchantId === '-1' ? '' : this.queryForm.merchantId,
          orderStatus: this.queryForm.orderStatus === '-1' ? '' : this.queryForm.orderStatus,
          wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus,
          noOrderStatus: this.queryForm.noOrderStatus === '-1' ? '' : this.queryForm.noOrderStatus,
          noWayBillStatus:
            this.queryForm.noWayBillStatus === '-1' ? '' : this.queryForm.noWayBillStatus,
          orderType: this.queryForm.orderType === '-1' ? '' : this.queryForm.orderType
        }
        axios({
          method: 'post',
          url: this.baseURL + '/wayBill/exportOrder',
          data: param,
          responseType: 'blob'
        }).then(res => {
          const fileName = '导出订单.xls'
          const blob = new Blob([res.data], { type: 'application/xls' })
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        })
      })
    },
    /** 订单导出结束 */

    /** 导出发货单开始 */
    exportInvoiceHandle() {
      this.exportInvoiceVisible = true
      this.exportInvoiceForm.merchantId = ''
      this.exportInvoiceForm.payMethod = ''
      this.exportInvoiceForm.goodsId = ''
      this.exportInvoiceForm.expressType = '1'
      this.exportInvoiceForm.orderTimeRange = []

      exportMerchant({}).then(res => {
        this.exportMerchantList = res.data
      })
    },
    merchantChange() {
      this.exportInvoiceForm.goodsId = ''
      const merchantId = this.exportInvoiceForm.merchantId
      const payMethod = this.exportInvoiceForm.payMethod
      if (!merchantId || !payMethod) {
        return
      }
      const param = {
        merchantId: merchantId,
        payMethod: payMethod
      }
      exportGoodsId(param).then(res => {
        this.exportGoodsList = res.data
      })
    },
    exportInvoice() {
      this.exportInvoiceLoading = true
      let orderTimeStart = ''
      let orderTimeEnd = ''
      if (this.exportInvoiceForm.orderTimeRange) {
        orderTimeStart = this.exportInvoiceForm.orderTimeRange[0]
        orderTimeEnd = this.exportInvoiceForm.orderTimeRange[1]
      }
      var param = {
        merchantId: this.exportInvoiceForm.merchantId,
        payMethod: this.exportInvoiceForm.payMethod,
        goodsId: this.exportInvoiceForm.goodsId,
        expressType: this.exportInvoiceForm.expressType,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd
      }
      axios({
        method: 'post',
        url: this.baseURL + '/order/exportInvoice',
        data: param,
        responseType: 'blob'
      })
        .then(res => {
          this.exportInvoiceLoading = false
          const fileName = '发货单.xls'
          const blob = new Blob([res.data], { type: 'application/xls' })
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
          this.exportInvoiceVisible = false
        })
        .catch(error => {
          this.$message({
            message: error,
            type: 'error'
          })
          this.exportInvoiceLoading = false
        })
    },
    /** 导出发货单结束 */

    /** 新增订单开始 */
    addBtnHandle() {
      this.addFormVisible = true
    },
    addOrderHandle() {
      var param = {
        orderNo: this.addForm.orderNo,
        wayBillNo: this.addForm.wayBillNo,
        expressCompany: this.addForm.expressCompany,
        orderStatus: this.addForm.orderStatus,
        merchantId: this.addForm.merchantId,
        receiver: this.addForm.receiver,
        receiverMobile: this.addForm.receiverMobile,
        goodsName: this.addForm.goodsName,
        orderTime: this.addForm.orderTime
      }
      addOrder(param).then(res => {
        this.addFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 新增订单结束 */

    /** 修改订单开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.orderNo = row.orderNo
      this.updateForm.orderStatusString = row.orderStatusString
      this.updateForm.merchantRemark = row.merchantRemark
    },
    updateOrderHandle() {
      var param = {
        orderNo: this.updateForm.orderNo,
        merchantRemark: this.updateForm.merchantRemark
      }
      remarkOrder(param).then(res => {
        this.updateFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 修改订单结束 */

    /** 取消订单开始 */
    cancelBtnHandle(row) {
      this.cancelFormVisible = true

      this.cancelForm.orderNo = row.orderNo
      this.cancelForm.merchantName = row.merchantName
      this.cancelForm.goodsName = row.goodsName
      this.cancelForm.orderTime = row.orderTime
      this.cancelForm.receiver = row.receiver
      this.cancelForm.receiverMobile = row.receiverMobile
      this.cancelForm.receiverAddress = row.receiverAddress
      this.cancelForm.actualAmount = row.actualAmount
      this.cancelForm.payMethod = row.payMethod
      this.cancelForm.orderStatusString = row.orderStatusString
    },
    cancelHandle() {
      const param = [this.cancelForm.orderNo]
      orderRepeatCancel(param).then(res => {
        this.cancelFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 取消订单结束 */

    /** 线下订单导入开始 */
    offUplaodBtnHandle() {
      this.offOrderUploadVisible = true
    },
    offOrderUploadSuccess(res) {
      this.offOrderFileName = res.data.fileName
    },
    offOrderUploadHandle() {
      if (!this.offOrderFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.offOrderFileName
      }
      this.offOrderUploadLoading = true
      uploadOffOrder(param)
        .then(res => {
          this.offOrderUploadLoading = false
          this.offOrderUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.queryBtnHandle()
        })
        .catch(() => {
          this.offOrderUploadLoading = false
        })
    },
    /** 线下订单导入结束 */

    /** 超区订单导入开始 */
    exrUplaodBtnHandle() {
      this.exrOrderUploadVisible = true
    },
    exrOrderUploadSuccess(res) {
      this.exrOrderFileName = res.data.fileName
    },
    exrOrderUploadHandle() {
      if (!this.exrOrderFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.exrOrderFileName,
        merchantId: this.exrOrderUploadForm.merchantId
      }
      this.exrOrderUploadLoading = true
      uploadExrOrder(param)
        .then(res => {
          this.exrOrderUploadLoading = false
          this.exrOrderUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.queryBtnHandle()
        })
        .catch(() => {
          this.exrOrderUploadLoading = false
        })
    }
    /** 超区订单导入结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    // this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
