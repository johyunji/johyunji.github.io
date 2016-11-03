$(document).ready(function() {
	
	/* section 리사이즈 */
	$(window).resize(function() {
		$('section').height($(window).height() - $('section').offset().top); //윈도우 크기가 변경되면 섹션의 높이를 윈도우 높이와 동일하게
	});
	$(window).resize();
	
	/* 슬라이더 */
	
	var autoswitch = false; //자동 슬라이드
	var autoswitch_speed = 8000; //슬라이드 속도
	var isAnimating = false; //다중클릭 방지
	
	//첫번째 카드 활성화
	$('.card').first().addClass('active');
	
	// 모든 카드 숨기기
	$('.card').animate({opacity:0});
	
	//첫번째 카드 보이기
	$('.active').animate({opacity:1}, function() {
		activeAnimating(); //active 카드 애니메이션
	});
	
	//이전 버튼 클릭 시 이전 카드로 슬라이드
	$('.prevWrap').on('click', function() {
		if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
			prevSlide();
		}
	});
	
	//다음 버튼 클릭 시 다음 카드로 슬라이드
	$('.nextWrap').on('click', function() {
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
		//슬라이드 이동 시 현재 active 상태인 카드를 비활성화 하고, oldActive 클래스 부여
		$('.active').removeClass('active').addClass('oldActive');
		
		//카드가 마지막 장인지 확인
		if ($('.oldActive').is(':last-child')) {
			$('.card').first().addClass('active'); //현재 카드가 마지막 장이면, 첫번째 카드를 active
		} else {
			$('.oldActive').next().addClass('active'); //현재 카드가 마지막 장이 아니면, 다음 카드를 active
		}
		
		$('.oldActive').removeClass('oldActive'); //oldActive 된 카드의 클래스 삭제
		
		cardAnimating(); //현재 카드 퇴장 애니메이팅 시작
	}
	
	//이전으로 슬라이드
	function prevSlide() {
		$('.active').removeClass('active').addClass('oldActive');
		
		//카드가 첫번째 장인지 확인
		if ($('.oldActive').is(':first-child')) {
			$('.card').last().addClass('active'); //현재 카드가 첫번째 장이면, 마지막 카드를 active
		} else {
			$('.oldActive').prev().addClass('active'); //현재 카드가 첫번째 장이 아니면, 이전 카드를 active
		}
		
		$('.oldActive').removeClass('oldActive');
		
		cardAnimating(); //현재 카드 퇴장 애니메이팅 시작
	}

	/* 애니메이팅 */
	
	//버튼 애니메이팅
	$('.prev').animate({opacity:1,left:'-10px'},{duration:600,easing:'easeOutCubic'});
	$('.prevWrap').animate({left:0},{duration:600,easing:'easeOutCubic'});
	$('.next').animate({opacity:1,right:'-10px'},{duration:600,easing:'easeOutCubic'});
	$('.nextWrap').animate({right:0},{duration:600,easing:'easeOutCubic'});
	
	//active 카드 등장
	function activeAnimating() {
		//active 카드의 오디오 재생
		var audio = $(".active audio")[0];
		audio.play();
		
		//배경이미지 변경
		var $img = $('.active .artistimg').children('img').attr('src');
		$(".bg").fadeOut(function() {
			$(this).css({'background-image':'url('+$img+')'}).fadeIn(); //현재 카드의 아티스트이미지가 bg의 백그라운드 이미지로 페이드인
		});
		
		//active 카드 애니메이팅
		$('.active .box1').delay(150).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic',function(){
			//애니메이팅 시작
			isAnimating = true;
		}});
		$('.active .number').delay(300).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .artistimg').delay(450).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .box2').delay(600).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .artist').delay(750).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .title').delay(900).animate({opacity:1},{duration:600,easing:'easeOutCubic'});
		$('.active .desc').delay(1050).animate({opacity:1},{duration:600,easing:'easeOutCubic'});
		$('.active .box3').delay(1300).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .albumart').delay(1450).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .times').delay(1600).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		$('.active .listened').delay(1750).animate({opacity:1},{duration:600,easing:'easeOutCubic'});
		$('.active .playbtn').delay(1900).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		
		//애니메이팅 종료
		isAnimating = false;
	};
	
	//기존 카드 퇴장 후 active 카드 등장
	function cardAnimating() {
		//애니메이팅 시작
		isAnimating = true;
		
		//모든 카드의 오디오 볼륨이 페이드아웃 되며 정지
		var audio = $(".card audio");
		audio.animate({volume:0},1500,function() {
			for(i=0; i<audio.length; i++) audio[i].pause(); //오디오 일시정지 후,
			for(i=0; i<audio.length; i++) audio[i].currentTime = 0; //처음으로 되감기 함으로써 정지와 같은 효과
			for(i=0; i<audio.length; i++) audio[i].volume = 1; //0이 되었던 볼륨을 1로 되돌림
		});
		
		//배경이미지 변경
		var $img = $('.active .artistimg').children('img').attr('src');
		$(".bg").stop().delay(1900).fadeOut(function() {
			$(this).css({'background-image':'none'}).fadeIn(); //bg의 백그라운드 이미지 지우기
		});
		
		//기존 카드 애니메이팅 (active될 때의 역순으로)
		$('.box1').delay(1900).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic',complete:function() { //가장 마지막에 움직이는 box1의 애니메이팅이 끝나면
			$('.card').stop().animate({opacity:0},{complete:function() { //카드 숨기고
				$('.active').stop().animate({opacity:1},{complete:function() { //active된 카드만 보이기
					activeAnimating(); //active 카드 등장
					isAnimating = false; //애니메이팅 종료
				}});
			}});
		}});
		$('.number').delay(1750).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.artistimg').delay(1600).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.box2').delay(1450).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.artist').delay(1300).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.title').delay(1050).animate({opacity:0},{duration:600,easing:'easeOutCubic'});
		$('.desc').delay(900).animate({opacity:0},{duration:600,easing:'easeOutCubic'});
		$('.box3').delay(750).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.albumart').delay(600).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.times').delay(450).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		$('.listened').delay(300).animate({opacity:0},{duration:600,easing:'easeOutCubic'});
		$('.playbtn').delay(150).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic',complete:function() {
			$('.playbtn').removeClass('play'); //플레이버튼을 클릭했을 경우, 다음 active되는 카드에서 play 클래스가 추가돼있는 것을 방지하기 위해 클래스 삭제로 초기화 해줌
		}});
	}
	
	/* 버튼 클릭 시 오디오 재생/일시정지 토글 */
	$('.playbtn').click(function() {
		$('.playbtn').toggleClass('play'); //클릭 시 플래이버튼에 play 클래스가 토글
		if ($('.playbtn').hasClass('play')) {
			$('.active audio')[0].pause();        
		} else {
			$('.active audio')[0].play();
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