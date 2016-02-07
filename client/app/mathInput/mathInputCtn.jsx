class MathInputCtn extends React.Component {
  
  render() {
    return (
      <div className="math-input-ctn">
        <div className="math-input-question-ctn">
          <div className="math-input-question">
            <RenderMathInput />
          </div>
          <div className="math-input-question-answer">
            <MathInput />
          </div>
        </div>
      </div>
    )
  }

}

window.MathInputCtn = MathInputCtn;
