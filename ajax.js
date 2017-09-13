$(function() {
    var platform = 'public';
    var productId = '';
    var priceId = '';
    var reportType = '1';
    var pageNum = 1;

    if (navigator.userAgent.toLowerCase().indexOf("hxappid") > -1 || "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i) || window.location.href.indexOf('header=off') > -1) {
        $('header').hide();
    } else {
        platform = 'h5';
        $('header').show();
    }
    if ("micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)) {
        $('.subDiv').hide();
    }

    function isapp() {
        return navigator.userAgent.toLowerCase().indexOf("hxappid") > -1 ? true : false
    }

    function dologin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("hxappid") > -1) {
            window.javatojs.login();
        } else if ("micromessenger" == ua.match(/MicroMessenger/i)) {
            $.ajax({
                url: 'https://regtool.hexun.com/wapreg/CheckBindWechat.aspx',
                type: 'get',
                dataType: 'jsonp',
                success: function(data) {
                    if (data.code == -1) {
                        location.href = "https://reg.hexun.com/bindweixin.aspx?gourl=" + escape(window.location.href);
                    }
                }
            })
        } else {
            location.href = 'https://reg.hexun.com/h5/login.aspx?regtype=5&gourl=' + escape(window.location.href)
        }
    }
    var islogin = false,
        loname, lopic;
    var likeArr = [];
    var flag = true;

    function loadData(page) {
        isLoading = true;
        $.ajax({
            type: "GET",
            url: "http://testcomment.zq.hexun.com/Comment/GetComment.do",
            data: {
                articleid: articleId,
                commentsource: 3,
                articlesource: 5,
                articleuid: teacherId,
                pagesize: 10,
                pagenum: page
            },
            dataType: "jsonp",
            success: function(res) {
                var arr = res.revdata.articledata;
                pageNum++;
                window.commentnum = res.revdata.commentcount;
                $('#comments').text(res.revdata.commentcount + " 评论");
                if (res.status == 1) {
                    if (arr.length != 0) {
                        var content = "";
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i].parentuserid != 0) {
                                arr[i].content = '回复' + arr[i].parentusername + '：' + arr[i].content
                            }
                            content += '<dl class="plList flex flex-pack-justify">' +
                                '<dt><img src="' + arr[i].logo + '"></dt>' +
                                '<dd class="articleList" id="pl">' +
                                '<div class="flex flex-pack-justify">' +
                                '<span>' + arr[i].username + '</span>' +
                                '<time class="ft12 fc_9">' + formatTime(arr[i].posttime) + '</time>' +
                                '</div>' +
                                '<p class="txt">' + arr[i].content + '</p>' +
                                '<div class="readCount pt10 clearfix">' +
                                '<div class="fr">' +
                                '<i class="jb-ico"></i><span comid="' + arr[i].id + '" usid="' + arr[i].userid + '" class="jb-txt">举报</span><i class="hf-ico"></i><span data-rn="' + arr[i].username + '" attrs="' + arr[i].id + '" class="hf revert">回复</span>' +
                                '</div>' +
                                '</div>' +
                                '</dd>' +
                                '</dl>'
                        }
                        if (page == 1) {
                            $('#comment').html(content);
                        } else {
                            $('#comment').append(content);

                        }
                        if (res.revdata.articledata.length == 10) {
                            $('#more').text('更多评论');
                        } else {
                            $('#more').text('暂无更多评论！');
                            isLast = true;
                        }
                    } else {
                        isLast = true;
                        $('#more').text('暂无更多评论！');
                    }
                }
                var com = "";
                var us = "";
                var reportMsg = "";
                var clickJb = $('.readCount span.jb-txt');
                clickJb.off('click').on('click', function(e) {
                    if (!islogin) {
                        dologin();
                        return;
                    }
                    dplus_Click("点击事件", { "事件功能": "举报", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                    com = $(this).attr("usid");
                    us = $(this).attr("comid")
                    $('.mask-attend').show();
                    $('.jb-tc').show(300);
                });
                $('.revert').off('click').on('click', function() {
                    if (!islogin) {
                        dologin();
                        return;
                    }
                    $('.edit').slideDown(1000);
                    $('.mask-edit').slideDown(1000);
                    $('body').append('<style>.text-edi.rn:after{content:\'回复：' + $(this).attr("data-rn") + '\'}</style>')
                    $('.text-edi').addClass('rn');
                    window.rname = $(this).attr("data-rn");
                    window.boxss = $(this).attr('attrs');
                    dplus_Click("点击事件", { "事件功能": "回复", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                });
                $('.wrapradio p span').click(function() {
                    $('.wrapradio p span').removeClass('active');
                    $(this).addClass('active')
                    reportType = $(this).attr('dataid');
                });
                $(".areaReport").bind('input propertychange', function() {
                    if ($(this).val().trim() != '') {
                        $('.reportBtn').addClass('reportBtnAct');
                    } else {
                        $('.reportBtn').removeClass('reportBtnAct');
                    }
                });
                $('.reportBtn').bind('click', function() {
                    if ($('.areaReport').val().trim() != '') {
                        reportMsg = $('.areaReport').val().trim();
                        report(reportType, com, us, reportMsg);
                    } else {
                        return;
                    }
                })
            },
            error: function(e) {}
        });
        isLoading = false;
        isMoved = false;
    };
    $.ajax({
        url: 'http://reg.tool.hexun.com/wapreg/checklogin.aspx?format=json&encode=utf-8',
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            if (data.islogin == "True") {
                islogin = true;
                loname = decodeURI(data.nickname);
                lopic = data.photo;
            } else {
                $('#focustag,.inputtext,.clk').unbind('click').click(function() { dologin() });
                // $('#teacherInfo .rig a.red').removeClass("focusout").addClass('focusin').text('+ 关注');
                flag = true;
            }
        }
    })
    var commentsource = '';
    var title = '';
    var teacherId = '13798641';//window.location.href.split("hexun.com/")[1].split("/")[0]
    var articleId = '6029';// window.location.href.split('article')[1].split('.html')[0];
     var teacherId = 13798641;
     var articleId = 6029;
    var teacherIdStr = "" + teacherId;
    var columnId = 0;
    var teacherName = '';
    /*$('.editour').click(function() {
        dplus_Click("点击事件", { "事件功能": "评论框", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
    })
    $('.myface').click(function() {
        dplus_Click("点击事件", { "事件功能": "表情", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
    })
    $(".logoDplus").on('click', function() {
        dplus_Click("点击事件", { "事件功能": "老师头像", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
        setTimeout(function() {
            window.location.href = 'http://test.caidao.hexun.com/' + teacherId;
        }, 300);
    });
    $('.nameDplus').on('click', function() {
        dplus_Click("点击事件", { "事件功能": "老师昵称", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
        setTimeout(function() {
            window.location.href = 'http://test.caidao.hexun.com/' + teacherId;
        }, 300);
    });
    $('.fbpl').click(function() {
        dplus_Click("点击事件", { "事件功能": "发表评论", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
    })*/
    //老师信息
    $.ajax({
        url: 'http://test.partner.px.hexun.com/api/partner/get_partnershow_info?partnerId=' + teacherId,
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            if (data.resultKey == "ok") {
                var _data = data.data.data,
                    zc = '';
                switch (_data.partnerLevel) {
                    case 1:
                        zc = '<img src="http://imgcd.hexun.com/teacher/images/tougu.png" data-title="投顾" />'
                        break;
                    case 2:
                        zc = '<img src="http://imgcd.hexun.com/teacher/images/laoshi.png" data-title="老师" />'
                        break;
                    case 3:
                        zc = '<img src="http://imgcd.hexun.com/teacher/images/mingjia.png" data-title="名家" />'
                        break;
                    default:
                        zc = ""
                }
                $('#teacherInfo .lef').html('<img src="' + _data.photo + '">');
                $('#teacherInfo .mid h5 .name').html(_data.nickname);
                $('#teacherInfo .mid h5').append(zc);
            } else {}
        }
    })
    //文章详情
    $.ajax({
        type: "GET",
        url: "http://test.apicaidao.hexun.com/article/info/" + teacherId + "/" + articleId,
        dataType: "jsonp",
        success: function(res) {
            var data = res.data;
            console.log(data)
            data.likeNum = data.likeNum == null ? 0 : data.likeNum;
            columnId = data.columnId;
            $('.detail-tit').text(data.articleTitle);
            $('#article-p').text(data.articleIntroduce);
            $('.ft16').text(data.teacherName);
            teacherName = data.teacherName;
            window.document.title = data.articleTitle + '_' + teacherName + '的财道工作室_和讯财道';
            //dplus_Click("页面浏览", { "所属平台": "财道社区", "类型": "互动", "页面名称": "财道老师工作室", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件名称": "页面浏览" });
            var time = formatTime(data.createTime);
            $('#create-time').text(time);
            $(".click-heart span").text(data.likeNum + "人喜欢");
            $('#article .disno').html(data.articleContent);
            $('#article .disno').find('img').css('width', 'auto');
            title = data.articleTitle;
            var shareDate = parseInt((new Date().getTime() / 1000));
            var awexin = [{
                "wximgUrl": "http://imgzq.hexun.com/caidao/video/img/f-logo.png",
                "wxnoncestr": "" + shareDate,
                "wxtitle": data.articleTitle,
                "wxdescContent": data.articleIntroduce
            }];
            HxWx.Jser.wxinit(awexin);
            clk_num(data.likeNum);
            if (res.data.columnId != 0) {
                //收费文章
                if (res.data.buyStatus) {
                    //已购买
                    $('#article .disno').show()
                    $('#order').show();
                    $('#secret').hide();
                    $('#article-p').show();
                } else {
                    $('#secret').show();
                    $('#order').hide();
                    $('#article .disno').hide();
                }
            } else {
                //免费文章
                $('#article .disno').show()
                $('#article-p').hide();
                $('#order').hide();
            }
            if (isapp()) {
                window.javatojs.shareLink(data.articleTitle, data.articleIntroduce, 'http://imgzq.hexun.com/caidao/video/img/f-logo.png')
            }
        },
        error: function(e) {}
    });
    //获取点赞用户的头像
    $.ajax({
        url: 'http://test.apicaidao.hexun.com/article/like/user/' + articleId,
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
            if (data.code == 0) {
                likeArr = data.data;
                likeArr.forEach(function(item) {
                    $('#likeLogo').append(
                        '<img src="' + item.imageUrl + '">')
                });
            }
        }
    })
    //是否已经关注过
    $.ajax({
        type: "GET",
        url: "http://testfollow.zq.hexun.com/relation/isattention.do",
        dateType: 'jsonp',
        data: {
            source: '2',
            uid: teacherId
        },
        dataType: "jsonp",
        success: function(res) {
            if (res.statecode == '1' && res.result) {
                $('#teacherInfo .rig a.red').removeClass('focusin').addClass('focusout').text('已关注');
                flag = false;
            } else {
                flag = true;
            }
        },
        error: function(e) {}
    });
    //添加关注
    $("#focustag").click(function() {
        if (flag == true) {
            $.ajax({
                type: "GET",
                url: "http://testfollow.zq.hexun.com/relation/add.do",
                dateType: 'jsonp',
                data: {
                    source: '2',
                    uid: teacherId
                },
                dataType: "jsonp",
                success: function(res) {
                    if (res.statecode == '1') {
                        if (isapp()) {
                            window.javatojs.attentionAction(1)
                        }
                        $('#teacherInfo .rig a.red').removeClass('focusin').addClass('focusout').text('已关注');
                        dplus_Click("点击事件", { "事件功能": "关注", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                        flag = false;
                    }

                }
            });
        } else {
            //取消关注
            $('.canel-attend h4').html('确定要取消对' + teacherName + '的关注吗？')
            $('.canel-attend').show();
            $('.mask-attend').show();
            $("#cancelyes").click(function() {
                $.ajax({
                    type: "GET",
                    url: "http://testfollow.zq.hexun.com/relation/cancel.do",
                    data: {
                        source: '2',
                        uid: teacherId
                    },
                    dataType: "jsonp",
                    success: function(res) {
                        if (res.statecode == '1') {
                            if (isapp()) {
                                window.javatojs.attentionAction(0)
                            }
                            $('#teacherInfo .rig a.red').removeClass("focusout").addClass('focusin').text('+ 关注');
                            flag = true;
                        }
                    }
                });
            });
        }
    });
    //发表评论
    window.boxss = '0';
    var ispling = false;
    $('.smile').click(function() {
        dplus_Click("点击事件", { "事件功能": "表情", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
    })
    $("#publish").click(function() {
        dplus_Click("点击事件", { "事件功能": "发送", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
        if ($('#reply').val() == '') {
            return;
        }
        if (!ispling) {
            ispling = true;
            pl(window.boxss);
        }
    });

    function pl(parent) {
        var cont = $('#reply').val();
        $.ajax({
            type: "GET",
            url: "http://test.apicaidao.hexun.com/comment/save",
            data: {
                commentsource: 3,
                comment: cont,
                articleid: articleId,
                parentid: parent,
                articlesource: 5,
                vcode: ''
            },
            dataType: "jsonp",
            success: function(res) {
                if (res.code == '0') {
                    $('.text-edi').removeClass('rn');
                    if (res.data.status == '1') {
                        var resData = res.data.revdata.data;
                        $('.tip p').text('发表成功');
                        $('#publish').css({ 'background-color': '#999' });
                        $('.text-edi').show();
                        $('#reply').val('');
                        if (parseInt(parent) != 0) {
                            cont = '回复' + window.rname + '：' + cont
                        }
                        $('#comment').prepend(
                            '<dl class="plList flex flex-pack-justify">' +
                            '<dt><img src="' + lopic + '"></dt>' +
                            '<dd class="articleList" id="pl">' +
                            '<div class="flex flex-pack-justify">' +
                            '<span class="userName">' + loname + '</span>' +
                            '<time class="ft12 fc_9 pubTime">刚刚</time>' +
                            '</div>' +
                            '<p class="txt">' + cont + '</p>' +
                            '<div class="readCount clearfix">' +
                            '<div class="fr">' +
                            '<i class="jb-ico"></i><span comid="' + resData.id + '" usid="' + resData.userid + '" class="jb-txt">举报</span><i class="hf-ico"></i><span data-rn="' + resData.username + '" attrs="' + resData.id + '" class="hf revert">回复</span>' +
                            '</div>' +
                            '</div>' +
                            '</dd>' +
                            '</dl>');
                        pageNum = 1;
                        loadData(pageNum);
                        window.boxss = '0';
                        window.commentnum = parseInt(window.commentnum + 1)
                        $('#comments').text(window.commentnum + " 评论")
                        $('#lengt').html('0');
                    } else {
                        $('.tip p').text('发表失败');
                        pageNum = 1;
                        loadData(pageNum);
                        $('#reply').val('');
                        $('#publish').css({ 'background-color': '#999' });
                        $('.text-edi').show();
                        window.boxss = '0';
                        $('#comments').text(window.commentnum + " 评论")
                        $('#lengt').html('0');
                    }
                } else {
                    $('.tip p').text(res.msg);
                    pageNum = 1;
                    loadData(pageNum);
                    $('#reply').val('');
                    $('.text-edi').show();
                    $('#publish').css({ 'background-color': '#999' });
                    window.boxss = '0';
                    $('#comments').text(window.commentnum + " 评论")
                    $('#lengt').html('0');
                }
                setTimeout(function() {
                    $('.tip').hide();
                }, 1500)
                $('.tip').show();
                $('.mask-edit').hide();
                $('.edit').hide();
                ispling = false;
            },
            error: function(e) {
                ispling = false;
            }
        });
    }
    //举报
    function report(num, com, us, reportMsg) {
        $.ajax({
            type: "GET",
            url: "http://testcomment.zq.hexun.com/ReportMessage/addReportMessage.do",
            data: {
                productType: 5,
                commentId: com,
                userId: us,
                reportType: num,
                reportMessage: reportMsg,
            },
            dataType: "jsonp",
            success: function(res) {
                if (res.status == 1) {
                    $('.jb-tc').hide();
                    $('.mask-attend').hide();
                    $('.tip').show();
                    $('.tip p').text('举报成功');
                    setTimeout(function() {
                        $('.jb-suc').hide();
                    }, 1000);
                    $('.reportBtn').removeClass('reportBtnAct');
                    $('.areaReport').val('');
                    $('.wrapradio p span').removeClass('active');
                    $('.wrapradio p span')[0].className = 'active';
                    reportType = '1';
                    dplus_Click("点击事件", { "事件功能": "举报", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                }
            },
            error: function(e) {}
        });
    }
    //观点私密部分,解锁后查看
    $("#secret").click(function() {
        if (!islogin) {
            dologin();
            return;
        }
        dplus_Click("点击事件", { "事件功能": "解锁", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
        $.ajax({
            type: "GET",
            url: "http://test.apicaidao.hexun.com/article/column/" + teacherId,
            dataType: "json",
            success: function(res) {
                $('#secret').hide();
                var arr = {},
                    _data = res.data;
                for (var i in _data) {
                    if (columnId == _data[i].id) {
                        arr = _data[i];
                    }
                }
                var buydom = '',
                    pricedom = '';
                productId = arr.productId;
                priceId = arr.priceId;
                if (arr.buyStatus == false) {
                    pricedom = '<p><span class="red ft24">' + arr.price + '</span>元/月</p>'
                    buydom = '<a id="subscribe" class="subscribe">立即订阅</a>';
                } else {
                    buydom = '<a target="_self" href="http://test.caidao.hexun.com/' + teacherId + '/column' + arr.id + '.html" class="subscribe">立即观看</a>'
                }
                //私密观点展示
                $('#article').append(
                    '<div class="secretCon">' +
                    '<div class="flex flex-pack-justify tit">' +
                    '<h5 class="ft16">' + arr.columnName + '</h5>' +
                    '<p><span class="red">' + arr.articleCount + '</span>篇文章&nbsp;&nbsp;<span class="red">' + arr.orderCount + '</span>订阅</p>' +
                    '</div>' +
                    '<p class="secret-txt">' + arr.columnIntroduce + '</p>' +
                    '<div class="flex flex-pack-justify pt10">' +
                    '<span class="fc_9">最近更新时间：' + formatTime(arr.articleLastTime) + '</span>' + pricedom +
                    '</div>' + buydom +
                    '</div>'
                );
                $('.subscribe').click(function() {
                    dplus_Click("点击事件", { "事件功能": "立即订阅", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                })
                $('#subscribe').click(function() {
                    if (islogin) {
                        window.location.href = 'http://test-order.hexun.com/order/web/product?productid=' + productId + '&priceid=' + priceId + '&fromhost=privateview&belong=caidaodsq&jumpPlatform=' + platform + '&returnurl=' + escape(window.location.href);
                    } else {
                        dologin();
                    }
                })
            },
            error: function(e) {}
        });

    });
    //获取用户是否点赞文章
    function clk_num(number) {
        $.ajax({
            type: "GET",
            url: "http://test.apicaidao.hexun.com/article/like/exist/" + articleId,
            dataType: "jsonp",
            success: function(res) {
                if (res.data == true) {
                    $(".click-heart").addClass('click-heart-bg').removeClass('clk');
                    $(".click-heart span").text(number + "人喜欢");
                } else {
                    clk(number);
                }
            },
            error: function(e) {}
        });
    }
    //点赞文章
    function clk(number) {
        $(".clk").click(function() {
            if (!islogin) {
                dologin();
                return;
            }
            $.ajax({
                type: "GET",
                url: "http://test.apicaidao.hexun.com/article/like/" + articleId,
                dataType: "jsonp",
                success: function(res) {
                    if (res.code == 0 && res.data == true) {
                        $(".click-heart").addClass('click-heart-bg').removeClass('clk');
                        $(".click-heart span").text(parseInt(number + 1) + "人喜欢");
                        if (likeArr.length >= 10) {
                            likeArr.pop();
                            likeArr.unshift({ imageUrl: lopic });
                        } else {
                            likeArr.unshift({ imageUrl: lopic });
                        }
                        $('#likeLogo').html('');
                        likeArr.forEach(function(item) {
                            $('#likeLogo').append('<img src="' + item.imageUrl + '">')
                        });
                        dplus_Click("点击事件", { "事件功能": "喜欢", "类型": "互动", "所属平台": "财道社区", "合作者ID": teacherIdStr, "合作者名称": teacherName, "事件类别": "体验" });
                    }
                },
                error: function(e) {}
            });

        });
    }
    //时间格式
    var formatTime = function(timespan) {
        var dateTime = new Date(timespan);
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        //当前时间
        var now = Date.parse(new Date());
        var milliseconds = 0;
        var timeSpanStr;
        //计算时间差
        milliseconds = (now - timespan) / 1000;
        //一分钟以内
        if (milliseconds <= 60) {
            timeSpanStr = '刚刚';
        }
        //大于一分钟小于一小时
        else if (60 < milliseconds && milliseconds <= 60 * 60) {
            timeSpanStr = Math.ceil((milliseconds / 60)) + '分钟前';
        }
        //大于一小时小于等于一天
        else if (60 * 60 < milliseconds && milliseconds <= 60 * 60 * 24) {
            timeSpanStr = Math.ceil(milliseconds / (60 * 60)) + '小时前';
        }
        //大于一天小于等于30天
        else if (60 * 60 * 24 < milliseconds && milliseconds <= 60 * 60 * 24 * 30) {
            timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24)) + '天前';
        }
        //大于一个月小于一年
        else if (60 * 60 * 24 * 30 < milliseconds && milliseconds <= 60 * 60 * 24 * 30 * 12) {
            timeSpanStr = Math.ceil(milliseconds / (60 * 60 * 24 * 30)) + '个月前';
        }
        //超过一年显示
        else {
            timeSpanStr = year + '年' + month + '月' + day + '日 ';
        }
        return timeSpanStr;
    }
    //上滑评论列表
    $(document).bind("scroll", srcollEvent);
    $(document).bind("touchstart", startEvent).bind("touchmove", moveEvent).bind("touchend", stopEvent).bind("touchend", stopEvent);
    var isScrollStop = true; //页面是否停止滚动 防止屏幕有滑动但还没到底部就开始加载数据
    var isMoveDown = false; //防止手指向上滑动屏幕开始加载数据
    var isLoading = false; //防止异步请求数据未返回到前端的时候重复提交请求
    var isMoved = false; //手指是否在滑动屏幕 防止出现手指触摸屏幕而没有滑动就加载数据
    var startY = 0;
    var startX = 0;
    var isLast = false;

    function srcollEvent() {
        if ($(document).scrollTop() > 0) {
            isScrollStop = false;
        }
    }

    function startEvent() {
        startY = event.targetTouches[0].clientY;
        isMoved = false;
        isMoveDown = false;
    }

    function moveEvent() {
        var Y = event.targetTouches[0].clientY;
        if (startY > Y) {
            isMoveDown = true;
        } else {
            isMoveDown = false;
        }
        isMoved = true;
    }

    function stopEvent() {
        isScrollStop = true;
        if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
            if (isScrollStop && isMoved && !isLoading && isMoveDown && !isLast) {
                loadData(pageNum);
            }
        }

    }
    loadData(pageNum);
});