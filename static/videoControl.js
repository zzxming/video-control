class Video {
	constructor(src, parent, style) {
		let initStyle = {
			width: '800px', 
			margin: '100px auto'
		}

		this.src = src;
		this.parent = parent;
		this.style = {
			...initStyle,
			...style
		};
		this.controllerShow = true;	// 是否显示控制栏
		this.isFull = false;	// 是否网页全屏
		this.title = src.replace(/(.*\/)*([^.]+).*/ig, '$2');
		this.isMute = false;	// 是否静音
		this.ended = false;		// 是否播放完毕
		this.loading = false;	// 视频是否在加载

		this.videoDuration = 0;
		this.videoVolume = 0.7;
		this.createVideo();
		this.createStyle();
	}

	createStyle() {
		for (let item in this.style) {
			this.root.style[item] = this.style[item];
		}
		if (document.getElementById('videoCSS')) {
			return;
		}
		let cssDom = document.createElement('style');
		cssDom.id = 'videoCSS';
		cssDom.type = 'text/css';
		cssDom.innerText = `
			.wrapper {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				background: #000;
				cursor: pointer;
			}
			.video {
				width: 100%;
				height: 100%;
			}
			.video_head,
			.video_control {
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: absolute;
				width: 100%;
				color: #fff;
				cursor: default;
			}
			.video_head {
				top: 0;
				left: 0;
				height: 40px;
				line-height: 40px;
				margin-bottom: 10px;
				background: linear-gradient(to bottom, #000, transparent);

			}
			.video_head_left,
			.video_head_right {
				height: 100%;
				margin: 0 40px;
			}
			.video_title {
				font-size: 20px;
			}
			.video_control {
				flex-direction: column;
				bottom: 0;
				left: 0;
				height: 60px;
				line-height: 60px;
				background: linear-gradient(to top, #000, transparent);
			}

			.video_control_time {
				display: grid;
				align-items: center;
				grid-template-areas: 'current time duration';
				grid-template-columns: auto 1fr auto;				
				width: 100%;
				height: 20px;
			}
			.video_time {
				grid-area: time;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				cursor: pointer;
			}
			.video_time-txt {
				min-width: 48px;
				height: 12px;
				line-height: 12px;
				margin: 0 10px;
				font-size: 12px;
				text-align: center;
			}
			.video_time-txt.current_time {
				grid-area: current;
			}
			.video_time-txt.duration_time {
				grid-area: duration;
			}
			.video_time_bar {
				position: relative;
				width: 100%;
				height: 4px;
				border-radius: 8px;
				background-color: rgba(255, 255, 255, .3);	
				cursor: pointer;
				transition: height .3s linear;
			}
			.video_time_bar.hover {
				height: 6px;
			}
			.video_time_bar.hover .video_time_cur {
				display: block;
				height: 6px;
			}
			.video_time_bar.hover .video_time_dot {
				top: -2px;
			}
			.video_time_bg {
				position: absolute;
				width: 0%;
				height: 100%;
				border-radius: 8px;
				background-color: #d4d4d4;
			}
			.video_time_progress {
				position: relative;
				width: 0%;
				height: 100%;
				border-radius: 8px;
				background-color: #00bcd4;	
			}
			.video_time_dot,
			.video_volume_dot {
				box-sizing: border-box;
				position: absolute;
				right: -6px;
				top: -3px;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background: #fff;
				z-index: 2;
				transition: top .3s linear;
			}
			.video_time_dot:hover,
			.video_volume_dot:hover {
				border: 1px solid #00bcd4;
			}
			.video_time_cur {
				display: none;
				position: absolute;
				top: 0;
				width: 1px;
				height: 4px;
				background-color: #000;
				z-index: 1;
				transition: height, top .3s linear;
			}
			.video_time_cur-txt {
				position: absolute;
				top: -24px;
				transform: translateX(-50%);
				font-size: 12px;
				color: #fff;
				background-color: rgba(0, 0, 0, .4);
				line-height: initial;
				padding: 2px 4px;
				border-radius: 4px;
				user-select: none;
			}
			.video_control_bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				height: 40px;
				line-height: 40px;
				margin: 0 40px;
			}
			.video_control_btn {
				display: inline-block;
				box-sizing: border-box;
				width: 30px;
				height: 30px;
				line-height: 30px;
				border: 1px solid;
				cursor: pointer;
				text-align: center;
			}
			.video_control_left {
				margin-left: 20px;
			}
			.video_control_right {
				margin-right: 20px;
			}
			.play::after {
				content: '放';
				display: inline-block;
			}
			.pause::after {
				content: '暂';
				display: inline-block;
			}
			.rate-btn {
				position: relative;
			}
			.rate-btn::after {
				content: '倍';
				display: inline-block;
			}
			.rate-btn:hover .rate_list {
				display: block;
			}
			.rate_list {
				display: none;
				position: absolute;
				bottom: 30px;
				left: -15px;
				width: 60px;
			}
			.rate_item {
				width: 100%;
				height: 26px;
				line-height: 26px;
				background-color: rgba(0, 0, 0, .4);
				cursor: pointer;
			}
			.rate_item:hover,
			.rate_item.active {
				background-color: rgba(0, 0, 0, .8);
			}
			.control_space {
				height: 10px;
				background-color: transparent;
			}
			.volume-btn {
				position: relative;
			}
			.volume-btn:hover .video_volume{
				display: block;
			}
			.video_volume.active {
				display: block;
			}
			.volume-btn::before {
				content: '音';
				display: inline-block;
			}
			.volume-btn::after {
				content: '';
				display: block;
				position: absolute;
				bottom: 28px;
				left: -5px;
				width: 40px;
				height: 14px;
				cursor: default;
			}
			.volume-btn.mute::after {
				content: '';
				display: block;
				position: absolute;
				width: 30px;
				background: #fff;
				height: 2px;
				top: 14px;
				left: -1px;
				transform: rotate(45deg);
			}
			.video_volume {
				display: none;
				position: absolute;
				bottom: 30px;
				left: -5px;
				cursor: default;
			}
			.video_volume_wrapper {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 40px;
				height: 100px;
				padding-bottom: 6px;
				background-color: rgba(0, 0, 0, .9);
			}
			.video_volume_txt {
				user-select: none;
			}
			.video_volume_bar {
				display: flex;
	    		flex-direction: column-reverse;
				width: 4px;
				height: 60px;
				border-radius: 8px;
				background-color: rgba(255, 255, 255, .3);
				cursor: pointer;
			}
			.video_volume_progress {
				position: relative;
				width: 100%;
				height: 0%;
				border-radius: 8px;
				background-color: #00bcd4;
			}
			.video_volume_dot {
				bottom: -3px;
				left: -3px;
			}


			.video_loading {
				box-sizing: border-box;
				position: absolute;
				top: 50%;
				left: 50%;
				margin-top: -25px;
				margin-left: -25px;
				width: 50px;
				height: 50px;
				border: 4px solid transparent;
				border-top-color: #fff;
				border-radius: 50%;
				visibility: hidden;
				animation: none;
			}
			.video_loading.show {
				visibility: visible;
				animation: circle 2s linear infinite;
			}
			.video_loading.hidden {
				visibility: hidden;
				animation: none;
			}


			.fadeout {
				visibility: hidden;
				opacity: 0;
				transition: .3s all linear;
			}
			.fadein {
				visibility: visible;
				opacity: 1;
				transition: .3s all linear;
			}
			
			@keyframes circle {
				0% { transform: rotateZ(0deg); }
				25% { transform: rotateZ(90deg); }
				50% { transform: rotateZ(180deg); }
				75% { transform: rotateZ(270deg); }
				100% { transform: rotateZ(360deg); }
			}
		`;
		document.head.append(cssDom);

	}

	createVideo() {
		let videoWrapper = document.createElement('div');
		videoWrapper.classList.add('wrapper');
		this.root = videoWrapper;

		let videoDom = document.createElement('video');
		videoDom.classList.add('video');
		this.video = videoDom;
		this.video.preload = 'metadata';
		videoDom.src = this.src;
		// this.video.load();
		let appendTo = this.parent || document.body;
		videoWrapper.append(videoDom);
		
		appendTo.append(videoWrapper);

		this.videoMask();
		this.bindVideoEvent();
	}

	videoMask() {
		this.videoLoading();
		this.createVideoHead();
		this.createVideoBottomControl();
	}
	// 创建加载元素
	videoLoading() {
		let loading = document.createElement('div');
		loading.classList.add('video_loading');
		loading.classList.add('hidden');
		this.root.append(loading);
	}
	startLoading() {
		let loadingDom = this.parent.getElementsByClassName('video_loading')[0];
		this.loading = true;
		loadingDom.classList.add('show');
		loadingDom.classList.remove('hidden');
	}
	stopLoading() {
		let loadingDom = this.parent.getElementsByClassName('video_loading')[0];
		this.loading = false;
		loadingDom.classList.remove('show');
		loadingDom.classList.add('hidden');
	}
	// 创建顶部head信息
	createVideoHead() {
		let videoHead = document.createElement('div');
		videoHead.classList.add('video_head');
		videoHead.innerHTML = `
			<div class="video_head_left">
				<span class="video_title">${this.title}</span>
			</div>
			<div class="video_head_right"></div>
		`;
		this.root.append(videoHead);
		this.videoHead = videoHead;
	}
	// 创建底部control
	createVideoBottomControl() {
		let videoBottom = document.createElement('div');
		videoBottom.classList.add('video_control');
		videoBottom.innerHTML = `
			<div class="video_control_time">
				<span class="video_time-txt current_time">${formatTime(this.video.currentTime)}</span>
				<div class="video_time">
					<div class="video_time_bar">
						<div class="video_time_bg"></div>
						<div class="video_time_progress">
							<div class="video_time_dot"></div>
						</div>
						<div class="video_time_cur">
							<div class="video_time_cur-txt">00:00</div>
						</div>
					</div>
				</div>
				<span class="video_time-txt duration_time">${formatTime(this.videoDuration)}</span>
			</div>
			<div class="video_control_bottom">
				<div class="video_control_left">
					<div class="video_control_btn play-btn play"></div>
				</div>
				<div class="video_control_right">
					<div class="video_control_btn volume-btn">
						<div class="video_volume">
							<div class="video_volume_wrapper">
								<div class="video_volume_txt">${this.videoVolume * 100}</div>
								<div class="video_volume_bar">
									<div class="video_volume_progress">
										<div class="video_volume_dot"></div>
									</div>
								</div>
							</div>
							<div class="control_space"></div>
						</div>
					</div>
					${ document.pictureInPictureEnabled ? '<div class="video_control_btn inpic-btn">画</div>' : '' }
					<div class="video_control_btn rate-btn">
						<div class="rate_list">
							<div class="rate_item" data-rate="0.5">x0.5</div>
							<div class="rate_item active" data-rate="1">x1</div>
							<div class="rate_item" data-rate="1.5">x1.5</div>
							<div class="rate_item" data-rate="2">x2</div>
							<div class="rate_item" data-rate="3">x3</div>
							<div class="control_space"></div>
						</div>
					</div>
					<div class="video_control_btn full-browser-btn">页</div>
					<div class="video_control_btn full-btn">全</div>
				</div>
			</div>
		`;
		this.root.append(videoBottom);
		this.videoBottom = videoBottom;
		this.videoControlEvent();
		this.timeBarEvent();
		this.volumeBarEvent();
	}
	// 音量进度条事件
	volumeBarEvent() {
		let volumeWrapper = this.parent.getElementsByClassName('video_volume')[0];
		let volumeBar = this.parent.getElementsByClassName('video_volume_bar')[0];
		let volumeDot = this.parent.getElementsByClassName('video_volume_dot')[0];
		let volumeProgress = this.parent.getElementsByClassName('video_volume_progress')[0];
		volumeBar.addEventListener('click', (e) => {
			e.stopPropagation();
			if (e.target === volumeBar || e.target === volumeProgress) {
				let y = Math.floor(volumeBar.getBoundingClientRect().y);
				let offsetY = e.clientY - y;
				// console.log(offsetY, volumeBar.offsetHeight, y)
				let pre = 1 - (offsetY / volumeBar.offsetHeight).toFixed(2);
				// console.log(pre)
				this.video.volume = pre > 1 ? 1 : pre < 0 ? 0 : pre;
			}
		});
		volumeDot.addEventListener('mousedown', (e) => {
			// console.log(e)
			let start = e.pageY;
			// 当前音量条高度
			let nowHeight = Number(getComputedStyle(volumeProgress).height.split('px')[0]);
			// 总的音量条的高度
			let totalHeight = volumeBar.offsetHeight;
			let result = 0;

			volumeWrapper.classList.add('active');

			let move = (e) => {
				let now = e.pageY;
				// 当前移动差
				let distance = now - start;
				// 因为音量条为竖向,增大音量是y减小,减小音量是y增大,所以使用start - 移动差,减负值为增,减正值为减
				// 当前高度减去移动值大于总高度则为100,否则正常赋值
				result = nowHeight - distance > totalHeight ? totalHeight : nowHeight - distance;
				if (result < 0) result = 0
				// console.log(now, start)
				let val = (result / totalHeight).toFixed(2);
				this.video.volume = val > 1 ? 1 : val < 0 ? 0 : val;
			}
			let up = () => {
				document.removeEventListener('mousemove', move);
				document.removeEventListener('mouseup', up);
				volumeWrapper.classList.remove('active');
				if (result <= 0) return;
				let val = (result / totalHeight).toFixed(2);
				this.video.volume = val > 1 ? 1 : val < 0 ? 0 : val;
			}
			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', up);
		});
	}
	// 视频进度条事件
	timeBarEvent() {
		let timeWrap = this.parent.getElementsByClassName('video_time')[0];
		let timeBar = this.parent.getElementsByClassName('video_time_bar')[0];
		let timeProgress = this.parent.getElementsByClassName('video_time_progress')[0];
		let timeDot = this.parent.getElementsByClassName('video_time_dot')[0];
		let timeCur = this.parent.getElementsByClassName('video_time_cur')[0];
		let timeCurTxt = this.parent.getElementsByClassName('video_time_cur-txt')[0];
		timeBar.addEventListener('click', (e) => {
			e.stopPropagation();
			let barLeft = timeBar.getBoundingClientRect().left;
			let pre = (e.clientX - barLeft) / timeBar.offsetWidth;
			this.video.currentTime = pre * this.video.duration;
		});
		// 进度条拖动
		timeDot.addEventListener('mousedown', (e) => {
			// console.log(e)
			let start = e.pageX;
			let nowWidth = Number(getComputedStyle(timeProgress).width.split('px')[0]);
			let totalWidth = timeBar.offsetWidth;
			let pre = 0;
			let changed = false;
			// 同理音量条
			let move = (e) => {
				changed = true;
				let now = e.pageX;
				let distance = now - start;
				// 这里时间是横轴,所以不像音量是减,是直接相加
				// 长度不能超出
				let result = distance + nowWidth > totalWidth ? totalWidth : distance + nowWidth;
				if (result < 0) result = 0;
				pre = result / totalWidth;
				timeProgress.style.width = `${Math.round(pre * 100)}%`;
			}
			let up = () => {
				document.removeEventListener('mousemove', move);
				document.removeEventListener('mouseup', up);

				if (changed) {
					this.video.currentTime = pre * this.video.duration;
				}
			}
			document.addEventListener('mousemove', move);
			document.addEventListener('mouseup', up);
		});
		
		timeWrap.addEventListener('mouseenter', (e) => {
			timeBar.classList.add('hover');
			let { left: barLeft, width: barWidth } = timeBar.getBoundingClientRect();
			let move = (e) => {
				timeCur.style.left = `${e.clientX - barLeft}px`
				let pre = (e.clientX - barLeft) / barWidth;
				if (pre < 0) pre = 0;
				if (pre > 100) pre = 100;
				timeCurTxt.innerText = formatTime(pre * this.videoDuration);
			}
			let leave = (e) => {
				timeBar.classList.remove('hover');
				timeBar.removeEventListener('mousemove', move);
				timeWrap.removeEventListener('mouseleave', leave);
			}
			timeBar.addEventListener('mousemove', move);
			timeWrap.addEventListener('mouseleave', leave);
		});
	}
	// control按钮事件
	videoControlEvent() {
		let controlWrapper = this.parent.getElementsByClassName('video_control')[0];
		let playBtn = this.parent.getElementsByClassName('video_control_btn play-btn')[0];
		let rateList = this.parent.getElementsByClassName('rate_list')[0];
		let rateBtn = this.parent.getElementsByClassName('video_control_btn rate-btn')[0];
		let fullBtn = this.parent.getElementsByClassName('video_control_btn full-btn')[0];
		let fullBrowserBtn = this.parent.getElementsByClassName('video_control_btn full-browser-btn')[0];
		let volumeBtn = this.parent.getElementsByClassName('video_control_btn volume-btn')[0];
		let inpicBtn = this.parent.getElementsByClassName('video_control_btn inpic-btn')[0];

		// 播放按钮
		playBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.videoPlay();
		});
		// 倍速切换
		rateBtn.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		rateList.addEventListener('click', (e) => {
			e.stopPropagation();
			let clickDom = e.target;
			if (clickDom.dataset.rate) {
				this.parent.getElementsByClassName('rate_item active')[0].classList.remove('active');
				clickDom.classList.add('active');
				this.video.playbackRate = Number(clickDom.dataset.rate);
			}
		});
		let bindFullScreenKeyEvent = this.fullScreenKeyEvent.bind(this);
		let bindWindowResizeEvent = ((e) => {
			this.root.style.width = `${window.innerWidth}px`;
			this.root.style.height = `${window.innerHeight}px`;
		}).bind(this);
		// 画中画按钮
		inpicBtn.addEventListener('click', (e) => {
			if (!document.pictureInPictureEnabled) {
				alert('浏览器不支持画中画播放')
				return;
			}
			if (!document.pictureInPictureElement) {
				this.video.requestPictureInPicture();
			}
			else {
				document.exitPictureInPicture();
			}
		});
		// 全屏按钮
		fullBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			
			if (this.isFull) {
				this.outBrowserFullScreen();
				window.removeEventListener('resize', bindWindowResizeEvent);
			}

			if (document.fullscreenElement) {
				document.exitFullscreen();
			}
			else {
				document.addEventListener('keydown', bindFullScreenKeyEvent);
				this.root.requestFullscreen();
			}
		});
		// 页面全屏按钮
		fullBrowserBtn.addEventListener('click', async (e) => {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			}

			if (this.isFull) {
				this.outBrowserFullScreen();
				window.removeEventListener('resize', bindWindowResizeEvent);
			}
			else {
				this.inBrowserFullScreen();
				document.addEventListener('keydown', bindFullScreenKeyEvent);
				window.addEventListener('resize', bindWindowResizeEvent);
			}
		});
		// 音量按钮
		volumeBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			if (e.target !== volumeBtn) return;
			if (this.isMute) {
				this.video.volume = this.videoVolume;
				this.isMute = false;
				volumeBtn.classList.remove('mute');
			}
			else {
				// console.log(this.video.volume)
				this.videoVolume = this.video.volume;
				this.video.volume = 0;
				this.isMute = true;
				volumeBtn.classList.add('mute');
			}
		});

		// 点击显示title和control
		this.root.addEventListener('click', (e) => {
			e.stopPropagation();
			// 当前元素获得焦点
			window.isFoucs = this.root;
			
			this.videoPlay();
			
			// 绑定当选中视频时的键盘事件
			document.removeEventListener('keydown', bindFullScreenKeyEvent);
			document.removeEventListener('keydown', bindFullScreenKeyEvent);
			document.addEventListener('keydown', bindFullScreenKeyEvent);
		});
		
		let maskTimer = 0;		// mask消失计时
		let controlTimer = 0;
		// 鼠标移动事件节流
		let throttleMousemove = throttle((e) => {
			let path = e.path || e.composedPath();
			if (path.includes(controlWrapper)) {
				return;
			}
			clearTimeout(maskTimer);
			clearTimeout(controlTimer);
			// 进入显示
			this.controllerShow = true;
			this.videoHead.classList.add('fadein');
			this.videoHead.classList.remove('fadeout');
			this.videoBottom.classList.add('fadein');
			this.videoBottom.classList.remove('fadeout');
			// 停止移动3秒后隐藏
			maskTimer = setTimeout(() => {
				// console.log('mt')
				this.controllerShow = false;
				this.videoHead.classList.remove('fadein');
				this.videoHead.classList.add('fadeout');
				this.videoBottom.classList.remove('fadein');
				this.videoBottom.classList.add('fadeout');
				maskTimer = null;
			}, 3000);
		}, 1000);
		this.root.addEventListener('mousemove', throttleMousemove);
		// 当视频被激活时(被点了),绑一些事件,点击页面其他地方就解绑
		// 此事件要再this.root的click事件外,保持此事件函数地址引用不变,不然会导致解绑事件失败
		document.addEventListener('click', () => {
			document.removeEventListener('keydown', bindFullScreenKeyEvent)
		});

		let videoControl = this.parent.getElementsByClassName('video_control')[0];
		videoControl.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		// 鼠标移入长显示,移出2s后隐藏
		videoControl.addEventListener('mouseenter', () => {
			clearTimeout(maskTimer);
			clearTimeout(controlTimer);
			this.videoBottom.classList.remove('fadeout');
			this.videoBottom.classList.add('fadein');
		});
		videoControl.addEventListener('mouseleave', () => {
			controlTimer = setTimeout(() => {
				// console.log('ct')
				this.videoHead.classList.remove('fadein');
				this.videoHead.classList.add('fadeout');
				this.videoBottom.classList.remove('fadein');
				this.videoBottom.classList.add('fadeout');
				controlTimer = null;
			}, 2000)
		});
	}
	// 退出全屏处理
	outBrowserFullScreen() {
		this.isFull = false;

		this.root.style.position = `relative`;
		this.root.style.top = `0`;
		this.root.style.left = `0`;

		this.root.style.width = this.style.width || '100%';
		this.root.style.height = this.style.height || '100%';
		this.root.style.margin = this.style.margin || '0 auto';
		this.root.style.zIndex = 1;
		document.body.style.overflow = 'auto';
	}
	// 进入全屏处理
	inBrowserFullScreen() {
		// console.log(window.innerHeight)
		// console.log(this)
		this.isFull = true;
		this.root.style.position = `fixed`;
		this.root.style.top = `0`;
		this.root.style.left = `0`;
		this.root.style.width = `${window.innerWidth}px`;
		this.root.style.height = `${window.innerHeight}px`;
		this.root.style.margin = `0`;
		this.root.style.zIndex = 10;
		document.body.style.overflow = 'hidden';
	}
	// 视频事件
	bindVideoEvent() {
		let curTimedom = this.parent.getElementsByClassName('video_time-txt current_time')[0];
		let duraTimedom = this.parent.getElementsByClassName('video_time-txt duration_time')[0];
		let timeBg = this.parent.getElementsByClassName('video_time_bg')[0];
		
		let volumeProgress = this.parent.getElementsByClassName('video_volume_progress')[0];
		let voloumeText = this.parent.getElementsByClassName('video_volume_txt')[0];

		// 可以播放
		this.video.addEventListener('canplay', () => {
			console.log('canplay')
			this.stopLoading();
			// 视频初始化数据
			this.videoDuration = this.video.duration;
			this.video.volume = this.videoVolume;
			this.parent.getElementsByClassName('video_volume_txt')[0].innerText = Math.floor(this.videoVolume * 100);
			this.parent.getElementsByClassName('video_volume_progress')[0].style.height = `${this.videoVolume * 100}%`;

			// 视频当前时间和总时长
			curTimedom.innerText = formatTime(this.video.currentTime);
			duraTimedom.innerText = formatTime(this.videoDuration);
		});
		// 视频播放时间改变
		this.video.addEventListener('timeupdate', () => {
			this.videoTimeChange(this.video.currentTime);
		});
		// 视频进度跳转
		this.video.addEventListener('seeking', () => {
			this.startLoading();
			this.videoTimeChange(this.video.currentTime);
		});
		// 视频音量改变
		this.video.addEventListener('volumechange', () => {
			let val = this.video.volume;
			// this.videoVolume = val;
			// this.video.volume = val;
			volumeProgress.style.height = `${val * 100}%`;
			voloumeText.innerText = Math.floor(val * 100);
		});
		// 视频播放到末尾
		this.video.addEventListener('ended', () => {
			playBtn.classList.add('play');
			playBtn.classList.remove('pause');
			this.ended = true;
			this.video.pause();
		});

		this.video.addEventListener('loadstart', () => {
			console.log('loadstart');
			this.startLoading();
		});

		// this.video.addEventListener('durationchange', () => {
		// 	console.log('durationchange')
		// })

		this.video.addEventListener('loadedmetadata', () => {
			console.log('loadedmetadata');
			this.stopLoading();
			
			this.video.addEventListener('progress', () => {
				for (let i = 0; i < this.video.buffered.length; i++) {
					// console.log('start',this.video.buffered.start(i),'end',this.video.buffered.end(i), i)
					if (this.video.buffered.start(i) < this.video.currentTime && this.video.buffered.end(i) > this.video.currentTime) {
						timeBg.style.width = this.video.buffered.end(i) / this.video.duration * 100 + '%'
						break;
					}
				}
			});
		});

		// 
		this.video.addEventListener('waiting', () => {
			console.log('waiting');
			this.startLoading();
		});

		// this.video.addEventListener('canplaythrough', () => {
		// 	console.log('canplaythrough, 全部加载完')
		// });
		
		// this.video.addEventListener('loadeddata', () => {
		// 	console.log('第一帧')
		// });
	}
	// 全屏下键盘事件
	fullScreenKeyEvent(e) {
		e.preventDefault();
		// 判断当前获焦元素, 不是当前则不进行键盘事件执行
		if (window.isFoucs !== this.root) return;
		switch(e.key) {
			case 'ArrowLeft': {
				this.video.currentTime = this.video.currentTime - 5;
				break;
			}
			case 'ArrowRight': {
				this.video.currentTime = this.video.currentTime + 5;
				break;
			}
			case 'ArrowUp': {
				let val = this.video.volume + 0.1;
				this.video.volume = val > 1 ? 1 : val < 0 ? 0 : val;
				break;
			}
			case 'ArrowDown': {
				let val = this.video.volume - 0.1;
				this.video.volume = val > 1 ? 1 : val < 0 ? 0 : val;
				break;
			}
			case 'f': {
				let fullBtn = this.parent.getElementsByClassName('video_control_btn full-btn')[0];
				fullBtn.click();
				break;
			}
			case ' ': {
				this.videoPlay();
				break;
			}
			default: {
				break;
			}
		}
	}
	// 视频播放
	videoPlay() {
		if (this.ended) {
			this.video.currentTime = 0;
			playBtn.classList.remove('play');
			playBtn.classList.add('pause');
			this.ended = false;
			this.video.play();
			return;
		}
		let playBtn = this.parent.getElementsByClassName('video_control_btn play-btn')[0];
		if (this.video.paused) {
			playBtn.classList.remove('play');
			playBtn.classList.add('pause');
			this.video.play();
		}
		else {
			playBtn.classList.add('play');
			playBtn.classList.remove('pause');
			this.video.pause();
		}
	}
	// 视频时间变化
	videoTimeChange(time) {
		let curTimedom = this.parent.getElementsByClassName('video_time-txt current_time')[0];
		let timeProgress = this.parent.getElementsByClassName('video_time_progress')[0];

		curTimedom.innerText = formatTime(time);
		timeProgress.style.width = `${time / this.videoDuration * 100}%`;
	}
}

function formatTime(date) {
	if (typeof date !== 'number' || date < 0) {
		return date;
	}
	let time = Math.floor(date);
	let hour = Math.floor(time / 3600);
	let minute = Math.floor(time % 3600 / 60);
	let second = time - hour * 3600 - minute * 60;
	if (minute < 10) {
		minute = `0${minute}`;
	}
	if (second < 10) {
		second = `0${second}`;
	}
	if (hour < 10) {
		hour = `0${hour}`;
	}
	return `${hour > 0 ? `${hour}:` : ''}${minute}:${second}`;
}


function throttle(fn, delay) {
	var t = null;
	var begin = new Date().getTime();
	return function () {
		var self = this;
		var args = arguments;
		var cur = new Date().getTime();
		clearTimeout(t);
		if (cur - begin >= delay) {
			fn.apply(self, args);
			begin = cur;
		} else {
			t = setTimeout(() => {
				fn.apply(self, args);
			}, delay);
		}
	};
}