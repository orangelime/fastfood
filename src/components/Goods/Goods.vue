<template>
  <div class="goods">
    <!--分類-->
    <div class="menu-wrapper" ref="menuScroll">
      <ul>
        <!--專場-->
        <li class="menu-item" :class="{'current':currentIndex===0}" @click="selectMenu(0)">
          <p class="text">
            <img :src="container.tag_icon" v-if="container.tag_icon" class="icon" />
            {{container.tag_name}}
          </p>
        </li>
        <!--index為li下標 此處index需+1，因為下標0為專場-->
        <li class="menu-item" v-for="(item,index) in goods" :class="{'current':currentIndex===index+1}" @click="selectMenu(index+1)">
          <p class="text">
            <img :src="item.icon" v-if="item.icon" class="icon" />
            {{item.name}}
          </p>
          <i class="num" v-show="caculateCount(item.spus)">{{caculateCount(item.spus)}}</i>
        </li>
      </ul>
    </div>

    <!--商品列表-->
    <div class="foods-wrapper" ref="foodScroll">
      <ul>
        <!--專場-->
        <li class="container-list food-list-hook">
          <div v-for="item in container.operation_source_list">
            <img :src="item.pic_url"/>
          </div>
        </li>

        <!--具體分類-->
        <li v-for="item in goods" class="food-list food-list-hook">
          <h3 class="title">{{item.name}}</h3>
          <!--具體商品列表-->
          <ul>
            <li v-for="food in item.spus" class="food-item"  @click="showDetail(food)">
              <div class="icon" :style="head_bg(food.picture)"></div>
              <div class="content">
                <h3 class="name">{{food.name}}</h3>
                <p class="desc" v-if="food.description">{{food.description}}</p>
                <div class="extra">
                  <span class="saled">{{food.month_saled_content}}</span>
                  <span class="praise">{{food.praise_content}}</span>
                </div>
                <img class="product" :src="food.product_label_picture"/>
                <p class="price">
                  <span class="text">${{food.min_price}}</span>
                  <span class="unit">/{{food.unit}}</span>
                </p>
              </div>
              <div class="cartcontrol-wrapper">
                <Cartcontrol :food="food"></Cartcontrol>
              </div>
            </li>
          </ul>
        </li>
      </ul>

    </div>
  <!--購物車-->
  <Shopcart :poiInfo="poiInfo" :selectFoods="selectFoods"></Shopcart>
  <!--商品詳情-->
  <Food :food="selectedFood" ref="foodView"></Food>
  </div>

</template>
<script>
//導入better-scroll
import BScroll from 'better-scroll'
//導入shopcart
import Shopcart from 'components/Shopcart/Shopcart'
//導入Cartcontrol
import Cartcontrol from 'components/Cartcontrol/Cartcontrol'
//導入Food
import Food from 'components/Food/Food'

export default {
  data() {
    return {
      container: {},
      goods: [],
      poiInfo:{},
      listHeight:[],
      scrollY:0, //保存滾動值
      menuScroll:{},
      foodScroll:{},
      selectedFood:{}
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
          that.container = dataSource.data.container_operation_source;
          that.goods = dataSource.data.food_spu_tags;
          that.poiInfo = dataSource.data.poi_info;
          //console.log(that.container);
          //console.log(that.goods);

          //調用滾動的初始化方法
          //that.initScroll();  無法滾動
          //開始時 DOM元素沒有渲染 及高度是有問題的
          //在獲取到元素之後 並且DOM已經被渲染 表示列表高度是沒有問題的
          //$nextTick
          that.$nextTick( ()=>{
            //DOM已經更新
            that.initScroll();

            //計算分類區間高度
            that.calculateHeight();
          });
        }
      })
      .catch(function (error) {//出錯處裡
        // handle error
        //console.log(error);
      })
      .then(function () {
        // always executed
      });
  },
  /*  computed: { //計算屬性(不能傳遞參數)  非常重要
    head_bg(){
      return
    }
  }    */
  methods:{
    head_bg(imgName){
      return "background-image: url("+ imgName +");"
    },
    //滾動的初始化
    initScroll(){
      //ref屬性就是用來綁定某個DOM元素或某個組件，然後在this.$refs裡面
      //創建BScroll對象 有返回值 須將值保存起來
      this.menuScroll = new BScroll(this.$refs.menuScroll,{
        //@click="selectMenu(0)" 並不會觸發click事件 默認值為false
        click:true
      });
      this.foodScroll = new BScroll(this.$refs.foodScroll,{
        //可在傳遞參數 better-scroll probeType
        probeType:3,
        click:true
      });

      //添加滾動監聽事件
      this.foodScroll.on('scroll',(pos) => {
        //console.log(pos.y);
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    calculateHeight(){
      //通過$refs獲取到對應的元素
      let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
      //添加到數組區間
      //0~216第一個區間(專場)
      //217~1342(1125+217)  (熱銷)
      let height = 0;
      this.listHeight.push(height);
      for(let i=0;i<foodlist.length;i++){
        let item = foodlist[i];

        //累加
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    //左側點擊事件
    selectMenu(index){
      //console.log(index);//better-scroll scrollToElement
      //獲取對應的li元素
      let foodlist = this.$refs.foodScroll.getElementsByClassName('food-list-hook');
      //根據下標滾動到相對應的元素
      let el = foodlist[index];
      //滾動到對應元素的位置
      this.foodScroll.scrollToElement(el,250);
    },
    caculateCount(spus){
      let count = 0;
      spus.forEach((food) => {
        if(food.count > 0){
          count += food.count;
        }
      });
      return count;
    },
    /*點擊選中的商品列表*/
    showDetail(food){
      //傳值
      this.selectedFood = food;
      //顯示詳情頁
      this.$refs.foodView.showView();
    }
  },
  //根據右側滾動位置確定對應的索引下標 建立左右兩邊的連結
  computed:{
    currentIndex(){
      for(let i=0;i<this.listHeight.length;i++){
        //獲取商品區間的範圍
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i+1]; //可能會出現數組越界的問題

        //是否在上述區間中
        if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
          //console.log(i);
          return i;
        }
      }
      return 0;
    },
    //點選商品放入購物車
    selectFoods(){
      let foods = [];
      //遍歷goods的數組
      this.goods.forEach((good) => {
        //拿到對應的商品
        good.spus.forEach((food) => {
          //商品有選中
          if(food.count>0){
            foods.push(food);
          }
        });
      });
      return foods;
    },
    //計算當前各商品列表的被點擊個數(主食、套餐、飲品...等)
    //涉及參數的傳遞，所以計算屬性無法傳遞，移到方法
    //caculateCount(){}
  },
  components:{
    BScroll,
    Shopcart,
    Cartcontrol,
    Food
  }
}
</script>
<style>
  /*@import url("Goods.css");*/
.goods{
  display:flex;

  /*通過該方式確定高度*/
  position: absolute;
  top:190px;
  bottom: 31px;

  overflow: hidden;
  width: 100%;
}
/*
flex: flex-grow|flex-shrink|flex-basis
默認值flex； 0  |    1      |  auto;
flex-grow：定義放大比例 默認是0 如果存在剩餘空間 也不放大
          此項必選，其他可選擇
flex-shrink：定義縮小比例 默認是1 如果空間不足 該項目將會被縮小
            若屬性為0 其他項目為1 空間不足時 前者不縮小
flex-basis：定義在分配多餘空間之前 項目佔據主軸空間 瀏覽器根據這個屬性 會進行計算佔據是否有多餘空間
            默認值是auto 即項目的本來大小 設為跟width和height屬性值一樣 則項目佔據固定空間
flex-grow:值為1，如果存在剩餘空間，就會放大
*/
.goods .menu-wrapper{
  flex:0 0 85px;
  background: #f4f4f4;
}
.goods .menu-wrapper .menu-item{
  padding: 16px 23px 15px 10px;
  border-bottom: 1px solid #E4E4E4;
  position: relative;
}
.goods .menu-wrapper .menu-item.current{
  /*選中後的樣式 注意.menu-item.current間不須空格*/
  background: white;
  font-weight: bold;
  margin-top: -1px;
}
.goods .menu-wrapper .menu-item .text{
  font-size: 13px;
  color: #333333;
  line-height: 17px;
  vertical-align: middle;

  /*超過兩行文字即顯示省略號，使用webkit的CSS擴展屬性
    適用範圍webkit瀏覽器及移動端
  */
  /*用來顯示一個塊元素顯示的文本行數*/
  -webkit-line-clamp: 2;
  /*必須，將對象作為彈性伸縮盒子模型顯示*/
  display: -webkit-box;
  /*必須，設置或檢索伸縮盒子的子元素排列方式*/
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.goods .menu-wrapper .menu-item .text .icon{
  width: 15px;
  height: 15px;
}
.goods .menu-wrapper .menu-item .num{
  position: absolute;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  color: white;
  background: red;
  right: 5px;
  top: 5px;
  text-align: center;
  font-size: 7px;
  line-height: 13px;
}
.goods .foods-wrapper{
  flex:1;
  /*background: blue;*/
}
/*專場*/
.goods .foods-wrapper .container-list{
  padding: 11px  11px 0 11px;
  border-bottom: 1px solid #E4E4E4;
}
.goods .foods-wrapper .container-list img{
  width: 100%;
  margin-bottom: 11px;
  border-radius: 5px;
}
.goods .foods-wrapper .food-list{
  padding: 11px;
}
.goods .foods-wrapper .food-list .title{
  font-size: 13px;
  height: 13px;
  background:url(btn_yellow_highlighted@2x.png) no-repeat left center;
  background-size: 2px 10px;
  padding-left: 7px;
  margin-bottom: 12px;
}
.goods .foods-wrapper .food-list .food-item{
  display: flex;
  margin-bottom: 25px;
  position: relative;
}
.goods .foods-wrapper .food-list .food-item .cartcontrol-wrapper{
  position: absolute;
  right: 0;
  bottom: 0;
}
.goods .foods-wrapper .food-list .food-item .icon{
  flex:0 0 63px;
  background-position: center;
  background-size: 120% 100%;
  background-repeat: no-repeat;
  margin-right: 11px;
  height: 75px;/*防止圖片變形*/
}
.goods .foods-wrapper .food-list .food-item .content{
  flex:1;
}
.goods .foods-wrapper .food-list .food-item .content .name{
  color: #333333;
  line-height:21px;
  font-size: 16px;
  margin-bottom: 10px;
  padding-right: 27px; /*76-22=54  54/2=27*/
}
.goods .foods-wrapper .food-list .food-item .content .desc{
  font-size: 10px;
  line-height: 19px;
  color: #BFBFBF;
  margin-bottom: 8px;
  /*超出部分顯示省略號*/
  -webkit-line-clamp:1;
  display: -webkit-box;
  -webkit-box-orient:vertical;
  overflow: hidden;
}
.goods .foods-wrapper .food-list .food-item .content .extra{
  font-size: 10px;
  color: #BFBFBF;
  margin-bottom: 7px;
}
.goods .foods-wrapper .food-list .food-item .content .extra .saled{
  margin-right: 14px;
}
.goods .foods-wrapper .food-list .food-item .content .product{
  height: 15px;
  margin-bottom: 6px;
}
.goods .foods-wrapper .food-list .food-item .content .price{
  font-size: 0;
}
.goods .foods-wrapper .food-list .food-item .content .price .text{
  font-size: 14px;
  color: #fb4e44;
}
.goods .foods-wrapper .food-list .food-item .content .price .unit{
  font-size: 12px;
  color: #BFBFBF;
}

</style>


