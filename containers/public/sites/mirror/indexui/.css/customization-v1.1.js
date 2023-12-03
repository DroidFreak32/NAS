var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

(function($) {
    var $html = $('html'),
        $body = $('body');

    // Alert user to high file/folder count

	if (localStorage.getItem('large-directory-customizations') === null) {
	  localStorage.setItem('large-directory-customizations', 'false');
	}

	var enableLargeDirs = localStorage.getItem('large-directory-customizations');

	var dirItemsCount = $('pre a:not(:first-child)').length;

	var dirItemsCountAlert = '<div class="ui icon message customeyes-alert">' +
							 '<i class="eye icon exclamation triangle"></i>' +
							 '<h3>Customizations Disabled For Large Directories</h3>' +
							 '<div class="inner">' +
							 '<p>This directory contains <strong>' + dirItemsCount.toLocaleString() + '</strong> items. Customizations may slow down your browser.</p>' +
							 '<div class="continue-options">' +
							 '<button class="ui button" id="large-dirs-enable-once">Enable Once</button>' +
							 '<button class="ui button" id="large-dirs-always-enable">Always Enable For Large Directories</button>' +
							 '</div>' +
							 '</div>' +
							 '</div>';

    $('.directory.status .content').after('<button class="ui button" id="customize"><i class="icon paint brush"></i> Customize Layout</button>');

    $("#customize").click(function() {
        $(".customeyes-toolbar").slideToggle(300);
    });

    var $customizationdisabled = false;

    if ( dirItemsCount > 1000 && enableLargeDirs == 'false' && $customizationdisabled !== true ) {
		$customizationdisabled = true;

		$('pre').before(dirItemsCountAlert);

		$('#large-dirs-enable-once').on('click', function(){
			$(this).prop('disabled', true);
			$('pre').addClass('customeyes-files');
			applyCustomizations();
		});

		$('#large-dirs-always-enable').on('click', function(){
			console.log('Always Enable');
			localStorage.setItem('large-directory-customizations', true);
		});
	}

    if (localStorage.getItem('cust-disabled') == 'true') {
        $customizationdisabled = true;
    }

    var icons = '<svg style="display: none;" class="mimetype-icons" xmlns="http://www.w3.org/2000/svg">' +
                '<symbol id="disc-image" viewBox="0 0 48 48"><path d="M24 4C12.954 4 4 12.955 4 24s8.954 20 20 20 20-8.955 20-20S35.046 4 24 4zm0 23.684c-2.035 0-3.684-1.649-3.684-3.684s1.649-3.684 3.684-3.684 3.684 1.649 3.684 3.684-1.649 3.684-3.684 3.684z" fill="#90caf9"/><g fill="#cfe8f9"><path d="M28.022 22.645l10.902-8.699c-1.326-1.963-3.033-3.645-5.008-4.955l-8.759 10.925c1.348.384 2.417 1.407 2.865 2.729zM19.934 25.214L8.999 33.927c1.333 2.008 3.057 3.734 5.065 5.068l8.665-10.946c-1.344-.426-2.39-1.484-2.795-2.835z"/></g><path d="M24 18c-3.314 0-6 2.688-6 6s2.686 6 6 6c3.313 0 6-2.688 6-6s-2.687-6-6-6zm0 8c-1.104 0-2-.895-2-2s.896-2 2-2 2 .895 2 2-.896 2-2 2z" fill="#1e88e5"/></symbol>' +
                '<symbol id="archive" viewBox="0 0 48 48"><path d="M8 3h32v42H8z" fill="#ffca28"/><path d="M22 21h4v2h-4zM22 15h4v2h-4zM22 18h4v2h-4zM22 24h4v2h-4zM22 9h4v2h-4zM22 3h4v2h-4zM22 6h4v2h-4zM22 12h4v2h-4z" fill="#828282"/><path d="M26 27h-4c0 3-2 6-2 8 0 2.210938 1.789063 4 4 4 2.210938 0 4-1.789062 4-4 0-2-2-5-2-8zm-2 10c-1.105469 0-2-.894531-2-2s.894531-2 2-2 2 .894531 2 2-.894531 2-2 2z" fill="#4c4c4c"/></symbol>' +
                '<symbol id="image" viewBox="0 0 48 48"><path d="M40 41H8c-2.2 0-4-1.8-4-4V11c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v26c0 2.2-1.8 4-4 4z" fill="#1e88e5"/><path d="M38 16c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3z" fill="#fff59d"/><path d="M20 16L9 32h22L20 16z" fill="#e3f2fd"/><path d="M31 22l-8 10h16l-8-10z" fill="#cfdce5"/></symbol>' +
                '<symbol id="video" viewBox="0 0 48 48"><path d="M42 41V7H6v34zM12 18v4H8v-4zm0 8v4H8v-4zm0 8v4H8v-4zm0-24v4H8v-4zm28 8v4h-4v-4zm0 8v4h-4v-4zm0 8v4h-4v-4zm0-24v4h-4v-4z" fill="#3f51b5"/><path d="M30 24l-10-6v12z" fill="#fff"/></symbol>' +
                '<symbol id="audio" viewBox="0 0 48 48"><g fill="#e91e63"><path d="M28 33c0 4.96875-4.03125 9-9 9s-9-4.03125-9-9 4.03125-9 9-9 9 4.03125 9 9z"/><path d="M24 6v27h4V14l11 3v-7z"/></g></symbol>' +
                '<symbol id="folder" viewBox="0 0 48 48"><path d="M40 12H22l-4-4H8c-2.199219 0-4 1.800781-4 4v8h40v-4c0-2.199219-1.800781-4-4-4z" fill="#ffa000"/><path d="M40 12H8c-2.199219 0-4 1.800781-4 4v20c0 2.199219 1.800781 4 4 4h32c2.199219 0 4-1.800781 4-4V16c0-2.199219-1.800781-4-4-4z" fill="#ffca28"/></symbol>' +
                '<symbol id="text" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#efefef"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#cccccc"/><path class="st3" d="M16 21h17v2H16v-2zM16 27h17v2H16v-2zM16 33h13v2H16v-2z"/></symbol>' +
                '<symbol id="nfo" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#90caf9"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#e1f5fe"/><path fill="#1976d2" d="M16 21h17v2H16v-2zM16 27h17v2H16v-2zM16 33h13v2H16v-2z"/></symbol>' +
                '<symbol id="pdf" viewBox="0 0 48 48"><path d="M40 45H8V3h22l10 10v32z" fill="#ff5722"/><path d="M38.5 14H29V4.5l9.5 9.5z" fill="#fbe9e7"/><path d="M16 39c-.4 0-.7-.1-1-.2-1.1-.6-1.2-1.5-1-2.2.4-1.2 2.6-2.7 5.5-4 1.3-2.4 2.3-4.9 2.9-7-1-1.9-1.5-3.7-1.5-5 0-.7.2-1.3.5-1.8.4-.5 1-.8 1.8-.8.9 0 1.6.5 1.9 1.4.5 1.2.2 3.4-.5 5.9 1 1.7 2.2 3.3 3.5 4.5 1.9-.4 3.6-.6 4.7-.4 1.9.3 2.2 1.6 2.2 2.1 0 2.1-2.2 2.1-3 2.1-1.5 0-3-.6-4.3-1.7-2.4.6-4.8 1.4-6.7 2.3-1 1.7-2 3.1-2.9 3.9-.9.7-1.6.9-2.1.9zm1.2-2.9c-.5.3-.9.6-1.1.9.2-.1.6-.3 1.1-.9zm13.6-4.7c.4.1.8.2 1.2.2.6 0 .9-.1 1-.1-.1-.1-.8-.3-2.2-.1zm-7-3.6c-.4 1.2-1 2.5-1.5 3.7 1.2-.4 2.4-.8 3.6-1.1-.8-.8-1.5-1.7-2.1-2.6zm-.6-7.8h-.1c-.1.1-.2.8.2 2.3.1-1.2.1-2.1-.1-2.3z" fill="#fff"/></symbol>' +
                '<symbol id="ebook" viewBox="0 0 48 48"><path d="M38 5l-24-.003906c-2.207031 0-4.816406 1.070312-4.984375 6.003906H9v28l.019531-.054687C9.199219 42.585938 11.566406 43 12.605469 43H37c2 0 2-2 2-2V6c0-.554687-.445312-1-1-1z" fill="#7e57c2"/><path d="M36 36H12.605469C11.273438 36 11 37.117188 11 38.5c0 1.382813.273438 2.503906 1.605469 2.503906L36 41z" fill="#ffe0b2"/><path d="M12.605469 36c-1.164063 0-1.519531.859375-1.589844 2H36v-2z" fill="#e0b990"/><path d="M14 10.996094h21v5H14z" fill="#ffecb3"/><path d="M38 36h-2v7h1c2 0 2-2 2-2v-5.996094C39 35.554688 38.554688 36 38 36z" fill="#311b92"/></symbol>' +
                '<symbol id="windows" viewBox="0 0 48 48"><g fill="#03a9f4"><path d="M20 25H6v12.074219l14 1.917969zM20 9.101563L6 11.066406V23h14zM22 8.820313V23h20V6.011719zM22 25v14.269531l20 2.742188V25z"/></g></symbol>' +
                '<symbol id="torrent" viewBox="0 0 48 48"><path d="M42 38c0 2.210938-1.789062 4-4 4H10c-2.210937 0-4-1.789062-4-4V10c0-2.210937 1.789063-4 4-4h28c2.210938 0 4 1.789063 4 4z" fill="#4caf50"/><path d="M15.5 19l8.5-8.5 8.5 8.5zM15.5 30l8.5 8.5 8.5-8.5z" fill="#dcedc8"/><path d="M21 17h6v15h-6z" fill="#dcedc8"/></symbol>' +
                '<symbol id="bookmark"><path d="M24 13l2.898438 5.898438.902343 1.902343 2.097657.300782 6.5.898437-4.699219 4.601563-1.5 1.5.402344 2.097656 1.097656 6.5-5.800781-3.097656-1.898438-1-1.898437 1-5.800782 3.097656 1.097657-6.5.402343-2.097656-1.5-1.5L11.601563 22l6.5-.898437 2.097656-.300782.902344-1.902343L24 13m0-9l-6.5 13.199219L3 19.300781 13.5 29.5 11 44l13-6.800781L37 44l-2.5-14.5L45 19.300781l-14.5-2.101562z" fill="#ffca28"/></symbol>' +
                '<symbol id="bookmark-added"><path d="M24 4.050781L30.488281 17.1875 45 19.289063 34.5 29.511719l2.476563 14.4375L24 37.136719l-12.976562 6.8125L13.5 29.511719 3 19.289063 17.511719 17.1875z" fill="#ffca28"/></symbol>' +
                '<symbol id="verify"><path d="M6 10c0-2.2 1.8-4 4-4h28c2.2 0 4 1.8 4 4v28c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V10z" /><path fill="#fff" d="M12 27h24v3H12v-3zM12 18h24v3H12v-3z"/><path fill="#fff" d="M27 12h3v24h-3V12zM18 12h3v24h-3V12z"/></symbol>' +
                '</svg>';

    var toolbar = '<div class="customeyes-toolbar" style="display: none;">' +
                  '<div class="settings-group settings-icons">' +
                  '<h3>File Type Icons</h3>' +
                  '<div class="option-group"><input type="checkbox" id="enable-icons"> <label for="enable-icons">Enable</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="colored-icons"> <label for="colored-icons">Colored</label></div>' +
                  '</div>' +
                  '<div class="settings-group settings-bookmarks">' +
                  '<h3>Bookmarks</h3>' +
                  '<div class="option-group"><input type="checkbox" id="enable-bookmarks"> <label for="enable-bookmarks">Enable</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="show-bookmarks-list"> <label for="show-bookmarks-list">View List</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="delete-bookmarks"> <label for="delete-bookmarks">Delete All</label></div>' +
                  '</div>' +
                  '<div class="settings-group settings-misc">' +
                  '<h3>Misc.</h3>' +
                  '<div class="option-group"><input type="checkbox" id="large-dirs-always"> <label for="large-dirs-always">Enable for Large Directories</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="focus-highlight"> <label for="focus-highlight">Hover/Focus Highlight</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="hashcheck-disabled"> <label for="hashcheck-disabled">Disable Hash Verification</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="disable-date-mobile" checked> <label for="disable-date-mobile">Disable Date on Small Screens</label></div>' +
                  '<div class="option-group"><input type="checkbox" id="disable-date"> <label for="disable-date">Disable Date Altogether</label></div>' +
                  '<hr />' +
                  '<div class="option-group"><input type="checkbox" id="cust-disabled"> <label for="cust-disabled">Disable Customizations</label></div>' +
                  '</div>' +
                  '</div>';

    var videos = ['webm', 'mkv', 'flv', 'vob', 'ogv', 'gifv', 'mng', 'avi', 'mov', 'wmv', 'yuv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4v', 'mpg', 'mpeg', 'mpv', 'm2v', '3gp', 'nsv', 'flv', 'f4v'],
        audio = ['wav', 'aiff', 'au', 'pcm', 'mp3', 'flac', 'm4a', 'wma', 'webm'],
        archives = ['zip', '7z', 'tar', 'targz', 'bz2', 'gz', 'lz', 'lzma', 'lzo', 'rz', 'sfark', 'z', 'ace', 'apk', 'arc', 'cab', 'lzh', 'pak', 'rar', 'sfx', 'sit'],
        images = ['jpg', 'jpeg', 'tiff', 'exif', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'pcx', 'tga'],
        discImages = ['iso', 'bin', 'cue', 'ciso', 'nrg', 'mdf', 'mds', 'img'],
        ebooks = ['cbr', 'cbz', 'cb7', 'cbt', 'cba', 'djvu', 'epub', 'fb2', 'ibook', 'azw', 'lit', 'prc', 'mobi', 'pdb'];

    if ($customizationdisabled === false) {
        $('pre').addClass('customeyes-files').before(toolbar).before(icons);
        var $customeyesFiles = $('.customeyes-files');
    } else {
        $('pre').before(toolbar).before(icons);
        $('#cust-disabled').prop('checked', true);
    }

    if (localStorage.getItem('disable-date-mobile') === null) {
	  localStorage.setItem('disable-date-mobile', 'true');
	  $('#disable-date-mobile').prop('checked', true);
	} else if ( localStorage.getItem('disable-date-mobile') == 'true' ) {
		$('#disable-date-mobile').prop('checked', true);
	} else {
		$('#disable-date-mobile').prop('checked', false);
	}

	if (localStorage.getItem('disable-date') === null) {
	  localStorage.setItem('disable-date', 'false');
	  $('#disable-date').prop('checked', false);
	} else if ( localStorage.getItem('disable-date') == 'true' ) {
		$('#disable-date').prop('checked', true);
	} else {
		$('#disable-date').prop('checked', false);
	}

	if (localStorage.getItem('hashcheck-disabled') === null) {
        localStorage.setItem('hashcheck-disabled', 'false');
        $('#hashcheck-disabled').prop('checked', false);
      } else if ( localStorage.getItem('hashcheck-disabled') == 'true' ) {
          $('#hashcheck-disabled').prop('checked', true);
      } else {
          $('#hashcheck-disabled').prop('checked', false);
      }

    var $customeyesFiles = $('.customeyes-files');

    $body.on('click', '#enable-icons', function() {
        $customeyesFiles.toggleClass('icons-enabled');
        if ($customeyesFiles.hasClass('icons-enabled')) {
            localStorage.setItem('icons-enabled', true);
        } else {
            localStorage.setItem('icons-enabled', false);
        }
    });

    $body.on('click', '#colored-icons', function() {
        $customeyesFiles.toggleClass('colored-icons');
        if ($customeyesFiles.hasClass('colored-icons')) {
            localStorage.setItem('colored-icons', true);
        } else {
            localStorage.setItem('colored-icons', false);
        }
    });

    $body.on('click', '#cust-disabled', function() {
        $customeyesFiles.toggleClass('cust-disabled');
        if ($customeyesFiles.hasClass('cust-disabled')) {
            localStorage.setItem('cust-disabled', true);
        } else {
            localStorage.setItem('cust-disabled', false);
        }
        location.reload();
    });

    $body.on('click', '#focus-highlight', function() {
        $customeyesFiles.toggleClass('focus-highlight');
        if ($customeyesFiles.hasClass('focus-highlight')) {
            localStorage.setItem('focus-highlight', true);
        } else {
            localStorage.setItem('focus-highlight', false);
        }
    });

    $body.on('click', '#enable-bookmarks', function() {
        $html.toggleClass('bookmarks-enabled');
        if ($html.hasClass('bookmarks-enabled')) {
            localStorage.setItem('bookmarks-enabled', true);
        } else {
            localStorage.setItem('bookmarks-enabled', false);
        }
    });

    $body.on('click', '#show-bookmarks-list', function() {
        $html.toggleClass('show-bookmarks-list');
        if ($html.hasClass('show-bookmarks-list')) {
            localStorage.setItem('show-bookmarks-list', true);
        } else {
            localStorage.setItem('show-bookmarks-list', false);
        }
    });

    $body.on('click', '#delete-bookmarks', function() {
        if (confirm('Are you sure you want to delete all of your current bookmarks?')) {
            localStorage.setItem('bookmarks', '');
            location.reload();
        } else {
            $('#delete-bookmarks').prop('checked', false);
        }
    });

    $body.on('click', '#hashcheck-disabled', function() {
        $html.toggleClass('hashcheck-disabled hashcheck-enabled');
        if ($html.hasClass('hashcheck-disabled')) {
            localStorage.setItem('hashcheck-disabled', true);
        } else {
            localStorage.setItem('hashcheck-disabled', false);
        }
    });

    $body.on('click', '#large-dirs-always', function() {
        if ( localStorage.getItem('large-directory-customizations') == 'true' ) {
        	$(this).prop('checked', false);
        	localStorage.setItem('large-directory-customizations', 'false');
        } else {
        	$(this).prop('checked', true);
        	localStorage.setItem('large-directory-customizations', 'true');
        }
    });

    $body.on('click', '#disable-date-mobile', function() {
        if ( localStorage.getItem('disable-date-mobile') == 'true' ) {
        	$(this).prop('checked', false);
        	localStorage.setItem('disable-date-mobile', 'false');
        	$html.removeClass('disable-date-mobile');
        } else {
        	$(this).prop('checked', true);
        	localStorage.setItem('disable-date-mobile', 'true');
        	$html.addClass('disable-date-mobile');

        	if ( $(this).prop('checked') === true ) {
        		$('#disable-date').prop('checked', false);
        		localStorage.setItem('disable-date', 'false');
        		$html.removeClass('disable-date');
        	}
        }
    });

    $body.on('click', '#disable-date', function() {
        if ( localStorage.getItem('disable-date') == 'true' ) {
        	$(this).prop('checked', false);
        	localStorage.setItem('disable-date', 'false');
        	$html.removeClass('disable-date');
        } else {
        	$(this).prop('checked', true);
        	localStorage.setItem('disable-date', 'true');
        	$html.addClass('disable-date');

        	if ( $(this).prop('checked') === true ) {
        		$('#disable-date-mobile').prop('checked', false);
        		localStorage.setItem('disable-date-mobile', 'false');
        		$html.removeClass('disable-date-mobile');
        	}

        }
    });

	// Add class to HTML tag
    if (localStorage.getItem('hashcheck-disabled') == 'true') {
        $html.addClass('hashcheck-disabled');
        $('#hashcheck-disabled').prop('checked', true);
    } else {
        $html.addClass('hashcheck-enabled');
        $('#hashcheck-disabled').prop('checked', false);
    }

    if (localStorage.getItem('disable-date') == 'true') {
        $html.addClass('disable-date');
        $('#disable-date').prop('checked', true);
    } else {
        $('#disable-date').prop('checked', false);
    }

    if ( localStorage.getItem('disable-date') == 'true' && localStorage.getItem('disable-date-mobile') == 'true') {
    	$html.removeClass('disable-date-mobile');
    	localStorage.setItem('disable-date-mobile', 'false');
    }

    $body.on('focus', '.customeyes-files .name', function() {
        $(this).parent().addClass('focus');
    });

    $body.on('focusout', '.customeyes-files .name', function() {
        $(this).parent().removeClass('focus');
    });

    //**************************************************************

    if ($customizationdisabled === false) {
        applyCustomizations();
    }

    function applyCustomizations() {
    	var $customeyesFiles = $('.customeyes-files');

    	$('pre a:not(:first-child)').addClass('name');

        $customeyesFiles.contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            $(this).replaceWith($(this).text().replace(/([0-9]{1,2}-[a-zA-Z]{3}-[0-9]{4} [0-9]{2}:[0-9]{2})/, '<span class="date-time">$1</span>'));
        });

        $customeyesFiles.contents().filter(function() {
            return this.nodeType === 3;
        }).each(function() {
            $(this).replaceWith($(this).text().replace(/([0-9-].*)/, '<span class="size">$1</span>'));
        });

        $('.name').each(function() {
            $(this).nextUntil('.name').addBack().wrapAll('<div class="single-item"/>');
        });

        $('pre a:not(:first)').each(function() {
            var url = $(this).attr('href');
            var decodedUrl = decodeURIComponent(url);
            $(this).text(decodedUrl);
        });

        $('.size').each(function() {
            if ($(this).text() == '-') {
                $(this).parent().addClass('directory');
                $(this).parent().find('.name').prepend('<svg class="customeyes-icon" viewBox="0 0 48 48"><use class="folder" xlink:href="#folder" /></svg>');
            } else {
                $(this).parent().addClass('file');
            }
        });

        $('.file .name').each(function() {
            var file = $(this).text();

            function svgHTML(fileType) {
                return '<svg class="customeyes-icon file-type" viewBox="0 0 48 48"><use class="' + fileType + '" xlink:href="#' + fileType + '" /></svg>';
            }

            var extension = file.substr((file.lastIndexOf('.') + 1)).toLowerCase();

            if (file.match('tar\.gz')) {
                $(this).parent().addClass('mimetype-tar' + extension);
                $(this).prepend(svgHTML('archive'));
            } else {
                $(this).parent().addClass('mimetype-' + extension);

                if (extension == 'txt' || extension == 'srt' || extension == 'sub') {
                    $(this).prepend(svgHTML('text'));
                } else if (extension == 'pdf') {
                    $(this).prepend(svgHTML('pdf'));
                } else if (extension == 'exe') {
                    $(this).prepend(svgHTML('windows'));
                } else if (extension == 'torrent') {
                    $(this).prepend(svgHTML('torrent'));
                } else if (extension == 'nfo') {
                    $(this).prepend(svgHTML('nfo'));
                } else if ($.inArray(extension, ebooks) != -1) {
                    $(this).prepend(svgHTML('ebook'));
                } else if ($.inArray(extension, images) != -1) {
                    $(this).prepend(svgHTML('image'));
                } else if ($.inArray(extension, videos) != -1) {
                    $(this).prepend(svgHTML('video'));
                } else if ($.inArray(extension, audio) != -1) {
                    $(this).prepend(svgHTML('audio'));
                } else if ($.inArray(extension, archives) != -1) {
                    $(this).prepend(svgHTML('archive'));
                } else if ($.inArray(extension, discImages) != -1) {
                    $(this).prepend(svgHTML('disc-image'));
                } else {
                    $(this).prepend(svgHTML('text'));
                }
            }
        });

        var bookmarkUrl = '',
            bookmarkName = '',
            bookmarkDate = '',
            bookmarkSize = '';

        var hashcheckButtonContent = '<button class="verify-hashes" title="Verify Hashes">' +
                                     '<svg class="svg-icon verify" viewBox="0 0 48 48">' +
                                     '<use class="verify" xlink:href="#verify" />' +
                                     '</svg>' +
                                     '<span class="sr-only">Verify Hashes</span>' +
                                     '</button>';

        $('.single-item').each(function() {
            bookmarkName = decodeURIComponent($(this).find('.name').attr('href'));
            bookmarkUrl = $(this).find('.name').prop('href');
            bookmarkDate = $(this).find('.date-time').text();
            bookmarkSize = $(this).find('.size').text();

            var bookmarkIcon = '<button class="bookmark" data-bookmark-name="' + bookmarkName + '" data-bookmark-url="' + bookmarkUrl + '" data-bookmark-date="' + bookmarkDate + '" data-bookmark-size="' + bookmarkSize + '">' + '<span class="sr-only">Bookmark</span>' + '</button>';

            $(this).prepend(bookmarkIcon, hashcheckButtonContent);
        });

        $('.single-item.directory').each(function(){
        	$(this).find('.verify-hashes').prop({'disabled': 'true', 'title': 'Folder Hashes Not Supported.'});
        });


        //$('.single-item:not(.directory)').each(function(){
        //	$(this).prepend(hashcheckButtonContent);
        //});

        $hashcheckButton = $('.verify-hashes');

        var fileNameNoPath;
        var pathOnly;

        $hashcheckButton.on('click', function() {
            var fileName = $(this).siblings('.bookmark').data('bookmark-url');
            fileName = fileName.replace('https://web.archive.org/web/20210501133607/https://the-eye.eu', '');

            prettyFileName = decodeURIComponent(fileName);

            fileNameNoPath = prettyFileName.split('/').pop();

            pathOnly = prettyFileName.replace( prettyFileName.split('/').pop(), '');

            $('.data_filename').html('Loading...');
            $('.data_size').text('Loading...');

            $('input#md5').val('Loading...');
            $('input#sha1').val('Loading...');
            $('input#sha256').val('Loading...');
            $('input#sha512').val('Loading...');

            checkHashAPI(fileName, fileNameNoPath, pathOnly);

            $('.ui.modal.hashcheck-modal').modal('show');
        });

        function checkHashAPI(fileName) {
            var apiURL = '/api/checksum.php?path=';

            var data_success;
            var data_bytes;
            var data_type;
            var data_md5;
            var data_sha512;
            var data_sha256;
            var data_sha512;

            $.getJSON(apiURL + fileName, function(data) {
                data_bytes = data.bytes;
                data_type = data.filetype;
                data_md5 = data.md5;
                data_sha1 = data.sha1;
                data_sha256 = data.sha256;
                data_sha512 = data.sha512;
            }).done(function(){
                //console.log('CustomEyes API Success! Results were returned.');
                $('input#md5').val(data_md5);
                $('input#sha1').val(data_sha1);
                $('input#sha256').val(data_sha256);
                $('input#sha512').val(data_sha512);
                $('.data_filename').html('<span class="path">' + pathOnly + '</span><span class="filename">' + fileNameNoPath + '</span>');
                $('.data_size').html( formatBytes(data_bytes) + ' <span class="bytes">' + data_bytes.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + '</span>' );
            }).fail(function(){
                //console.log('CustomEyes API Error. No results were returned.');
                $('input#md5').val('Error...');
                $('input#sha1').val('Error...');
                $('input#sha256').val('Error...');
                $('input#sha512').val('Error...');
                $('.data_filename').text('Error...');
                $('.data_size').text('Error...');
            });
        }

        var hashcheckModal = '<div class="ui modal hashcheck-modal">' +
                             '<i class="close icon"></i>' +
                             '<div class="header">' +
                             'Verify Hashes' +
                             '</div>' +
                             '<div class="content main-content">' +
                             '<div class="ui list">' +
                             '<i class="file icon"></i>' +
                             '<div class="content data_filename">File Name</div>' +
                             '</div>' +
                             '<div class="ui list">' +
                             '<i class="server icon"></i>' +
                             '<div class="content data_size">File Size</div>' +
                             '</div>' +
                             '<div class="ui labeled fluid action input">' +
                             '<div class="ui label">MD5</div>' +
                             '<input value="Loading..." id="md5" type="text" readonly>' +
                             '<button class="ui right labeled icon button" id="cpbtn-md5" data-clipboard-target="#md5"><i class="copy icon"></i> Copy</button>' +
                             '</div>' +
                             '<div class="ui labeled fluid action input">' +
                             '<div class="ui label">SHA1</div>' +
                             '<input value="Loading..." id="sha1" type="text" readonly>' +
                             '<button class="ui right labeled icon button" id="cpbtn-sha1" data-clipboard-target="#sha1"><i class="copy icon"></i> Copy</button>' +
                             '</div>' +
                             '<div class="ui labeled fluid action input">' +
                             '<div class="ui label">SHA256</div>' +
                             '<input value="Loading..." id="sha256" type="text" readonly>' +
                             '<button class="ui right labeled icon button" id="cpbtn-sha256" data-clipboard-target="#sha256"><i class="copy icon"></i> Copy</button>' +
                             '</div>' +
                             '<div class="ui labeled fluid action input">' +
                             '<div class="ui label">SHA512</div>' +
                             '<input value="Loading..." id="sha512" type="text" readonly>' +
                             '<button class="ui right labeled icon button" id="cpbtn-sha512" data-clipboard-target="#sha512"><i class="copy icon"></i> Copy</button>' +
                             '</div>' +
                             '</div>' +
                             '</div>';

        $body.append(hashcheckModal);

        // --------------------------------------------------------------------

        function formatBytes(a, b) {
            if (0 == a) return "0 Bytes";
            var c = 1024,
                d = b || 2,
                e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
                f = Math.floor(Math.log(a) / Math.log(c));
            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
        }

        // --------------------------------------------------------------------

        var bookmarksList = '<div class="bookmarks-list">' + '<ul></ul>' + '</div>';

        $('.customeyes-toolbar').after(bookmarksList);

        var bookmarks = [];

        $body.on('click', '.bookmark', function() {
            updateBookmarks($(this));
        });

        function updateBookmarks($this) {
            var $bookmarksList = $('.bookmarks-list');
            var bookmark = {};

            bookmark.bookmark = $this.data('bookmark-url');
            bookmark.name = $this.data('bookmark-name');
            bookmark.date = $this.data('bookmark-date');
            bookmark.size = $this.data('bookmark-size');

            var bookmarkHTML = '<li class="bookmark-item" data-bookmark-url="' + bookmark.bookmark + '">' + '<p class="url"><a href="' + bookmark.bookmark + '">' + bookmark.name + '</a></p>' + '</li>';

            $bookmarksList.find('ul').append(bookmarkHTML);

            if ($this.hasClass('added')) {
                $this.removeClass('added');
                $bookmarksList.find('[data-bookmark-url="' + $this.data('bookmark-url') + '"]').remove();
                var remove = $this.data('bookmark-url');
                bookmarks = bookmarks.filter(function(val) {
                    return (remove.indexOf(val.bookmark) == -1 ? true : false)
                });
            } else {
                $this.addClass('added');
                bookmarks.push(bookmark);
            }

            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
    }

    //**************************************************************

    if (localStorage.getItem('large-directory-customizations') == 'true') {
        $('#large-dirs-always').prop('checked', true);
    }

    if (localStorage.getItem('cust-disabled') == 'true') {
        $('#cust-disabled').prop('checked', true);
        $customeyesFiles.addClass('cust-disabled');
    }

    if (localStorage.getItem('icons-enabled') == 'true') {
        $('#enable-icons').prop('checked', true);
        $customeyesFiles.addClass('icons-enabled');
    }

    if (localStorage.getItem('colored-icons') == 'true') {
        $('#colored-icons').prop('checked', true);
        $customeyesFiles.addClass('colored-icons');
    }

    if (localStorage.getItem('focus-highlight') == 'true') {
        $('#focus-highlight').prop('checked', true);
        $customeyesFiles.addClass('focus-highlight');
    }

    if (localStorage.getItem('bookmarks-enabled') == 'true') {
        $('#enable-bookmarks').prop('checked', true);
        $html.addClass('bookmarks-enabled');
    }

    if (localStorage.getItem('disable-date-mobile') == 'true') {
        $html.addClass('disable-date-mobile');
    }

    if (localStorage.getItem('show-bookmarks-list') == 'true') {
        $('#show-bookmarks-list').prop('checked', true);
        $html.addClass('show-bookmarks-list');
    }

    if (localStorage.getItem('bookmarks')) {
        bookmarks = $.parseJSON(localStorage.getItem('bookmarks'));
        $(bookmarks).each(function(i, val) {
            $('.single-item .bookmark[data-bookmark-url="' + val.bookmark + '"]').addClass('added');
            var bookmarkHTML = '<li class="bookmark-item" data-bookmark-url="' + val.bookmark + '">' + '<p class="url"><a href="' + val.bookmark + '">' + val.name + '</a></p>' + '</li>';
            $('.bookmarks-list').find('ul').append(bookmarkHTML);
        });
    }

    // Enable clipboard.js for dynamic elements
    var clipboardMD5 = new Clipboard('#cpbtn-md5');
    var clipboardSHA1 = new Clipboard('#cpbtn-sha1');
    var clipboardSHA256 = new Clipboard('#cpbtn-sha256');
    var clipboard512 = new Clipboard('#cpbtn-sha512');

    var consoleStyles = [
        'color: green'
      , 'background: black'
      , 'display: block'
    ].join(';');

    // Add special message to console
    var consoleArt = '%c                    ,,\\A                                                         \n' +
                     '   ,ee%hhee,     y%e *\\A                                                         \n' +
                     ' y^ ,, ^%%hhhhhee,,,e%\\A                                                          \n' +
                     ' %  *h ,e%hhh%*%%*^!e%^   ^%,\\A                                                   \n' +
                     '           hhh    yhh       h\\A                                                  \n' +
                     '          %hhh   yhhh  ^**^\\A                                                    \n' +
                     '          hhh    hhhe^  %hh    ,eh^  %hh    eeh  *hhe *%hhh   ^%hh%    y%h  h,\\A \n' +
                     '         %hhh   %hhh    hhh   %hh    %hh  yhhh   yhhh  yhhh    %hh    %hh  eh\\A  \n' +
                     '         hhh    hhh    %hhh  %hhh   yhhh  hhh    %hh   hhh    yhh%   %hhh,%*\\A   \n' +
                     '        %hhh   %hhh    %hh   ^^  ,,eh%%  *^  ,,e%h%^  %hhh    %hh    hhhe^\\A      \n' +
                     '      e%hhh    hhh    yhhh  yhhh   ,e%h  %hh^   ee%   hhh    yhhh   %hhh\\A       \n' +
                     '    eh %hhh   %hhh    hhh   hhh    %hh  %hhh   yhhh  %hhh    %hh    %hh\\A        \n' +
                     '   hh  hhh    hhh    %hhh  %hhh   ehh   hhh    hh%   hhh    yhhh   yhhh\\A        \n' +
                     '   %e,h%     %hh%^   %h%^   %hh,e%%     *%he,e%^     *%hee* %hh    %hh\\A          \n' +
                     '                                                    ,^^^%  %hhh   yhh%\\A         \n' +
                     '                                                   %,      hh^    %hhh   , ,~,\\A \n' +
                     '                                                    *%e,ee^,e%hhhhh%%h^   %ht %\\A \n' +
                     '                                                          e  e,  *%hhhhhhee,ee\\A \n' +
                     '                                                          %  %*        ^^^^\\A    \n';

    console.log(consoleArt, consoleStyles);

})(jQuery);

}
/*
     FILE ARCHIVED ON 13:36:07 May 01, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 21:51:55 May 17, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 83.911
  exclusion.robots: 0.153
  exclusion.robots.policy: 0.141
  RedisCDXSource: 0.693
  esindex: 0.009
  LoadShardBlock: 54.503 (3)
  PetaboxLoader3.datanode: 75.296 (5)
  load_resource: 157.867 (2)
  PetaboxLoader3.resolve: 95.486 (2)
*/