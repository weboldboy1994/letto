
$(function(){  //入口函数
      var currentPage=1
      var pageSize=5

      // 一进入页面就发送ajax请求，获取用户列表数据，通过模板引擎渲染
      render();
      function render(){

            $.ajax({
                  type:"get",
                  url:"/user/queryUser",
                  data:{
                        page:currentPage,
                        pageSize:pageSize
                  },
                  dataType:"json",
                  success:function(result){
                        console.log(result)
                            //template(模板id，数据对象)
                        //     在模板中可以任意使用数据对象中的属性
                         var hmtlStr=template('tpl',result);
                         $('tbody').html(hmtlStr);
      
      
                            //分页初始化
                   $('#paginator').bootstrapPaginator({
                              //配置 bootstrap版本
                              bootstrapMajorVersion:3 ,//指定当前bootstrap的版本是3
                              currentPage:result.page,//当前页
                              totalPages: Math.ceil(result.total/result.size),//总页数
                              //当页码被点击时调用的回调函数
                              onPageClicked:function(a,b,c,page){
                                    //通过page获取点击的页码
                                    console.log(page)
                                    //刚新当前页
                                    currentPage=page
                                          //重新渲染
                                    render();
                              }
                         })
                  }
            })

      }

})