Tinker = {};

if (Meteor.isClient) {

  Tinker.action = function (fn, param) {
    var fn = this.fn || fn || null;
    var param = this.param || param || null;
    check(fn, String);
    check(param, String);
    if ( fn === 'background-color' ) {
      $('body').css('background-color', param);
      return;
    }
    throw new Error('invalid fn String provided: ', fn);
  };


  Template.tinkerPane.triggers = function () {
    return [
      {label: 'Yellow', action: {fn: 'background-color', param: 'yellow', actionLog: 'Change background to Yellow'} },
      {label: 'Red', action: {fn: 'background-color', param: 'red', actionLog: 'Change background to Red'} },
      {label: 'Blue', action: {fn: 'background-color', param: 'blue', actionLog: 'Change background to Blue'} },
      {label: 'Green', action: {fn: 'background-color', param: 'green', actionLog: 'Change background to Green'} },
      {label: 'Orange', action: {fn: 'background-color', param: 'orange', actionLog: 'Change background to Orange'} },
    ]
  };

  Template.tinkerPane.events({
    'click .trigger': function (event, template) {
      var trigger = Blaze.getData(event.target);
      Meteor.call('tinkerAction', trigger.action, function (error, result) {
        if (error) {
          throw error;
        } else {
          //do something with result
        }
      });
    },
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


Meteor.methods({
  'tinkerAction': function tinerActionMethod (actionOptions) {
    this.unblock();
    if (Meteor.isClient) {
      Tinker.action.call(actionOptions);
    } else {
      //server only
    }
    //update database with action log
    //TinkerEvents.insert(currenTinker, actionOptions);
  },
});
