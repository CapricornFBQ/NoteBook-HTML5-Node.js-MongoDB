$(function() {
    var screenHeight = $(window).height();
    var screenWidth = $(window).width();
    //定义首页的巨幕高度
    $('#log').css({'height': screenHeight});
    // 定义页脚的宽度
    $('footer').css({'width': screenWidth});
    // 定义注册时，的动画
    $('#regButton').click(function() {
        $('#login').fadeOut(300, function() {
             $('#reg').fadeIn(500);
        })
    })
    //定义提示信息的显示时间=======================================================================================
    if($('.flashInformation').attr('success')) {
        $('#flashInformation').fadeIn(1000).delay(3000).fadeOut(1000); 
    }
    $('#noteFlashInformation').fadeIn(300).delay(3000).fadeOut(300); 
    //定义导航栏选项中，鼠标点击之后的效果==========================================================================
    $('.navBarBox').click(function() {
        $(this).css({
            'background-color':'rgba(0,0,0,0.4)',
	        'color': '#FFF'
        })
        $('.navBarBox').not(this).css({
            'background-color': 'transparent',
            'border': '1px solid #ccc',
            'color': '#444',
        })
    })
    //定义note中显示用户信息的动作==================================================================================
    $('#user').mouseenter(function() {
        $('#noteUserInformation').fadeIn(200).delay(3000).fadeOut(1000);
    })
    $('#user').mouseleave(function() {
        $('#noteUserInformation').fadeOut(200);
    })
    //定义导航栏图标鼠标停留时的动作=================================================================================
    $('.navBarBox').mouseenter(function() {
        $(this).next().fadeIn(200);
        $(this).next().next().fadeIn(200);
    })
    $('.navBarBox').mouseleave(function() {
        $(this).next().fadeOut(200);
        $(this).next().next().fadeOut(200);
    })
    //定义bodyPart部分的高度和宽度(宽度初始默认为0)；
    $('#bodyPart').css({'width':0});
    var bodyPartWidth = 0;
    //初始notePart的宽度和高度，这里必须是主角
    $('#notePart').css({'width':(screenWidth - 73 - bodyPartWidth) + 'px'});   
    $('#bodyPart').resize(function() {
            var bodyPartWidth = $('#bodyPart').width();
            $('#notePart').css({'width':(screenWidth - 73 - bodyPartWidth) + 'px'});   
    })
    //定义点击navBarNewNote事件，bodyPart动画显示，以及notePart动画缩小===============================================
    $('#navBarNewNote').click(function() {
        $.get('/newNote', function(data) {
            $('#defaultNoteShow').fadeOut(200, function() {
                $('#showNote').fadeOut();      //有无闪烁的情况，有待后续观察！！！！
                $('#noteCode').hide().html(data).fadeIn(300);
            });
        })
        var state = {
            url:"/newNoteWriting"
        }
        $('#fullScreen').fadeOut(200); 
        var bodyPartWidth = $('#bodyPart').width();
        $('#notePart').animate({'width':screenWidth}, 300, function() {
            if(bodyPartWidth > 0) {
                $('#bodyPart').children().fadeOut(100);
                $('#bodyPart').animate({'width': 0}, 300, function() {
                    $('#newNoteCancel').fadeIn(300);
                    $('#navbar').animate({'width': 0}, 300);
                    $('.navBarBox').fadeOut(300);
                    $('#user').fadeOut(100);
                    $('#NoteBook').fadeOut(300);
                    $('.navBarTriangle').fadeOut(200);
                    $('.navBarTitle').fadeOut(200);
                })
            }else {
                $('#newNoteCancel').fadeIn(300);
                $('#navbar').animate({'width': 0}, 300);
                $('.navBarBox').fadeOut(300);
                $('#user').fadeOut(100);
                $('#NoteBook').fadeOut(300);
                $('.navBarTriangle').fadeOut(200);
                $('.navBarTitle').fadeOut(200);
            }
        })
    })
    //定义点击写笔记时的取消键事件，及其动画效果======================================================================
    $('#newNoteCancel').click(function() {
        $('#noteCode').children().fadeOut(200, function() {
            $('#defaultNoteShow').fadeIn(500);
        })
        $('.navBarBox').fadeIn();
        $('#NoteBook').fadeIn();
        $('#user').fadeIn();
        $('#navbar').animate({'width': '73px'}, 300, function() {
            $('#notePart').animate({'width':(screenWidth - 73) + 'px'}, 300);
            $('#newNoteCancel').fadeOut(300);
        });
    })
     //定义点击写笔记时的确定键事件，及其动画效果======================================================================
    $('#newNoteEnsure').click(function() {
        console.log($('#newNoteText').val());
        if($('#newNoteText').val()) {
            var body = {
                "title":  $('#newNoteTitle').val(),
                "tag":    $('#newNoteTag').val(),
                "newNote":$('#newNoteText').val(),
            }
            $.post('/newNoteInformation', body, function(data) {
                if(data.result) {
                    $('#noteCode').children().fadeOut(200, function() {
                        $('#defaultNoteShow').fadeIn(500);
                    })
                    $('.navBarBox').fadeIn();
                    $('#NoteBook').fadeIn();
                    $('#user').fadeIn();
                    $('#navbar').animate({'width': '73px'}, 300, function() {
                        $('#notePart').animate({'width':(screenWidth - 73) + 'px'}, 300);
                        $('#newNoteEnsure').fadeOut(300);
                    });
                }
            })
        }
    })
    //定义点击navBarSearch事件，bodyPart动画显示，以及notePart动画缩小================================================
    $('#navBarSearch').click(function() {
        $('#defaultNoteShow').fadeOut(500);
        //每次点击之后，确保导航栏的图标提示消失
        $('.navBarTriangle').fadeOut(200);
        $('.navBarTitle').fadeOut(200);
        $('#bodyPart').css({'height':screenHeight});
        if (screenWidth >= 480) {
            bodyPartWidth = '380px';
        } else {
            bodyPartWidth = (screenWidth - 100) + 'px';
        }
        $('#bodyPart').animate({'width': bodyPartWidth}, 300, function() {
            var bodyPartWidth = $('#bodyPart').width();
            $('#notePart').animate({'width':(screenWidth - 73 - bodyPartWidth) + 'px'}, 100);
            $('#fullScreen').fadeIn(300);
        });
    })
    //定义点击navBarTag事件，bodyPart动画显示，以及notePart动画缩小===================================================
    $('#navBarTag').click(function() {
        $('#defaultNoteShow').fadeOut(500);
        //每次点击之后，确保导航栏的图标提示消失
        $('.navBarTriangle').fadeOut(200);
        $('.navBarTitle').fadeOut(200);
        $('#bodyPart').css({'height':screenHeight,});
        if (screenWidth >= 480) {
            bodyPartWidth = '380px';
        } else {
            bodyPartWidth = (screenWidth - 100) + 'px';
        }
        $('#bodyPart').animate({'width': bodyPartWidth}, 300, function() {
            var bodyPartWidth = $('#bodyPart').width();
            $('#notePart').animate({'width':(screenWidth - 73 - bodyPartWidth) + 'px'}, 100); 
            $('#fullScreen').fadeIn(300); 
        }); 
    })
    //定义点击navBarNote事件，bodyPart动画显示，以及notePart动画缩小===================================================
    $('#navBarNote').click(function() {
        $.get('/allNotes', function(data) {
            $('#defaultNoteShow').fadeOut(300, function() {
                $('#bodyPart').hide().html(data);
                //每次点击之后，确保导航栏的图标提示消失
                $('.navBarTriangle').fadeOut(200);
                $('.navBarTitle').fadeOut(200);
                $('#bodyPart').css({'height':screenHeight,});
                if (screenWidth >= 480) {
                    bodyPartWidth = '380px';
                } else {
                    bodyPartWidth = (screenWidth - 100) + 'px';
                }
                $('#bodyPart').animate({'width': bodyPartWidth}, 500, function() {
                    var bodyPartWidth = $('#bodyPart').width();
                    $('#notePart').animate({'width':(screenWidth - 73 - bodyPartWidth) + 'px'}, 100);
                    $('#fullScreen').fadeIn(300); 
                });
                $('#bodyPart').fadeIn();
            });
        })
    })
    //定义点击废纸篓事件，bodyPart动画显示，以及notePart动画缩小==========================================================
    $('#navBarBasket').click(function() {
        $('#defaultNoteShow').fadeOut(500);
        //每次点击之后，确保导航栏的图标提示消失
        $('.navBarTriangle').fadeOut(200);
        $('.navBarTitle').fadeOut(200);
        $('#bodyPart').css({'height':screenHeight,});
        if (screenWidth >= 480) {
            bodyPartWidth = '380px';
        } else {
            bodyPartWidth = (screenWidth - 100) + 'px';
        }
        $('#bodyPart').animate({'width': bodyPartWidth}, 300, function() {
            var bodyPartWidth = $('#bodyPart').width();
            $('#notePart').animate({'width':(screenWidth - 73 - bodyPartWidth) + 'px'}, 100);
            $('#fullScreen').fadeIn(300); 
        });
    })
    //定义点击全屏按钮事件，及其动画=====================================================================================
    $('#fullScreen').click(function() {
        //每次点击之后，确保导航栏的图标提示消失
        $('.navBarTriangle').fadeOut(200);
        $('.navBarTitle').fadeOut(200);
        var bodyPartWidth = $('#bodyPart').width();
        $('#notePart').animate({'width':(screenWidth - 73) + 'px'}, 500, function() {
            if(bodyPartWidth > 0) {
                $('#bodyPart').children().fadeOut(100);
                $('#bodyPart').animate({'width': 0}, 200, function() {
                    $('#fullScreen').fadeOut(200); 
                })
            }
        })
    })




})