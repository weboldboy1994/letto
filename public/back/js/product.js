$(function(){//入口函数
      var currentPage=1 //当前页
      var pageSize=5    //页大小
      var picArr=[]; //
      //01 一进入页面，请求商品数据，进行页面渲染
      rander()
      function rander(){
            //发送请求渲染
            $.ajax({
                  type:"get",
                  url:"/product/queryProductDetailList",
                  data:{
                        page:currentPage,
                        pageSize:pageSize
                  },
                  dataType:"json",
                  success:function(result){
                        // console.log(result)
                        // 通过template生成模板
                        var htmlStr=template('productTpl',result)
                        $(' tbody').html(htmlStr)
 
                        //分页初始化
                        $('#paginator').bootstrapPaginator({
                              bootstrapMajorVersion:3,//版本号
                              currentPage:result.page,//当前页
                              totalPages: Math.ceil(result.total/result.size),   //总页数
                              //给页码添加点击事件
                              onPageClicked:function(a,b,c,page){
                                    //更新当前页
                                    currentPage=page;
                                    //重新渲染
                                    rander();
                              }
                        })
                  }
            })
      }

      //02点击添加商品，显示模态框
      $('#addBtn').click(function(){
            $('#addModal').modal('show');

            //发送ajax请求，请求所有二级分类数据，进行下拉列表渲染
            //通过分页接口，模拟获取全局数据的接口
            $.ajax({
                  type:"get",
                  url:"/category/querySecondCategoryPaging",
                  data:{
                        page:1,
                        pageSize:100
                  },
                  dataType:"json",
                  success: function(result){
                        console.log(result)
                        var htmlStr=template('dropdownTpl',result)
                        $('#dropdown-menu').html(htmlStr)
                  }
                  
            })
      })


      //03给dropdown-menu下面的a注册点击事件，通过事件委托
      $('#dropdown-menu').on("click",'a',function(){
            //设置文本
            var txt=$(this).text()
            $('#dorpdownText').text( txt );
            //设置id给隐藏域
            var id=$(this).data("id")

            $('[name="brandId"]').val(id)
            console.log( $('[name="brandId"]').val())   
            // 此刻是凌晨0.41因为 $('[name="brandId]').val(id)这个，找了20分钟bug  靠靠靠 一万头cnm


            //重置校验状态为 VALID
            $('#form').data('bootstrapValidator').updateStatus("brandId","VALID")
            
      })


      //04 文件上传初始化
      //  多文件上传时,插件会遍历选中的图片，发送多次请求到服务器，将来响应多次，
      // 每次响应都会调用一次我们的done方法
      // 定义用来存储已上传图片的数组
     
      $('#fileupload').fileupload({
            //返回的数据格式
            dataType:"json",
           //文件上传完成时调用的回调函数
           done:function(e,data){
            //      console.log(data.result)
                 picArr.unshift(data.result);//往数据的最前面追加 图片对象
            
            // 往imgBox最前面追加img元素
            $('#imgBox').prepend('<img src="'+data.result.picAddr+'" width="50px">')

               //通过判断数组长度,如果数组长度大于3，将数组最后一个移除
               if(picArr.length>3){
                  picArr.pop();//移除数组最后一项
                  //移除图片结构的最后一项
                  $('#imgBox img').eq(-1).remove()
               }
               

            // 如果图片数组长度===3，那么就通过校验，手动将picStatus设置成VALID
            if(picArr.length===3){
                  $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
            }
           }
      })

      // 05进行表单校验初始化  表单验证
      $('#form').bootstrapValidator({
               //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
               excluded: [],//需要对隐藏域进行校验，所以把它设置为空

               //配置图标
               feedbackIcons: {
                     valid: 'glyphicon glyphicon-ok',  //校验成功
                     invalid: 'glyphicon glyphicon-remove',   //校验失败
                     validating: 'glyphicon glyphicon-refresh'  //校验中
                   },
               //配置校验字段
               fields:{
                  brandId:{
                        validators:{   notEmpty:{message:"请选择二级分类"  },
                  }
            },

                  proName:{
                        validators:{    notEmpty:{message:"请输入商品名称" }, 
                  },
            },
                  proDesc:{
                        validators:{    notEmpty:{message:"请输入产品描述" }, 
                  }
            },

                  //产品库存，要求除了非空之外，要求必须是非0开头的数字 
                  num:{
                        validators:{    notEmpty:{message:"请输入商品库存" }, 
                                        //正则校验    \d表示数字0~9     *表示出现0次或者多次
                                          regexp: {
                                           regexp: /^[1-9]\d*$/,
                                           message: '商品库存必须为非0开口的数字'
                                        }
                  }
            },
                  //商品尺寸： 要求  xx-xx 的格式   x为数字  /^\d{2}-\d{2}*$/
                  size:{
                        validators:{    notEmpty:{message:"请输入商品尺码" }, 
                        regexp: {
                              regexp:/^\d{2}-\d{2}$/ ,
                              message: '尺码必须为XX-XX格式'
                           }
                     } 
            },
                  oldPrice:{
                        validators:{    notEmpty:{message:"请输入原价" }, 
                  }
            },
                  price:{
                        validators:{    notEmpty:{message:"请输入商品现价" }, 
                  }

            },
            picStatus:{
                  validators:{    notEmpty:{message:"请选择三张图片" } }
            }
      }
})



      //06 注册表单校验成功事件，阻止默认提交，通过ajax进行提交
      $('#form').on('success.form.bv',function(e){
            //阻止默认的提交
            e.preventDefault();
            

            var paramsStr = $('#form').serialize(); //获取的是表单元素的数据
            
            console.log(paramsStr)   
            // //还需要拼接上图片的数据      

             paramsStr += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
             paramsStr += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
             paramsStr += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;

         
             console.log(paramsStr)
            $.ajax({
                  type:'post',
                  url:'/product/addProduct',
                  data: paramsStr,
                  dataType:'json',
                  success:function(result){
                        console.log(result)
                        if(result.success){
                              //添加成功
                              //关闭模态框
                              $('#addModal').modal("hide");
                              //页面重新渲染第一个页面
                              currentPage=1;
                              rander()
                              //重置表单的内容和校验状态
                              $('#form').data("bootstrapValidator").resetForm(true);

                              //下拉列表和图片不是表单元素，需要动手重置
                              $('#dropdownText').text("请选择二级分类")
                              $('imgBox img').remove()  //移除所有图片
                        }
                  }
            })
      })

})