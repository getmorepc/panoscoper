/* =========================================================
// jquery.panoscoper.js
// Author: Aaron Brewer
// Mail: spaceribs@gmail.com
// Web: http://aaronbrewer.net
// Copyright (c) 2010 Aaron Brewer
// Licence : GPL
========================================================= */
(function($) {
	$.fn.extend({
		panoscope: function( optPano, optCompass ) {
			
/* Initialize for each instance */
			
			this.each(function(){
				
			var setPano = {
				cursors		:	true,						// change cursor or not
				debug		:	false,						// show the debug panel
				width		:	$(this).outerHeight()/3*4,	// width of the panoscoper frame
				height		:	$(this).outerHeight(),		// height of the panoscoper frame
				direction	:	0,							// the point of view to start with
				momentum	:	80							// speed at which to move
			};
			
			var setCompass = { 
				enabled		:	true,						// Sets the compass on or off
				url			:	'compass.png',				// URL string to the image used for the compass
				width		:	100,						// The width of the compass image
				height		:	100,						// the height of the compass image
				bearing		:	0							// The direction of north
			};
			
			if ( optPano ) {
				var setPano =  $.extend(setPano, optPano);
			}
			
			if ( optCompass ) {
				var setCompass =  $.extend(setCompass, optCompass);
			}
				
			/******* Build the wrappers *******/
				
				var panowrap = '<div id="'+$(this).attr('id')+'-frame" class="panoframe"><div id="'+$(this).attr('id')+'-viewer" class="panoviewer"><div id="'+$(this).attr('id')+'-box" class="panobox">';
	
			/******* Apply options and CSS, then wrap, clone the element and insert it after *******/
			
				$(this).attr('id', $(this).attr('id') )
					.attr('unselectable','on')
					.css('-moz-user-select','none')
					.css('-webkit-user-select','none')
					.css('margin', '0')
					.css('float', 'left')
					.css('display', 'block')
					.wrap(panowrap)
					.clone().attr('id', $(this).attr('id')+'-clone').insertAfter($(this));
					
				var pano = $(this);
				
			/******* The panobox houses the panoscoped element and the clone, used exclusively for left/right motion *******/
				
				var panobox = $(this).parent();
				
			/******* Set the starting position and the width of the panobox *******/
				
				var boxwidth = $(this).outerWidth() * 2;
				
				panobox.width(boxwidth)
					.css('marginLeft', -setPano.direction+'px');
				
			/******* The panoviewer is a wrapper for future features (multiple layering) *******/
				
				var panoviewer = panobox.parent();
				
				panoviewer.css('height', '100%')
				.css('width', '100%')
				.css('display', 'block')
				.css('overflow', 'hidden');
				
			/******* If the compass is enabled, build it and add it before the panoviewer *******/
				
				if(setCompass.enabled){
					
					var compassimg = '<img id="'+$(this).attr('id')+'-compass" class="panocompass" src="'+setCompass.url+'" alt="compass" width="'+setCompass.width+'" height="'+setCompass.height+'" style="position:absolute;" />';
					
					panoviewer.before(compassimg);
					var panocompass = $('#'+$(this).attr('id')+'-compass');
				}
				
			/******* If debug is enabled, build a box for text input *******/
				
				if(setPano.debug){
				
					var debugbox = '<div id="'+$(this).attr('id')+'-debugger" class="panodebug" style="float:right; position:absolute; background:black; color:white; padding:5px;">N/A</div>';
					console.log('Debugger is now online');
					
					panoviewer.before(debugbox);
					var panodebug = $('#'+$(this).attr('id')+'-debugger');
				}
				
			/******* The panoframe houses all the elements, It is for decorations and mouse events. *******/
				
				var panoframe = panoviewer.parent();
				
				panoframe.css('height', setPano.height)
				.css('width', setPano.width)
				.css('clear', 'both')
				.css('overflow', 'hidden');
			
				var pagepos = panoframe.offset(); // get the exact position of the frame for calculating mouse position later
				
			/******* Localize the left/right movement and animation to support multiple panoscopers *******/
				
				var xmov;
				
				var interAnim;
				
				updateCompass(setPano.direction);
				
			/******* On mouse enter, begin animating *******/
			
				panoframe.mouseenter(function(e){
					interAnim = setInterval( function(){ updatepano(); } , 20);
				});
				
			/******* On mouse leave, kill the setInterval animation *******/
			
				panoframe.mouseleave(function(e){
					clearInterval( interAnim );
					cursorupdate(0);
				});
			
			/******* This event is for looking up and down (not implemented yet) *******/
				
				panoframe.mousemove(function(e){
					xmov = e.pageX-((setPano.width/2)+pagepos.left);
					if( pano.height() > setPano.height ) {
						ymov = e.pageY-((setPano.height/2)+pagepos.top);
						panoviewer
					}
				});
				
/* Main update function */
				
				function updatepano() {
					
			/******* Conditional statement was meant for only animating if your cursor was close to the left or right edge, 
				disabled as clickable elements pause the animation anyway and you can't move by decimals of a pixel (future feature?) *******/
					
				/*if (xmov <= -(setPano.width/3) || xmov >= (setPano.width/3)){*/
				
			/******* Get the current location and the amount of calculated movement *******/
					
					var currentMarg = parseInt(panobox.css('marginLeft'), 10);
					var amountToMove = currentMarg-(xmov/setPano.momentum);
					
			/******* Check if it's too far to the left and jump to the opposite end if true *******/
					
					if (amountToMove >= 0) {
						panobox.css('marginLeft', currentMarg-pano.width() );
						if (setPano.debug){
							console.log('jumped left');
						}
					}
					
			/******* Otherwise check if it's too far to the right and jump to the opposite end if true *******/
					
					else if (amountToMove <= -boxwidth+setPano.width) {
						panobox.css('marginLeft', currentMarg+pano.width() );
						if (setPano.debug){
							console.log('jumped right');
						}
					}
					
			/******* Recalculate after the jump *******/
					
					currentMarg = parseInt(panobox.css('marginLeft'), 10);
					amountToMove = Math.round(currentMarg-(xmov/setPano.momentum));
					
			/******* Send cursor updates based on mouse position *******/
			
					if (setPano.cursors)	{
						if ( xmov < 0 && amountToMove !== currentMarg) {
							cursorupdate(1);
						} else if ( xmov > 0 && amountToMove !== currentMarg) {
							cursorupdate(2);
						} else {
							cursorupdate(0);
						}
					}
					
			/******* Updates for the Compass *******/
					
					if (setCompass.enabled){
						updateCompass(amountToMove);
					}
					
			/******* This is where all the magic happens, applies the new left margin to the panobox *******/
					
					panobox.css('marginLeft', amountToMove+'px');
					
		 		/*} else {
		 			return;
		 		}*/
				}
				
			/******* Function to update the Compass and Debug Panel*******/
			
				function updateCompass(marg){
					var panorot = ((marg+setCompass.bearing)/pano.width())*360;
					panorot = panorot%360;	//	Keep it within 360 degrees
				
					panocompass.css({
						'-webkit-transform':'rotate('+panorot+'deg) ', 
						'-moz-transform':'rotate('+panorot+'deg)'
					});
					
					if (setPano.debug){
						panodebug.html('Current Bearing: '+(-marg)+'<br/>North: '+setCompass.bearing);
					}
				}
				
			
			/******* Simple function for setting the cursor *******/
				
				function cursorupdate(num){
					switch(num) {
						case 1:
							if (panoframe.css('cursor') !== 'w-resize') {
								panoframe.css('cursor', 'w-resize' );
							}
							break;
						case 2:
							if (panoframe.css('cursor') !== 'e-resize') {
								panoframe.css('cursor', 'e-resize' );
							}
							break;
						default:
							if (panoframe.css('cursor') !== 'default') {
								panoframe.css('cursor', 'default' );
							}
							break;
					}
				}
				
			});
		}
	});
})(jQuery);