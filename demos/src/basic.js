/**
 * Created by Maor.Frankel on 2/27/14.
 */
'use strict'
infuser.defaults.templateUrl = "../../views";                              // init knockout template folder
var floatingWidget = floatingWidgetController({
    staticIcon: "addPane-sprite-add",
    staticIconOpen: "addPane-sprite-add_selected",
    labelName: "Components",
    initHeight: '200px',
    minHeight: '190px',
    maxHeight: ($("body").height()-230) + 'px',
    closeBtnId: "addCompCls",
    content: {
        name: 'Content'

    }
});
ko.applyBindings();