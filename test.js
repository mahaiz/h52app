/**
 * Created by hx on 2017/9/12.
 */
$(function(){
    var _list=[
        // A股雷达详情
        'hexuncaidao://com.hexun.caidao/radar_details?teacherId=1037523&radarId=8776',
// 直播室详情   vip直播室：roomType=1，免费直播室：roomType=0
        //vip直播室
    'hexuncaidao://com.hexun.caidao/live_room?roomType=1&roomId=676',
        //免费直播室
        'hexuncaidao://com.hexun.caidao/live_room?roomType=0&roomId=659',
// 老师个人财圈
        'hexuncaidao://com.hexun.caidao/teacher_moments?teacherId=1037523',
// 财圈详情
        'hexuncaidao://com.hexun.caidao/moments_details?teacherId=1037523&articleId=92468',
// 课程详情
        'hexuncaidao://com.hexun.caidao/lesson_details?lessonId=202793',

// 名家号文章
        'hexuncaidao://com.hexun.caidao/blog?teacherId=13798641&blogId=9814',

// 直播

       // 正在直播     watchType  0 直播中 1 回顾
    //orientation    vertical 竖屏    horizontal 横屏
    'hexuncaidao://com.hexun.caidao/video?watchType=0&teacherId=20055482&webinarId=924455223&orientation=horizontal',
     //   回顾
    'hexuncaidao://com.hexun.caidao/video?watchType=1&teacherId=29018290&webinarId=128647589&orientation=horizontal&recordId=442825'
        ],
        _downUrl='http://api.cd.hexun.com/statistic/addOpenLinkNum?teacherId=37624&amp;source=cdh5',
        openUrl=function(_path){
            window.location.href=$.trim(_path)==''?_downUrl:_path;
        }


    //console.log('a:',$('.box .a-down'),$('.box .a-down').length)
    $('.box .a-down').each(function(_index,_item){
        var _this=$(_item);
        _this.attr('href','javascript:void (0);');
        _this.on('click',_index,function(_e){
            openUrl(_list[_e.data]);//唤醒app
            setTimeout(openUrl,1500);//1.5秒后进入app下载页
            console.log('a:',_e.data);
        })
    })
})