(function() {
	
	new View('talks', {
		
		initialize: function() {
		
			//
		
		},
		
		on: {
			layout: function() {
				
				var availableHeight = app.viewportSize.height
					- this.$('.statusbar').height()
					- this.$('.titlebar').height();
					
				this.$('.container').css({
					height: availableHeight,
					top: this.$('.titlebar').height()
				});
				
			},
			visible: function() {
				
				this.animateView();
				
				// iOS: Change status bar style to match view style
				app.changeStatusBarStyle('black');
				
				// analytics
				app.trackEvent({ label: 'Talks', category: 'view', action: 'visible' });
				
			}
		},
		
		buttons: {
			'.close': 'back'
		},
		
		back: function() {
			app.view('home').reveal('slide-down');
		},
		
		renderTalks: function() {
		
			var $list = this.$('.list');
				$list.html('');
			
			var talks = app.parseMeetup().data.talks;
			
			$list.css('padding-bottom', 25);
			
			_.each(talks, function(talk) {
			
				var html = '<li>' +
					'<span class="images"></span>' +
					'<span class="text">' +
						'<span class="title">' + talk.name + '</span>' +
						'<span class="people">by ';
				
				var people = [],
					images = [];
				
				_.each(talk.who, function(person) {
					if (person.twitter && person.twitter.slice(0,1) == '@') person.twitter = person.twitter.slice(1);
					if (person.name) people.push({ name: person.name.first + ' ' + person.name.last, twitter: person.twitter });
					if (person.avatarUrl) images.push({ avatarUrl: person.avatarUrl, twitter: person.twitter });
				});
				
				if (people.length) {
					_.each(people, function(person, index) {
						if (people.length > 1 && people.length == index + 1) {
							html += ' & ';
						} else if (people.length > 1 && index != 0) {
							html += ', ';
						}
						if (person.twitter) {
							html += '<a href="http://twitter.com/' + person.twitter + '" class="twitter" target="_blank">' + person.name + '</a>';
						} else {
							html += '<span class="author">' + person.name + '</span>';
						}
					});
				}
				
				if (talk.description) {
					html += '<span class="description">';
						html += talk.description;
					html += '</span>';
				}
				
				html += '</span>';
				
				if (talk.slides || talk.link) {
					html += '<span class="links">' +
							(talk.slides ? '<span class="btn-text" data-link="' + talk.slides + '"><span class="pill">Slides<span class="icon"></span></span></span>' : '') +
							(talk.link ? '<span class="btn-text" data-link="' + talk.link + '"><span class="pill">Link<span class="icon"></span></span></span>' : '') +
						'</span>';
				}
				
				html += '</span>' + 
					'</span>' +
				'</li>';
				
				var $html = $(html)
				
				if (images.length) {
					var $images = $html.find('.images');
					_.each(images, function(image, index) {
						if (image.twitter) {
							var $img = $('<a href="http://twitter.com/' + image.twitter + '" class="twitter" target="_blank"><img src="' + image.avatarUrl + '"></a>').appendTo($images);
						} else {
							var $img = $('<img src="' + image.avatarUrl + '">').appendTo($images);
						}
					});
				}
				
				$html.appendTo($list);
			
			});
			
			$list.find('a').each(function() {
				var $link = $(this);
				$link.click(function(e) {
					e.preventDefault();
					if (app.inTransition()) return;
					window.open($link.prop('href'), '_system');
				});
			});
			
			$list.find('.btn-text').each(function() {
				var $link = $(this);
				$link.button();
				$link.click(function(e) {
					e.preventDefault();
					if (app.inTransition()) return;
					window.open($link.data().link, '_system');
				});
			});
		
		},
		
		animateView: function() {
			var self = this;
			this.$('.footer').css('transform', 'translateY(' + app.viewportSize.height + 'px)');
			this.$('.footer').velocity({ translateY: [app.viewportSize.height - 95, app.viewportSize.height] }, { delay: 250, duration: 500, easing: 'easeOutSine', complete: function() {
				self.$('.container').css('height', self.$('.container').height() - 75);
				self.$('.list').css('padding-bottom', 25);
			}});
		}
		
	});
	
})();
