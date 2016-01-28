define( "TrackScorePlugin/View/Dialog/SetTrackScore", [
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dijit/focus',
    'dijit/form/TextBox',
    'JBrowse/View/Dialog/WithActionBar',
    'dojo/on',
    'dijit/form/Button',
    'JBrowse/Model/Location'
    ],
    function( declare, dom, focus, dijitTextBox, ActionBarDialog, on, Button, Location ) {

return declare (ActionBarDialog,{
    /**
     * Dijit Dialog subclass to change the min
     * and max score of XYPlots
     */
     
     title: 'Set track score range',
    //autofocus: false,
     
     constructor: function( args ){
        this.browser = args.browser;
        this.min_score = args.minScore || 0;
        this.max_score = args.maxScore || 10;
        this.setCallback    = args.setCallback || function() {};
        this.cancelCallback = args.cancelCallback || function() {};
        this.scoreConstraints = {};
     },
     
     _fillActionBar: function( actionBar ){
        var ok_button = new Button({
            label: "OK",
            onClick: dojo.hitch(this, function() {
                var min_score = parseInt(this.minScoreText.getValue());
                var max_score = parseInt(this.maxScoreText.getValue());
                if (isNaN(min_score) || isNaN(max_score)) return;
                this.setCallback && this.setCallback( min_score, max_score );
                this.hide();
            })
        }).placeAt(actionBar);

        var cancel_button = new Button({
            label: "Cancel",
            onClick: dojo.hitch(this, function() {
                this.cancelCallback && this.cancelCallback();
                this.hide();
            })
        }).placeAt(actionBar);
     },
    
    show: function( callback ) {
        dojo.addClass( this.domNode, 'setTrackScoreDialog' );

        this.minScoreText = new dijitTextBox({
            id: 'adjustminscore',
            value: this.min_score || ''
        });
        this.maxScoreText = new dijitTextBox({
            id: 'adjustmaxscore',
            value: this.max_score || ''
        })

        this.set('content', [
            dom.create('label', { "for": 'adjustminscore', innerHTML: 'Min Score' } ),
            this.minScoreText.domNode,
            dom.create( 'br' ),
            dom.create('label', { "for": 'adjustmaxscore', innerHTML: 'Max Score' } ),
            this.maxScoreText.domNode
        ] );

        this.inherited( arguments );
    },
    
    hide: function() {
        this.inherited(arguments);
        window.setTimeout( dojo.hitch( this, 'destroyRecursive' ), 500 );
    }
});
});