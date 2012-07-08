// Generated by CoffeeScript 1.3.1
var AppRouter, app;

app = void 0;

Backbone.View.prototype.close = function() {
  if (this.beforeClose) {
    this.beforeClose();
  }
  return this.undelegateEvents();
};

Backbone.View.prototype.navigateAnchor = function(event) {
  event.preventDefault();
  return app.navigate(event.currentTarget.getAttribute("href"), {
    trigger: true
  });
};

AppRouter = Backbone.Router.extend({
  initialize: function() {
    var _this = this;
    this.bind('all', this._trackPageview);
    this.faceList = new FaceCollection();
    this.randFaceList = new FaceCollection();
    this.tagList = new TagCollection();
    this.firstLoad = true;
    this.imageServices = ["http://denver.mylittlefacewhen.com", "http://scranton.mylittlefacewhen.com"];
    this.fastest = {
      service: void 0,
      speed: 10000
    };
    _.each(this.imageServices, function(service) {
      var time;
      time = new Date().getTime();
      return $.ajax({
        method: "GET",
        url: service + "/media/speedtest.txt",
        complete: function() {
          var speed;
          speed = new Date().getTime() - time;
          if (speed < _this.fastest.speed) {
            return _this.fastest = {
              service: service,
              speed: speed
            };
          }
        }
      });
    });
    return this.topView = new TopView().render();
  },
  _trackPageview: function() {
    var url;
    url = Backbone.history.getFragment();
    return _gaq.push(['_trackPageview', "/" + url]);
  },
  getImageService: function() {
    if (this.fastest.service) {
      return this.fastest.service;
    }
    return this.imageServices[0];
  },
  routes: {
    "": "main",
    "develop": "develop",
    "develop/api": "apidoc",
    "develop/api/:version": "apidoc",
    "changelog": "changes",
    "f": "random",
    "f/:id": "face",
    "face": "random",
    "feedback": "feedback",
    "random": "random",
    "randoms": "randoms",
    "search/*query": "search",
    "submit": "submit",
    "tags": "tags",
    "unreviewed": "unreviewed"
  },
  main: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_new");
      return new MainView({
        model: _this.faceList
      }).render();
    });
  },
  apidoc: function(version) {
    var _this = this;
    return this.before(function() {
      if (version === void 0) {
        version = "v2";
      }
      _this.select("#m_api");
      return _this.pageload(new APIDocView({
        version: version
      }));
    });
  },
  changes: function() {
    var _this = this;
    return this.before(function() {
      _this.select("none");
      return _this.pageload(new ChangesView());
    });
  },
  develop: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_develop");
      return _this.pageload(new DevelopView());
    });
  },
  face: function(id) {
    var _this = this;
    return this.before(function() {
      var model, page, r;
      _this.select("none");
      model = _this.faceList.get(id);
      r = _this.randFaceList.get(id);
      if (r) {
        model = r;
      }
      if (!model) {
        page = new SingleView({
          model: new Face({
            id: id,
            not_fetched: true
          })
        });
      } else {
        page = new SingleView({
          model: model
        });
      }
      return _this.pageload(page);
    });
  },
  feedback: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_feedback");
      return _this.pageload(new FeedbackView());
    });
  },
  random: function() {
    var faces;
    faces = new FaceCollection();
    faces.fetch({
      data: {
        order_by: "random",
        limit: 1
      },
      success: function(data) {
        var face;
        face = faces.models[0];
        if (!app.faceList.get(face.id)) {
          app.faceList.add(face);
        }
        return app.navigate("f/" + face.get("id") + "/", {
          trigger: true
        });
      }
    });
    return this.select("none");
  },
  randoms: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_randoms");
      return new RandomsView().render();
    });
  },
  submit: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_submit");
      return _this.pageload(new SubmitView());
    });
  },
  search: function() {
    var _this = this;
    return this.before(function() {
      _this.select("none");
      return new SearchView().render();
    });
  },
  tags: function() {
    var _this = this;
    return this.before(function() {
      _this.select("#m_tags");
      return _this.pageload(new TagsView({
        model: _this.tagList
      }));
    });
  },
  unreviewed: function() {
    var _this = this;
    return this.before(function() {
      _this.select("none");
      _this.randFaceList = new FaceCollection();
      return new UnreviewedView({
        model: _this.randFaceList
      }).render();
    });
  },
  pageload: function(page) {
    if (this.firstLoad && !$.browser.msie) {
      return page;
    } else {
      return page.render();
    }
  },
  select: function(item) {
    $("#topmenu div").removeClass("selected");
    return $("" + item + " div").addClass("selected");
  },
  before: function(callback) {
    if (this.currentPage) {
      this.currentPage.close();
    }
    this.currentPage = callback();
    if (this.firstLoad) {
      this.firstLoad = false;
    }
    return this.topView.updateAd();
  }
});

tpl.loadTemplates(["main", "thumbnail", "top", "single", "tag", "randoms", "randomsImage", "apidoc-v1", "apidoc-v2", "changelog", "develop", "feedback", "submit", "submitItem", "search", "tags", "tagsItem", "meta"], function() {
  var action, route, routes;
  routes = AppRouter.prototype.routes;
  for (route in routes) {
    action = routes[route];
    routes[route + "/"] = action;
  }
  AppRouter.prototype.routes = routes;
  app = new AppRouter();
  if ($.browser.msie && $.browser.version === "9.0") {
    return Backbone.history.start();
  } else {
    return Backbone.history.start({
      pushState: true
    });
  }
});
