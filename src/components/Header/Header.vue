<template>
  <div class="header">
    <!--頂部-->
    <div class="top-wrapper">
      <div class="back-wrapper">
        <span class="icon-arrow_lift"></span>
      </div>
      <form class="search-wrapper">
        <span class="search-icon"></span>
        <input class="search-bar" type="text" placeholder="搜尋店內商品"/>
      </form>
      <div class="more-wrapper">
        <a class="spelling-bt" href="#">拚單</a>
        <div class="more-bt">
          <i class="s-radius"></i>
          <i class="s-radius"></i>
          <i class="s-radius"></i>
        </div>
      </div>
    </div>
    <!--主體內容-->
    <div class="content-wrapper">
      <div class="icon" :style="head_bg">
        <!--<img :src="poiInfo.pic_url"/>-->
      </div>
      <div class="name">
        <h3>{{poiInfo.name}}</h3>
      </div>
      <div class="collect">
        <img src="./star.png"/>
        <span>收藏</span>
      </div>
    </div>
    <!--公告內容-->
    <div class="bulletin-wrapper">
      <img class="icon" v-if="poiInfo.discounts2" :src="poiInfo.discounts2[0].icon_url"/>
      <span class="text" v-if="poiInfo.discounts2">{{poiInfo.discounts2[0].info}}</span>
      <div class="detail" v-if="poiInfo.discounts2" @click="showBulletin">
        {{poiInfo.discounts2.length}}個活動
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <!--背景-->
    <div class="bg-wrapper" :style="content_bg">
      <!--<img :src="poiInfo.head_pic_url"/>-->
      <!--通過計算屬性調整圖片-->
    </div>
    <!--公告詳情-->
    <transition name="bulletin-detail">
      <div class="bulletin-detail" v-show="isShow">
        <div class="detail-wrapper">
          <div class="main-wrapper" :style="detail_bg">
            <div class="icon" :style="head_bg"></div>
            <h3 class="name">{{poiInfo.name}}</h3>
            <!--星級評價-->
            <div class="score">
              <Star :score="poiInfo.wm_poi_score"></Star>
              <span>{{poiInfo.wm_poi_score}}</span>
            </div>
            <p class="tip">
              {{poiInfo.min_price_tip}} <i>|</i>
              {{poiInfo.shipping_fee_tip}} <i>|</i>
              {{poiInfo.delivery_time_tip}}
            </p>
            <p class="time">
              配送時間：
              {{poiInfo.shipping_time}}
            </p>
            <div class="discounts" v-if="poiInfo.discounts2">
              <p>
                <img :src="poiInfo.discounts2[0].icon_url"/>
                <span>{{poiInfo.discounts2[0].info}}</span>
              </p>
            </div>
          </div>
          <div class="close-wrapper">
            <span class="icon-close" @click="closeBulletin"></span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
//導入star組件
/*import Star from "../Star/Star"   能否改成較方便的呢 修改webpack.base.conf.js之路徑的配置*/
import Star from 'components/Star/Star'

export default {//組件傳值
  data(){
    return {
      isShow: false//公告詳情是否顯示
    }
  },
  components: {
    Star
  },
  props:{
    poiInfo:{
      type:Object,
      default:{}
    }
  },
  computed:{//計算屬性
    content_bg(){
      return "background-image: url("+ this.poiInfo.head_pic_url +");"
    },
    head_bg(){
      return "background-image: url("+ this.poiInfo.pic_url +");"
    },
    detail_bg(){
      return "background-image: url("+ this.poiInfo.poi_back_pic_url +");"
    }
  },
  methods:{
    showBulletin(){
      this.isShow = true;
    },
    closeBulletin(){
      this.isShow = false;
    }
  }
}
</script>
<style>
  /*導入字體圖標*/
  @import url("../../common/styles/icon.css");
  /*導入css樣式*/
 /* @import url("Header.css");*/
  .header{
    height: 129px;/*11/24修改 nav bar無法顯現*/
    padding-top: 20px;
  }
  /*最上方欄位*/
  .header .top-wrapper{
    position: relative;
  }
  .header .top-wrapper .back-wrapper{
    width: 50px;
    height: 31px;
    /*background: red;*/
    position: absolute;
    left: 0;
    top: 0;
    text-align: center;
    line-height: 31px;
  }
  .header .top-wrapper .back-wrapper span{
    display: inline-block;/*可使上面的text-align: center;
    line-height: 31px;產生效果*/
    color: white;
  }
  .header .top-wrapper .search-wrapper{
    width: 100%;
    height: 31px;
    /*background: green;*/
    padding: 0 104px 0 50px;
    /*設置盒子從邊框開始計算*/
    box-sizing: border-box;
  }
  .header .top-wrapper .search-wrapper .search-icon{
    width: 28px;
    height: 31px;
    background: url(titans_h5_search@2x.png) no-repeat 11px center;
    background-size: 13px 13px;
    position: absolute;
  }
  .header .top-wrapper .search-wrapper .search-bar{
    width: 100%;
    height: 31px;
    border: 0;
    /*設置盒子從邊框開始計算*/
    box-sizing: border-box;
    background: #cdcdcc;
    border-radius: 25px;
    padding-left: 28px;
    /*去除選中時的藍色邊框*/
    outline: none;
  }
  .header .top-wrapper .more-wrapper{
    /*width: 104px;*/
    width: 65px;
    /*height: 31px;*/
    height: 24px;
    /*background: blue;*/
    position: absolute;
    right: 0;
    top: 0;
    padding: 7px 15px 0 24px;
  }
  .header .top-wrapper .more-wrapper .spelling-bt{
    width: 30px;
    height: 17px;
    color: white;
    line-height: 17px;
    border: 1px solid white;
    text-align: center;
    float: left;
    text-decoration: none;
    font-size: 10px;
  }
  .header .top-wrapper .more-wrapper .more-bt{
    float: right;
    width: 20px;
    height: 24px;
    margin-left: 13px;
    margin-top: 6px;
  }
  .header .top-wrapper .more-wrapper .more-bt .s-radius{
    width: 3px;
    height: 3px;
    border-radius: 50%;
    border: 1px solid white;
    display: block;
    float: left;
    margin-right: 1px;
  }
  /*主體內容*/
  .content-wrapper{
    padding: 17px 10px 11px;
    height: 50px;
  }
  .content-wrapper .icon{
    width: 50px;
    height: 50px;
    background-size: 135% 100%;
    background-position: center;
    border-radius: 5px;
    float: left;
  }
  .content-wrapper .name{
    float: left;
    padding: 18px 0 0 12px;
  }
  .content-wrapper .name h3{
    font-size: 16px;
    font-weight: bold;
    color: white;
  }
  .content-wrapper .collect{
    width: 25px;
    height: 37px;
    float: right;
    text-align: center;
    padding-top: 6px;
  }
  .content-wrapper .collect img{
    width: 20px;
    height: 20px;
  }
  .content-wrapper .collect span{
    margin-top: 7px;
    color: white;
    font-size: 11px;
  }

  /*公告內容*/
  .bulletin-wrapper{
    height: 16px;
    padding: 0 10px;
  }
  .bulletin-wrapper .icon{
    width: 16px;
    height: 16px;
    float: left;
    margin-right: 6px;
  }
  .bulletin-wrapper .text{
    font-size: 11px;
    color: white;
    float: left;
    line-height: 16px;
  }
  .bulletin-wrapper .detail{
    color: white;
    float: right;
    font-size: 11px;
    line-height: 16px;
  }
  .bulletin-wrapper .detail span{
    font-size: 16px;
    line-height: 16px;
    float: right;
  }

  /*背景*/
  .header .bg-wrapper{
    width: 100%;
    height: 150px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-size: 100% 135%;
    background-position: center -12px;
  }

  /*公告詳情*/
  .header .bulletin-detail{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(98,98,98,0.8);
    z-index: 999; /*11/24修改公告欄被埋藏在底下的問題*/
  }
  .header .bulletin-detail .detail-wrapper{
    width: 100%;
    height: 100%;
    padding: 43px 20px 125px;
    box-sizing: border-box;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper{
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    border-radius: 10px;
    text-align: center;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .icon{
    width: 60px;
    height: 60px;
    background-size: 135% 100%;
    background-position: center;
    border-radius: 5px;
    display: inline-block;
    margin-top: 40px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .name{
    font-size: 15px;
    color: white;
    margin-top: 13px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .score{
    height: 10px;
    margin-top: 6px;
    text-align: center;
    font-size: 0;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .score .star{
    display: inline-block;
    margin-right: 7px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .score span{
    display: inline-block;
    font-size: 10px;
    color: white;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .tip{
    font-size: 11px;
    color: #bababc;
    margin-top: 8px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .tip i{
    margin: 0 7px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .time{
    font-size: 11px;
    color: #bababc;
    margin-top: 13px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .discounts{
    margin-top: 20px;
    padding: 0 20px;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .discounts p{
    padding-top: 20px;
    border-top: 1px solid #BABABC;
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .discounts img{
    width:16px;
    height: 16px;
    /*margin-right: 10px;*/
    vertical-align: middle;/*將圖片對齊文字*/
  }
  .header .bulletin-detail .detail-wrapper .main-wrapper .discounts span{
    font-size: 11px;
    line-height: 16px;
    color: white;
  }
  .header .bulletin-detail .detail-wrapper .close-wrapper{
    padding-top: 20px;
    height: 40px;
    text-align: center;
  }
  .header .bulletin-detail .detail-wrapper .close-wrapper span{
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    font-size: 14px;
    display: inline-block;
    background: rgba(118,118,118,0.7);
    border:1px solid rgba(140,140,140,0.9);
  }

  /*Vue過度效果
    <transition name="detail"><transition>
    .xxx指的是name
    進入
    .xxx-enter  過渡開始的狀態
    .xxx-enter-to  過渡結束的狀態
    .xxx-enter-active  過渡的持續時間、延遲、曲線函數
    離開
    .xxx-leave  過渡開始的狀態
    .xxx-leave-to  過渡結束的狀態
    .xxx-leave-active  過渡的持續時間、延遲、曲線函數
  */
  .bulletin-detail-enter-active,.bulletin-detail-leave-active{
    transition:2s all;
  }
  .bulletin-detail-enter,.bulletin-detail-leave-to{
    opacity: 0;
  }
  .bulletin-detail-enter-to,.bulletin-detail-leave{
    opacity: 1;
  }

</style>
