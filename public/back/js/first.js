
$(function(){
      var currentPage=1  //当前页面是第一页
      var pageSize =5   //每页有五条
      // 1一进入页面，发送ajax请求获取数据,通过模板引擎渲染
      render();
      function render(){

            $.ajax({
                  type:"get",
                  url:"/category/queryTopCategoryPaging",
                  data:{
                        page:currentPage,
                        pageSize:pageSize
                  },
                  dataType:"json",
                  success:function(result){
                        console.log(result)
                        //04将数据和模板相结合，进行页面渲染
                        var hmtlStr=template('tpl',result);
                        $('tbody').html(hmtlStr);
      
                        // 进行分页初始化
                        $('#paginator').bootstrapPaginator({
                              //指定bootstrap版本
                              bootstrapMajorVersion:3,//3版本的boot
                              totalPages: Math.ceil(result.total/result.size),  //总页数
                              currentPage:result.page,
                              //注册点击事件
                              onPageClicked:function(a,b,c,page){
                                    //更新当前页面
                                    currentPage=page
                                    // 重新渲染
                                    render();
                              }
                        })
                  }
            })

      }
})