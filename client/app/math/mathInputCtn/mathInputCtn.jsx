class MathInputCtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exampleText1: "c = \\sqrt{a^2 + b^2}",
      exampleText2: '\\frac{3}{4}',
      exampleText3: 'c = \\sqrt{a^2 + b^2}'
    };
  }
  
  render() {

    return (
      <div className="math-input-ctn">
        <div className="math-input-question-ctn">

          <div className="math-input-question">
            <p className="math-input-question-explanation">Render LaTex statically:</p>
            <RenderMathInput text={this.state.exampleText1} />
          </div>

          <div className="math-input-question-answer">
            <p className="math-input-question-explanation">Input and dynamically render LaTex (e.g. "\frac{'{3}'}{'{4}'}"):</p>
            <form className="form-input" onSubmit={this.renderLaTex.bind(this)} >
              <input
                type="text"
                ref="LaTexInput"
                placeholder="\frac{3}{4}" />
            </form>
            <RenderMathInput text={this.state.exampleText2} />
          </div>

          <div className="math-input-question-answer">
            <p className="math-input-question-explanation">Magic textboxes where you can type math as easily as writing:</p>
            <MathInput value={this.state.exampleText3} onChange={this.renderKatex.bind(this)} />
            <RenderMathInput text={this.state.exampleText3} />
          </div>

        </div>
      </div>
    );
  }

  renderKatex(value) {
    this.setState({
      exampleText3: value
    });
  }

  renderLaTex(event) {
    event.preventDefault();
  
     // Find the text field via the React ref
    var text = ReactDOM.findDOMNode(this.refs.LaTexInput).value;
    
    console.log('text',text);
    this.setState({
      exampleText2: text
    });
  
    ReactDOM.findDOMNode(this.refs.LaTexInput).value = "";
  }

}

window.MathInputCtn = MathInputCtn;
