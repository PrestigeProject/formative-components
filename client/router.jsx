
FlowRouter.route('/', {
  action() {
    ReactLayout.render(App, {
      content: <Home />,
      name: 'Home'
    });
  }
});

FlowRouter.route('/canvas/:canvasId', {
  action(params) {
    console.log('params',params)
    ReactLayout.render(App, {
      content: <Canvas {...params} />,
      name: 'Canvas'
    });
  }
});

FlowRouter.route('/canvas', {
  action() {
    ReactLayout.render(App, {
      content: <Canvas />,
      name: 'Canvas'
    });
  }
});

FlowRouter.route('/mathinput', {
  action() {
    ReactLayout.render(App,{
      content: <MathInputCtn />,
      name: 'MathInput'
    });
  }
});

