class Nav extends React.Component {

  render() {

    let url = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'http://formative-components.metoer.com';
    let canvasClass = classNames('nav-btn',{ 'active': this.props.name === 'Canvas'});
    let mathinputClass = classNames('nav-btn',{ 'active': this.props.name === 'MathInput' });

    return (
      <header className="nav-ctn">
        <div className="nav">
          <h2 className="nav-title">
            <span className="nav-title-contrast">Go</span>Formative
          </h2>
          <span className={canvasClass}>
            <a href={url+'/canvas'}>Canvas</a>
          </span>
          <span className={mathinputClass}>
            <a href={url+'/mathinput'}>MathInput</a>
          </span>
          <span className="nav-author">
            by Jeff Plourd
          </span>
        </div>
      </header>
    );
  }
}

window.Nav = Nav;