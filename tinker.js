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
    var triggers = [];
    _.each(['Q','W','E','R','T'], function (key) {
      var color = randomColor();
      triggers.push({
        key: key,
        label: '',
        action: {
          fn: 'background-color',
          param: color,
          actionLog: 'Change background to ' + color}
        });
    });
    return triggers;
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
