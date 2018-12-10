var Web = {
  debounceTime : 150,

  // DOM references
  dom : {
    html : $( 'html' ),
    body : $( 'body' ),
    links: $( 'a' ),
    tables: $( 'table' ),
    formControl: $( '.form-control' )
  },

  defBreakPoints : {
    // Supported breakpoints with value from (including self)
    // help: 320 <= xs < 576 <= sm < 768 <= md < 992 <= lg < 1200 <= xl
    xs : 320,
    sm : 576,
    md : 768,
    lg : 992,
    xl : 1200
  },

  // Get current breakpoint
	getCurrentBreakPoint : function() {
		var width = Web.getDeviceScreenX(),
        bps = Web.defBreakPoints,
        breakpoint;

		for( var key in bps ) {
			var size = bps[key];

			if ( width >= size ) {
				breakpoint = key;
			}
		}

		return breakpoint;
  },

  // Get PixelRatio
  getPixelRatio : function() {
    window.devicePixelRatio = window.devicePixelRatio || Math.round( window.screen.availWidth / document.documentElement.clientWidth );

    return window.devicePixelRatio;
  },

  // Get Device Screen width
	getDeviceScreenX : function() {
		return window.innerWidth;
	},

  // Get Device Screen width
  getDeviceScreenY : function() {
    return window.innerHeight;
  },

  // Functions
  getLang: function() {
    return Web.dom.html.attr( 'lang' );
  },

  externalLinks : function() {
    var locationPattern =
          Web.dom.html.attr( 'data-location' ) ?
            Web.dom.html.attr( 'data-location' ) :
            window.location.origin,
        extPattern = 'http',
        eC = 'external',
        extTitle = {
          cs : 'Externí odkaz - otevře se do nového okna',
          en : 'External link - open in a new window',
          de : 'Externer Link - öffnet in neuem Fenster',
          fr : 'Lien externe - ouvre dans une nouvelle fenêtre'
        }
    ;

    Web.dom.links.each(function() {
      var _this = $( this ),
          href = _this.attr( 'href' );

      if ( href ) {
        if ( href.match( '^' + extPattern ) && !href.match( '^' + locationPattern ) ) {
          _this
            .addClass( eC )
            .attr( 'title', extTitle[Web.getLang()] )
            .attr( 'target', '_blank' );
        }
      }
    });
  },

  scrollTo : function(el, time) {
    var speed = time || 750;

    el.animate({
      scrollTop: 0
    }, speed);
  },

  equalHeight : function( parent, el, action ) {
    if ( parent.length ) {

      var holder = parent,
          box = el,
          action = action || '';

      if ( action == 'reset' ) {
        $( box ).height('auto');
      }

      if ( Web.getCurrentBreakPoint() != 'xs' ) {
        holder.each(function() {
          var _this = $( this ),
              tallest = 0,
              boxes = _this.find( box );

            boxes.each(function() {
              var thisHeight = $( this ).height();

              if( thisHeight > tallest ) {
                tallest = thisHeight;
              }
            });

            boxes.height(tallest);
        });
      }
    }
  },

  resizeWindow : function() {
    $( window ).resize($.debounce(Web.debounceTime, function() {
      Web.equalHeightSum( 'reset' );
    }));
  },

  equalHeightSum : function( action ){
    var act = action || '';

    Web.equalHeight( $( '.boxes--eq' ), '.box__title', action );
    Web.equalHeight( $( '.boxes--eq' ), '.box__text', action );
  },

  fillTableColumn : function() {
    Web.dom.tables.each(function() {
      var thCount = $( this ).find( 'thead tr' ).children().length;

      for ( i = 0; i <= thCount; i++ ) {
        $( this ).find( 'tbody tr td:nth-of-type(' + i + ')' ).each(function() {
          var theadValue = $( this ) .closest( 'table' ).find( 'thead th:nth-child(' + i + ')' ).text();
          $( this ).before( '<span class="td--before">' + theadValue + '</span>' );
        });
      };
    });
  },

  showHideAccordionContent : function() {
    $('.accordion__link').click(function(e) {
      e.preventDefault();

      $( this ).closest( '.accordion' ).toggleClass( 'accordion--open' );
    })
  },

  datePicker : function(){
    var date_input = $( 'input[name="date"]' ),
        container = $( '.bootstrap-iso form' ).length>0 ? $( '.bootstrap-iso form' ).parent() : "body";

    date_input.datepicker({
      format: 'd. MM yyyy',
      language: 'cs',
      container: container,
      todayHighlight: true,
      autoclose: true
    });
  },

  showHideContent: function() {
    $('[data-toggle="action"]').click(function(e) {
      e.preventDefault();

      var arrow = $(this).find('.arrow');

      if ($(arrow).length > 0 ) {
        $(arrow).toggleClass('pvs-theme-icon-arrow-down');
        $(arrow).toggleClass('pvs-theme-icon-arrow-up');
      }

      var content = $(this).closest('[data-toggle="container"]').find('[data-toggle="content"]');
      $(content).toggleClass('active');

    });
  },

  formFields : function() {
    Web.dom.formControl.each(function(){
      var $this = $( this ),
          notEmptyC = 'form-control--not-empty';

      // init
      if ( $this.val().length > 0 ) {
          $this.addClass( notEmptyC );
      }

      // on change
      $this.change(function(){
        if ( $this.val().length > 0 ) {
          $this.addClass( notEmptyC );
        } else {
          $this.removeClass( notEmptyC );
        }
      });

    });
  },

	fileInput: function() {
		var fileInputs = $( '.inputfile' ),
			fileDrop = $( '[data-toggle="file-drop"]' );

		fileInputs.each( function() {
			var input = $( this ),
				fileElement = input.prev( '.drop-area__file' );

			input.change( function( e ) {
				var fileName = '';

				if ( input[0].files && input[0].files.length > 1 ) {
					fileName = input[0].getAttribute( 'data-multiple-caption' ).replace( '{count}', input[0].files.length );
				} else {
					fileName = e.target.value.split( '\\' ).pop();
				}

				if ( fileName !== '' ) {
					fileElement.text( fileName );
				}
			});

			// Firefox bug fix
			input.focus( function() {
				input.addClass( 'has-focus' );
			});

			input.blur( function() {
				input.removeClass( 'has-focus' );
			});
		});

		fileDrop.each( function() {
			var fileDropElement = $( this ),
				fileDropInput = fileDropElement.find( '.inputfile' );

			fileDropElement.on( 'dragenter dragover', function() {
				fileDropElement.addClass( 'drop-area--over' );
				return false;
			}).on( 'dragleave', function() {
				fileDropElement.removeClass( 'drop-area--over' );
				return false;
			}).on( 'drop', function(e) {
				e.preventDefault();
				e.stopPropagation();

				fileDropElement.removeClass( 'drop-area--over' );

				e.dataTransfer = e.originalEvent.dataTransfer;

				if ( e.dataTransfer.items ) {
					for (var i = 0; i < e.dataTransfer.items.length; i++) {
						if ( e.dataTransfer.items[i].kind === 'file' ) {
							var droppedFiles = e.dataTransfer.files;
							fileDropInput[0].files = droppedFiles;
						}
					}
				}
			});
		});
	},

	// Init function
	init : function() {
    Web.resizeWindow();
    Web.equalHeightSum();
    Web.fillTableColumn();
    Web.showHideAccordionContent();
    Web.datePicker();
    Web.externalLinks();
    Web.showHideContent();
    Web.formFields();
		Web.fileInput();
	}
};

/* Document ready */
$(function () {
  Web.init();
});
