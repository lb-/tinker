Tinker = {};

if (Meteor.isClient) {

  Tinker.action = function (fn, param) {
    var fn = this.fn || fn || null;
    var param = this.param || param || null;
    check(fn, String);
    check(param, String);
    if ( fn === 'background-color' ) {
      //$('body').css('background-color', param);
      $('body').animate({
        backgroundColor: param,
      }, 1000);
      return;
    }
    throw new Error('invalid fn String provided: ', fn);
  };

  Template.tinkerPane.triggers = function () {
    var triggers = [];
    var newTriggers = Session.get('newTriggers');
    _.each(['q','w','e','r','t'], function (key) {
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
      var button = $(event.target).closest('button')[0];
      var trigger = Blaze.getData(button);
      Meteor.call('tinkerAction', trigger.action, function (error, result) {
        if (error) {
          throw error;
        } else {
          //do something with result
        }
      });
    },
    'click .reset-triggers': function (event, template) {
      Session.set('newTriggers', Random.id());
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
