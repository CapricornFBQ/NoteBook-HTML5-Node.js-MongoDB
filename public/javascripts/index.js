$(function(){
    
    var name, regInputPassword, regInputPasswordAgain;
    //添加注册页表单验证
    $('#regInputName').blur(function(){
        //进行用户名是否重复的验证==================================================
        $.get("/email",{email: $('#regInputName').val()}, function(result) {
            console.log(result);
            if (result.exist) {
                //!!!!!!!!切记这里不可以用this，因为this指的是jQuery对象!!!!!!!
                $('#regInputName').next().show(); 
                name = 0;
            }else {
                $('#regInputName').next().hide();
                name = 1;
            }
        });
    })
    $('#regInputPassword').blur(function(){
        var val = this.value;
        if (val.length < 6 || val.length >20) {
            $(this).next().show();
            regInputPassword = 0;
        } else {
            $(this).next().hide();
            regInputPassword = 1;
        }
    })
    $('#regInputPasswordAgain').blur(function(){
        var val1 =  $('#regInputPassword').val();
        var val2 = this.value;
        if (val1 != val2) {
            $(this).next().show();
            regInputPasswordAgain = 0;
        } else {
            $(this).next().hide();
            regInputPasswordAgain = 1;
        }
    })

    //reg页面进行post提交===================================================================
    $('#regSubmit').submit(function() {
        if (name && regInputPassword && regInputPasswordAgain) {
            return true;
        } else {
            return false;
        }
    })
})