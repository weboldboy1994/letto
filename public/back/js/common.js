
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
