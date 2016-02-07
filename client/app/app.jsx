class App extends React.Component {
  render() {

    let canvasClass = classNames('nav-btn',{ 'active': this.props.name === 'Canvas'});
    let mathinputClass = classNames('nav-btn',{ 'active': this.props.name === 'MathInput' });

    return (
      <div>
        <header className="nav-ctn">
          <div className="nav">
            <h2 className="nav-title">
              <span className="nav-title-contrast">Go</span>Formative
            </h2>
            <span className={canvasClass}>
              <a href="http://localhost:3000/canvas">Canvas</a>
            </span>
            <span className={mathinputClass}>
              <a href="http://localhost:3000/mathinput">MathInput</a>
            </span>
            <span className="nav-author">
              by Jeff Plourd
            </span>
          </div>
        </header>
        <main>{this.props.content}</main>
      </div>
    );
  }
}

if(Meteor.isClient){
  window.App = App;
}