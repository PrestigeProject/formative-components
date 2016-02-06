class App extends React.Component {
  render() {
    return (
      <Canvas isErasing={false} canvasId="NLuZALxBE9PJcMpXd" />
    );
  }
}

if(Meteor.isClient){
  window.App = App;
}