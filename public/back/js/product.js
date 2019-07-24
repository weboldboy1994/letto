$(function(){//入口函数
      var currentPage=1 //当前页
      var pageSize=5    //页大小

      //01 一进入页面，请求商品数据，进行页面渲染
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
                        // console.log(result)
                        // 通过template生成模板
                        var htmlStr=template('productTpl',result)
                        $(' tbody').html(htmlStr)
 
                        //分页初始化
                        $('#paginator').bootstrapPaginator({
                              bootstrapMajorVersion:3,//版本号
                              currentPage:result.page,//当前页
                              totalPages: Math.ceil(result.total/result.size),   //总页数
                              //给页码添加点击事件
                              onPageClicked:function(a,b,c,page){
                                    //更新当前页
                                    currentPage=page;
                                    //重新渲染
                                    rander();
                              }
                        })
                  }
            })
      }

      //02点击添加商品，显示模态框
      $('#addBtn').click(function(){
            $('#addModal').modal('show');

            //发送ajax请求，请求所有二级分类数据，进行下拉列表渲染
            //通过分页接口，模拟获取全局数据的接口
            $.ajax({
                  type:"get",
                  url:"/category/querySecondCategoryPaging",
                  data:{
                        page:1,
                        pageSize:100
                  },
                  dataType:"json",
                  success: function(result){
                        console.log(result)
                        var htmlStr=template('dropdownTpl',result)
                        $('#dropdown-menu').html(htmlStr)
                  }
                  
            })
      })


      //03给dropdown-menu下面的a注册点击事件，通过事件委托
      $('#dropdown-menu').on("click",'a',function(){
            //设置文本
            var txt=$(this).text()
            $('#dorpdownText').text( txt );
            //设置id给隐藏域
            var id=$(this).data("id")
            $('[name="brandId]').val(id)
            
      })

})