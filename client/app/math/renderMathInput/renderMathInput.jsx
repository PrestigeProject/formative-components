class RenderMathInput extends React.Component {

  render(){
    return (
      <div className="mi" ref="myKatex"></div>
    );
  }

  componentDidMount(){
    katex.render(this.props.text, this.refs.myKatex);
  }

  componentWillReceiveProps(props) {
    katex.render(props.text, this.refs.myKatex);
  }

};

window.RenderMathInput = RenderMathInput;