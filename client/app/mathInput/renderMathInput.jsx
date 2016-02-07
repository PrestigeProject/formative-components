RenderMathInput = React.createClass({

  handleChange(event) {
    console.log(this.refs.mathToConvert.value);
    katex.render(this.refs.mathToConvert.value, this.refs.myKatex, {throwOnError: false, displayMode: true});
  },

  componentDidMount(){
    katex.render("c = \\pm\\sqrt{a^2 + b^2}", this.refs.myKatex);
    // katex.render(this.props.text, this.refs.myKatex);
  },
  
  render(){
    return (
      <div className="mi" ref="myKatex"></div>
    );
  }

});
