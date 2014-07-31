/**
 * Created by Maor.Frankel on 4/13/2014.
 */
var floatingWidgetController = function (options){
    options = options || {};                                     //if no options passed, create dummy object
    var defaultInitHeight = '200px';                             //default highet in case none is stated
    var S_STATIC = "static";                                     //const for static state
    var S_HOVER = "hover";                                       //const for hover state
    var S_ACTIVE = "active";                                     //const for active state
    var dummyFunc = function (){};                               //dummy function used as call back default
    var scroller;                                                //reference to scroller object
    var $contenHolder;                                           //reference to contentholder jquery object
    var $parent                                                  //reff to paren jquery obj
    var hoverCB = options.hoverCB || dummyFunc;                  //hover call back function
    var openCB = options.openCB || dummyFunc;                    //open call back function
    var closeCB = options.closeCB || dummyFunc;                  //close call back function
    var scrollContainer = options.scrollContainer || "hf_fw_scroller";  //class name of the container of the scroller, by default it will be the hf_fw_scroller
    var resizeContainer = options.resizeConatiner || "hf_fw_bodyBar";   //class name of the container to be set as resizble, by default it will be the hf_fw_bodyBar
    var state =  ko.observable(S_STATIC);                               //observable maintaining the state of the current state
    options.initHeight =  options.initHeight || defaultInitHeight;
    options.content =  options.content || {data:'', name:''};           //object containing the template object to be placed as content

    /**
     * init function called after template is rendered
     * @param elements
     */
    function init(elements){
        $parent = $(elements.filter(function getContiner(element){//get reff to container of content if there yet
            return $(element).hasClass('hf_fw_container');
        }));

        if( options.content && options.content.data && options.content.data.init) {
            options.content.afterRender = callContentInit;//in case the content has not been loaded from, set the content after render function to callContentInit
            return;
        }

        onLoaded(); // if content has loaded, start the init process


    }
    /**
     * Internal function handling the init of all jquery ui resize and jscroll pane
     * @param elems
     */
    function onLoaded(elems){
        if(!$parent[0]) {//if parent avaliable the the widget has not loaded correctly and no action should be taken, should never happen really, hopefully
            return;
        }

        $contenHolder = $parent.find('.' + resizeContainer);

        $contenHolder.resizable({//set content to be resizble
            handles: "s",
            resize: function () {
                scroller.reinitialise();
            }
        });
        //set content to be scrollble
        scroller = $parent.find('.' + scrollContainer);
        scroller = scroller.jScrollPane({
            verticalDragMaxHeight: 20,
            verticalGutter: 0,
            verticalBarCustom: "jspVerticalBarCustom",
            hideFocus: true,
            autoReinitialise: true
        }).data('jsp');

        $parent.find('.ui-resizable-s').css('background', 'none');


        $('#header').on('click', doClose);//set call back for header click
        $("body").on("somePaneOpenedEvent", doClose ); // on somePaneOpen event, close others
    }

    /**
     * Call back for content rendered
     * @param elems content html object
     */
    function callContentInit(elems){
        onLoaded(elems);// call the onLoaded function to initialize widget content
        options.content.data.init(elems);//call content init function
    }

    /**
     * Call back for mouse over, set to hover state
     * @param data
     * @param event
     */
    function onMouseOver(data, event){
        if(isStatic()) {
            doHover(event);
        }
    }

    /**
     * Call back for mouse out, set to closed state
     * @param data
     * @param event
     */
    function onMouseOut(data, event){
        if(isHover()) {
            doClose(event);
        }
    }

    /**
     * Opens the widget
     * @param data
     * @param event
     */
    function onOpen(data, event){
        if(isHover() || isStatic()) {
            doOpen(event);
        }
    }

    /**
     * Closes the widget
     * @param data
     * @param event
     */
    function onClose(){
        doClose()
    }

    /**
     * Check if current state is static
     * @returns {boolean}
     */
    function isStatic(){
        return (state() === S_STATIC);
    }

    /**
     * Check if current state is hover
     * @returns {boolean}
     */
    function isHover(){
        return (state() === S_HOVER);
    }

    /**
     *
     * @returns {boolean}
     */
    function isActive(){
        return (state() === S_ACTIVE);
    }

    /**
     * Set state to hover
     */
    function doHover(event){
        if(hoverCB(event)){
            return;
        }
       state(S_HOVER);
    }

    /**
     * Open the widget
     */
    function doOpen(event){
        openCB(event);
        $("body").trigger("somePaneOpenedEvent"); // dispatch somePaneOpenedEvent event in order to update all other panes with norollover state (doRollOver = false)
        state(S_ACTIVE);
        scroller.reinitialise();//re init the scroller by force on each open
    }

    /**
     * Close the widget
     */
    function doClose(event){
        closeCB(event);
        state(S_STATIC);
    }

    return {
        state:state,
        model: options,
        isStatic: ko.computed(isStatic),
        isHover: ko.computed(isHover),
        isActive: ko.computed(isActive),
        init: init,
        onMouseOver: onMouseOver,
        onMouseOut: onMouseOut,
        onOpen: onOpen,
        onClose: onClose
    }
};