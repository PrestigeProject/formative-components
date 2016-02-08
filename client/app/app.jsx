class App extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <main>{this.props.content}</main>
      </div>
    );
  }
}

window.App = App;
