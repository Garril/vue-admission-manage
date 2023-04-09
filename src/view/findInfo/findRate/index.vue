<template>
  <div id="find_rate">
    <div id="condition_choice">
      <el-form :inline="true" :model="form" class="find_rate_form">
        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历-不能为空">
            <el-option label="本科" value="3"></el-option>
            <el-option label="硕士" value="2"></el-option>
            <el-option label="博士" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院">
          <el-select
            v-model="form.dep_id"
            placeholder="请选择学院-不能为空"
            @change="dep_change"
          >
            <span v-for="(item, index) in data">
              <el-option
                :label="item.dep_name"
                :value="item.dep_id"
              ></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item label="专业">
          <el-select v-model="form.spe_id" placeholder="请选择专业-可以为空">
            <el-option label="" value=""></el-option>
            <span v-for="(item, index) in right_spe">
              <el-option :label="item" :value="index + 1"></el-option>
            </span>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="pie_echarts" style="width: 1000px; height: 400px"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { findDepSpe } from "network/find/findDepSpe.js";
//  先前使用的请求
// import { GetCountInfo } from 'network/find/findCount.js'
import { findClassByDep, findClassBySpe } from "network/find/findClass.js";

export default {
  name: "rate_echarts",
  data() {
    return {
      form: {
        degree: "",
        dep_id: "",
        spe_id: "",
      },
      data: [
        {
          name: "Apples",
          value: 70,
        },
      ],
      right_spe: [],

      tempArr: [],

      myEcharts: {},
      classInfo: [],
    };
  },
  mounted() {
    this.echartsInit();
  },
  methods: {
    echartsInit() {
      this.myEcharts = echarts.init(document.getElementById("pie_echarts"));
      this.myEcharts.setOption({
        title: {
          text: "人数占比统计",
          subtext: "",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["软件工程1班", "软件工程2班", "软件工程3班", "软件工程4班"],
        },
        series: [
          {
            name: "总人数(占比)",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 52, name: "软件工程1班" },
              { value: 51, name: "软件工程2班" },
              { value: 55, name: "软件工程3班" },
              { value: 44, name: "软件工程4班" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    dep_change(dep_id) {
      this.data.forEach((item, index) => {
        if (item.dep_id === dep_id) {
          this.right_spe = item.spe_arr;
        }
      });
      this.form.spe_id = "";
    },
    // 按照专业看班
    refreshDataSpe(data) {
      let options = this.myEcharts.getOption();
      const boyArr = [],
        girlArr = [],
        allArr = [],
        classNameArr = [];
      data.map((item, index) => {
        boyArr.push(item.boy);
        girlArr.push(item.girl);
        classNameArr.push(item.class_name);
        allArr.push(parseInt(item.girl) + parseInt(item.boy));
      });
      let obj = [];
      classNameArr.forEach((class_name, index) => {
        obj.push({
          name: class_name,
          value: allArr[index],
        });
      });
      options.legend[0].data = classNameArr;
      options.series[0].data = obj;
      this.myEcharts.setOption(options);
    },
    // 按照学院看专业
    refreshDataDep(data) {
      // 对信息 按专业 进行分组
      let map = {};
      data.forEach((item) => {
        if (!map[item.spe_id]) {
          map[item.spe_id] = {
            name: item.spe_name,
            boyCount: parseInt(item.boy),
            girlCount: parseInt(item.girl),
            allCount: parseInt(item.boy) + parseInt(item.girl),
          };
        } else {
          map[item.spe_id].boyCount += parseInt(item.boy);
          map[item.spe_id].girlCount += parseInt(item.girl);
          map[item.spe_id].allCount =
          map[item.spe_id].boyCount + map[item.spe_id].girlCount;
        }
      });
      // 分组后，再分为数组，为什么不在之前就顺便分数组？
      // 每个学院的spe_id是从1开始的，是可行的,但是每次加减都得赋值，太过重复
      const boyArr = [],
        girlArr = [],
        allArr = [],
        nameArr = [];
      for (let key in map) {
        nameArr.push(map[key].name);
        boyArr.push(map[key].boyCount);
        girlArr.push(map[key].girlCount);
        allArr.push(map[key].allCount);
      }

      let options = this.myEcharts.getOption();
      let obj = [];
      nameArr.forEach((name, index) => {
        obj.push({
          name: name,
          value: allArr[index],
        });
      });
      options.legend[0].data = nameArr;
      options.series[0].data = obj;
      this.myEcharts.setOption(options);
    },
    onSubmit() {
      if (this.form.dep_id == "" || this.form.degree == "") {
        // 学院，学历为空
        alert("学历和学院不能为空");
      } else if (this.form.spe_id == "") {
        // 专业为空
        findClassByDep(this.form.dep_id, this.form.degree).then((res) => {
          if (res.status == "200") {
            this.classInfo = res.data;
            this.refreshDataDep(this.classInfo);
          } else {
            alert("查询失败!");
          }
        });
      } else {
        // 全填了
        findClassBySpe(
          this.form.dep_id,
          this.form.degree,
          this.form.spe_id
        ).then((res) => {
          if (res.status == "200") {
            this.classInfo = res.data;
            this.refreshDataSpe(this.classInfo);
          } else {
            alert("查询失败!");
          }
        });
      }
    },
  },
  created() {
    findDepSpe().then((res) => {
      this.data = res.data;
    });
  },
};
</script>

<style>
#find_rate {
  padding-left: 40px;
}
#find_rate .find_rate_form {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 50px;
}
#find_rate .find_rate_form .el-form-item__label {
  color: black;
}
#find_rate .find_rate_form .el-form-item {
  width: 250px;
}
#find_rate .find_rate_form .el-form-item:first-of-type {
  width: 250px;
}
#find_rate .find_rate_form .el-form-item:last-of-type {
  width: 70px;
}
</style>
