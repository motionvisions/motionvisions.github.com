/*
* @Author: ccfe
* @Email:  hzchangchao@corp.netease.com
*/

(function(win, doc) {
	var window = win, document = doc;

	/************ 下面为工具方法 ************/
	var nodePrototype = Node.prototype;
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


	//图片加载及进度条逻辑，与展示无关
	var layer, bar, imageList = ['logo.png','slice_01.jpg','slice_02.jpg','slice_03.jpg','slice_04.jpg',
			'slice_05.jpg','slice_06.jpg','slice_07.jpg','slice_08.jpg','slice_09.jpg','slice_10.jpg','logo.png'],
		IMAGES_LEN = imageList.length;

	(layer = document.getElementById('layer'), bar = document.getElementById('bar')) && setTimeout(function() {
		bar.style.width = '80%';
	}, 500);


	function createBall() {
		var ball = document.getElementById('ball'), fragment = document.createDocumentFragment(), div;
		imageList.forEach(function(itm, idx) {
			div = document.createElement('div');
			div._$addClass('slice');
			div._$setStyle({backgroundImage: 'url(' + itm.src + ')'});
			fragment.appendChild(div);
		});
		ball.appendChild(fragment);
		setTimeout(function() {
			bar.style.width = '100%';
		}, 500);
		setTimeout(function() {
			layer._$setStyle({display: 'none'});
		}, 1500);
	};

	imageList.forEach(function(itm, idx) {
		var img = new Image();
		img.onload = function(){
			imageList[idx] = img;
			IMAGES_LEN --;
			!IMAGES_LEN && createBall();
		};
		img.src = './images/' + itm;
	});





})(window, document);