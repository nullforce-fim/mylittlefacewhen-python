// Generated by CoffeeScript 1.3.3

window.APIDocView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    if (this.options.version === void 0) {
      this.options.version = "v3";
    }
    this.title = "API" + this.options.version + " Documentation - MyLittleFaceWhen";
    this.description = "Information about API for mylittlefacewhen. It can be used to fetch data from the service and for maintanence by administrator.";
    return this.template = tpl.get("apidoc-" + this.options.version);
  },
  events: function() {
    return {
      "click .navigate": "navigateAnchor"
    };
  },
  render: function() {
    this.updateMeta(this.title, this.description);
    this.$el.html(this.template);
    return this;
  }
});

window.DevelopView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    this.title = "Information - MyLittleFaceWhen";
    this.description = "How and why this service exists. API, feed, etc.";
    return this.template = tpl.get("develop");
  },
  events: function() {
    return {
      "click .navigate": "navigateAnchor",
      "click #mlfw": "random"
    };
  },
  render: function() {
    this.updateMeta(this.title, this.description);
    $(this.el).html(this.template);
    return this;
  },
  random: function(event) {
    event.preventDefault();
    return app.random();
  }
});

window.ChangesView = Backbone.View.extend({
  el: "#content",
  initialize: function() {
    this.title = "Changelog - MyLittleFaceWhen";
    this.description = "List of changes to the service.";
    return this.template = tpl.get("changelog");
  },
  render: function() {
    this.updateMeta(this.title, this.description);
    $(this.el).html(this.template);
    return this;
  }
});
