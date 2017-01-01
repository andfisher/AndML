/**
 * @desc andML. A JavaScript Object to HTML parser
 * @author Andrew Fisher
 * @copyright Copyright (c) 2016 Andrew Fisher (andfisher)
 * @version 0.1.4
 * @license The MIT License (MIT)
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
 
;(function(undefined){
	'use strict';

	window.andML = (function() {
	
		var _version = '0.1.4';
		
		var _settings = {
			supportSVG: false,
			supportXML: false
		};
		
		var _tags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,bgsound,big,blink,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,content,data,datalist,dd,del,details,dfn,dialog,dir,div,dl,dt,element,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h,head,header,hgroup,hr,html,i,iframe,image,img,input,ins,isindex,kbd,keygen,label,legend,li,link,listing,main,map,mark,marquee,menu,menuitem,meta,meter,multicol,nav,nobr,noembed,noframes,noscript,object,ol,optgroup,option,output,p,param,picture,plaintext,pre,progress,q,rp,rt,rtc,ruby,s,samp,script,section,select,shadow,small,source,spacer,span,strike,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr,xmp'.split(',');
		
		var _svg = '?xml,circle,ellipse,image,line,path,polygon,polyline,rect,svg'.split(',');
		
		var _voids = 'area,base,br,col,command,embed,hr,img,input,keygen,link,meta,param,source,track,wbr'.split(',');

		var _tagNS = function(){
			return (_settings.supportXML ? '=node' : 'tag');
		}
		var _textNS = function(){
			return (_settings.supportXML ? '=text' : 'text');
		}
		var _childrenNS = function() {
			return (_settings.supportXML ? '=nodes' : 'children');
		}
		
		var _emptyObj = function(o) {
			return JSON.stringify(o) === '{}';
		}
		
		var _isArray = function(o) {
			if (Array.isArray) return Array.isArray(o);
			return Object.prototype.toString.call(o) === '[object Array]';
		}
		
		var _extend = function() {
		
			var _array = [], len = arguments.length;
			while(len--) {
				if (typeof arguments[len] === 'object') {
					for (var i in arguments[len]) {
						if (arguments[len].hasOwnProperty(i)) {
							_array.push(arguments[len][i]);
						}
					}
				}
			}
			return _array;
		}
		
		var _parse = function(o) {

			var _, m;
			
			function _merge() {
				var _merged = {}, len = arguments.length;
				while(len--) {
					if (typeof arguments[len] === 'object') {
						for (var i in arguments[len]) {
							if (arguments[len].hasOwnProperty(i)) {
								_merged[i.toLowerCase()] = arguments[len][i];
							}
						}
					}
				}
				return _merged;
			}
		
			function _keys(str) {
			
				var _parsed = {}, _tag, m;

				if(!_settings.supportXML && _tags.indexOf(str) >= 0) {
					_parsed[_tagNS()] = str;
					return _parsed;
				}
				
				if (_settings.supportXML) {
					m = str.match(/^[a-z0-9]*:?([a-z1-6]*)/gi);
				} else {
					m = str.match(/^([a-z1-6]*)/gi);
				}
				
				if (m.length) {
					_tag = m[0].toLowerCase();
					if (!_settings.supportXML && _tags.indexOf(_tag) < 0) {
						return false;
					}
					if (_tag === '') {
						return false;
					}
					_parsed[_tagNS()] = _tag;
					
					
					/**
 					 * Test for CSS selectors
					 */

					// ID
					m = str.match(/#([^#\s\[\]\.]+)/i);
					if (m && m.length === 2) {
						_parsed['@id'] = m[1];
					}
					
					// Attributes
					var aRE = /\[([^\=\[\]]{1,})=?["']?([^\=\'\"]{0,})["']?\]/ig;
					while ((m = aRE.exec(str)) !== null) {
						_parsed['@' + m[1]] = m[2];
					}
					
					// Attributes
					var cRE = /\.([a-z0-9\-\_]{1,})/ig;
					var cssClasses = [];
					while ((m = cRE.exec(str)) !== null) {
						cssClasses.push(m[1]);
					}
					if (cssClasses.length) {
						_parsed['@class'] = cssClasses.join(' ');
					}

					return _parsed;
				}
				
				return false;
			}
		
			function _attr(obj) {
				var attr = '';
				for (var i in obj) {
					if (! _settings.supportXML && i.toLowerCase() === '@data' && typeof obj[i] !== 'string') {
					
						for (var d in obj[i]) {
							attr += ' data-' + d.toLowerCase() + '="' + obj[i][d] + '"';
						}
					
					} else if (i.charAt(0) === '@') {
						attr += ' ' + i.toLowerCase().substring(1) + '="' + obj[i] + '"';
					}
				}
				return attr;
			}
		
			for (var i in o) {
				_ = _keys(i);

				if (!_) continue;

				_ = _merge(_, o[i]);

				if (_[_tagNS()] === 'img' && _['@alt'] === undefined) {
					_['@alt'] = '';
				}

				this._ml += '<' + _[_tagNS()] + _attr(_) + (_[_tagNS()].charAt(0) === '?' ? '?' : '') + '>';

				if (_emptyObj(o[i])) {
					// No output required.
					
				} else if (typeof o[i] !== 'string' && o[i].length) {
					for (var n in o[i]) {
						_parse.call(this, o[i][n]);
					}						
				} else if (typeof o[i] === 'string') {
					
					this._ml += o[i];
					
				} else {

					if (_[_textNS()]) {
						this._ml += _[_textNS()];
					}

					_parse.call(this, _);
				
				}
				
				if (_isArray(_[_childrenNS()])) {
					for (var n in _[_childrenNS()]) {
						_parse.call(this, _[_childrenNS()][n]);
					}
				}
				
				if (_voids.indexOf(_[_tagNS()]) < 0 && _[_tagNS()].charAt(0) !== '?') {
					this._ml += '</' + _[_tagNS()] + '>';
				}
			}
		}
		
		var _reverse = function(ml) {
			// @todo
		}
	
		function andML() {
			this._version = _version;
			this._ml = '';
			this._on = {};
		}
		
		andML.prototype.on = function(ml) {
			this._on = {};
			_reverse.call(this, ml);
			return this._on;
		};
		andML.prototype.ml = function(on) {		
			if (this.settings.supportSVG) {
				_tags = _extend(_svg);
			};
			this._ml = '';
			_parse.call(this, on);
			return this._ml;
		};
		andML.prototype.version = _version;
		andML.prototype.settings = _settings;
		
		return new andML();
	})();
	
})();