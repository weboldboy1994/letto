$(function(){//入口函数
      var currentPage=1 //当前页
      var pageSize=5    //页大小

      //一进入页面，请求商品数据，进行页面渲染
      rander()
      function rander(){
            //发送请求渲染
            $.ajax({
                  type:"get",
                  url:"/product/queryProductDetailList",
                  data:{
                        page:currentPage,
                        pageSize:pageSize
                  },
                  dataType:"json",
                  success:function(result){
                        console.log(result)
                        // 通过template生成模板
                        var htmlStr=template('productTpl',result)
                        $(' tbody').html(htmlStr)
                  }
            })
      }

})