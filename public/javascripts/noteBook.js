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
            'background-color':'rgba(0,0,0,0.7)',
	        'color': '#FFF'
        })
        $('.navBarBox').not(this).css({
            'background-color': 'transparent',
            'border': '1px solid #ccc',
            'color': '#333',
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
        var enterObj = $(this);
        showTime = setTimeout(function() {
            enterObj.next().show().delay(1000).fadeOut(300);
            enterObj.next().next().show().delay(1000).fadeOut(300);
            clearTimeout(showTime);
        }, 500);
    });
    $('.navBarBox').mouseleave(function() {
        //该操作同时应该在点击之后被触发
        clearTimeout(showTime);
        $(this).next().hide();
        $(this).next().next().hide();
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
    //noteCode中默认页面//////noteCode中默认页面//////noteCode中默认页面//////noteCode中默认页面//////noteCode中默认页面//////noteCode///
    //noteCode中默认页面的搜索功能==================================================================================
    $('#notePart #defaultNoteShow #basic-addon2').click(function() {
        $.get('/noteSearch', function(data) {
            $('#bodyPart').hide().html(data);
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
            $('#bodyPart').fadeIn(function() {
                $('#noteSearchWord').val($('#defaultNoteShow input').val());
                var body= {
                    noteSearchWord : $('#defaultNoteShow input').val(),
                }
                console.log(body);
                $.get('/noteSearchByWord', body, function(data) {
                    $('#noteSearchCode').hide().html(data).fadeIn(300);
                })
            });
        })
    })
    //导航栏newNote功能/////导航栏newNote功能/////导航栏newNote功能/////导航栏newNote功能/////导航栏newNote功能/////导航栏newNote功能/////
    //定义点击navBarNewNote事件，bodyPart动画显示，以及notePart动画缩小===============================================
    $('#navBarNewNote').click(function() {
        //该操作同时应该在点击之后被触发
        clearTimeout(showTime);
        $('.navBarTriangle').hide();
        $('.navBarTitle').hide();
        $.get('/newNote', function(data) {
            $('#defaultNoteShow').fadeOut(200, function() {
                $('#showNote').fadeOut();      //有无闪烁的情况，有待后续观察！！！！
                $('#noteCode').hide().html(data).fadeIn(300);
            });
        })
        $('#fullScreen').fadeOut(200); 
        var bodyPartWidth = $('#bodyPart').width();
        $('#notePart').animate({'width':screenWidth}, 300, function() {
            if(bodyPartWidth > 0) {
                $('#bodyPart').fadeOut(100);
                $('#bodyPart').animate({'width': 0}, 300, function() {
                    $('#newNoteCancel').fadeIn(300);
                    $('#navbar').animate({'width': 0}, 300);
                    $('.navBarBox').fadeOut(300);
                    $('#user').fadeOut(100);
                    $('#NoteBook').fadeOut(300);
                })
            }else {
                $('#newNoteCancel').fadeIn(300);
                $('#navbar').animate({'width': 0}, 300);
                $('.navBarBox').fadeOut(300);
                $('#user').fadeOut(100);
                $('#NoteBook').fadeOut(300);
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
                    $('#noteFlashInformation').hide().html(data.flashInformation).fadeIn(300).delay(3000).fadeOut(300);
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
    //导航栏search选项功能//////导航栏search选项功能//////导航栏search选项功能//////导航栏search选项功能//////导航栏search选项功能//////search//
    //定义点击navBarSearch事件，bodyPart动画显示，以及notePart动画缩小================================================
    $('#navBarSearch').click(function() {
        $.get('/noteSearch', function(data) {
            $('#bodyPart').hide().html(data);
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
            $('#bodyPart').fadeIn();
        })
    })
    //对search后的结果翻页的功能====================================================================================
    $(Document).on('click','.noteSearchByWordPage', function() {
        var page = $(this).attr('p');
        $.get('/noteSearchByWord',page, function(data) {
            $('#defaultNoteShow').fadeOut(300, function() {
                $('#noteSearchCode').fadeOut(300,function() {
                    $(this).html(data).fadeIn(300);
                });
            });
        })
    })
    //导航栏标签tag选项功能/////导航栏标签tag选项功能/////导航栏标签tag选项功能/////导航栏标签tag选项功能/////导航栏标签tag选项功能/////导航栏标签//
    //定义点击navBarTag事件，bodyPart动画显示，以及notePart动画缩小===================================================
    $('#navBarTag').click(function() {
        $('#showNote').hide();
        $.get('/noteTag', function(data) {
            $('#bodyPart').hide().html(data);
            $('#defaultNoteShow').fadeIn(500);
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
            $('#bodyPart').fadeIn();
        })
    })
    //标签页全部标签翻页功能============================================================================================
    $(Document).on('click','.noteTagPage', function() {
        var page = $(this).attr('p');
        $.get('/noteTag',page, function(data) {
            $('#defaultNoteShow').fadeOut(300, function() {
                $('#bodyPart').fadeOut(300,function() {
                    $(this).html(data).fadeIn(300);
                });
            });
        })
    })
    //定义单个标签内笔记的翻页功能=======================================================================================
    $(Document).on('click','.noteTagMenuPage', function() {
        var page = $(this).attr('p');
        $.get('/noteTag',page, function(data) {
            $('#defaultNoteShow').fadeOut(300, function() {
                $('#noteTagBrief').fadeOut(300,function() {
                    $(this).html(data).fadeIn(300);
                });
            });
        })
    })
    //导航栏allNotes选项功能//////导航栏allNotes选项功能//////导航栏allNotes选项功能//////导航栏allNotes选项功能//////导航栏allNotes选项功能//////
    //定义点击navBarNote事件，bodyPart动画显示，以及notePart动画缩小,获取全部笔记目录======================================
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
    //定义全部笔记目录中的翻页事件========================================================================================
    $(Document).on('click','.allNotesPage', function() {
        var page = $(this).attr('p');
        $.get('/allNotes',page, function(data) {
            $('#defaultNoteShow').fadeOut(300, function() {
                $('#bodyPart').fadeOut(300,function() {
                    $(this).html(data).fadeIn(300);
                });
            });
        })
    })
    //导航栏废纸篓basket功能//////导航栏废纸篓basket功能//////导航栏废纸篓basket功能//////导航栏废纸篓basket功能//////导航栏废纸篓basket功能//////basket////
    //定义点击废纸篓事件，bodyPart动画显示，以及notePart动画缩小==========================================================
    $('#navBarBasket').click(function() {
        $('#showNote').hide();
        $.get('/basket', function(data) {
            $('#bodyPart').hide().html(data);
            $('#defaultNoteShow').fadeIn(500);
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
            $('#bodyPart').fadeIn();
        })
    })
    //定义废纸篓目录中的翻页事件========================================================================================
    $(Document).on('click','.basketPage', function() {
        $('#showNote').hide();
        var page = $(this).attr('p');
        $.get('/basket',page, function(data) {
            $('#defaultNoteShow').fadeIn(500);
            $('#bodyPart').fadeOut(300,function() {
                $(this).html(data).fadeIn(300);
            });
        })
    })
    //定义点击全屏按钮事件，及其动画=====================================================================================
    $('#fullScreen').click(function() {
        //每次点击之后，确保导航栏的图标提示消失
        $('.navBarTriangle').fadeOut(200);
        $('.navBarTitle').fadeOut(200);
        var bodyPartWidth = $('#bodyPart').width();
        $('#notePart').animate({'width':(screenWidth - 73) + 'px'}, 500, function() {
            if(bodyPartWidth > 0) {
                $('#bodyPart').fadeOut(100);
                $('#bodyPart').animate({'width': 0}, 200, function() {
                    $('#fullScreen').fadeOut(200); 
                })
            }
        })
    })




})