
//   精度条 条 条



//实现在第一个ajax发送的时候，开启精度条
//在所有的ajax请求都完成的时候，结束进度条

// .ajaxComplete()   //当ajax完成的时候注册（调用），每个ajax请求完成时候都调用，不管成功失败
// Register a handler to be called when Ajax requests complete. This is an AjaxEvent.


// .ajaxError()    //当ajax失败的时候调用 
// Register a handler to be called when Ajax requests complete with an error. This is an Ajax Event.


// .ajaxSuccess()  //当ajax成功的时候调用
// Attach a function to be executed whenever an Ajax request completes successfully. This is an Ajax Event.



// .ajaxSend()   // 在ajax请求发送前调用
// Attach a function to be executed before an Ajax request is sent. This is an Ajax Event.



// .ajaxStart()  // 在第一个ajax发送时调用
// Register a handler to be called when the first Ajax request begins. This is an Ajax Event.



// 。ajaxStop()   //所有ajax请求完成时，调用



//在第一个ajax发送时调用
$(document).ajaxStart(function(){
      //开启进度条
      NProgress.start() 
})


//在所有的ajax请求完成时， 调用
$(document).ajaxStop(function(){
      //结束精度条
      NProgress.done()
})



// 登录拦截  功能   登录页面不需要校验，不用登录就能访问
//因为前后分离了，前段不知道这个用户是否登录了，但是后端知道， 可以发送ajax请求 查询用户的状态 是不是登录的
// 01用户已经登录 ，可以让用户继续访问
// 02如果用户未登录，拦截到登录页

// 登录页面是不需要发送ajax请求校验的
//如果 indexof返回的是-1 说明不是登录页面 所以要发送ajax请求
if(location.href.indexOf("login.html")===-1){
      $.ajax({
            type:"get",
            url:"/employee/checkRootLogin",  //判断是否登录的接口
            dataType:"json",
            success:function(result){     
                  if(result.success){//如果已经登录 true  可以继续访问
                     
                  }
                  if(result.error===400){
                        location.href="login.html"
                  }
            }
      })
}





$(function(){//入口函数

      // 分类管理的切换功能
$('.category').click(function(){
      //点击显示/影藏
      $('.nav .child').stop().slideToggle();
})


      // 左侧侧边栏切换功能
$('.icon_menu').click(function(e){
      e.preventDefault()
      // toggleClass切换 添加或删除
      $('.hh_aside').toggleClass("hidemeun")
      $('.hh_topbar').toggleClass("hidemeun")
      $('.hh_mian').toggleClass("hidemeun")
})
      



//点击退出，弹出一个模态框
 $('.icon_logout').click(function(e){
      e.preventDefault()
       //显示模态框
       $('#logoutModle').modal('show')
 })

//点击模态框的退出按钮 
$("#logoutBtn").click(function(){
      //当点击退出  发送ajax请求 点击退出
      $.ajax({
            url:"/employee/employeeLogout",
            type:"get",
            dataType:"json",
            success:function(result){
                 if(result.success){//如果返回的是true 说明退出成功了
                        //退出成功 ,跳转登录页
                        location.href="login.html"
                 }
            }

      })
})




});
