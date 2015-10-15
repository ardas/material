describe('md083forkIcon service', function() {

  var $md083forkIcon;
  var $httpBackend;
  var $scope;

  beforeEach(module('material.083fork.core'));
  beforeEach(module('material.083fork.components.icon',function($md083forkIconProvider){
    $md083forkIconProvider
      .icon('android',   'android.svg')
      .icon('c2',        'c2.svg')
      .iconSet('social', 'social.svg' )
      .iconSet('notfound', 'notfoundgroup.svg' )
      .defaultIconSet('core.svg');
  }));

  beforeEach(inject(function($templateCache, _$httpBackend_, _$md083forkIcon_, $rootScope){
    $md083forkIcon = _$md083forkIcon_;
    $httpBackend = _$httpBackend_;
    $scope = $rootScope;
    $templateCache.put('android.svg', '<svg><g id="android"></g></svg>');
    $templateCache.put('social.svg' , '<svg><g id="s1"></g><g id="s2"></g></svg>');
    $templateCache.put('core.svg'   , '<svg><g id="c1"></g><g id="c2" class="core"></g></svg>');
    $templateCache.put('c2.svg'   , '<svg><g id="c2" class="override"></g></svg>');

    $httpBackend.whenGET('notfoundgroup.svg').respond(404, 'Cannot GET notfoundgroup.svg');

  }));

  describe('when $md083forkIcon() is passed and icon ID', function() {

    it('should append configured SVG single icon', function() {
      var expected = updateDefaults('<svg><g id="android"></g></svg>');
      $md083forkIcon('android').then(function(el) {
        expect(el[0].outerHTML).toEqual(expected);
      })
      $scope.$digest();
    });

    it('should append configured SVG icon from named group', function() {
      var expected = updateDefaults('<svg xmlns="http://www.w3.org/2000/svg"><g id="s1"></g></g></svg>');
      $md083forkIcon('social:s1').then(function(el) {
        expect(el[0].outerHTML).toEqual(expected);
      })
      $scope.$digest();
    });

    it('should append configured SVG icon from default group', function() {
      var expected = updateDefaults('<svg xmlns="http://www.w3.org/2000/svg"><g id="c1"></g></g></svg>');
      $md083forkIcon('c1').then(function(el) {
        expect(el[0].outerHTML).toEqual(expected);
      })
      $scope.$digest();
    });

    it('should allow single icon defs to override those defined in groups', function() {
      $md083forkIcon('c2').then(function(el) {
        expect(el.find('g').hasClass('override')).toBe(true);
      })
      $scope.$digest();
    });

  });

  describe('When $md083forkIcon() is passed a URL', function() {

    it('should return correct SVG markup', function() {
      $md083forkIcon('android.svg').then(function(el) {
        expect(el[0].outerHTML).toEqual( updateDefaults('<svg><g id="android"></g></svg>') );
      })
      $scope.$digest();
    });

  });

  describe('When icon set URL is not found', function() {
    it('should throw Error', function() {
      var msg;
      try {
        $md083forkIcon('notconfigured')
          .catch(function(error){
            msg = error;
          });

        $scope.$digest();
      } finally {
        expect(msg).toEqual('icon $default:notconfigured not found');
      }
    });
  });

  describe('When icon is not found', function() {
    it('should throw Error', function() {
      var msg;
      try {
        $md083forkIcon('notfound:someIcon')
          .catch(function(error){
            msg = error;
          });

        $httpBackend.flush();
      } finally {
        expect(msg).toEqual('Cannot GET notfoundgroup.svg');
      }
    });
  });

  function updateDefaults(svg) {
    svg = angular.element(svg);

    svg.attr({
      'xmlns' : 'http://www.w3.org/2000/svg',
      'fit'   : '',
      'height': '100%',
      'width' : '100%',
      'preserveAspectRatio': 'xMidYMid meet',
      'viewBox' : svg.attr('viewBox') || '0 0 24 24'
    })
    .css( {
      'pointer-events' : 'none',
      'display' : 'block'
    });

    return svg[0].outerHTML;
  }

});
