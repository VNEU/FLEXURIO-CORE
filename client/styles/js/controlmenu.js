/* ========================================================================
 * Bootstrap: controlmenu.js v0.1
 * ========================================================================
 * Copyright 2011-2014 Asyraf Abdul Rahman
 * Licensed under MIT
 * ======================================================================== */

+function ($) {
	'use strict';

	// SIDEBAR PUBLIC CLASS DEFINITION
	// ================================

	var ControlMenu = function (element, options) {
		this.$element = $(element)
		this.options = $.extend({}, ControlMenu.DEFAULTS, options)
		this.transitioning = null

		if (this.options.parent) this.$parent = $(this.options.parent)
		if (this.options.toggle) this.toggle()
	}

	ControlMenu.DEFAULTS = {
		toggle: true
	}

	ControlMenu.prototype.show = function () {
		if (this.transitioning || this.$element.hasClass('controlmenu-open')) return


		var startEvent = $.Event('show.bs.controlmenu')
		this.$element.trigger(startEvent);
		if (startEvent.isDefaultPrevented()) return

		this.$element
			.addClass('controlmenu-open')

		this.transitioning = 1

		var complete = function () {
			this.$element
			this.transitioning = 0
			this.$element.trigger('shown.bs.controlmenu')
		}

		if (!$.support.transition) return complete.call(this)

		this.$element
			.one($.support.transition.end, $.proxy(complete, this))
			.emulateTransitionEnd(400)
	}

	ControlMenu.prototype.hide = function () {
		if (this.transitioning || !this.$element.hasClass('controlmenu-open')) return

		var startEvent = $.Event('hide.bs.controlmenu')
		this.$element.trigger(startEvent)
		if (startEvent.isDefaultPrevented()) return

		this.$element
			.removeClass('controlmenu-open')

		this.transitioning = 1

		var complete = function () {
			this.transitioning = 0
			this.$element
				.trigger('hidden.bs.controlmenu')
		}

		if (!$.support.transition) return complete.call(this)

		this.$element
			.one($.support.transition.end, $.proxy(complete, this))
			.emulateTransitionEnd(400)
	}

	ControlMenu.prototype.toggle = function () {
		this[this.$element.hasClass('controlmenu-open') ? 'hide' : 'show']()
	}

	var old = $.fn.controlmenu

	$.fn.controlmenu = function (option) {
		return this.each(function () {
			var $this = $(this)
			var data = $this.data('bs.controlmenu')
			var options = $.extend({}, ControlMenu.DEFAULTS, $this.data(), typeof options == 'object' && option)

			if (!data && options.toggle && option == 'show') option = !option
			if (!data) $this.data('bs.controlmenu', (data = new ControlMenu(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	$.fn.controlmenu.Constructor = ControlMenu

	$.fn.controlmenu.noConflict = function () {
		$.fn.controlmenu = old
		return this
	}

	$(document).on('click.bs.controlmenu.data-api', '[data-toggle="controlmenu"]', function (e) {
		var $this = $(this), href
		var target = $this.attr('data-target')
			|| e.preventDefault()
			|| (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
		var $target = $(target)
		var data = $target.data('bs.controlmenu')
		var option = data ? 'toggle' : $this.data()

		$target.controlmenu(option)
	})

	$('html').on('click.bs.controlmenu.autohide', function (event) {
		var $this = $(event.target);
		var isButtonOrControlMenu = $this.is('.controlmenu, [data-toggle="controlmenu"]') || $this.parents('.controlmenu, [data-toggle="controlmenu"]').length;
		if (isButtonOrControlMenu) {
			return;
		} else {
			var $target = $('.controlmenu');
			$target.each(function (i, trgt) {
				var $trgt = $(trgt);
				if ($trgt.data('bs.controlmenu') && $trgt.hasClass('controlmenu-open')) {
					$trgt.controlmenu('hide');
				}
			})
		}
	});
}(jQuery);
