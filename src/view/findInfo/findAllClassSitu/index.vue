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
    <div id="count_echarts" style="width: 1000px;height: 400px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { findDepSpe } from 'network/find/findDepSpe.js'
//  先前使用的请求
// import { GetCountInfo } from 'network/find/findCount.js'
import { findClassByDep,findClassBySpe } from 'network/find/findClass.js'

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

      tempArr:[

      ],

      myEcharts:{},
      classInfo:[],
    }
  },
  mounted() {
    this.echartsInit()
  },
  methods:{
    echartsInit() {
      this.myEcharts = echarts.init(document.getElementById('count_echarts'));
      this.myEcharts.setOption({
          legend: {
            data:['男生','女生','总人数']
          },
          xAxis: { 
            type: 'category',
            data: [1,2,3,4,5,6]
          },
          yAxis: {
            type: 'value',
            
          },
          series: [{
              type: 'bar',
              name:'男生',
              data:[300,600,600,400,500,600]
              },{
              type: 'bar',
              name:'女生',
              data:[400,200,600,400,500,800]
              },{
              type: 'bar',
              name:'总人数',
              data:[700,800,1200,800,1000,1400]
              }
          ],
          tooltip: {
            trigger:'axis',
            axisPointer: {
              type:'shadow'
            }
          }
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
    // 按照专业看班
    refreshDataSpe(data) {
      let options = this.myEcharts.getOption();
      const boyArr = [],girlArr = [],allArr = [],nameArr = [];
      data.map( (item,index) => {
        nameArr.push(item.class_name);
        boyArr.push(item.boy);
        girlArr.push(item.girl);
        allArr.push(parseInt(item.girl)+parseInt(item.boy));
      })
      options.xAxis = {
        type:'category',
        data:[...nameArr]
      }
      options.series[0].data = boyArr;
      options.series[1].data = girlArr;
      options.series[2].data = allArr;
      this.myEcharts.setOption(options);
    },
    // 按照学院看专业
    refreshDataDep(data) {
      // 对信息 按专业 进行分组
      let map = {}
      data.forEach( item => {
        if(!map[item.spe_id]) {
          map[item.spe_id] = {
            name: item.spe_name,
            boyCount: parseInt(item.boy),
            girlCount: parseInt(item.girl),
            allCount: parseInt(item.boy)+parseInt(item.girl)
          };
        } else {
          map[item.spe_id].boyCount += parseInt(item.boy);
          map[item.spe_id].girlCount += parseInt(item.girl);
          map[item.spe_id].allCount = map[item.spe_id].boyCount + map[item.spe_id].girlCount;
        }
      })
      // 分组后，再分为数组，为什么不在之前就顺便分数组？
      // 每个学院的spe_id是从1开始的，是可行的,但是每次加减都得赋值，太过重复
      const boyArr = [],girlArr = [],allArr = [],nameArr = [];
      for(let key in map) {
        nameArr.push(map[key].name);
        boyArr.push(map[key].boyCount);
        girlArr.push(map[key].girlCount);
        allArr.push(map[key].allCount);
      }

      let options = this.myEcharts.getOption();

      options.xAxis = {
        type:'category',
        data:[...nameArr]
      }
      options.series[0].data = boyArr;
      options.series[1].data = girlArr;
      options.series[2].data = allArr;
      this.myEcharts.setOption(options);
      
    },
    onSubmit() {
      if(this.form.dep_id =='' || this.form.degree =='') { // 学院，学历为空
        alert("学历和学院不能为空");
      } else if(this.form.spe_id == '') { // 专业为空
        findClassByDep(this.form.dep_id,this.form.degree).then(res => {
          if(res.status == '200') {
            this.classInfo = res.data;
            this.refreshDataDep(this.classInfo);
          } else {
            alert("查询失败!");
          }
        })
      } else { // 全填了
        findClassBySpe(this.form.dep_id,this.form.degree,this.form.spe_id).then(res => {
          if(res.status == '200') {
            this.classInfo = res.data;
            this.refreshDataSpe(this.classInfo);
          } else {
            alert("查询失败!");
          }
        })
      }


    },

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
    padding-left: 40px;
  }
  #find_all_class .findclass_detail_form{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
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
    width: 250px;
  }
  #find_all_class .findclass_detail_form .el-form-item:last-of-type{
    width: 70px;
  }
</style>