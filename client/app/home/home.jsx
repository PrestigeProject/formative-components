class Home extends React.Component {
  render() {
    return (
      <div className="home-ctn">
        <div className="home">
          <div className="home-title">
            <h1>Jeff Plourd</h1>
            <p>UI Components <br/> EdTech</p>
          </div>
          <div className="home-images">
            <a href="https://linkedin.com/in/jeffplourd"><img src="linkedin.png" /></a>
            <a href="https://github.com/jeffplourd"><img src="github.png" /></a>
          </div>
        </div>
      </div>
    )
  }
}

window.Home = Home;