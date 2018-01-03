(function ($) {
  window.kalturaLoaded = false;
  window.youtubeLoaded = false;
  window.youtubePlayers = [];
  $.fn.embedVideo = function(options) {
    $(this).each(function() {
      var settings = $.extend({
            uiconf : '11601208',
            wid : '102',
            kalturaServerURL: 'http://cloudvideo.cdn.net.co',
            maxWidth : ($(this).data('max-width')) ? $(this).data('max-width') : '1200px',
            video_id : $(this).data('video-id'),
            video_url : ($(this).data('video-url')) ? $(this).data('video-url') : null,
            html5 : false,
            autoplay: ($(this).data('autoplay')) ? $(this).data('autoplay') : false,
            thumbnail : ($(this).data('thumbnail')) ? $(this).data('thumbnail') : false,
            width : ($(this).data('width')) ? $(this).data('width') : '100%',
            height : ($(this).data('height')) ? $(this).data('height') : '100%',
            container : $(this).attr('id'),
            video_src: ($(this).data('source')) ? $(this).data('source') : 'kaltura',
            extra_params: ($(this).data('params')) ? $(this).data('params') : false,
            cc_policy: ($(this).data('cc-policy')) ? $(this).data('cc-policy') : false,
            play : '<svg enable-background="new 0 0 34 34" height="34px" id="Layer_1" version="1.1" viewBox="0 0 34 34" width="34px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M17.078,0.25c-9.389,0-17,7.611-17,17s7.611,17,17,17s17-7.611,17-17S26.467,0.25,17.078,0.25z M14,23.963  V10.537l9,6.713L14,23.963z" fill="#FFF"/></svg>',
            playWidth: '100px',
            playHeight: '100px',
            playOpacity: '0.7'
          }, options);

      var video_cont = $(this);

      if (settings.video_src == 'kaltura') {
        if (!window.kalturaLoaded) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = settings.kalturaServerURL + '/p/' + settings.wid + '/sp/' + settings.wid + '00/embedIframeJs/uiconf_id/' + settings.uiconf + '/partner_id/' + settings.wid;
          document.getElementsByTagName('head')[0].appendChild(script);

          window.kalturaLoaded = true;
        }
      } else if (settings.video_src == 'youtube') {
        if (!window.youtubeLoaded) {
          var tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          document.getElementsByTagName('head')[0].appendChild(tag);
          window.youtubeLoaded = true;
        }
        var videoid = settings.video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
          settings.video_id = videoid[1];
        }
      } else if (settings.video_src == 'vimeo') {
        settings.video_id = settings.video_url.split(/video\/|https?:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
      }

      // Get uniqid
      var n = Math.floor(Math.random() * 11);
      var k = Math.floor(Math.random() * 1000000);
      var m = String.fromCharCode(n) + k;
      m = settings.video_src + '_video_' + m;

      var video_styles = function() {
        video_cont.css({
          width : '100%',
          height : '100%',
          position : 'absolute',
          top : 0,
          left : 0,
          'background-repeat' : 'no-repeat',
          'background-size' : 'cover',
          'background-position' : '50% 50%',
          'background-image': 'url("' + settings.thumbnail + '")'
        }).attr('id', m);
      }

      if (!settings.thumbnail) {
        if (settings.video_src == 'kaltura') {
          settings.thumbnail = 'http://cloudvideo.cdn.net.co/p/' + settings.wid + '/thumbnail/entry_id/' + settings.video_id;
          video_styles();
        } else if (settings.video_src == 'youtube') {
          settings.thumbnail = 'https://img.youtube.com/vi/' + settings.video_id + '/maxresdefault.jpg';
          video_styles();
        } else if (settings.video_src == 'vimeo') {
          $.getJSON('http://www.vimeo.com/api/v2/video/' + settings.video_id + '.json?callback=?', {format: "json"}, function(data) {
            settings.thumbnail = data[0].thumbnail_large;
            video_styles();
          });
        }
      } else {
        video_styles();
      }

      var videoContainer = $('<div>').attr({
        'style' : 'width: 100%; margin: 0 auto; max-width: ' + settings.maxWidth + ';',
        'class' : 'videoContainer'
      });
      var frameVideoContainer = $('<div>').attr({
        'style' : 'position: relative; height: 0; width: 100%; padding-bottom: 56.25%;',
        'class' : 'framePlayerContainer'
      });
      var playIcon = $(settings.play);
      playIcon.attr({
        width : '100%',
        height : '100%'
      });

      var playButton = $('<a>').css({
        'position': 'absolute',
        'cursor': 'pointer',
        'width': settings.playWidth,
        'height': settings.playHeight,
        'top': '50%',
        'margin-top': '-' + settings.playHeight + 'px',
        'left': '50%',
        'margin-left': '-' + settings.playWidth + 'px',
        'text-decoration': 'none',
        'border': 'none',
        'border-radius': '50%',
        'box-shadow': '0 0 100px rgba(0, 0, 0, 0.7)',
        'opacity': settings.playOpacity
      }).append(playIcon);
      var parent = $(this).parent();

      playButton.appendTo($(this));

      $(this).wrap(frameVideoContainer);

      frameVideoContainer.wrap(videoContainer);

      //videoContainer.appendTo(parent);

      var videoAutoPlay = (settings.autoplay) ? settings.autoplay : true;

      playButton.click(function() {
        var tag = 'iframe',
            insideContent = '';
        if (typeof AMP !== 'undefined') {
          tag = 'amp-iframe';
          insideContent = '<amp-img layout="fill" src="' + settings.thumbnail + '" placeholder></amp-img>';
        }
        playButton.fadeOut(function() {
          $(this).remove();
          if (settings.video_src == 'kaltura' && window.kalturaLoaded) {
            kWidget.embed({
              'targetId' : m,
              'wid' : '_' + settings.wid,
              'uiconf_id' : settings.uiconf,
              'entry_id' : settings.video_id,
              'flashvars' : {
                'autoPlay' : videoAutoPlay
              }
            });
          } else if (settings.video_src == 'youtube') {
            var YTConfig = {
                width: '100%',
                height: '100%',
                videoId: settings.video_id,
                events: {
                  'onReady': function (event) {
                    if (videoAutoPlay) {
                      event.target.playVideo();
                    }
                  }
                }
              };
            if (settings.autoplay || settings.cc_policy) {
              YTConfig.playerVars = {};
              if (settings.cc_policy) {
                YTConfig.playerVars.cc_load_policy = settings.cc_policy;
              }
              if (settings.autoplay) {
                YTConfig.playerVars.autoplay = settings.autoplay;
              }
            }
            window.youtubePlayers[m] = new YT.Player(m, YTConfig);
          } else if (settings.video_src == 'vimeo') {
            var videoParams = '';
            if (settings.extra_params) {
              videoParams = '&' + settings.extra_params;
            }
            var video_player = '<' + tag + ' src="https://player.vimeo.com/video/' + settings.video_id + '?autoplay=' + videoAutoPlay + videoParams + '" width="' + settings.width + '" height="' + settings.height + '" sandbox="allow-scripts allow-presentation allow-same-origin" layout="responsive" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen>' + insideContent + '</' + tag + '>';
            video_cont.append(video_player);
          }
        });
      });

    });
  }
})(jQuery);