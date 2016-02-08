class App extends React.Component {
  render() {
    return (
      <div>
        <Nav name={this.props.name} />
        <main>{this.props.content}</main>
      </div>
    );
  }
}

window.App = App;
