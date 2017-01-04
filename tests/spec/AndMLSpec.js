describe('AndML', function() {

  beforeEach(function() {
    andML.settings.supportSVG = false;
	andML.settings.supportXML = false;
  });
  
  it('should have a ml() method', function() {
	expect(typeof andML.ml).not.toEqual('undefined');
  });

  it('should have a on() method', function() {
	expect(typeof andML.on).not.toEqual('undefined');
  });
  
  describe('AndML.ml()', function() {
  
    beforeEach(function() {
		andML.settings.supportSVG = false;
		andML.settings.supportXML = false;
	  });
	  
	  it('should allow its ml method to be passed around', function() {
		var on = {
			'article': {
				'h1': 'Hello World',
				'p': 'Lorem Ipsum dolor sit amet'
			}
		  };
		var ml = '<article><h1>Hello World</h1><p>Lorem Ipsum dolor sit amet</p></article>'
		var fn = andML.ml;
		expect(fn(on)).toEqual(ml);  
	  });

	  it('should parse AMLON into correct markup', function() {
		var on = {
			'article': {
				'h1': 'Hello World',
				'p': 'Lorem Ipsum dolor sit amet'
			}
		  };
		var ml = '<article><h1>Hello World</h1><p>Lorem Ipsum dolor sit amet</p></article>'
		expect(andML.ml(on)).toEqual(ml);  
	  });

	  it('should parse arrays from AMLON into correct markup', function() {
		var on = {
			'html': {
				'body': [
					{'p': 'Lorem Ipsum dolor sit amet'},
					{'p': 'Lorem Ipsum dolor sit amet'},
					{'p': 'Lorem Ipsum dolor sit amet'}
				]
			}
		  };
		var ml = '<html><body><p>Lorem Ipsum dolor sit amet</p><p>Lorem Ipsum dolor sit amet</p><p>Lorem Ipsum dolor sit amet</p></body></html>'
		expect(andML.ml(on)).toEqual(ml);  
	  });
	  
	  it('should allow for array-like attributes', function() {
		var on = {
			'input[name="variables[0][222]"]': true
		  };
		var ml = '<input name="variables[0][222]">';
		expect(andML.ml(on)).toEqual(ml);  
	  });
	  
	  it('should parse a full complex form', function() {
		var on = {
			'form[enctype="multipart/form-data"]': {
				'@method': 'post',
				'@action': '/submit',
				'fieldset': [
					{'legend': 'Enter your details'},
					{'label[for="email"]': 'Email address'},
					{'input#email[type="email"][name="email"]': true},
					{'input#reset[type="reset"][value="Reset me"]': true},
					{'button#submit[type="submit"]': 'Submit me!'}
				]
			}
		  };
		var ml = '<form method="post" action="/submit" enctype="multipart/form-data">' +
			'<fieldset>' +
				'<legend>Enter your details</legend>' +
				'<label for="email">Email address</label>' +
				'<input id="email" type="email" name="email">' +
				'<input id="reset" type="reset" value="Reset me">' +
				'<button id="submit" type="submit">Submit me!</button>' +
			'</fieldset></form>'
		expect(andML.ml(on)).toEqual(ml);  
	  });
	  
	  it('should support a children node', function() {
		var on = {
			'div': {
				'children': [
					{'p': 'One'},
					{'p': 'Two'}
				]
			}
		};
		var ml = '<div><p>One</p><p>Two</p></div>'
		expect(andML.ml(on)).toEqual(ml);  
	  });
	  
	  it('should ignore non html5 tags', function() {
		var on = {
			'article': {
				'andml': 'Hello World',
				'p': 'Lorem Ipsum dolor sit amet'
			}
		  };
		var ml = '<article><p>Lorem Ipsum dolor sit amet</p></article>'
		expect(andML.ml(on)).toEqual(ml);
	  });
	  
	  it('should force lowercase tagnames and attribute keys', function() {
	  
		var on = {
			'ARTICLE': {
				'@DATA': {
					'KEY': 'value'
				},
				'H1': {
					'@CLASS': 'some-css-class',
					'TEXT': 'Hello World'
				},
				'P': {
					'@ID': 'SomeId',
					'TEXT': 'Lorem Ipsum dolor sit amet'
				}
			}
		  };
		var ml = '<article data-key="value"><h1 class="some-css-class">Hello World</h1><p id="SomeId">Lorem Ipsum dolor sit amet</p></article>'
		expect(andML.ml(on)).toEqual(ml);
	  
	  });
	  
	  describe('AndML.on() setting @attributes', function() {
	 
		  it('should add an ID attribute from @id key-value pair', function() {
			var on = {
				'div': {
					'@id' : 'my-id-example'
				}
			};
			var ml = '<div id="my-id-example"></div>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  
		  it('should parse CSS selector attributes (double quotes)', function() {
			var on = {
				'input[name="number"][type=text]': true
			  };
			var ml = '<input name="number" type="text">'
			expect(andML.ml(on)).toEqual(ml);  
		  });
		  it('should parse CSS selector attributes (single quotes)', function() {
			var on = {
				"input[name='number'][type=text]": true
			  };
			var ml = '<input name="number" type="text">'
			expect(andML.ml(on)).toEqual(ml);  
		  });
		  it('should parse CSS selector class names', function() {
			var on = {
				"input.form-field": true
			  };
			var ml = '<input class="form-field">'
			expect(andML.ml(on)).toEqual(ml);  
		  });
		  it('should parse multiple CSS selector class names', function() {
			var on = {
				"input.form-field.active.text-field": true
			  };
			var ml = '<input class="form-field active text-field">'
			expect(andML.ml(on)).toEqual(ml);  
		  });
		  
		  it('should add set A href, target, name an rel attributes from @href key-value pair', function() {
			var on = {
				'a': {
					'@href' 	: '#',
					'@target' 	: '_blank',
					'@name'		: 'hyperlink',
					'@rel'		: 'test'
				}
			};
			var ml = '<a href="#" target="_blank" name="hyperlink" rel="test"></a>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  it('should parse a key into an ID attribute', function(){
			var on = {
				'a#element-id': {
					text : 'Key'
				}
			};
			var ml = '<a id="element-id">Key</a>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  it('should add data attributes when passed an @data key', function(){
			var on = {
				'div': {
					'@data': {
						attribute: 'test1',
						property: 'test2'
					}
				}
			};
			var ml = '<div data-attribute="test1" data-property="test2"></div>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should should treat a @data key as its own attribute, if the value is a string, e.g. on OBJECT', function(){
			var on = {
				'object': {
					'@data': '/object.wav'
				}
			};
			var ml = '<object data="/object.wav"></object>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  it('should generate a void AREA element with attributes', function() {
			var on = {
				'area': {
					'@shape': 'circle',
					'@coords': '90,58,3',
					'@href':'mars.html',
					'@alt': 'Mars'
				}
			};
			var ml = '<area shape="circle" coords="90,58,3" href="mars.html" alt="Mars">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void BASE element with attributes', function() {
			var on = {
				'base': {
					'@href': 'https://github.com/andfisher/andML',
					'@target': '_blank'
				}
			};
			var ml = '<base href="https://github.com/andfisher/andML" target="_blank">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  it('should generate a void BR element', function() {
			var on = {
				'br': true
			};
			var ml = '<br>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void COL element with attributes', function() {
			var on = {
				'col': {
					'@span': 2
				}
			};
			var ml = '<col span="2">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void COMMAND element with attributes', function() {
			var on = {
				'command': {
					'@type': 'command',
					'@label': 'Save',
					'@icon': 'icons/save.png',
					'@onclick': 'save()'
				}
			};
			var ml = '<command type="command" label="Save" icon="icons/save.png" onclick="save()">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void EMBED element with attributes', function() {
			var on = {
				'embed': {
					'@type': 'video/quicktime',
					'@src': 'movie.mov',
					'@width': 640,
					'@height': 480
				}
			};
			var ml = '<embed type="video/quicktime" src="movie.mov" width="640" height="480">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void HR element', function() {
			var on = {
				'hr': true
			};
			var ml = '<hr>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void IMG element with attributes', function() {
			var on = {
				'img': {
					'@src': '/some.png',
					'@alt': 'Some alt attribute',
					'@width': 300,
					'@height': 200
				}
			};
			var ml = '<img src="/some.png" alt="Some alt attribute" width="300" height="200">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void INPUT element with attributes', function() {
			var on = {
				'input': {
					'@type': 'text',
					'@id': 'form_field_1',
					'@name': 'form-field',
					'@value': '12345'
				}
			};
			var ml = '<input type="text" id="form_field_1" name="form-field" value="12345">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void KEYGEN element with attributes', function() {
			var on = {
				'keygen': {
					'@name': 'name',
					'@challenge': 'challenge string',
					'@keytype': 'type',
					'@keyparams': 'params'
				}
			};
			var ml = '<keygen name="name" challenge="challenge string" keytype="type" keyparams="params">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void LINK element with attributes', function() {
			var on = {
				'link': {
					'@type': 'text/css',
					'@rel': 'stylesheet',
					'@href': '/some.css'
				}
			};
			var ml = '<link type="text/css" rel="stylesheet" href="/some.css">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  it('should generate a void META element with attributes', function() {
			var on = {
				'meta': {
					'@property': 'og:title',
					'@content': 'Site description'
				}
			};
			var ml = '<meta property="og:title" content="Site description">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void PARAM element with attributes', function() {
			var on = {
				'param': {
					'@name': 'autoplay',
					'@value': 'true'
				}
			};
			var ml = '<param name="autoplay" value="true">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void SOURCE element with attributes', function() {
			var on = {
				'source': {
					'@src': 'audio.ogg',
					'@type': 'audio/ogg'
				}
			};
			var ml = '<source src="audio.ogg" type="audio/ogg">';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should generate a void TRACK element with attributes', function() {
			var on = {
				'track': {
					'@kind': 'subtitles',
					'@src': 'subtitles_en.vtt',
					'@srclang': 'en'
				}
			};
			var ml = '<track kind="subtitles" src="subtitles_en.vtt" srclang="en">';
			expect(andML.ml(on)).toEqual(ml);
		  });

		  it('should generate a void WBR element', function() {
			var on = {
				'wbr': true
			};
			var ml = '<wbr>';
			expect(andML.ml(on)).toEqual(ml);
		  });
	  
	  
	  
		  it('should, for accessibilty, add an empty alt attribute to an IMG element if not set explicitly', function() {
			var on = {
				'img': {
					'@src': '/some.png',
					'@height': 200,
					'@width': 400
				}
			};
			var ml = '<img src="/some.png" height="200" width="400" alt="">';
			expect(andML.ml(on)).toEqual(ml);
		  });
	  });
	
	  describe('Other formats', function() {
  
		  it('should not allow extended SVG elements if unconfigured', function() {

			andML.settings.supportSVG = false;
			
			var on = {
				'svg': {}
			};

			var ml = '';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should extend the list of allowed tags when SVG support is configured', function() {

			andML.settings.supportSVG = true;
			
			var on = {
				'svg': {}
			};

			var ml = '<svg></svg>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should support ?xml declatations', function() {

			andML.settings.supportSVG = true;
			
			var on = {
				'?xml': {
					'@version': '1.0',
					'@standalone': 'no'
				}
			};

			var ml = '<?xml version="1.0" standalone="no"?>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should allow any node names when XML support is configured', function() {

			andML.settings.supportXML = true;
			andML.settings.debug = true;
			var on = {
				'xml': {
					'library': {
						'books': {
							'book': {
								'@author': 'David Wong', 
								'=text': 'John Dies at the End'
							}
						}
					}
				}
			};

			var ml = '<xml><library><books><book author="David Wong">John Dies at the End</book></books></library></xml>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  it('should support XML namespaces support is configured', function() {

			andML.settings.supportXML = true;
			andML.settings.debug = true;
			var on = {
				'xml': {
					'@xmlns:l' : 'http://www.andfisher.com/library',
					'@xmlns:b' : 'http://www.andfisher.com/book',
					'l:library': {
						'bb:books': {
							'@xmlns:bb': 'http://www.andfisher.com/books',
							'b:book': {
								'@author': 'David Wong', 
								'=text': 'John Dies at the End'
							}
						}
					}
				}
			};

			var ml = '<xml xmlns:l="http://www.andfisher.com/library" xmlns:b="http://www.andfisher.com/book"><l:library><bb:books xmlns:bb="http://www.andfisher.com/books"><b:book author="David Wong">John Dies at the End</b:book></bb:books></l:library></xml>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
		  
		  it('should allow an attribute called `data` instead of HTML `data-` attributes when using XML', function() {

			andML.settings.supportXML = true;
			andML.settings.debug = true;
			var on = {
				'xml': {
					'book': {
						'@data' : 'Some value',
						'=text' : 'Some node string'
					},
					'record': {
						'@data' : {
							a: 'foo',
							b: 'bar'
						}
					}
				}
			};

			var ml = '<xml><book data="Some value">Some node string</book><record data="[object Object]"></record></xml>';
			expect(andML.ml(on)).toEqual(ml);
		  });
		  
	});
  
  });
  
  xdescribe('AndML.on()', function() {
  
	it('should parse correct markup into AMLON', function() {
	
		var ml = '<article><h1>Hello World</h1><p>Lorem Ipsum dolor sit amet</p></article>';
		var on = {
			'article': {
				'h1': 'Hello World',
				'p': 'Lorem Ipsum dolor sit amet'
			}
		 };
		expect(andML.on(ml)).toEqual(on); 
	
	});

  });
 
  /*
  it("should be able to play a Song", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
  */
});
