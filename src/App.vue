<template>
  <div id="app">
    <!--頭部-->
    <Myheader :poiInfo='poiInfo'></Myheader>
    <!--導航-->
    <Mynav :commentNum="commentNum"></Mynav>
    <!--主體內容-->
    <!--<div class="content">
      content
    </div>-->

    <!--優化處理 讓用戶的流量降低-->
    <keep-alive>
      <!-- 路由出口 -->
      <!-- 路由匹配到的组件将渲染在这里 -->
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
//1.導入
import Myheader from 'components/Header/Header'
import Mynav from 'components/Nav/Nav'


export default {
  name: 'App',
  components: { //2.註冊
    Myheader,
    Mynav

  },
  data(){
    return{
      //header組件需要的訊息(商家訊息)
      poiInfo:{},
      commentNum:0
    }
  },
  created(){ //發起異步請求，獲取數據
    var that = this;
    //此this指的是vue對象，而非App.vue
    //通過axios發起get請求
    this.$axios.get('/api/goods')
      .then(function (response) {//獲取到數據之後的操作
          // handle success
          //console.log(response);
        var dataSource = response.data;
        //console.log(dataSource);
        if(dataSource.code == 0){
          that.poiInfo = dataSource.data.poi_info;
          //console.log(that.poiInfo);
        }
      })
      .catch(function (error) {//出錯處裡
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

      //通過axios發起get請求//評價頁面數據
    this.$axios.get('/api/ratings')
      .then(function (response) {//獲取到數據之後的操作
        var dataSource = response.data;
        //console.log(dataSource);
        if(dataSource.code == 0){
          that.commentNum = dataSource.data.comment_num;
          //console.log(that.poiInfo);
        }
      })
      .catch(function (error) {//出錯處裡
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }
}
</script>

<style>

</style>
