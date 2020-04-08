<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'Sql',
  data() {
    return {
      name: 'SQL'
    }
  },
  methods: {
    payTypeCnd(payType) {
      switch (payType) {
        case 'cod':
          return " and t.pay_method in ('0')"
        case 'op':
          return " and t.pay_method in ('1', '2')"
        default:
          return ''
      }
    },
    dateCnd(endDate) {
      return " and date(t.order_time) <= '" + endDate + "'"
    },
    goodsIdCnd(goodsIds) {
      return ' and t.goods_id in (' + goodsIds + ')'
    },
    goodsSpecCnd(goodsSpecs) {
      if (goodsSpecs) {
        return ' and goods_spec in (' + goodsSpecs + ')'
      }
      return ''
    },
    areaTypeCnd(areaType) {
      switch (areaType) {
        case 'high':
          return " and t.provice in ('新疆维吾尔自治区', '新疆', '西藏自治区', '西藏', '青海省', '青海', '宁夏回族自治区', '宁夏', '内蒙古自治区', '内蒙', '甘肃省', '甘肃')"
        case 'low':
          return " and t.provice not in ('新疆维吾尔自治区', '新疆', '西藏自治区', '西藏', '青海省', '青海', '宁夏回族自治区', '宁夏', '内蒙古自治区', '内蒙', '甘肃省', '甘肃')"
        default:
          return ''
      }
    },
    codAmountField() {
      return 't.actual_amount'
    },
    opAmountField() {
      return '0 as actual_amount'
    },
    ztField(type) {
      let amount = this.codAmountField()
      if (type == 'op') {
        amount = this.opAmountField()
      }
      return (
        't.order_no, ' +
        amount +
        ", '头条商家' as a, '17267311160' as b, '' as c, '湖南省长沙市岳麓区岳麓大道芯城科技园1栋702' as d, '' as e" +
        ', t.receiver' +
        ", t.receiver_mobile , '' as f" +
        ", replace(t.receiver_address,char(10), ' ') as receiver_address, '' as g" +
        ', t1.goods_short_name' +
        ', t.goods_num' +
        ', t.user_remark, t.merchant_remark, goods_spec'
      )
    },
    ytField(type) {
      let amount = this.codAmountField()
      if (type == 'op') {
        amount = "'' as actual_amount"
      }
      return (
        "t.receiver, t.receiver_mobile, '' as a" +
        ", replace(t.receiver_address,char(10), ' ') as receiver_address, '' as b" +
        ', t1.goods_short_name, t.goods_num, t.order_no, ' +
        amount +
        ", '' as c, '' as d, goods_spec"
      )
    },
    ydField(type) {
      let amount = this.codAmountField()
      if (type == 'op') {
        amount = this.opAmountField()
      }
      return (
        "'4106932442' as a, '' as p" +
        ", t.order_no, '头条商家' as b, '' as c, '17267311160' as d, '' as q, '湖南省长沙市岳麓区岳麓大道芯城科技园1栋702' as e, '' as f, '' as g" +
        ", t.receiver, '' as h" +
        ', t.receiver_mobile' +
        ', concat(t.provice, t.city, t.area) as i' +
        ", replace(replace(replace(t.receiver_address,char(10), ''), ' ', ''), ',', '') as receiver_address, '' as r, '' as s, '' as j, t.order_no as k" +
        ', t1.goods_short_name' +
        ', t.goods_num, ' +
        amount +
        ", '' as l, '' as m, '' as n, '' as o" +
        ', t.merchant_remark, goods_spec'
      )
    },
    jdField(type) {
      let amount = this.codAmountField()
      if (type == 'op') {
        amount = this.opAmountField()
      }
      return (
        "t.order_no, '' as p, '' as q, '' as r, '' as s, '' as t, '' as u" +
        ', t.receiver' +
        ", t.receiver_mobile , '' as v" +
        ", replace(t.receiver_address,char(10), ' ') as receiver_address, '' as a" +
        ", t1.goods_short_name, '' as b, '1' as c, '' as d, '' as e, '特惠送' as f, '' as g, '' as h, '否' as i, '' as j, '否' as k, '是' as l, " +
        amount +
        ", '' as m, '' as n, '' as o" +
        ', t.user_remark, t.merchant_remark, goods_spec'
      )
    },
    field(expressType, payType) {
      switch (expressType) {
        case '1':
          return this.jdField(payType)
        case '3':
          return this.ydField(payType)
        case '4':
          return this.ztField(payType)
        case '5':
          return this.ytField(payType)
        default:
          return ''
      }
    },
    sql() {
      const payType = 'op'
      const areaType = ''
      const endDate = '2020-03-30'
      const goodsIds = "'3398818474565482218'"
      const goodsSpecs = ''
      const expressType = '4'
      return (
        'select ' +
        this.field(expressType, payType) +
        ' from t_ec_order t left join t_ec_goods t1 on t.goods_id = t1.goods_id' +
        " where order_status = '2' and order_source != '4' and (user_remark != '8888' and user_remark != '6666' and receiver not like '麓谷科技园%')" +
        this.payTypeCnd(payType) +
        this.dateCnd(endDate) +
        this.goodsIdCnd(goodsIds) +
        this.goodsSpecCnd(goodsSpecs) +
        this.areaTypeCnd(areaType) +
        " and t.order_no not in (select order_no from t_way_bill where date(order_time) >= '2020-02-11')" +
        ' order by t.order_time'
      )
    },
    exceedSql() {
      const payType = 'op'
      const areaType = ''
      const endDate = '2020-03-30'
      const goodsIds = "'3398818474565482218'"
      const goodsSpecs = ''
      const expressType = '4'
      return (
        'select distinct ' +
        this.field(expressType, payType) +
        ' from t_way_bill t1 join t_ec_order t on t.order_no = t1.order_no' +
        ' left join t_ec_goods t2 on t1.goods_id = t2.goods_id' +
        " where date(t.order_time) >= '2020-02-11' and t.exceed_flag = 1 and t1.order_status = '2' and t1.pay_method in ('1', '2')" +
        ' and not exists (select 1 from t_way_bill where exceed_flag = 0 and order_no = t.order_no)' +
        " and t1.order_source != '4' and (t1.user_remark != '8888' and t1.user_remark != '6666' and t1.receiver not like '麓谷科技园%')" +
        this.payTypeCnd(payType) +
        this.dateCnd(endDate) +
        this.goodsIdCnd(goodsIds) +
        this.goodsSpecCnd(goodsSpecs) +
        this.areaTypeCnd(areaType) +
        " and t.order_no not in (select order_no from t_way_bill where date(order_time) >= '2020-02-11')" +
        ' order by t.order_time'
      )
    }
  },
  mounted() {
    this.name = this.sql()
  }
}
</script>
