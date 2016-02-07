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
    return (
      <div className="canvas-tools">
        <div onClick={this.props.handleShareCanvas} className="canvas-share">
          SHARE
        </div>
        <button onClick={this.props.handleEraserChange} className="canvas-btn">
          <h2>{this.props.isErasing ? 'Pen' : 'Eraser'}</h2>
        </button>
        {this.renderColors()}
      </div>
    );
  }

}


window.CanvasTools = CanvasTools;
