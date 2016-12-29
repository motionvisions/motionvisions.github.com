/*
* @Author: ccfe
* @Email:  hzchangchao@corp.netease.com
*/

(function(win, doc) {
	var window = win, document = doc;

	/************ 下面为工具方法  ************/
	var nodePrototype = window.Node.prototype;
	nodePrototype._$hasClass = function(cls) {
    	return this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	};

	nodePrototype._$addClass = function(cls) {
	   !this._$hasClass(cls) && (this.className += " " + cls);
	};

	nodePrototype._$removeClass = function(cls) {
		if(!this._$hasClass(cls)) return;
	    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
	    this.className = this.className.replace(reg, ' ');
	};

	nodePrototype._$toggleClass = function(cls){
	    this._$hasClass(cls) ? this._$removeClass(cls) : this._$addClass(cls);
	};

	nodePrototype._$setStyle = function(styleMap) {
		for(var pro in styleMap) {
			this.style[pro] = styleMap[pro];
		}
	};


	/************ 图片加载及进度条逻辑，与展示无关 ************/
	var layer, bar, imageList = ['slice_01','slice_02','slice_03','slice_04','slice_05','slice_06'
			,'slice_07','slice_08','slice_09','slice_10','slice_11','slice_12','slice_13','slice_14'
			,'slice_15','slice_16','slice_17','slice_18','slice_19','slice_20','logo','logo'],
		IMAGES_LEN = imageList.length, barDuration = 500, sliceH = 1170;

	(layer = document.getElementById('layer'), bar = document.getElementById('bar')) && setTimeout(function() {
		bar.style.width = '80%';
	}, barDuration);



	function createBall() {
		var eyes = document.getElementById('eyes'),
			ball = document.getElementById('ball'),
			axis = document.getElementById('axis'),
			fragment = document.createDocumentFragment(),
			winH = document.documentElement.clientHeight;

		eyes._$setStyle({ height: document.body.clientHeight + 'px'});
		imageList.forEach(function(itm, idx) {
			div = document.createElement('div');
			div._$addClass('slice' + (idx > 19 ? ' cap' : ' side'));
			div._$setStyle({backgroundImage: 'url(' + itm.src + ')'});
			fragment.appendChild(div);
		});
		axis.appendChild(fragment);
		setTimeout(function() {
			bar.style.width = '98%';
		}, barDuration);
		setTimeout(function() {
			layer._$setStyle({display: 'none'});
		}, barDuration*3);
		setTimeout(function() {
			afterInit();
		}, barDuration*5);
	};

	imageList.forEach(function(itm, idx) {
		var img = new Image();
		img.onload = function(){
			imageList[idx] = img;
			IMAGES_LEN --;
			!IMAGES_LEN && createBall();
		};
		img.src = ['./images/', itm, '.png'].join('');
	});

	/************ 开场动画 ************/


	/************ 鼠标拖动 ************/

    function afterInit() {
	    var PERSP_LENGTH = 800,
	    	BG_WIDTH = 129,
	      	BG_HEIGHT = 1170,
		  	BTM_WIDTH = 500,
	      	BTM_HEIGHT = 600,
	      	BG_NUMBER = 20,
	      	PER_ANGLE = 360 / BG_NUMBER;

	    var translateZ = (function calTranslateZ(opts) {
	      return Math.round(opts.width / (2 * Math.tan(Math.PI / opts.number)))
	    })({
	      width: BG_WIDTH,
	      number: BG_NUMBER
	    })


	    var stage = document.getElementById('stage'),
	    	axis = document.getElementById('axis'),
	    	ball = document.getElementById('ball'),
	      	viewW = document.body.clientWidth,
	      	viewH = document.body.clientHeight;

	    stage._$setStyle({
	    	transform: 'translateZ(' + translateZ*1.3 + 'px)',
	    	left: -viewW/6 +'px'
	    });
	    axis._$setStyle({left: -viewW/2 +'px'});
	    var container = document.getElementById('axis'),
	    	slices = document.getElementsByClassName('slice');

	    for (var i = 0; i < BG_NUMBER; i++) {
	      	slices[i]._$setStyle({
		        "position": "absolute",
		        "width": BG_WIDTH + 'px',
		        "height": BG_HEIGHT + 'px',
		        "left": (viewW - BG_WIDTH) / 2  + 'px',
		        "top": (viewH - BG_HEIGHT) / 2  + 'px',
		        "transform": "rotateY(" + (180 - i * PER_ANGLE) + "deg) translateZ("+ (-translateZ + 3) +"px)"
	      	});
	    }

	    for(var j = BG_NUMBER; j < BG_NUMBER + 2; j++){
	       slices[j]._$setStyle({
		        "position": "absolute",
		        "width": BTM_WIDTH + 'px',
		        "height": BTM_HEIGHT + 'px',
		        "left": (viewW - BTM_WIDTH) / 2 + 'px',
		        "top": (viewH - BTM_HEIGHT) / 2 + 'px',
		        "transform": "rotateX("+ (j - BG_NUMBER ? 1: -1) * 90 +"deg) rotateZ(90deg) translateZ("+ (-BG_HEIGHT/2) +"px)"
	        });
	    }

	    var lastMouseX = 0,
	      lastMouseY = 0,
	      curMouseX = 0,
	      curMouseY = 0,
	      lastAngleX = 0,
	      lastAngleY = 0,
	      angleX = 0,
	      angleY = 0;

	    var initTranZ = -150,
	      tranZDistance = 0,
	      oriDragDistance = 0;
	    var temZ = 0;

	    var slastMouseX = 0;
	    var frameTimer;
	    var timeoutTimer;

	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
	      function(callback) {
	        setTimeout(callback, 1000 / 60)
	      }

	    document.body.addEventListener('touchmove', function(evt) {
	    	//禁用微信的下拉
	    	event.preventDefault();
	    });
	    document.body.addEventListener('mousedown', mouseDownHandler);
	    document.body.addEventListener('touchstart', mouseDownHandler);
	    document.body.addEventListener('mouseup', mouseUpHandler);
	    document.body.addEventListener('touchend', mouseUpHandler);

	    function mouseDownHandler(evt) {
	      // 由于移动设备支持多指触摸，因此与PC的鼠标不同，返回是一数组touches。
	      lastMouseX = evt.pageX || evt.touches[0].pageX;
	      lastMouseY = evt.pageY || evt.touches[0].pageY;
	      lastAngleX = aimAngleX;
	      lastAngleY = aimAngleY;
	      curMouseX = evt.pageX || evt.touches[0].pageX;
	      curMouseY = evt.pageY || evt.touches[0].pageY;

	      slastMouseX = evt.pageX || evt.touches[0].pageX;
	      clearTimeout(timeoutTimer);

	      document.body.addEventListener('mousemove', mouseMoveHandler);
	      document.body.addEventListener('touchmove', mouseMoveHandler);

	      window.cancelAnimationFrame(frameTimer);
	      frameTimer = requestAnimationFrame(go);
	    }

	    function mouseMoveHandler(evt) {
	      curMouseX = evt.pageX || evt.touches[0].pageX;
	      curMouseY = evt.pageY || evt.touches[0].pageY;

	      dragRotate({
	        pageX: curMouseX,
	        pageY: curMouseY
	      });
	      dragScale({
	        pageX: curMouseX,
	        pageY: curMouseY
	      });
	    }

	    function mouseUpHandler(evt) {
	      // touchend 不具有坐标信息，因此需以touchmove的最后一次点提供
	      // http://stackoverflow.com/questions/17957593/how-to-capture-touchend-coordinates
	      // curMouseX = evt.pageX || evt.touches[0].pageX;
	      // curMouseY = evt.pageY || evt.touches[0].pageY;

	      document.body.removeEventListener('mousemove', mouseMoveHandler);
	      document.body.removeEventListener('touchmove', mouseMoveHandler);

	      timeoutTimer = setTimeout(function(){
	        window.cancelAnimationFrame(frameTimer)
	      }, 2500)
	    }


	    var aimAngleX = 0,aimAngleY = 0;
	    var curBgAngleX = 0, curBgAngleY = 0;
	    var curItemAngleX = 0, curItemAngleY = 0;

	    function dragRotate(evtInfo) {
	      // 注意：rotateX(Y) 与 鼠标（触摸）的X（Y）轴是交叉对应的

	      // aimAngleX(Y)的值是通过【拖拽位移换算为相应角度得到】
	      aimAngleX = ( 180 / Math.PI * (Math.atan((curMouseX - lastMouseX) / translateZ)) + lastAngleX )

	      // 限制上下旋转在35°以内
	      aimAngleY = Math.max(-33, Math.min((180 / Math.PI * Math.atan((curMouseY - lastMouseY) / (Math.sqrt(Math.pow(BG_HEIGHT / 2, 2) + Math.pow(translateZ, 2))*1.5)) + lastAngleY), 33))
	    }

	    function dragScale(evtInfo) {
	        var dis = Math.abs(evtInfo.pageX - slastMouseX);
	        tranZDistance -= 0.7 * dis;
	        slastMouseX = evtInfo.pageX;
    	}

	    // requestAnimationFrame
	    function go() {
	      // bg 与 item 的位移增量速度的不一致，可形成视差运动
	      curBgAngleX += (aimAngleX - curBgAngleX) * 0.4;
	      curBgAngleY += (aimAngleY - curBgAngleY) * 0.4;
	      tranZDistance -= 0.08 * tranZDistance;

	      Math.abs(tranZDistance) < 0.5 && (tranZDistance = 0);
	      ball._$setStyle({
	           transform: "translateZ(" + (tranZDistance) + "px)"
	       });
	      axis._$setStyle({
	        transform: "rotateX(" + (curBgAngleY) + "deg) rotateY(" + -curBgAngleX + "deg) rotateZ(0)"
	      })
	      frameTimer = requestAnimationFrame(go);
	    }
	}
})(window, document);