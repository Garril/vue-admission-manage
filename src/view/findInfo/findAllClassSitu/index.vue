<template>
  <div id="find_all_class">
    <div id="condition_choice">
      <el-form :inline="true" :model="form" class="findclass_detail_form">

        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历-不能为空">
            <el-option label="本科" value="3"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="1"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="学院">
          <el-select v-model="form.dep_id" placeholder="请选择学院-不能为空" @change="dep_change">
            <span v-for="(item,index) in data">
              <el-option :label="item.dep_name" :value="item.dep_id"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.spe_id" placeholder="请选择专业-可以为空">
            <el-option label="" value=""></el-option>
            <span v-for="(item,index) in right_spe">
              <el-option :label="item" :value="index+1"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div id="count_echarts" style="width: 600px;height: 400px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { findDepSpe } from 'network/find/findDepSpe.js'
import { GetCountInfo } from 'network/find/findCount.js'

export default {
  name: "echarts",
  data() {
    return {
      form: {
        degree:'',
        dep_id: '',
        spe_id: '',
      },
      data:[],
      right_spe:[],
      info:{},
      tempArr:[],
      myEcharts:{},
    }
  },
  mounted() {
    this.echartsInit()
  },
  methods:{
    echartsInit() {
      this.myEcharts = echarts.init(document.getElementById('count_echarts'));
      this.myEcharts.setOption({
        title: {
          text: '分班情况',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '人数',
            type: 'pie',
            radius: '70%',
            data: [
              { value: 500, name: '男生' },
              { value: 900, name: '女生' },
              { value: 1400, name: '总人数' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    dep_change(dep_id) {
      this.data.forEach((item,index) => {
        if(item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      })
      this.form.spe_id = "";
    },
    onSubmit() {
      if(this.form.spe_id =='') { // 没填专业
        GetCountInfo(this.form.dep_id,this.form.degree,'@').then(res => {
          if(res.status == '200') {
            this.info = res.data;
            if(this.tempArr.length !=0) {
              this.tempArr = [];
            }
            let all = parseInt(this.info.boy) + parseInt(this.info.girl);
            this.tempArr.push({ value:this.info.boy, name:'男生'});
            this.tempArr.push({ value:this.info.girl, name:'女生'});
            this.tempArr.push({ value:all, name:'总人数'});
            this.refreshData(this.tempArr);
          }
        })
      } else {
        GetCountInfo(this.form.dep_id,this.form.degree,this.form.spe_id).then(res => {
          if(res.status == '200') {
            this.info = res.data;
            if(this.tempArr.length !=0) {
              this.tempArr = [];
            }
            let all = parseInt(this.info.boy) + parseInt(this.info.girl);
            this.tempArr.push({ value:this.info.boy, name:'男生'});
            this.tempArr.push({ value:this.info.girl, name:'女生'});
            this.tempArr.push({ value:all, name:'总人数'});
            this.refreshData(this.tempArr);
          }
        })
      }

    },
    refreshData(data) {
      let option = this.myEcharts.getOption();
      option.series[0].data = data;
      this.myEcharts.setOption(option)
    }

  },
  created() {
    findDepSpe().then(res => {
      this.data = res.data;
    });    
  }
}
</script>

<style>
  #find_all_class {
    padding-left: 50px;
  }
  #find_all_class .findclass_detail_form{
    flex-direction: row;
    width: 100%;
    margin-bottom: 50px;
  }
  #find_all_class .findclass_detail_form .el-form-item__label{
    color: black;
  }
  #find_all_class .findclass_detail_form .el-form-item{
    width: 250px;
  }
  #find_all_class .findclass_detail_form .el-form-item:first-of-type{
    width: 300px;
  }
  #find_all_class .findclass_detail_form .el-form-item:last-of-type{
    width: 70px;
  }
</style>