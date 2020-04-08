<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">待发货种类：{{ stasticsData.speciesNumber }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">已出运单种类：{{ stasticsData.deliverSpeciesNumber }}</div>
            <div class="card-panel-text">已出运单数量：{{ stasticsData.deliverTotalNumber }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">发货计划：{{ stasticsData.planNumber }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-description">
            <div class="card-panel-text">采购商品种类：{{ stasticsData.buySpeciesNumber }}</div>
            <div class="card-panel-text">采购商品数量：{{ stasticsData.buyNumber }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8" style="margin-bottom: 10px;">
      <el-col :span="24">
        <el-button size="small" type="primary">生成发货单</el-button>
        <el-button size="small" type="primary" @click="buyBtnHandle">找品</el-button>
        <el-button size="small" type="primary" @click="procurementBtnHandle">采购</el-button>
        <el-button size="small" type="primary">发货地址维护</el-button>
        <el-button size="small" type="primary">商品名称维护</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="24">
        <el-card>
          <el-collapse v-model="activeNames" accordion @change="collapseChange">
            <el-collapse-item title="待发货数据" name="1">
              <el-form
                size="small"
                :inline="true"
                :model="toDeliverQueryForm"
                class="demo-form-inline"
              >
                <el-form-item label="">
                  <el-date-picker
                    v-model="toDeliverQueryForm.orderDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="下单日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="listToDeliver">查询</el-button>
                </el-form-item>
              </el-form>
              <el-table
                :summary-method="getToDeliverSummaries"
                show-summary
                stripe
                :data="toDeliverDatas"
              >
                <el-table-column label="商品名称" align="center" prop="goodsName" />
                <el-table-column label="货到付款待发货数" align="center" prop="codNum" />
                <el-table-column label="在线支付待发货数" align="center" prop="opNum" />
                <el-table-column label="总待发货数" align="center" prop="totalNum" />
                <el-table-column label="平均时长" align="center" prop="deliverDays" />
              </el-table>
            </el-collapse-item>
            <!-- <el-collapse-item title="发货数据详情" name="1">
              <el-table :data="detailDatas">
                <el-table-column label="发货日期" align="center" prop="deliverDate" />
                <el-table-column label="商品名称" align="center" prop="goodsName" />
                <el-table-column label="在线支付数量" align="center" prop="onlinePayNumber" />
                <el-table-column label="货到付款数量" align="center" prop="deliverPayNumber" />
                <el-table-column label="总待发货数量" align="center" prop="totalNumber" />
                <el-table-column label="实际发货数量" align="center" prop="deliverNumber" />
                <el-table-column label="采购数量" align="center" prop="buyNumber" />
              </el-table>
              <div class="waybill-pages" v-if="total > 0">
                <Pagination
                  :total="total"
                  :perpages="perpageNumber"
                  :currentPage="currentPage"
                  @currentPage="getCurrentPage"
                ></Pagination>
              </div>
            </el-collapse-item> -->

            <el-collapse-item title="找品数据详情" name="2">
              <el-form size="small" :inline="true" :model="buyQueryForm" class="demo-form-inline">
                <el-form-item label="">
                  <el-input
                    v-model="buyQueryForm.merchantName"
                    placeholder="商户名称"
                    :editable="false"
                  ></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-input
                    v-model="buyQueryForm.goodsName"
                    placeholder="商品名称"
                    :editable="false"
                  ></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-date-picker
                    v-model="buyQueryForm.buyDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="找品日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="buyQueryBtnHandle(1)"
                    >查询</el-button
                  >
                  <el-button size="small" type="primary" @click="buyAddBtnHandle">添加</el-button>
                </el-form-item>
              </el-form>
              <el-table :data="buyDatas">
                <el-table-column label="日期" align="center" prop="buyDate" />
                <el-table-column label="商品名称" align="center" prop="goodsName" />
                <el-table-column label="单价" align="center" prop="goodsPrice" />
                <el-table-column label="渠道来源" align="center" prop="goodsChannels" />
                <el-table-column label="联系方式" align="center" prop="mobile" />
                <el-table-column label="姓名" align="center" prop="userName" />
                <el-table-column label="商户" align="center" prop="merchantName" />
                <el-table-column label="操作员" align="center" prop="operator" />
                <el-table-column label="网址链接" align="center" width="200" prop="goodsUrl" />
                <el-table-column
                  prop="option"
                  fixed="right"
                  align="center"
                  width="100"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button @click="buyUpdateBtnHandle(scope.row)" type="text" size="small"
                      >修改</el-button
                    >
                    <el-button @click="buyDeleteBtnHandle(scope.row)" type="text" size="small"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="waybill-pages" v-if="buyTotal > 0">
                <Pagination
                  :total="buyTotal"
                  :perpages="buyPerpageNumber"
                  :currentPage="buyCurrentPage"
                  @currentPage="getBuyCurrentPage"
                ></Pagination>
              </div>
            </el-collapse-item>

            <el-collapse-item title="今日发货计划" name="3">
              <el-table :data="planDatas">
                <el-table-column label="商品名称" align="center" prop="processDate" />
                <el-table-column label="支付类型" align="center" prop="totalHandle" />
                <el-table-column label="规格" align="center" prop="newHandle" />
                <el-table-column label="数量" align="center" prop="oldHandle" />
                <el-table-column label="发货地址" align="center" prop="totalFinish" />
                <el-table-column label="发货人" align="center" prop="totalFinish" />
                <el-table-column label="快递公司" align="center" prop="totalFinish" />
              </el-table>
            </el-collapse-item>

            <el-collapse-item title="采购数据详情" name="4">
              <el-form
                size="small"
                :inline="true"
                :model="procurementQueryForm"
                class="demo-form-inline"
              >
                <el-form-item label="">
                  <el-input
                    v-model="procurementQueryForm.merchantName"
                    placeholder="商户名称"
                    :editable="false"
                  ></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-input
                    v-model="procurementQueryForm.goodsName"
                    placeholder="商品名称"
                    :editable="false"
                  ></el-input>
                </el-form-item>
                <el-form-item label="">
                  <el-date-picker
                    v-model="procurementQueryForm.purchaseDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="采购日期"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button size="small" type="primary" @click="procurementQueryBtnHandle(1)"
                    >查询</el-button
                  >
                  <el-button size="small" type="primary" @click="procurementAddBtnHandle"
                    >添加</el-button
                  >
                </el-form-item>
              </el-form>
              <el-table :data="procurementDatas" :summary-method="getSummaries" show-summary>
                <el-table-column label="采购日期" align="center" prop="purchaseDate" />
                <el-table-column label="商户名称" align="center" prop="merchantName" />
                <el-table-column label="商品名称" align="center" prop="goodsName" />
                <el-table-column label="采购数量" align="center" prop="purchaseAmount" />
                <el-table-column label="单价" align="center" prop="unitPrice" />
                <el-table-column label="总价" align="center" prop="total" />
                <el-table-column label="运费" align="center" prop="freight" />
                <el-table-column label="均价" align="center" prop="averagePrice" />
                <el-table-column label="快递公司" align="center" prop="expressCompany" />
                <el-table-column
                  label="是否到货"
                  :formatter="arrivalFmt"
                  align="center"
                  prop="arrivalGoods"
                />
                <el-table-column label="商家电话" align="center" prop="merchantMobile" />
                <el-table-column label="备注" align="center" prop="remark" />
                <el-table-column
                  prop="option"
                  fixed="right"
                  align="center"
                  width="100"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click="procurementUpdateBtnHandle(scope.row)"
                      type="text"
                      size="small"
                      >修改</el-button
                    >
                    <el-button
                      @click="procurementDeleteBtnHandle(scope.row)"
                      type="text"
                      size="small"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div class="waybill-pages" v-if="procurementTotal > 0">
                <Pagination
                  :total="procurementTotal"
                  :perpages="procurementPerpageNumber"
                  :currentPage="procurementCurrentPage"
                  @currentPage="getProcurementCurrentPage"
                ></Pagination>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      @close="() => this.$refs['buyUpload'].clearFiles()"
      size="small"
      title="找品导入"
      :close-on-click-modal="false"
      :visible.sync="buyUploadVisible"
    >
      <el-form :model="buyUploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            ref="buyUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="buyUploadSuccess"
          >
            <el-button size="small">上传找品文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="buyUploadLoading"
            size="small"
            type="primary"
            @click="buyUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => (this.buyAddForm = {})"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="buyAddVisible"
    >
      <el-form :model="buyAddForm" label-width="120px">
        <el-form-item label="商品名称">
          <el-input v-model="buyAddForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="buyAddForm.goodsPrice" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="渠道来源">
          <el-input v-model="buyAddForm.goodsChannels" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="buyAddForm.mobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="buyAddForm.userName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-select v-model="buyAddForm.merchantName" filterable placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="buyAddForm.goodsUrl" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="buyAddCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="buyUpdateVisible">
      <el-form :model="buyUpdateForm" label-width="120px">
        <el-form-item label="商品名称">
          <el-input v-model="buyUpdateForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="buyUpdateForm.goodsPrice" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="渠道来源">
          <el-input v-model="buyUpdateForm.goodsChannels" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="buyUpdateForm.mobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="buyUpdateForm.userName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="商户">
          <el-select v-model="buyUpdateForm.merchantName" filterable placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="buyUpdateForm.goodsUrl" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="buyUpdateCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => this.$refs['procurementUpload'].clearFiles()"
      size="small"
      title="采购导入"
      :close-on-click-modal="false"
      :visible.sync="procurementUploadVisible"
    >
      <el-form :model="procurementUploadForm" label-width="120px">
        <el-form-item label="选择文件">
          <el-upload
            ref="procurementUpload"
            class="upload-demo"
            :action="this.baseURL + '/file/upload'"
            :on-success="procurementUploadSuccess"
          >
            <el-button size="small">上传采购文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="procurementUploadLoading"
            size="small"
            type="primary"
            @click="procurementUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="() => (this.procurementAddForm = {})"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="procurementAddVisible"
    >
      <el-form :model="procurementAddForm" label-width="120px">
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="procurementAddForm.purchaseDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder=""
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商户">
          <el-select v-model="procurementAddForm.merchantName" filterable placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="procurementAddForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="procurementAddForm.unitPrice" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="procurementAddForm.purchaseAmount" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="运费">
          <el-input v-model="procurementAddForm.freight" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-input v-model="procurementAddForm.expressCompany" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="是否到货">
          <el-select v-model="procurementAddForm.arrivalGoods" placeholder="">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家电话">
          <el-input v-model="procurementAddForm.merchantMobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="procurementAddForm.remark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="procurementAddCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="procurementUpdateVisible"
    >
      <el-form :model="procurementUpdateForm" label-width="120px">
        <el-form-item label="采购日期">
          <el-date-picker
            v-model="procurementUpdateForm.purchaseDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder=""
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商户">
          <el-select v-model="procurementUpdateForm.merchantName" filterable placeholder="">
            <el-option
              v-for="item in merchantList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="procurementUpdateForm.goodsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="procurementUpdateForm.unitPrice" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="procurementUpdateForm.purchaseAmount" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="运费">
          <el-input v-model="procurementUpdateForm.freight" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="快递公司">
          <el-input v-model="procurementUpdateForm.expressCompany" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="是否到货">
          <el-select v-model="procurementUpdateForm.arrivalGoods" placeholder="">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家电话">
          <el-input v-model="procurementUpdateForm.merchantMobile" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="procurementUpdateForm.remark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="procurementUpdateCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { mapGetters } from 'vuex'
import {
  deliverStatistic,
  deliverDetail,
  listToDeliver,
  getBuyDetail,
  importBuyDetail,
  getProcurement,
  importProcurement,
  addBuyDetail,
  addProcurement,
  updateBuyDetail,
  deleteBuyDetail,
  updateProcurement,
  deleteProcurement
} from '@/api/deliver.js'
import { parseTime } from '@/utils'
import { merchantArray } from '@/utils/const'

export default {
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    const currentDate = parseTime(date, '{y}-{m}-{d}')

    return {
      baseURL: process.env.VUE_APP_BASE_API,
      stasticsData: {
        speciesNumber: 0,
        deliverSpeciesNumber: 0,
        deliverTotalNumber: 0,
        planNumber: 0,
        buySpeciesNumber: 0,
        buyNumber: 0
      },
      activeNames: '1',
      currentPage: 1,
      perpageNumber: 10,
      total: 0,
      detailDatas: [],
      toDeliverQueryForm: {
        orderDate: currentDate
      },
      toDeliverDatas: [],
      buyQueryForm: {},
      buyCurrentPage: 1,
      buyPerpageNumber: 10,
      buyTotal: 0,
      buyDatas: [],
      planDatas: [],
      buyUploadVisible: false,
      buyUploadLoading: false,
      buyUploadForm: {},
      buyFileName: '',
      buyAddVisible: false,
      buyAddForm: {
        goodsName: '',
        goodsPrice: '',
        goodsChannels: '',
        mobile: '',
        userName: '',
        merchantName: '',
        goodsUrl: ''
      },
      buyUpdateVisible: false,
      buyUpdateForm: {
        id: '',
        goodsName: '',
        goodsPrice: '',
        goodsChannels: '',
        mobile: '',
        userName: '',
        merchantName: '',
        goodsUrl: ''
      },
      procurementQueryForm: {},
      procurementCurrentPage: 1,
      procurementPerpageNumber: 10,
      procurementTotal: 0,
      procurementDatas: [],
      procurementUploadVisible: false,
      procurementUploadLoading: false,
      procurementUploadForm: {},
      procurementFileName: '',
      procurementAddVisible: false,
      procurementAddForm: {
        purchaseDate: '',
        merchantName: '',
        goodsName: '',
        unitPrice: '',
        purchaseAmount: '',
        freight: '',
        expressCompany: '',
        arrivalGoods: '',
        merchantMobile: '',
        remark: ''
      },
      procurementUpdateVisible: false,
      procurementUpdateForm: {
        id: '',
        purchaseDate: '',
        merchantName: '',
        goodsName: '',
        unitPrice: '',
        purchaseAmount: '',
        freight: '',
        expressCompany: '',
        arrivalGoods: '',
        merchantMobile: '',
        remark: ''
      },
      merchantList: merchantArray
    }
  },
  methods: {
    deliverStatistic() {
      const param = {}
      deliverStatistic(param).then(res => {
        if (res.data) {
          this.stasticsData = res.data
        }
      })
    },

    collapseChange(activeName) {
      switch (activeName) {
        case '1':
          this.listToDeliver()
          // this.deliverDetail(this.perpageNumber, this.currentPage)
          break
        case '2':
          this.getBuyDetail(this.buyPerpageNumber, this.buyCurrentPage)
          break
        case '3':
          break
        case '4':
          this.getProcurement(this.procurementPerpageNumber, this.procurementCurrentPage)
          break

        default:
          break
      }
    },

    listToDeliver() {
      var param = {
        orderDate: this.toDeliverQueryForm.orderDate
      }
      listToDeliver(param).then(res => {
        this.toDeliverDatas = res.data
      })
    },
    getToDeliverSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ([4].indexOf(index) != -1) {
          sums[index] = '-'
        } else {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          }
        }
      })

      return sums
    },

    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.deliverDetail(perPage, currPage)
    },
    // 异步获取数据
    deliverDetail(numPerPage, pageNum) {
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum
      }
      deliverDetail(param).then(res => {
        this.detailDatas = res.data.recordList
        this.total = res.data.totalCount
      })
    },

    buyQueryBtnHandle(page) {
      if (page) {
        this.buyCurrentPage = page
      }
      this.getBuyDetail(this.buyPerpageNumber, this.buyCurrentPage)
    },
    // 页码发生变化
    getBuyCurrentPage(perPage, currPage) {
      this.buyCurrentPage = currPage
      this.buyPerpageNumber = perPage
      this.getBuyDetail(perPage, currPage)
    },
    // 异步获取数据
    getBuyDetail(numPerPage, pageNum) {
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        merchantName: this.buyQueryForm.merchantName,
        goodsName: this.buyQueryForm.goodsName,
        buyDate: this.buyQueryForm.buyDate
      }
      getBuyDetail(param).then(res => {
        this.buyDatas = res.data.recordList
        this.buyTotal = res.data.totalCount
      })
    },

    buyAddBtnHandle() {
      this.buyAddVisible = true
    },
    buyAddCommit() {
      var param = {
        goodsName: this.buyAddForm.goodsName,
        goodsPrice: this.buyAddForm.goodsPrice,
        goodsChannels: this.buyAddForm.goodsChannels,
        mobile: this.buyAddForm.mobile,
        userName: this.buyAddForm.userName,
        merchantName: this.buyAddForm.merchantName,
        goodsUrl: this.buyAddForm.goodsUrl
      }
      addBuyDetail(param).then(res => {
        this.buyAddVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getBuyDetail(this.buyPerpageNumber, 1)
      })
    },

    buyUpdateBtnHandle(row) {
      this.buyUpdateVisible = true

      this.buyUpdateForm.id = row.id
      this.buyUpdateForm.goodsName = row.goodsName
      this.buyUpdateForm.goodsPrice = row.goodsPrice
      this.buyUpdateForm.goodsChannels = row.goodsChannels
      this.buyUpdateForm.mobile = row.mobile
      this.buyUpdateForm.userName = row.userName
      this.buyUpdateForm.merchantName = row.merchantName
      this.buyUpdateForm.goodsUrl = row.goodsUrl
    },
    buyUpdateCommit() {
      var param = {
        id: this.buyUpdateForm.id,
        goodsName: this.buyUpdateForm.goodsName,
        goodsPrice: this.buyUpdateForm.goodsPrice,
        goodsChannels: this.buyUpdateForm.goodsChannels,
        mobile: this.buyUpdateForm.mobile,
        userName: this.buyUpdateForm.userName,
        merchantName: this.buyUpdateForm.merchantName,
        goodsUrl: this.buyUpdateForm.goodsUrl
      }
      updateBuyDetail(param).then(res => {
        this.buyUpdateVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getBuyDetail(this.buyPerpageNumber, this.buyCurrentPage)
      })
    },
    buyDeleteBtnHandle(row) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBuyDetail({ id: row.id }).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getBuyDetail(this.buyPerpageNumber, this.buyCurrentPage)
        })
      })
    },

    buyBtnHandle() {
      this.buyUploadVisible = true
    },
    buyUploadSuccess(res) {
      this.buyFileName = res.data.fileName
    },
    buyUploadHandle() {
      if (!this.buyFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.buyFileName
      }
      this.buyUploadLoading = true
      importBuyDetail(param)
        .then(res => {
          this.buyUploadLoading = false
          this.buyUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.getBuyDetail(this.buyPerpageNumber, 1)
        })
        .catch(() => {
          this.buyUploadLoading = false
        })
    },

    procurementQueryBtnHandle(page) {
      if (page) {
        this.procurementCurrentPage = page
      }
      this.getProcurement(this.procurementPerpageNumber, this.procurementCurrentPage)
    },
    // 页码发生变化
    getProcurementCurrentPage(perPage, currPage) {
      this.procurementCurrentPage = currPage
      this.procurementPerpageNumber = perPage
      this.getProcurement(perPage, currPage)
    },
    // 异步获取数据
    getProcurement(numPerPage, pageNum) {
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        merchantName: this.procurementQueryForm.merchantName,
        goodsName: this.procurementQueryForm.goodsName,
        purchaseDate: this.procurementQueryForm.purchaseDate
      }
      getProcurement(param).then(res => {
        this.procurementDatas = res.data.recordList
        this.procurementTotal = res.data.totalCount
      })
    },
    arrivalFmt(row) {
      switch (row.arrivalGoods) {
        case 'Y':
          return '是'
        case 'N':
          return '否'
        default:
          return row.arrivalGoods
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ([1, 2, 8, 9, 10, 11].indexOf(index) != -1) {
          sums[index] = ''
        } else {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values
              .reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              .toFixed(2)
          }
        }
      })

      return sums
    },

    procurementAddBtnHandle() {
      this.procurementAddVisible = true
    },
    procurementAddCommit() {
      var param = {
        purchaseDate: this.procurementAddForm.purchaseDate,
        merchantName: this.procurementAddForm.merchantName,
        goodsName: this.procurementAddForm.goodsName,
        unitPrice: this.procurementAddForm.unitPrice,
        purchaseAmount: this.procurementAddForm.purchaseAmount,
        freight: this.procurementAddForm.freight,
        expressCompany: this.procurementAddForm.expressCompany,
        arrivalGoods: this.procurementAddForm.arrivalGoods,
        merchantMobile: this.procurementAddForm.merchantMobile,
        remark: this.procurementAddForm.remark
      }
      addProcurement(param).then(res => {
        this.procurementAddVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getProcurement(this.procurementPerpageNumber, this.procurementCurrentPage)
      })
    },

    procurementUpdateBtnHandle(row) {
      this.procurementUpdateVisible = true

      this.procurementUpdateForm.id = row.id
      this.procurementUpdateForm.purchaseDate = row.purchaseDate
      this.procurementUpdateForm.merchantName = row.merchantName
      this.procurementUpdateForm.goodsName = row.goodsName
      this.procurementUpdateForm.unitPrice = row.unitPrice
      this.procurementUpdateForm.purchaseAmount = row.purchaseAmount
      this.procurementUpdateForm.freight = row.freight
      this.procurementUpdateForm.expressCompany = row.expressCompany
      this.procurementUpdateForm.arrivalGoods = row.arrivalGoods
      this.procurementUpdateForm.merchantMobile = row.merchantMobile
      this.procurementUpdateForm.remark = row.remark
    },
    procurementUpdateCommit() {
      var param = {
        id: this.procurementUpdateForm.id,
        purchaseDate: this.procurementUpdateForm.purchaseDate,
        merchantName: this.procurementUpdateForm.merchantName,
        goodsName: this.procurementUpdateForm.goodsName,
        unitPrice: this.procurementUpdateForm.unitPrice,
        purchaseAmount: this.procurementUpdateForm.purchaseAmount,
        freight: this.procurementUpdateForm.freight,
        expressCompany: this.procurementUpdateForm.expressCompany,
        arrivalGoods: this.procurementUpdateForm.arrivalGoods,
        merchantMobile: this.procurementUpdateForm.merchantMobile,
        remark: this.procurementUpdateForm.remark
      }
      updateProcurement(param).then(res => {
        this.procurementUpdateVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getProcurement(this.procurementPerpageNumber, this.procurementCurrentPage)
      })
    },
    procurementDeleteBtnHandle(row) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProcurement({ id: row.id }).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.getProcurement(this.procurementPerpageNumber, this.procurementCurrentPage)
        })
      })
    },

    procurementBtnHandle() {
      this.procurementUploadVisible = true
    },
    procurementUploadSuccess(res) {
      this.procurementFileName = res.data.fileName
    },
    procurementUploadHandle() {
      if (!this.procurementFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        fileName: this.procurementFileName
      }
      this.procurementUploadLoading = true
      importProcurement(param)
        .then(res => {
          this.procurementUploadLoading = false
          this.procurementUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
          this.getProcurement(this.procurementPerpageNumber, 1)
        })
        .catch(() => {
          this.procurementUploadLoading = false
        })
    }
  },
  create() {},
  mounted() {
    this.deliverStatistic()
    this.listToDeliver()
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 300px;
}

.dashboard-editor-container {
  padding: 32px;
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    text-align: center;
    height: 108px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }

  .card-panel-description {
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;

    .card-panel-text {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-bottom: 12px;
    }
  }
}
</style>
