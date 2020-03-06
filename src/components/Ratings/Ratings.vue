<template>
  <div class="ratings" ref="ratingView">
    <div class="ratings-wrapper">
      <div class="overview">
        <div class="overview-left">
          <!--商家評分-->
          <div class="comment-score">
            <p class="score">{{ratings.comment_score}}</p>
            <p class="text">商家評分</p>
          </div>
          <!--口味包裝星星數-->
          <div class="other-score">
            <div class="quality-score item">
              <span class="text">口味</span>
              <Star :score="ratings.quality_score" class="star"></Star>
              <span class="score">{{ratings.quality_score}}</span>
            </div>
            <div class="pack-score item">
              <span class="text">包裝</span>
              <Star :score="ratings.pack_score" class="star"></Star>
              <span class="score">{{ratings.pack_score}}</span>
            </div>
          </div>
        </div>
        <!--配送評分-->
        <div class="overview-right">
          <div class="delivery_score">
            <p class="score">{{ratings.delivery_score}}</p>
            <p class="text">配送評分</p>
          </div>
        </div>
      </div>
      <!--分隔條-->
      <Split></Split>
      <!--評論區-->
      <div class="content">
        <!--評論分類-->
        <div class="rating-select" v-if="ratings.tab">
          <span class="item" @click="selectTypeFn(2)" :class="{'active':selectType==2}">
            {{ratings.tab[0].comment_score_title}}
          </span>
          <span class="item" @click="selectTypeFn(1)" :class="{'active':selectType==1}">
            {{ratings.tab[1].comment_score_title}}
          </span>
          <span class="item" @click="selectTypeFn(0)" :class="{'active':selectType==0}">
            <img src="./icon_sub_tab_dp_normal@2x.png" v-show="selectType!=0"/>
            <img src="./icon_sub_tab_dp_highlighted@2x.png" v-show="selectType==0"/>
            {{ratings.tab[2].comment_score_title}}
          </span>
        </div>
        <!--評論標籤-->
        <div class="labels-view">
          <span v-for="item in ratings.labels" class="item" :class="{'highlight':item.label_star>0}">
            {{item.content}}{{item.label_count}}
          </span>
        </div>
        <!--評論內容-->
        <ul class="rating-list">
          <li v-for="comment in selectComments" class="comment-item">
            <div class="comment-header">
              <img :src="comment.user_pic_url" v-if="comment.user_pic_url"/>
              <img src="./anonymity.png" v-if="!comment.user_pic_url" />
            </div>
            <div class="comment-main">
              <div class="user">
                {{comment.user_name}}
              </div>
              <div class="time">
                {{formatDate(comment.comment_time)}}
              </div>
              <div class="star-wrapper">
                <span class="text">評分</span>
                <Star :score="comment.order_comment_score" class="star"></Star>
              </div>
              <div class="c_content" v-html="commentStr(comment.comment)">
              </div>
              <div class="img-wrapper" v-if="comment.comment_pics.length">
                <img v-for="item in comment.comment_pics" :src="item.thumbnail_url"/>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
//導入Star組件
import Star from 'components/Star/Star'
//導入Split
import Split from 'components/Split/Split'
//導入better-scroll
import BScroll from 'better-scroll'

const ALL = 2; //表示評論分類的點擊事件 2為全部
const PICTURE = 1; //表示評論分類的點擊事件 1為有附圖的
const COMMENT = 0; //表示評論分類的點擊事件 0為只有文字評論的

export default {
  data(){
    return{
      ratings:{},
      selectType:ALL
    }
  },
  created(){
    //通過axios發起get請求//評價頁面數據
    let that = this;
    this.$axios.get('/api/ratings')
      .then(function (response) {//獲取到數據之後的操作
        var dataSource = response.data;
        if(dataSource.code == 0){
          //console.log(dataSource.data.comment_num);
          that.ratings = dataSource.data;

          //初始化滾動
          that.$nextTick(()=>{
            if(!that.scroll){
              that.scroll = new BScroll(that.$refs.ratingView,{
                click:true
              });
            }else{
              that.scroll.refresh();
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
  methods:{
    selectTypeFn(type){
      this.selectType = type;

      //顯示有圖的評論
      //先刷新操作
      this.$nextTick(()=>{
        this.scroll.refresh();
      })
    },
    formatDate(time){
      let date = new Date(time*1000);
      //時間格式
      let fmt = 'yyyy.MM.dd';
      if(/(y+)/.test(fmt)){
        //年
        let year = date.getFullYear().toString();
        fmt = fmt.replace(RegExp.$1,year);
      }
      if(/(M+)/.test(fmt)){
        //月 +1的原因是取得的只到11
        let month = date.getMonth() + 1;
        if(month<10){
          //1~9月前面須補零
          month = '0' + month;
        }
        fmt = fmt.replace(RegExp.$1,month);
      }
      if(/(d+)/.test(fmt)){
        //日
        let mydate = date.getDate();
        if(mydate<10){
          //1~9日前面須補零
          mydate = '0' + mydate;
        }
        fmt = fmt.replace(RegExp.$1,mydate);
      }
      return fmt;
    },
    commentStr(content){
      let rel = /#[^#]+#/g;
      return content.replace(rel, '<i>$&</i>');
    }
  },
  //評論分類不同的設置
  computed:{
    selectComments(){
      if(this.selectType == ALL){
        //顯示評論分類:全部
        return this.ratings.comments;
      }else if(this.selectType == PICTURE){
        //顯示評論分類:有附圖
        //先遍歷
        let arr = [];
        this.ratings.comments.forEach((comment)=>{
          if(comment.comment_pics.length){
            arr.push(comment);
          }
        });
        return arr;
      }else{
        //顯示評論分類:只有文字評論
        return this.ratings.comments_dp.comments;
      }
    }
  },
  components:{
    Star,
    Split,
    BScroll
  }
}
</script>
<style>
  /*@import url("Ratings.css");*/
.ratings{
  position: absolute;
  left: 0;
  top: 191px;
  bottom:0;
  width:100%;
  overflow: hidden;
}
.ratings .ratings-wrapper .overview{
  padding: 20px 0 18px 0;
  display: flex;
}
.ratings .ratings-wrapper .overview .overview-left{
  flex: 1;
  padding-left: 26px;
}
/*商家評分*/
.ratings .ratings-wrapper .overview .overview-left .comment-score{
  float: left;
  width: 48px;
  text-align: center;
  margin-right: 26px;
}
.ratings .ratings-wrapper .overview .overview-left .comment-score .score{
  font-size: 23px;
  font-weight: 800;
  color: #ffb000;
  margin-bottom: 9px;
}
.ratings .ratings-wrapper .overview .overview-left .comment-score .text{
  font-size: 11px;
  color: #666666;
}
/*口味包裝星星數*/
.ratings .ratings-wrapper .overview .overview-left .other-score{
  float: left;
  margin-top: 3px;
}
.ratings .ratings-wrapper .overview .overview-left .other-score .item{
  height: 11px;
}
.ratings .ratings-wrapper .overview .overview-left .other-score .item .text{
  font-size: 11px;
  color: #666666;
  margin-right: 11px;
  float: left;/*因為text和score是span元素，但中間有star組件，可能會造成排版問題，利用float來解決*/
}
.ratings .ratings-wrapper .overview .overview-left .other-score .item .star{
  float: left;
  margin-right: 11px;
}
.ratings .ratings-wrapper .overview .overview-left .other-score .item .score{
  font-size: 11px;
  color: #ffb000;
  float: left;
}
.ratings .ratings-wrapper .overview .overview-left .other-score .quality-score{
  margin-bottom: 14px;
}
/*配送評分*/
.ratings .ratings-wrapper .overview .overview-right{
  flex: 0 0 100px;
  text-align: center;
  border-left: 1px solid #9d9d9d;
}
.ratings .ratings-wrapper .overview .overview-right .delivery_score{

}
.ratings .ratings-wrapper .overview .overview-right .delivery_score .score{
  font-size:19px;
  font-weight: 500;
  color: #999999;
  margin-bottom: 10px;
  margin-top: 3px;
}
.ratings .ratings-wrapper .overview .overview-right .delivery_score .text{
  font-size: 11px;
  color: #999999;
}
/*評論區*/
.ratings .ratings-wrapper .content{
  padding: 16px;
}
/*評論分類*/
.ratings .ratings-wrapper .content .rating-select{
  width: 100%;
  box-sizing: border-box;
  font-size: 0;
  border: 1px solid #ffb000;
  margin-bottom: 11px;
  border-radius: 3px;
  border-right: 0;
}
.ratings .ratings-wrapper .content .rating-select .item{
  width: 33.3%;
  display: inline-block;
  height: 33px;
  line-height: 33px;
  font-size: 14px;
  text-align: center;
  border-right: 1px solid #ffb000;
  box-sizing: border-box;/*寬度只能是33.3%*/
  color: #ffb000;
}
.ratings .ratings-wrapper .content .rating-select .item:last-child{
  /*border-right: 0;*/
}
.ratings .ratings-wrapper .content .rating-select .item:last-child img{
  height: 14px;
  vertical-align: middle;
}
.ratings .ratings-wrapper .content .rating-select .item.active{
  background: #ffb000;
  color: black;
}
/*評論標籤*/
.ratings .ratings-wrapper .content .labels-view{
  /*margin-bottom: 14px;*/
}
.ratings .ratings-wrapper .content .labels-view .item{
  display: inline-block;
  height: 27px;
  line-height: 27px;
  padding: 0 10px;
  font-size: 12px;
  background: #f4f4f4;
  margin-right: 6px;
  margin-bottom: 6px;
  border-radius: 3px;
  color: #999999;
}
.ratings .ratings-wrapper .content .labels-view .item.highlight{
  color: #656565;
}
/*評論內容*/
.ratings .ratings-wrapper .content .rating-list{

}
.ratings .ratings-wrapper .content .rating-list .comment-item{
  padding: 16px 16px 16px 0;
  border-bottom: 1px solid #f4f4f4;
  width: 100%;
  box-sizing: border-box;
  display: flex;
}

.ratings .ratings-wrapper .content .rating-list .comment-item .comment-header{
  flex: 0 0 35px;
  margin-right: 11px;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-header img{
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main{
  flex: 1;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .user{
  width: 50%;
  float: left;
  font-size: 11px;
  color: #333333;
}

.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .time{
  width: 51%;
  float: right;
  text-align: right;
  font-size: 9px;
  color: #666666;
}

.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .star-wrapper{
  float: left;
  margin-top: 12px;
  margin-bottom: 15px;
  width: 100%;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .star-wrapper .text{
  color: #999999;
  font-size: 11px;
  float: left;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .star-wrapper .star{
  float: left;
  margin-left: 7px;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .c_content{
  font-size: 13px;
  line-height: 19px;
  float: left;
  width: 100%;/*加上這個內容就不會跑到評分旁邊去*/
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .c_content i{
  color:#576D95;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .img-wrapper{
  margin-top: 9px;
  float: left;
}
.ratings .ratings-wrapper .content .rating-list .comment-item .comment-main .img-wrapper img{
  width: 175px;
}

</style>


