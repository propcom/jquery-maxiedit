(function($) {

	var aceEdit;
	var $activeElem;

	$.fn.maxiEdit = function(options) {

		var $elem = this;

		if ($elem.length > 1) {
			$elem.each(function() {
				$(this).maxiEdit(options);
			});

			return;
		}

		// Create the button and set it up
		var $button = $('<button/>')
			.addClass('js-maxiedit-go')
			.css('position', 'absolute')
			.text('+')
			.hide()
			.on('mouseleave', function(){
				$button.hide();
			})
			.on('click', function(e){
				e.preventDefault();

				$activeElem = $elem;

				if (aceEdit) {
					aceEdit.setValue($elem.val());
					aceEdit.focus();
				} else {
					$('.js-maxiedit-edit').val($elem.val());
					$('.js-maxiedit-edit').focus();
				}

				$('.js-maxiedit-overlay').show();
				$button.hide();
			});

		// Add the button to the DOM
		$elem.after($button);

		// Make the button show on hover
		$elem.on('mouseenter', function(e){
			// Position the button correctly
			$button.css({
				top: $(this).offset().top,
				left: $(this).offset().left + $(this)[0].scrollWidth - $button.outerWidth()
			});

			$button.show();
		}).on('mouseleave', function(e){
			// Don't hide button if we have moused over it
			if ($(e.relatedTarget).is('.js-maxiedit-go')) {
				e.stopPropagation();
				return false;
			}

			$button.hide();
		});

	};

	function addMaxiEditOverlay() {
		// We don't want more than one of these
		if ($('.js-maxiedit-overlay').length > 0) {
			return;
		}

		// Create all the elements
		var $overlay = $('<div/>').addClass('js-maxiedit-overlay').hide(),
			$done    = $('<button/>').addClass('js-maxiedit-done btn btn-primary').text('Done (or Ctrl+Enter)').on('click', function(e){e.preventDefault();$('.js-maxiedit-overlay').hide();}),
			$cancel  = $('<button/>').addClass('js-maxiedit-cancel btn btn-danger').text('Cancel').on('click', function(e){e.preventDefault();$('.js-maxiedit-overlay').hide();}),
			$edit;

		// Hook done button
		$done.click(function(e) {
			e.preventDefault();

			if (aceEdit) {
				$activeElem.val(aceEdit.getValue());
			} else {
				$activeElem.val($('.js-maxiedit-edit').val());
			}
		});

		// Use ACE editor if it exists
		if (window.ace) {
			$edit = $('<div/>').addClass('js-maxiedit-ace');

			// Activate ACE editor
			aceEdit = ace.edit($edit[0]);

			// Remove the Print Margin, lets keep things clean
			aceEdit.setShowPrintMargin(false);
		} else {
			$edit = $('<textarea/>');
		}

		// Make sure we always have the edit class
		$edit.addClass('js-maxiedit-edit');

		// A couple of keyboard shortcuts for usability
		$edit.on('keyup', function(e){
				if (e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10)) {
					$done.trigger('click');
				} else if (e.keyCode == 27) {
					$overlay.hide();
				}
			});

		// Add everything to the DOM
		$('body').append($overlay.append($edit).append($done).append($cancel));
	}


	$(function(){
		addMaxiEditOverlay();
	});

})(jQuery);
