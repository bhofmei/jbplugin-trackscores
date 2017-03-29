define( "TrackScorePlugin/View/Dialog/SetTrackScore", [
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dijit/focus',
    'dijit/form/TextBox',
    "dijit/registry",
    'JBrowse/View/Dialog/WithActionBar',
    'dojo/on',
    'dijit/form/Button',
    'dijit/form/RadioButton',
    'JBrowse/Model/Location'
    ],
    function(
       declare,
        dom,
        array,
        lang,
        focus,
        dijitTextBox,
        registry,
        ActionBarDialog,
        on,
        dijitButton,
        dijitRadioButton,
        Location ) {

return declare (ActionBarDialog,{
    /**
     * Dijit Dialog subclass to change the min
     * and max score of XYPlots
     */
     
     title: 'Set track score range',
    autofocus: false,
     
     constructor: function( args ){
        this.browser = args.browser;
        this.min_score = args.minScore;
        this.max_score = args.maxScore;
        this.scaleType = ((args.minScore===undefined && args.maxScore==undefined) ? args.scaleType : 'manual');
        this.setCallback    = args.setCallback || function() {};
        this.cancelCallback = args.cancelCallback || function() {};
        this.scoreConstraints = {};
        //console.log(this.scaleType, this.min_score, this.max_score);
        this.scoreTypes = {
            manual: { name:'Manual', title:'Manually set min/max'},
            global:{name:'Global', title: 'Min/max based on global min/max'},
            local: {name:'Local', title: 'Min/Max based on min/max of visible region'},
            clipped_global:{name:'Clipped global', title: 'Min/max based on (mean +/- 4 * sd)'}
        };
     },
     
     _fillActionBar: function( actionBar ){
        var ok_button = new dijitButton({
            label: "OK",
            onClick: dojo.hitch(this, function() {
                var type = this.scaleType;
                var min_score = parseInt(this.minScoreText.getValue());
                var max_score = parseInt(this.maxScoreText.getValue());
                if (type === 'manual' && (isNaN(min_score) || isNaN(max_score))) return;
                this.setCallback && this.setCallback( type, min_score, max_score );
                this.hide();
            })
        }).placeAt(actionBar);

        var cancel_button = new dijitButton({
            label: "Cancel",
            onClick: dojo.hitch(this, function() {
                this.cancelCallback && this.cancelCallback();
                this.hide();
            })
        }).placeAt(actionBar);
     },
    
    show: function( callback ) {
        var thisB = this;
        var curScale = this.scaleType;
        dojo.addClass( this.domNode, 'setTrackScoreDialog' );

        var table = dom.create('table',{id:'track-score-dialog-table'});
        var t;
        for(t in this.scoreTypes){

            var data = thisB.scoreTypes[t];
            var row = dom.create('tr',{id:'track-score-dialog-'+t}, table);
            var button = new dijitRadioButton({
            id: 'track-score-dialog-'+t,
            checked: curScale === t,
            value: t
            });
        button.onClick = lang.hitch(thisB, '_setScale', button.value);
        var buttonData = dom.create('td',{},row);
        buttonData.appendChild(button.domNode);
        if(t === 'manual'){
            var label = dom.create('td',{className:'track-score-dialog-label', innerHTML:data.name, title: data.title}, row);
            this.minScoreText = new dijitTextBox({
                id: 'adjustminscore',
                intermediateChanges: true,
                value: thisB.min_score === undefined ? '' : thisB.min_score
            });
            this.minScoreText.onChange = lang.hitch(thisB, '_textManual');
            var minTd = dom.create('td',{innerHTML: 'Min score', className: 'track-score-input'}, row);
            minTd.appendChild(this.minScoreText.domNode);

            this.maxScoreText = new dijitTextBox({
                id: 'adjustmaxscore',
                intermediateChanges: true,
                value: thisB.max_score === undefined ? '' : thisB.max_score
            });
            this.maxScoreText.onChange = lang.hitch(thisB, '_textManual');
            var maxTd = dom.create('td',{innerHTML: 'Max score', className: 'track-score-input'}, row);
            maxTd.appendChild(this.maxScoreText.domNode);
        } else {
            var label = dom.create('td',{className:'track-score-dialog-label', innerHTML:data.name, title: data.title, 'colspan':3}, row);
        }
        };

        this.set('content', [
            table
        ] );

        this.inherited( arguments );
    },
    
    _setScale: function(newScale){
        this.scaleType = newScale;
    },

    _textManual: function(){
        var thisB = this;
        if(this.scaleType !== "manual"){
            var curType = this.scaleType;
            registry.byId('track-score-dialog-'+curType).set('checked',false);
            registry.byId('track-score-dialog-manual').set('checked',true);
        }
        this.scaleType = 'manual';
    },

    hide: function() {
        this.inherited(arguments);
        window.setTimeout( dojo.hitch( this, 'destroyRecursive' ), 500 );
    }
});
});
