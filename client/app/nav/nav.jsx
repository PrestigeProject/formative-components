class Nav extends React.Component {

  render() {

    let url = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://formative-components.meteor.com';
    let canvasUrl = url+'/canvas';
    let mathInputUrl = url+'/mathinput';
    let canvasClass = classNames('nav-btn',{ 'active': this.props.name === 'Canvas'});
    let mathinputClass = classNames('nav-btn',{ 'active': this.props.name === 'MathInput' });

    return (
      <header className="nav-ctn">
        <div className="nav">
          <h2 onClick={this.goToUrl.bind(this, url)} className="nav-title">
            <span className="nav-title-contrast">Go</span>Formative
          </h2>
          <span className={canvasClass}>
            <a href={canvasUrl}>Canvas</a>
          </span>
          <span className={mathinputClass}>
            <a href={mathInputUrl}>MathInput</a>
          </span>
          <span onClick={this.goToUrl.bind(this, url)} className="nav-author">
            by Jeff Plourd
          </span>
        </div>
      </header>
    );
  }

  goToUrl(url) {
    window.location.assign(url);
  }

}

window.Nav = Nav;