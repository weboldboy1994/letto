

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

            //将隐藏域校验状态，设置成校验成功状态  updateStatus(字段名，校验状态，校验规则)
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
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

            //手动重置隐藏域的状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID')

            }
      });

      //  06 实现表单校验
      $('#form').bootstrapValidator({
             //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
            excluded: [],//需要对隐藏域进行校验，所以把它设置为空

            //配置图标
            feedbackIcons: {
                  valid: 'glyphicon glyphicon-ok',  //校验成功
                  invalid: 'glyphicon glyphicon-remove',   //校验失败
                  validating: 'glyphicon glyphicon-refresh'  //校验中
                },
            //配置字段
            fields:{
                  //categoryId  分类id
                  //brandName   二级分类名称
                  //brandLogo   图片地址
                  categoryId:{//配置校验规则
                        validators:{
                              notEmpty:{message:"请选择一级分类" }, //提示
                        }
                  },
                  brandName:{
                        validators:{
                              notEmpty:{message:"请输入二级分类" }, //提示
                        }
                  },
                  brandLogo:{
                        validators:{
                              notEmpty:{message:"请选择图片" }, //提示
                        }
                  }
            }
            
      })


      //07  注册表单校验成功事件，阻止默认提交，通过ajax进行提交
      $("#form").on('success.form.bv', function (e) {
            e.preventDefault();
            //使用ajax提交逻辑
            $.ajax({
                  type:'post',
                  url:"/category/addSecondCategory",
                  dataType:'json',
                  data:$('#form').serialize(),
                  success:function(result){
                        console.log(result)
                  if(result.success){
                        //关闭模态框      
                  $('#addModal').modal("hide")
                        //重新渲染第一个页面
                  currentPage=1
                  render()
                        //重置模态框表单,全部重置
                  $('#form').data('bootstrapValidator').resetForm(true)
                  //手动重置文本内容和图片路径
                  $('#dorpdownText').text("请选择一级分类")
                  $('#imgBox img').attr('src','images/none.png')
                  
                  }
                  }
            })
        });
})



// 文件上传思路整理
// 01 引包
// 02准备解构   name告诉后台需要通过哪个来接收文件     data-url指定后台接口地址
// 03进行文件上传初始化  ，配置done 和回调函数