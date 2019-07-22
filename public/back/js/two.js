

$(function(){//入口函数
      var currentPage=1;  //当前页面
      var pageSize   =5;  //页大小
      //一进入页面 发送ajax请求， 获取数据，通过模板引擎渲染， 
      render()
      function render(){
            $.ajax({
                  type:"get",
                  url:"/category/querySecondCategoryPaging",
                  data:{
                        page:currentPage,
                        pageSize:pageSize
                  },
                  dataType:"json",
                  success:function(result){
                        console.log(result)
                        // 结合模板引擎渲染
                        var hmtlStr=template('twotpl',result);
                        $('tbody').html(hmtlStr);

                        //进行分页初始化
                        $('#paginator').bootstrapPaginator({
                              bootstrapMajorVersion:3,
                              currentPage:result.page,//当前页
                              totalPages: Math.ceil(result.total/result.size),//总页数
                               //当页码被点击时调用的回调函数
                               onPageClicked:function(a,b,c,page){
                                    //更新当前页
                                    currentPage=page
                                    //重新渲染
                                    render();
                               }    
                        })
                  }
            })
      }
})