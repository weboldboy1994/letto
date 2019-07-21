
$(function(){  //入口函数
      // 一进入页面就发送ajax请求，获取用户列表数据，通过模板引擎渲染
      $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                  page:1,
                  pageSize:5
            },
            dataType:"json",
            success:function(result){
                  console.log(result)
                      //template(模板id，数据对象)
                  //     在模板中可以任意使用数据对象中的属性
                   var hmtlStr=template('tpl',result);
                   $('tbody').html(hmtlStr);
            }
      })

})