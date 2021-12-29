<template>
  <div id="create_book">
    
    <div id="pdfCentent">
      <div id="bookbox">

        <div id="bookbox_head">
          <img src="../../../assets/img/bookhead.png" alt="">
        </div>

        <div id="bookbox_content">
          <div>
            <span>{{stuInfo.name}}  同学:</span>
            <span id="book_avatar">
              <img :src="require('../../../assets/avatar/'+stuInfo.url)" alt="">
            </span>            
          </div>
          <div id="content_text">经广东省招生委员会批准，你被我校录取到 {{stuInfo.dep_name}} {{stuInfo.spe_name}} 专业{{stuInfo.year.slice(2,4)}} ({{stuInfo.class_no}}) 班，为 {{studyYear}} 年制{{transDegree(stuInfo.degree)}}，请凭本通知于 {{arriveDay}} 到我校 {{transCampus(stuInfo.campus)}} 校区报到</div>
          <div>
            <span>广东工业大学</span>
            <span>签发人(校长): xxxx</span>
          </div>
        </div>
        
        <div id="bookbox_foot">
          <span>{{footDate}}</span>
        </div>

      </div>
    </div>

    <el-button type="danger" @click="ExportSavePdf(htmlTitle,nowTime)" id="pdf_btn">导出PDF</el-button>

  </div>

</template>

<script>

export default {
// html 取参  $route.query.stuInfo
// script 取参  this.$route.query.stuInfo
  name:"",
  data() {
    return {
      stuInfo:{},
      htmlTitle: "录取通知书",
      nowTime: "",
      studyYear:"3", // x年制本科生
      arriveDay:"9月1日", // 学生报到日期
      footDate:"二〇二一年七月二十八日", // 通知书底部日期
    }
  },
  methods: {
    transDegree(degree) {
      if(degree =='3') {
        return "本科生"
      } else if(degree == '2') {
        return "硕士生"
      } else {
        return "博士生"
      }
    },
    transCampus(id) {
      if(id =='1') {
        return "大学城"
      } else if(id == '2') {
        return "龙洞"
      } else if(id == '3'){
        return "番禺"
      } else {
        return "东风路"
      }
    },

  },
  computed:{

  },
  created() {
    this.stuInfo = this.$route.query.stuInfo;
    this.stuInfo.url = this.stuInfo.url.substring(53);
  }
}
</script>

<style>
#bookbox {
  width: 769px;
  height: 990px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #5c5c58;
  background-color: #ffffff;
  margin-bottom: 40px;
}

#bookbox_head {
  height: 150px;
  padding-top: 100px;
}

#bookbox_content {
  margin-top: 150px;
  width: 528px;
  flex: 1;
}

#bookbox_content div:first-of-type {
  display: flex;
  flex-wrap: nowrap;
  justify-content:space-between;
}
#bookbox_content div:first-of-type span:first-of-type{
  font-size: 25px;
  font-weight: bolder;
  transform: translateY(80px);
}

#bookbox_content div:first-of-type span:first-of-type{
  font-size: 25px;
  font-weight: bolder;
  transform: translateY(80px);
}

#bookbox_content div:last-of-type{
  display: flex;
  flex-wrap: nowrap;
  justify-content:space-between;
  padding: 120px 40px 0px 10px;
  font-size: 17px;
}

#bookbox_foot {
  height: 30px;
  width: 100%;
  font-size: 17px;
  text-align: right;
  padding-right: 40px;
}

#book_avatar img{
  width: 120px;
  height: 120px;
  margin:10px;
}
#content_text {
  margin-top: 50px;
  text-align: left;
  line-height: 50px;
  letter-spacing: 8px;
  font-size: 20px;
  font-weight: bolder;
  text-indent: 3rem;
}
#create_book{
  padding-left: 20%;
}
</style>