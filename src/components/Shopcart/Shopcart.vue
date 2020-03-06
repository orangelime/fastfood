<template>
  <div class="shopcart" :class="{'hightlight':totalCount > 0}">
    <div class="shopcart-wrapper">
      <div class="content-left">
        <div class="logo-wrapper" :class="{'hightlight':totalCount > 0}" @click="toggleList">
          <span class="icon-shopping_cart logo" :class="{'hightlight':totalCount > 0}"></span>
          <!--v-show 有數據就顯示 沒數據為0-->
          <i class="num" v-show="totalCount">{{totalCount}}</i>
        </div>
        <div class="desc-wrapper">
          <p class="total-price" v-show="totalPrice">$ {{totalPrice}}</p>
          <p class="tip" :class="{'hightlight':totalCount > 0}">另需{{poiInfo.shipping_fee_tip}}</p>
        </div>
      </div>
      <div class="content-right" :class="{'hightlight':totalCount > 0}">
        {{payStr}}
      </div>
      <!--購物車詳情-->
      <div class="shopcart-list" v-show="listShow" :class="{'show':listShow}">
        <div class="list-top" v-if="poiInfo.discounts2">
          {{poiInfo.discounts2[0].info}}
        </div>
        <div class="list-header">
          <h3 class="title">1號口袋</h3>
          <div class="empty" @click="emptyFn">
            <img src="./ash_bin.png"/>
            <span>清空購物車</span>
          </div>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food-item" v-for="food in selectFoods">
              <div class="desc-wrapper">
                <div class="desc-left">
                  <p class="name">{{food.name}}</p>
                  <p class="unit" v-show="!food.description">{{food.unit}}</p>
                  <p class="description" v-show="food.description">{{food.description}}</p>
                </div>
                <div class="desc-right">
                  <span class="price">${{food.min_price}}</span>
                </div>
              </div>
              <div class="cartcontrol-wrapper">
                <Cartcontrol :food="food"></Cartcontrol>
              </div>
            </li>
          </ul>
        </div>
        <div class="list-bottom"></div>
      </div>
    </div>
      <!--購物車詳情上面的黑色部分-->
      <div class="shopcart-mask" v-show="listShow" @click="hideMask"></div>
  </div>
</template>
<script>
import Cartcontrol from 'components/Cartcontrol/Cartcontrol';
//導入better-scroll
import BScroll from 'better-scroll'
export default {
  data(){
    return{
      fold:true
    }
  },
  props:{
/*    min_price_tip:{
      type:String,
      default:''
    },
    shipping_fee_tip:{
      type:String,
      default:''
    },
*/
    poiInfo:{
      type:Object,
      default:{}
    },
    //選中的商品有哪些
    selectFoods:{
      type:Array,
      default(){
        return[
/*          {
            //商品價格及個數
            min_price:10,
            count:3
          },
          {
            min_price:7,
            count:1
          }
*/
        ];
      }
    }
  },
  computed:{
    //獲取商品總個數
    totalCount(){
      let num = 0;
      this.selectFoods.forEach((food) => {
        num += food.count;
      });
      return num;
    },
    //總金額
    totalPrice(){
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.min_price * food.count;
      });
      return total;
    },
    //購物車結算按鈕顯示
    payStr(){
      if(this.totalCount > 0){
        return "去結算"
      }else{
        return this.poiInfo.min_price_tip;
      }
    },
    //透過計算屬性來顯示或隱藏 data
    listShow(){
      if(!this.totalCount){
        //個數為0
        this.fold = true;
        return false;
      }
      let show = !this.fold;

      //BScroll相關操作
      if(show){
        /*if(!this.shopScroll){*/
          /*上述不能產生滾動效果*/
          /*DOM元素更新完後 才去計算獲取它的高度*/
          this.$nextTick(() =>{
            if(!this.shopScroll){
              this.shopScroll = new BScroll(this.$refs.listContent,{
                //派發點擊事件
                click:true
              });
            }else{
              this.shopScroll.refresh();
            }
          });
      }
      return show;
    }
  },
  methods:{
    toggleList(){
      //如果個數為0
      if(!this.totalCount){
        return;
      }
      //如果不為0
      this.fold = !this.fold;
    },
    emptyFn(){
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    hideMask(){
      this.fold = true;
    }
  },
  components:{
    Cartcontrol,
    BScroll
  }
}
</script>
<style>
  /*@import url("Shopcart.css");*/
.shopcart-wrapper{
  width: 100%;
  height:51px;
  background: #514f4f;
  position: fixed;/*沒打就跟著跑到右手邊去，變成三大欄了*/
  left: 0;
  bottom: 0;
  display: flex;
  z-index: 99;
}
.shopcart-wrapper.hightlight{
  background: #2d2b2a;
}
.shopcart-wrapper .content-left{
  flex: 1;
}
.shopcart-wrapper .content-left .logo-wrapper{
  width: 50px;
  height: 50px;
  background: #666666;
  border-radius: 50%;
  position: relative;
  top: -14px;
  left: 10px;
  text-align: center;
  float: left;
}
.shopcart-wrapper .content-left .logo-wrapper.hightlight{
  background: #ffd161;
  /*z-index: 99;讓購物車顯示出來*/
}
.shopcart-wrapper .content-left .logo-wrapper .logo{
  font-size: 28px;
  color: #c4c4c4;
  line-height: 50px;
}
.shopcart-wrapper .content-left .logo-wrapper .logo.hightlight{
  color: #2d2b2a;
}
.shopcart-wrapper .content-left .logo-wrapper .num{
  width: 15px;
  height: 15px;
  line-height: 15px;
  border-radius: 50%;
  font-size: 9px;
  color: white;
  background: red;
  position: absolute;
  right: 0;
  top: 0;
}
.shopcart-wrapper .content-left .desc-wrapper{
  float: left;
  margin-left: 13px;
}
.shopcart-wrapper .content-left .desc-wrapper .total-price{
  line-height: 33px;
  font-size: 18px;
  color: white;
}
.shopcart-wrapper .content-left .desc-wrapper .tip{
  font-size: 12px;
  color: #bab9b9;
  line-height: 51px;
}
.shopcart-wrapper .content-left .desc-wrapper .tip.hightlight{
  line-height: 12px;
}
.shopcart-wrapper .content-right{
  flex: 0 0 110px;
  font-size: 15px;
  color: #bab9b9;
  line-height:51px;
  text-align: center;
  font-weight: bold;
}
.shopcart-wrapper .content-right.hightlight{
  background: #ffd161;
  color: #2d2b2a;
}
/*購物車詳情*/
.shopcart-wrapper .shopcart-list{
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: -1;
}
.shopcart-wrapper .shopcart-list.show{
  transform: translateY(-100%);
}
.shopcart-wrapper .shopcart-list .list-top{
  height: 30px;
  text-align: center;
  font-size: 11px;
  background: #f3e6c6;
  line-height: 30px;
  color: #646158;
}
.shopcart-wrapper .shopcart-list .list-header{
  height: 30px;
  background: #f4f4f4;
}
.shopcart-wrapper .shopcart-list .list-header .title{
  float: left;
  border-left: 4px solid #53c123;
  padding-left: 6px;
  line-height: 30px;
  font-size: 12px;
}
.shopcart-wrapper .shopcart-list .list-header .empty{
  float: right;
  line-height: 30px;
  margin-right: 10px;
  font-size:0;
}
.shopcart-wrapper .shopcart-list .list-header .empty img{
  height: 14px;
  margin-right: 9px;
  vertical-align: middle;
}
.shopcart-wrapper .shopcart-list .list-header .empty span{
  font-size: 12px;
  vertical-align: middle;
}
.shopcart-wrapper .shopcart-list .list-content{
  max-height: 360px;/*862-60-60-22=720 720/2=360*/
  overflow: hidden;
  background: white;
}
.shopcart-wrapper .shopcart-list .list-content .food-item{
  height: 38px;/*60-12-10=38*/
  padding: 12px 12px 10px 12px;
  border-bottom: 1px solid #f4f4f4;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper{
  float: left;
  width: 240px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left{
  float: left;
  width: 170px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .name{
  font-size: 16px;
  margin-bottom: 8px;
  /*超出部分隱藏*/
  -webkit-line-clamp:1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 16px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .unit{
  font-size: 12px;
  color: #b4b4b4;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-left .description{
  font-size: 12px;
  color: #b4b4b4;
  /*超出部分隱藏*/
  /*-webkit-line-clamp:1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  */
  overflow: hidden;
  height: 12px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right{
  float:right;
  width: 70px;
  text-align: right;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .desc-wrapper .desc-right .price{
  font-size: 12px;
  line-height: 38px;
}
.shopcart-wrapper .shopcart-list .list-content .food-item .cartcontrol-wrapper{
  float: right;
  margin-top: 6px;
}
/*購物車詳情上面的黑色部分*/
.shopcart .shopcart-mask{
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 98px;
  background: rgba(7,17,27,0.6);
}


</style>


