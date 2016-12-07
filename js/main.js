$(document).ready(function() {
	/* json 데이터를 받은 dom 로드 */
	$.getJSON('../data/chart.json', function(data) {
		$.each(data, function(i, value) {
			//카드
			var cardsample = $('.cardsample').html();
			var card = $('<div class="card">');
			card.html(cardsample); //샘플의 html 내용을 카드 안에 넣기
			$('.cardWrap').append(card); //데이터의 개수만큼 카드 추가
			
			//추가된 카드마다 해당 인덱스의 데이터 입력
			card.find('.number').text('#' + value.rank);
			card.find('.artistimg').append('<img src="' + value.artistimg + '" width="540" alt="artist" />');
			card.find('.artist').text(value.artist);
			card.find('.title').text(value.title);
			card.find('.desc').text(value.desc);
			card.find('audio').append('<source src="' + value.audio + '" type="audio/mpeg">');
			card.find('.albumart').append('<img src="' + value.albumart + '" width="220" alt="album art" />');
			card.find('.times').text(value.count);
			
			//리스트
			var chartsample = $('.chartsample').html();
			var chart = $('<tr>');
			chart.html(chartsample);
			$('table').append(chart);
			
			chart.find('.list-rank').text(i+1);
			chart.find('.list-title').text(value.title);
			chart.find('.list-artist').text(value.artist);
			chart.find('.list-albumart').append('<img src="' + value.albumart + '" width="90" height="90" alt="album art" />');
		});
	});
});
$(document).ajaxComplete(function() { //ajax 로드 완료 후 
	$('.cardsample, .chartsample').remove(); //샘플 삭제
	
	/* 슬라이더 */
	
	var autoswitch = false; //자동 슬라이드
	var autoswitch_speed = 8000; //슬라이드 속도
	var isAnimating = false; //다중클릭 방지
	
	var $first = $('.card').first();
	var $last = $('.card').last();
	var $bg = $('.bg');
	var $playbtn = $('.playbtn');
	var $chart = $('.chartList tr');
	
	//첫번째 active
	$first.addClass('active');
	$chart.first().addClass('current');
	
	//전체 숨기고 첫번째만 보이기
	$('.card').animate({opacity:0});
	$('.active').animate({opacity:1}, function() {
		activeOn(); //active 카드 애니메이션
	});
	
	//이전 버튼 클릭 시 이전으로
	$('.prevWrap').click(function() {
		if (isAnimating === false) { //애니메이팅이 종료됐을 때만 동작
			prevSlide();
		}
	});
	
	//다음 버튼 클릭 시 다음으로
	$('.nextWrap').click(function() {
		if (isAnimating === false) {
			nextSlide();
		}
	});
	
	//방향키를 클릭 시
	$(document).keydown(function(e) {
		if (e.keyCode == 37) { //왼쪽 키를 누를 시 이전으로
			if (isAnimating === false) {
				prevSlide();
			}
			return false;
		} else if (e.keyCode == 39) { //오른쪽 키를 누를 시 다음으로
			if (isAnimating === false) {
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
		
		activeChange(); //active 변경
		
		//active가 마지막 번째인지 확인
		if ($active.is($last)) {
			$next = $first; //마지막일 경우 첫번째를 active
		} else {
			$next = $active.next(); //마지막이 아닐 경우 다음으로
		}
		
		$active.removeClass('active'); //기존 active를 제거 후
		$next.addClass('active'); //다음 카드를 active
		
		activeOff(); //현재 active를 off
	}
	
	//이전으로 슬라이드
	function prevSlide() {
		var $prev, $active = $('.active');
		
		activeChange();
		
		//active가 첫번째인지 확인
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
			$(this).css({'background-image':'url('+$img+')'}).fadeIn(); //active의 아티스트이미지가 bg의 백그라운드로 페이드인
		});
		
		//애니메이팅
		$active.find('.box1, .number, .artistimg, .box2, .artist, .title, .desc, .box3, .albumart, .times, .listened, .playbtn').each(function(i) {
			$(this).delay(150 + i*150).animate({opacity:1,width:'100%'},{duration:600,easing:'easeOutCubic'});
		}).promise().done(function() { //each 함수 종료 시
			isAnimating = false; //애니메이팅 종료
		});
		
		//active된 곡을 리스트에서 표시
		var current = $active.index(); //active의 index값을 불러와서
		$chart.eq(current).addClass('current'); //해당 index의 차트에 current 클래스 추가
	};
	
	//active 변경 시 (등장 시의 역순으로)
	function activeChange() {
		var $active = $('.active');
		
		//애니메이팅 시작
		isAnimating = true;
		
		//애니메이팅
		$active.find('.title, .desc').delay(900).animate({opacity:0},{duration:600,easing:'easeOutCubic'});
		$active.find('.box1, .number, .artistimg, .box2, .artist, .box3, .albumart, .times, .listened, .playbtn').each(function(i) {
			$(this).delay(1750 - i*150).animate({opacity:0,width:0},{duration:600,easing:'easeOutCubic'});
		}).promise().done(function() { //each 함수 종료 시
			//차트의 current 클래스 삭제
			var current = $active.index();
			$('.current').removeClass('current');
			
			isAnimating = false; //애니메이팅 종료
		});
	}
	
	//active 퇴장
	function activeOff() {
		var $active = $('.active');
		
		//애니메이팅 시작
		isAnimating = true;
		
		//전체 오디오의 볼륨이 페이드아웃 되며 정지
		var audio = $('.card audio');
		audio.animate({volume:0},1500,function() {
			for (i=0; i<audio.length; i++) {
				audio[i].pause(); //일시정지 후,
				audio[i].currentTime = 0; //처음으로 되감기 함으로써 정지와 같은 효과
				audio[i].volume = 1; //0이 되었던 볼륨을 1로 되돌림
			}
		});
		
		$bg.stop().delay(1750).fadeOut({duration:600,easing:'easeOutCubic',complete:function() { //bg의 백그라운드 이미지 지우기
			$playbtn.removeClass('play'); //play 클래스가 다른 active에서 추가돼있는 것을 방지
			$('.card').stop().animate({opacity:0},{complete:function() { //모두 숨기고	
				$active.stop().animate({opacity:1},{complete:function() { //active만 보이기
					activeOn(); //active 등장
				}});
				
				isAnimating = false; //애니메이팅 종료
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
	
	/* 리스트 */
	
	//순차적으로 delay 되며 등장
	$chart.each(function(i) {
		$(this).delay(300 + i*150).animate({opacity:1,left:0},{duration:600,easing:'easeOutCubic'});
	});
	
	//리스트에서 클릭 시, 해당 곡만 active
	$chart.click(function() {
		var index = $chart.index(this); //차트가 몇 번째인지 index 값을 정의
		if (!$('.card').eq(index).hasClass('active')) { //해당 index의 카드가 active되지 않았을 때만 작동
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
$(window).resize(function() {
	$('body, section').height($(window).height() - $('section').offset().top); //윈도우 크기가 변경되면 윈도우 높이와 동일하게
});
$(window).resize();