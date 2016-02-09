var VIDEO_NS = 'video';

$.magnificPopup.registerModule(VIDEO_NS, {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-video"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		titleSrc: 'title', 
		tError: '<a href="%url%">The video</a> could not be loaded.'
	},

	proto: {

		initVideo: function() {
			mfp.types.push(VIDEO_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if (prevType !== newType) {
					if (prevType === VIDEO_NS) {
						if (mfp.currTemplate[VIDEO_NS]) {
							var el = mfp.currTemplate[VIDEO_NS].find('video');
							if (el.length) {
								el[0].src = '';
							}
						}
					}
				}
			});
		},

		getVideo: function(item, template) {

			var onLoadComplete = function() {
				if (item) {
					item.video.off('.mfploader');

					if (item === mfp.currItem) {
						mfp.updateStatus('ready');
					}

					item.loaded = true;

					_mfpTrigger('VideoLoadComplete');
				}
			};
			var onLoadError = function() {
				if (item) {
					item.video.off('.mfploader');
					if (item == mfp.currItem) {
						mfp.updateStatus('error', videoSt.tError.replace('%url%', item.src));
					}

					item.loaded = true;
					item.loadError = true;
				}
			};
			var videoSt = mfp.st.video;

			var el = template.find('.mfp-video');
			if (el.length) {
				var video = document.createElement('video');
				video.className = 'mfp-video';
				video.controls = 'controls';
				// video.preload = 'auto';
				video.autoplay = 'true';
				item.video = $(video).on('loadstart.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				video.src = item.src;

				// if (el.is('video')) {
				// 	item.video = item.video.clone();
				// }
				video = item.video[0];
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				video_replaceWith: item.video
			}, item);

			mfp.updateStatus('loading');
			item.loading = true;

			return template;
		}
	}
});