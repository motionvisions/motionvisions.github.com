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
	var layer, bar, imageList = ['logo','slice_01','slice_02','slice_03','slice_04','slice_05','slice_06'
			,'slice_07','slice_08','slice_09','slice_10','slice_11','slice_12','slice_13','slice_14'
			,'slice_15','slice_16','slice_17','slice_18','slice_19','slice_20','logo'],
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

		eyes._$setStyle({perspectiveOrigin: '50% ' + winH/2 + 'px'});
		imageList.forEach(function(itm, idx) {
			div = document.createElement('div');
			div._$addClass('slice');
			div._$setStyle({backgroundImage: 'url(' + itm.src + ')'});
			fragment.appendChild(div);
		});
		axis.appendChild(fragment);
		setTimeout(function() {
			bar.style.width = '100%';
		}, barDuration);
		setTimeout(function() {
			layer._$setStyle({display: 'none'});
		}, barDuration*3);
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



})(window, document);