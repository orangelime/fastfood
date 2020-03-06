var express = require('express');
var port = 8088;

var app = express();

var router = express.Router();
router.get('/',function(req,res,next){
  req.url = '/index.html';
  next();
});

app.use(router);

//接口數據
var goods = require('./data/01-商品页(点菜).json');

var ratings = require('./data/02-商品页(评价).json');

var seller = require('./data/03-商品页(商家).json');

// 2、路由
var routes = express.Router();

// 3、编写接口
routes.get('/goods', (req,res) => {

  // 返回数据给客户端，返回json数据
  res.json(goods);
}),

routes.get('/ratings', (req,res) => {

  // 返回数据给客户端，返回json数据
  res.json(ratings);
}),

routes.get('/api/seller', (req,res) => {

  // 返回数据给客户端，返回json数据
  res.json(seller);
});

//4.中間件
app.use('/api',routes);

//定義static目錄 指向項目目錄文件./dist目錄
app.use(express.static('./dist'));

//啟動express
module.express = app.listen(port,function(err){
  if(err){
    console.log(err);
    retuen;
  }
  console.log('http://localhost:' + port + '\n');
});
