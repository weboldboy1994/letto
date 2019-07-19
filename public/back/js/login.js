$(function(){  //入口函数
      //查找页面id是form的表单 绑定插件
      //配置的字段与input中的 name="username"是关联的
      $("#form").bootstrapValidator({
             //2. 指定校验时的图标显示，默认是bootstrap风格
  feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',  //校验成功
      invalid: 'glyphicon glyphicon-remove',   //校验失败
      validating: 'glyphicon glyphicon-refresh'  //校验中
    },


            //配置字段
            fields:{
                  username:{
                        //配置校验规则
                        validators:{
                              notEmpty:{message:"用户名不能为空" }, //非空
                              stringLength:{ min:2 ,max:6, message:"用户名长度必须在2~6位"},    //长度校验
                              callback:{message:"用户名不存在"}
                        }
                  },
                  password:{
                        validators:{
                              notEmpty:{message:"密码不能为空"},
                              stringLength:{ min:6, max:12,message:"密码长度必须是6~12位"},
                              callback:{message:"密码不正确"}
                        }
                  }
            }
      });


      //注册表单验证成功事件
      $('#form').on("success.form.bv",function(e){
            //阻止默认提交
            e.preventDefault();

            //通过ajax进行提交
            $.ajax({
                  type:"post",
                  url:"/employee/employeeLogin",
                  data:$('#form').serialize(),//获取 查询字符串
                  dataType:"json",
                  success:function(result){//返回的结果
                        console.log(result)
                        if(result.success){
                              //跳转首页
                              location.href="index.html"
                        }
                        
                        if(result.error=="1000"){
                           
                              // 01 字段名称   
                              //02校验状态 INVALID or VALID 失败 或成功
                              // 03校验 规则  提示文字
                   $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");

                        }

                        if(result.error=="1001"){
                             
                    $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
                        }
                  }
            })

      })


      //重置按钮
      $('[type="reset"]').click(function(){
            //查找表单     注册                    重置（）布尔值   true 内容和状态  false 只重置状态
            $('form').data("bootstrapValidator").resetForm(false)
      })


})