

$(function(){//入口函数
      var currentPage=1;  //当前页面
      var pageSize   =5;  //页大小
      //01一进入页面 发送ajax请求， 获取数据，通过模板引擎渲染， 
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

      //02点击添加分类按钮，显示添加模态框
      $('#addBtn').click(function(){
            $('#addModal').modal('show')
      })

      //03发送ajax请求，获取一级分类全局数据，通过模板引擎渲染
      //
      $.ajax({
           type:"get",
           url:"/category/queryTopCategoryPaging",
           data:{
                 page:1,
                 pageSize:100
           },
           dataType:"json",
           success:function(result){
                  console.log(result)
                  // 结合模板和数据进行渲染
                  var hmtlStr=template('dropnTpl',result)
                  $('#dropdown-menu').html(hmtlStr)
           }
      })


      // 04通过事件委托，给dropdown-menu下的所有a都绑定  点击事件
      $('#dropdown-menu').on("click","a",function(){
            //获取a的文本
            var txt=$(this).text();
            //设置 给dorpdownText
            $('#dorpdownText').text(txt)

            //  获取选中的id
            var id = $(this).attr("data-id")
            //  把id设置给input框
            $('[name="categoryId"]').val(id)
      })

      //  05 进行文件上传初始化
      $("#fileupload").fileupload({
            dataType:"json",
            //e：事件对象
            //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
            done:function (e, data) {
              console.log(data.result.picAddr);
            //   获取上传图片得到的地址
              var imgUrl = data.result.picAddr;
            //   赋值给img
            $('#imgBox img').attr("src",imgUrl)

            //将图片地址设置给input
            $('[name="brandLogo"]').val(imgUrl)

            }
      
      });

})

// 文件上传思路整理
// 01 引包
// 02准备解构   name告诉后台需要通过哪个来接收文件     data-url指定后台接口地址
// 03进行文件上传初始化  ，配置done 和回调函数