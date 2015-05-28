###A Collection of Implemented Node Themed Tutorial's

* ####Node starter kit (starter_app): [scotch.io](https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application)
  * References:
      * [angular.module] (https://docs.angularjs.org/guide/module)
        > Most applications have a main method that instantiates and wires together the different parts of the application.

        > Angular apps don't have a main method. Instead modules declaratively specify how an application should be bootstrapped. There are several advantages to this approach:

        > The declarative process is easier to understand.
        > You can package code as reusable modules.
        > The modules can be loaded in any order (or even in parallel) because modules delay execution.
        > Unit tests only have to load relevant modules, which keeps them fast.
        > End-to-end tests can use modules to override configuration. 
      
      * [$locationProvider.html5Mode](https://docs.angularjs.org/api/ng/provider/$locationProvider#html5Mode) - Use the $locationProvider to configure how the application deep linking paths are stored.
      * [$routeProvider](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider) - Used for configuring routes.
          * [example](https://docs.angularjs.org/api/ngRoute/service/$route#example)


###TODO
[Building a Restful API Using Node and Express ](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)