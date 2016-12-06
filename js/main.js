$(document).ready(function() {
	/* 슬라이더 */
	
	var autoswitch = false; //자동 슬라이드
	var autoswitch_speed = 8000; //슬라이드 속도
	var isAnimating = false; //다중클릭 방지
	
	var $first = $('.card:first'); //첫번째 카드
	var $last = $('.card:last'); //마지막 카드
	var $bg = $('.bg'); //배경
	var $playbtn = $('.playbtn'); //재생버튼
	var $chartList = $('.chartList tr'); //차트리스트
	
	//첫번째 카드 active
	$first.addClass('active');
	$chartList.first().addClass('current');
	
	// 모든 카드 숨기기
	$('.card').animate({opacity:0});
	
	//첫번째 카드 보이기
	$('.active').animate({opacity:1}, function() {
		activeOn(); //active 카드 애니메이션
	});
	
	//이전 버튼 클릭 시 이전 카드로 슬라이드
	$('.prevWrap').click(function() {
		if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
			prevSlide();
		}
	});
	
	//다음 버튼 클릭 시 다음 카드로 슬라이드
	$('.nextWrap').click(function() {
		if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
			nextSlide();
		}
	});
	
	//방향키를 누를 때 슬라이드
	$(document).keydown(function(e) {
		if (e.keyCode == 37) { //왼쪽 키를 누를 시 이전 카드로 슬라이드
			if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
				prevSlide();
			}
			return false;
		} else if (e.keyCode == 39) { //오른쪽 키를 누를 시 다음 카드로 슬라이드
			if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
				nextSlide();
			}
			return false;
		}
	});
	
	//자동 슬라이드가 true이면
	if (autoswitch === true) {
		var slideIntv = setInterval(nextSlide, autoswitch_speed);
		
		//마우스 엔터일 때 일시정지
		$('.cardWrap').mouseenter(function() {
		    clearInterval(slideIntv);
		});
		//마우스를 떼면 슬라이드 시작
		$('.cardWrap').mouseleave(function() {
		    slideIntv = setInterval(nextSlide, autoswitch_speed);
		});
	}

	//다음으로 슬라이드
	function nextSlide() {
		var $next, $active = $('.active');
		
		activeChange(); //카드 off 애니메이팅
		
		//마지막 카드인지 확인
		if ($active.is($last)) {
			$next = $first; //마지막일 경우 첫번째를 active
		} else {
			$next = $active.next(); //마지막이 아닐 경우 다음으로
		}
		
		$active.removeClass('active'); //기존 active를 제거 후
		$next.addClass('active'); //다음에 오는 카드를 active
		
		activeOff(); //현재 카드 off
	}
	
	//이전으로 슬라이드
	function prevSlide() {
		var $prev, $active = $('.active');
		
		activeChange();
		
		//첫번째 카드인지 확인
		if ($active.is($first)) {
			$prev = $last; //첫번째일 경우 마지막번째를 active
		} else {
			$prev = $active.prev(); //첫번째가 아닐 경우 이전으로
		}
		
		$active.removeClass('active');
		$prev.addClass('active');
		
		activeOff();
	}

	//버튼 애니메이팅
	$('.prev').animate({opacity:1,left:'-10px'},{duration:600,easing:'easeOutCubic'});
	$('.prevWrap').animate({left:0},{duration:600,easing:'easeOutCubic'});
	$('.next').animate({opacity:1,right:'-10px'},{duration:600,easing:'easeOutCubic'});
	$('.nextWrap').animate({right:0},{duration:600,easing:'easeOutCubic'});

	/* active */
	
	//active 등장
	function activeOn() {
		var $active = $('.active');
		
		//애니메이팅 시작
		isAnimating = true;
		
		//오디오 재생
		var audio = $('.active audio')[0];
		audio.play();
		
		//배경이미지 변경
		var $img = $active.find('.artistimg').children('img').attr('src');
		$bg.fadeOut(function() {
			$(this).css({'background-image':'url('+$img+')'}).fadeIn(); //현재 카드의 아티스트이미지가 bg의 백그라운드 이미지로 페이드인
		});
		
		//애니메이팅
		$active.find('.box1, .number, .artistimg, .box2, .artist, .title, .desc, .box3, .albumart, .times, .listened, .playbtn').each(function(i) {
			$(this).delay(150 + i*150).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		}).promise().done(function() {
			isAnimating = false; //애니메이팅 종료
		});
		
		//active의 index에 해당하는 차트를 리스트에 표시
		var current = $active.index();
		$chartList.eq(current).addClass('current');
	};
	
	//active 변경 시 애니메이팅 (등장 시의 역순으로)
	function activeChange() {
		var $active = $('.active');
		
		//애니메이팅 시작
		isAnimating = true;
		
		$active.find('.title, .desc').delay(900).animate({opacity:0},{duration:600,easing:'easeOutCubic'});
		$active.find('.box1, .number, .artistimg, .box2, .artist, .box3, .albumart, .times, .listened, .playbtn').each(function(i) {
			$(this).delay(1750 - i*150).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		}).promise().done(function() {
			isAnimating = false; //애니메이팅 종료
		});
		
		//차트리스트의 current 클래스 삭제
		var current = $active.index();
		$('.current').removeClass('current');
	}
	
	//active 퇴장
	function activeOff() {
		var $active = $('.active');
		
		//애니메이팅 시작
		isAnimating = true;
		
		//모든 오디오의 볼륨이 페이드아웃 되며 정지
		var audio = $('.card audio');
		audio.animate({volume:0},1500,function() {
			for (i=0; i<audio.length; i++) {
				audio[i].pause(); //오디오 일시정지 후,
				audio[i].currentTime = 0; //처음으로 되감기 함으로써 정지와 같은 효과
				audio[i].volume = 1; //0이 되었던 볼륨을 1로 되돌림
			}
		});
		
		$bg.stop().delay(1900).fadeOut({duration:600,easing:'easeOutCubic',complete:function() { //bg의 백그라운드 이미지 지우기
			$playbtn.removeClass('play'); //플레이버튼을 클릭했을 경우, 다음 active되는 카드에서 play 클래스가 추가돼있는 것을 방지하기 위해 클래스 삭제로 초기화 해줌
			$('.card').stop().animate({opacity:0},{complete:function() { //카드 숨기고
				isAnimating = false; //애니메이팅 종료
				$active.stop().animate({opacity:1},{complete:function() { //active만 보이기
					activeOn(); //active 등장
				}});
			}});
		}});
	}
	
	/* 재생버튼 클릭 시 오디오 재생,일시정지 토글 */
	$playbtn.click(function() {
		$playbtn.toggleClass('play'); //클릭 시 플래이버튼에 play 클래스가 토글
		if ($playbtn.hasClass('play')) {
			$('.active audio')[0].pause();
		} else {
			$('.active audio')[0].play();
		}
	});
	
	/* 차트리스트 */
	
	//순차적으로 delay 되며 등장
	$chartList.each(function(i) {
		$(this).delay(300 + i*150).animate({opacity:1,left:0},{duration:600,easing:'easeOutCubic'});
	});
	
	//리스트에서 클릭 시, 해당 곡만 active
	$chartList.click(function() {
		var index = $chartList.index(this); //차트가 몇 번째인지 index 값을 정의
		if (!$('.card').eq(index).hasClass('active')) { //해당 번째의 카드가 active되지 않았을 때만 작동
			activeChange();
			$('.active').removeClass('active'); //기존 active를 제거 후
			$('.card').eq(index).addClass('active'); //해당 번째를 active
			activeOff();
		}
	});
	
	/* 마우스 감지 parallax 플러그인 */
	$(document).mousemove(function(e) {
		$('.box1, .box3').parallax(-40,e);
		$('.artistimg').parallax(-30,e);
		$('.number, .box2, .audio, .albumart, .count').parallax(-20,e);
		$('.artist, .title, .desc').parallax(-10,e);
	});
});
/* section 리사이즈 */
$(window).resize(function() {
	$('section').height($(window).height() - $('section').offset().top); //윈도우 크기가 변경되면 섹션의 높이를 윈도우 높이와 동일하게
});
$(window).resize();