describe('md083forkIcon directive', function() {
  var el;
  var $scope;
  var $compile;
  var $q;

  beforeEach(module('material.083fork.core'));
  beforeEach(module('material.083fork.components.icon'));

  var mockIconSvc = function(id) {
    var deferred = $q.defer();
    switch(id) {
      case 'android':
        deferred.resolve('<svg><g id="android"></g></svg>');
        break;
      case 'cake':
        deferred.resolve('<svg><g id="cake"></g></svg>');
        break;
      case 'android.svg':
        deferred.resolve('<svg><g id="android"></g></svg>');
        break;
      case 'cake.svg':
        deferred.resolve('<svg><g id="cake"></g></svg>');
        break;
    }
    return deferred.promise;
  }

  function make(html) {
    var el;
    el = $compile(html)($scope);
    $scope.$digest();
    return el;
  }

  beforeEach(function() {
    module(function($provide) {
      $provide.value('$md083forkIcon', mockIconSvc);
    });

    inject(function($rootScope, _$compile_, _$q_){
      $scope = $rootScope;
      $compile = _$compile_;
      $q = _$q_;
    });
  });


  describe('using md-font-icon=""', function() {

    it('should render correct HTML with md-font-icon value as class', function() {
      el = make( '<md083fork-icon md-font-icon="android"></md083fork-icon>');
      expect(el.html()).toEqual('<span class="md-font android" ng-class="fontIcon"></span>');
    });

  });

  describe('using md-svg-icon=""', function() {

    it('should update mdSvgIcon when attribute value changes', function() {
      $scope.iconName = 'android';
      el = make('<md083fork-icon md-svg-icon="{{ iconName }}"></md083fork-icon>');
      var iScope = el.isolateScope();
      expect(iScope.svgIcon).toEqual('android');
      $scope.iconName = 'cake';
      $scope.$digest();
      expect(iScope.svgIcon).toEqual('cake');
    });

  });

  describe('using md-svg-src=""', function() {

    it('should update mdSvgSrc when attribute value changes', function() {
      $scope.url = 'android.svg';
      el = make('<md083fork-icon md-svg-src="{{ url }}"></md083fork-icon>');
      var iScope = el.isolateScope();
      expect(iScope.svgSrc).toEqual('android.svg');
      $scope.url = 'cake.svg';
      $scope.$digest();
      expect(iScope.svgSrc).toEqual('cake.svg');
    });

  });

  describe('with ARIA support', function() {

    it('should apply aria-hidden="true" when parent has valid label', function() {
      el = make('<button aria-label="Android"><md083fork-icon md-svg-icon="android"></md083fork-icon></button>');
      expect(el.find('md083fork-icon').attr('aria-hidden')).toEqual('true');

      el = make('<md083fork-radio-button aria-label="avatar 2" role="radio"> '+
                  '<div class="md-container"></div> '+
                    '<div class="md-label"> '+
                    '<md083fork-icon md-svg-icon="android"></md083fork-icon> '+
                  '</div></md083fork-radio-button>');

      expect(el.find('md083fork-icon').attr('aria-hidden')).toEqual('true');
    });

    it('should apply aria-hidden="true" when parent has text content', function() {
      el = make('<button>Android <md083fork-icon md-svg-icon="android"></md083fork-icon></button>');
      expect(el.find('md083fork-icon').attr('aria-hidden')).toEqual('true');
    });

    it('should apply aria-hidden="true" when alt is empty string', function() {
      el = make('<md083fork-icon md-svg-icon="android" alt=""></md083fork-icon>');
      expect(el.attr('aria-hidden')).toEqual('true');
    });

    it('should apply alt value to aria-label when set', function() {
      el = make('<md083fork-icon md-svg-icon="android" alt="my android icon"></md083fork-icon>');
      expect(el.attr('aria-label')).toEqual('my android icon');
    });

    it('should apply font-icon value to aria-label when alt not set', function() {
      el = make('<md083fork-icon md-font-icon="android"></md083fork-icon>');
      expect(el.attr('aria-label')).toEqual('android');
    });

    it('should apply svg-icon value to aria-label when alt not set', function() {
      el = make('<md083fork-icon md-svg-icon="android"></md083fork-icon>');
      expect(el.attr('aria-label')).toEqual('android');
    });

  });

});
