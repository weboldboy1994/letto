
$(function(){
      var currentPage=1  //当前页面是第一页
      var pageSize =5   //每页有五条
      // 01一进入页面，发送ajax请求获取数据,通过模板引擎渲染
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


      //02 点击添加分类按钮，显示模态框
      $('#addBtn').click(function(){
            $('#addModal').modal('show')
      })

      //03 使用表单校验插件,实现表单校验
      $('#form').bootstrapValidator({


            //配置图标
            feedbackIcons: {
                  valid: 'glyphicon glyphicon-ok',  //校验成功
                  invalid: 'glyphicon glyphicon-remove',   //校验失败
                  validating: 'glyphicon glyphicon-refresh'  //校验中
                },

                    //配置字段
            fields:{
                  categoryName:{
                        validators:{//校验规则
                              notEmpty:{message:"一级分类不能为空" } //非空
                        }
                  }
            }

      })

        
      //04  注册表成功事件，阻止默认的成功提交，通过ajax进行提交
      $("form").on("success.form.bv",function(e){
            e.preventDefault();
            //通过ajax 进行表单提交
            $.ajax({
                  type:"post",
                  url:"/category/addTopCategory",
                  data:$('#form').serialize(),
                  dataType:"json",
                  success:function(result){
                        console.log(result)
                        if(result.success){
                              //添加成功
                              //01 关闭模态框
                              $('#addModal').modal("hide")
                              //02 页面重新渲染第一页面
                              currentPage=1     
                              render();
                              //03重置模态框   resetForm(true) 全部重置  表单验证和内容都重置
                              $("#form").data("bootstrapValidator").resetForm(true)
                        }
                  }

                  
            })
      })



})