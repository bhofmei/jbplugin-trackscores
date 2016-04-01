define('TrackScorePlugin/main', [ 
      'dojo/_base/declare',
    'dojo/_base/lang',
      'JBrowse/Plugin',
    'JBrowse/View/Dialog/SetTrackHeight',
    'JBrowse/View/Track/BlockBased',
    './View/Dialog/SetTrackScore'
       ],
       function(
            declare,
            lang,
            JBrowsePlugin,
            TrackHeightDialog,
             BlockBasedTrack,
            TrackScoreDialog
       ) {
 
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        var thisB = this;
        var browser = this.browser;
        //console.log("plugin: TrackScore");
        
        browser.afterMilestone( 'loadConfig', function() {
            if (typeof browser.config.classInterceptList === 'undefined') {
                browser.config.classInterceptList = {};
            }
            
            // override WiggleBase
            require(["dojo/_base/lang", "JBrowse/View/Track/WiggleBase"], function(lang, WiggleBase){
                lang.extend(WiggleBase, {
                    _trackMenuOptions: thisB._trackMenuOptions
                });
            });
        });      
    },
    
    _trackMenuOptions: function(){
        var track = this;
        var options = this.inherited(arguments) || [];
        // original option
        options.push({
            label: 'Change height',
            iconClass: 'jbrowseIconVerticalResize',
            action: function() {
                new TrackHeightDialog({
                    height: track._canvasHeight(),
                    setCallback: function( newHeight ) {
                        track.trackHeightChanged=true;
                        track.updateUserStyles({ height: newHeight });
                    }
                }).show();
            }
        },
        // new option
        {
            label: 'Change score range',
            iconClass: 'trackScoreIcon',
            action: function() {
                new TrackScoreDialog({
                    minScore: track.config.min_score,
                    maxScore: track.config.max_score,
                    setCallback: function( minScore, maxScore ) {
                        track.config.min_score = minScore;
                        track.config.max_score = maxScore;
                        track.browser.publish('/jbrowse/v1/v/tracks/replace', [track.config]);
                    }
                }).show();
            }
        });
        // original option
        if(this.config.logScaleOption) {
            options.push({
                label: 'Log scale',
                type: 'dijit/CheckedMenuItem',
                checked: !!(this.config.scale == 'log'),
                onClick: function(event) {
                    if (this.checked) {
                        track.config.scale = 'log';
                    } else {
                        track.config.scale = 'linear';
                    }
                    track.browser.publish('/jbrowse/v1/v/tracks/replace', [track.config]);
                }
            });
        }
        return options;
    }
});
});
