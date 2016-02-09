class CanvasTools extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      colors: [{name:'red',hex:'#CC0000'},{name:'green',hex:'#008080'},{name:'blue',hex:'#468499'}]
    }
  }

  renderColors() {
    return this.state.colors.map((color) => {
      return <button key={color.name} onClick={this.props.handleColorChange.bind(null, color.hex)} style={{'backgroundColor':color.hex}} className="canvas-btn"></button>;
    });
  }

  render() {

    let imgUrl = this.props.isErasing ? 'pencil.png' : 'eraser.png';
    if(window.location.hostname !== 'localhost') imgUrl = '../' + imgUrl;

    return (
      <div className="canvas-tools">
        <div onClick={this.props.handleShareCanvas} className="canvas-share">
          SHARE
        </div>
        <button onClick={this.props.handleEraserChange} className="canvas-btn">
          <img src={imgUrl}
               alt={this.props.isErasing ? 'pen' : 'eraser'}/>
        </button>
        {this.renderColors()}
      </div>
    );
  }

}


window.CanvasTools = CanvasTools;
