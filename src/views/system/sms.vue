<template>
  <div class="app-container">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.goodsNo" placeholder="短信编号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="短信名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="业务类型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryBtnHandle(1)">查询</el-button>
          <el-button size="small" type="primary" @click="addBtnHandle">新增短信模板</el-button>
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
        <el-table-column prop="smsId" label="短信编号" align="center"> </el-table-column>
        <el-table-column prop="smsName" label="短信名称" align="center"> </el-table-column>
        <el-table-column prop="smsType" label="业务类型" align="center"> </el-table-column>
        <el-table-column prop="smsContent" label="短信内容" align="center"> </el-table-column>
        <el-table-column prop="smsParam" label="参数" align="center" :formatter="smsParamFormatter">
        </el-table-column>
        <el-table-column prop="option" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="updateBtnHandle(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteBtnHandle(scope.row)" type="text" size="small">删除</el-button>
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

    <el-dialog size="small" title="" :close-on-click-modal="false" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="120px">
        <el-form-item label="短信编号">
          <el-input v-model="addForm.smsId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="短信名称">
          <el-input v-model="addForm.smsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="addForm.smsType" placeholder="">
            <el-option
              v-for="option in busTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            v-model="addForm.smsContent"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="短信参数">
          <el-select multiple v-model="addForm.smsParam" placeholder="">
            <el-option
              v-for="option in smsParamOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="addHandle">确定</el-button>
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
        <el-form-item label="短信编号">
          <el-input v-model="updateForm.smsId" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="短信名称">
          <el-input v-model="updateForm.smsName" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="updateForm.smsType" placeholder="">
            <el-option
              v-for="option in busTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3 }"
            v-model="updateForm.smsContent"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="短信参数">
          <el-select multiple v-model="updateForm.smsParam" placeholder="">
            <el-option
              v-for="option in smsParamOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="updateHandle">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pagination/index'
import { smsListPage, smsUpdate, smsAdd, smsDelete } from '@/api/sms.js'

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
        smsId: '',
        smsName: '',
        smsType: '',
        smsContent: '',
        smsParam: ''
      },
      updateForm: {
        id: '',
        smsId: '',
        smsName: '',
        smsType: '',
        smsContent: '',
        smsParam: ''
      },
      addFormVisible: false,
      updateFormVisible: false,
      busTypeOptions: [
        {
          value: 'comfirm_sms',
          label: '确认'
        },
        {
          value: 'cancel_sms',
          label: '取消'
        },
        {
          value: 'send_sms',
          label: '发货'
        }
      ],
      smsParamOptions: [
        {
          value: 'goodsName',
          label: '商品名称'
        },
        {
          value: 'merchantName',
          label: '商户名称'
        },
        {
          value: 'orderNo',
          label: '订单号'
        },
        {
          value: 'wayBillNo',
          label: '运单号'
        },
        {
          value: 'wx',
          label: '微信号'
        }
      ]
    }
  },
  methods: {
    /** 分页查询开始 */
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
      const param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        smsId: this.queryForm.smsId,
        smsName: this.queryForm.smsName,
        smsType: this.queryForm.smsType
      }
      smsListPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    smsParamFormatter(row) {
      return row.smsParam
        .split('|')
        .map(item => this.getParamLabel(item))
        .join('|')
    },
    getParamLabel(val) {
      const option = this.smsParamOptions.find(option => option.value === val)
      return option ? option.label : val
    },
    /** 分页查询结束 */

    /** 新增开始 */
    addBtnHandle() {
      this.addFormVisible = true

      this.addForm.smsId = ''
      this.addForm.smsName = ''
      this.addForm.smsType = ''
      this.addForm.smsContent = ''
      this.addForm.smsParam = ''
    },
    addHandle() {
      const param = {
        smsId: this.addForm.smsId,
        smsName: this.addForm.smsName,
        smsType: this.addForm.smsType,
        smsContent: this.addForm.smsContent,
        smsParam: this.addForm.smsParam.join('|')
      }
      smsAdd(param).then(res => {
        this.addFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 新增结束 */

    /** 修改开始 */
    updateBtnHandle(row) {
      this.updateFormVisible = true

      this.updateForm.id = row.id
      this.updateForm.smsId = row.smsId
      this.updateForm.smsName = row.smsName
      this.updateForm.smsType = row.smsType
      this.updateForm.smsContent = row.smsContent
      this.updateForm.smsParam = row.smsParam.split('|')
    },
    updateHandle() {
      const param = {
        id: this.updateForm.id,
        smsId: this.updateForm.smsId,
        smsName: this.updateForm.smsName,
        smsType: this.updateForm.smsType,
        smsContent: this.updateForm.smsContent,
        smsParam: this.updateForm.smsParam.join('|')
      }
      smsUpdate(param).then(res => {
        this.updateFormVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryBtnHandle()
      })
    },
    /** 修改结束 */

    /** 删除开始 */
    deleteBtnHandle(row) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        smsDelete({ id: row.id }).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.queryBtnHandle()
        })
      })
    }
    /** 删除结束 */
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    this.getListByPage(this.perpageNumber, this.currentPage)
  }
}
</script>
