
$(function(){  //入口函数
      var currentPage=1  //当前页
      var pageSize=5     //每页多少条
      var currentId;    //当前选中的用户id
      var isDelete;

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


      //2点击启用按钮，显示模态框，通过事件委托绑定事件
      $('tbody').on("click",".btn",function(){
            //显示模态框
            $('#userModle').modal('show')
            //获取用户id   jq中提供了获取自定义属性的方法  data()
            currentId=$(this).parent().data("id")

            //  1表示 已启用   0表示 已禁用   传给后天几，后天就设置用户状态为几
            //如果是禁用按钮，说明需要将该用户置成禁用状态，传0
            isDelete=$(this).hasClass("btn-danger")?0:1
      })


      //3点击确认按钮，发送ajax请求修改对应用户状态，需要两个参数，一个是用户id  一个是用户状态isDelete
      $('#submitBtn').click(function(){
            $.ajax({
                  type:"post",
                  url:"/user/updateUser",
                  data:{
                        id:currentId,
                        isDelete:isDelete
                  },
                  dataType:"json",
                  success:function(result){
                        
                        if(result.success){
                              //01 关闭模态框
                              $('#userModle').modal("hide")
                               //02 页面要重新渲染
                               render()
                        }
                  }
            })
      })

})