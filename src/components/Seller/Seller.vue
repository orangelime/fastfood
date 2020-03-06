<template>
  <div class="seller">
    <div class="seller-wrapper">
      <Split></Split>
      <div class="seller-view">
        <div class="address-wrapper">
          <div class="address-left">
            {{seller.address}}
          </div>
          <div class="address-right">
            <div class="content"></div>
          </div>
        </div>
        <div class="pics-wrapper" v-if="seller.poi_env" ref="picsView">
          <ul class="pics-list" ref="picsList">
            <li class="pics-item" v-for="imgurl in seller.poi_env.thumbnails_url_list" ref="picsItem">
              <img :src="imgurl"/>
          </li>
          </ul>
        </div>
        <div class="safety-wrapper">
          查看食品安全檔案
          <span class="icon-keyboard_arrow_right"></span>
        </div>
      </div>
      <Split></Split>
      <div class="tip-wrapper">
        <div class="delivery-wrapper">
          配送服務: {{seller.app_delivery_tip}}
        </div>
        <div class="shipping-wrapper">
          配送時間: {{seller.shipping_time}}
        </div>
      </div>

      <Split></Split>
      <div class="other-wrapper">
        <div class="server-wrapper">
          商家服務
          <div class="poi-server" v-for="item in seller.poi_service">
            <img :src="item.icon"/>
            {{item.content}}
          </div>
        </div>
        <div class="discounts-wrapper">
          <div class="discounts-item" v-for="item in seller.discounts2">
            <div class="icon">
              <img :src="item.icon_url"/>
            </div>
            <div class="text">
              {{item.info}}
            </div>
          </div>
        </div>
      </div>
      <Split class="bottom"></Split>
    </div>
  </div>
</template>
<script>
//導入Split
import Split from 'components/Split/Split'
//導入better-scroll
import BScroll from 'better-scroll'

export default {
  data(){
    return{
      seller:{}
    }
  },
  created(){
    //通過axios發起get請求//評價頁面數據
    let that = this;
    this.$axios.get('/api/seller')
      .then(function (response) {//獲取到數據之後的操作
        var dataSource = response.data;
        if(dataSource.code == 0){
          //console.log(dataSource.data.comment_num);
          that.seller = dataSource.data;

          //初始化
          that.$nextTick(()=>{
            if(that.seller.poi_env.thumbnails_url_list){
              let imgW = that.$refs.picsItem[0].clientWidth;
              let marginR = 11;
              let width = (imgW + marginR)*that.seller.poi_env.thumbnails_url_list.length;
              that.$refs.picsList.style.width = width + 'px';
              that.scroll = new BScroll(that.$refs.picsView,{
                scrollX: true
              });
            }
          });
        }
      })
      .catch(function (error) {//出錯處裡
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  },
  components:{
    Split,
    BScroll
  }
}
</script>
<style>
@import url("Seller.css");
</style>


