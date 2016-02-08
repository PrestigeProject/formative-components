class MathInput extends React.Component {

    constructor(props) {
      super(props);
    }

    render() {

        var className = classNames({
            "math-input": true,
            "mq-editable-field": true,
            "mq-math-mode": true
        });

        if (this.props.className) {
            className = className + " " + this.props.className;
        }

        return (
            <div style={{display: "inline-block", width:"100%", height:"100%"}}>
                <div style={{display: 'inline-block', width:"100%", height:"100%"}}>
                    <span className={className} ref="mathinput" />
                </div>
            </div>
        );
    }

    insert(value) {
        var input = this.mathField();
        if (_(value).isFunction()) {
            value(input);
        } else if (value[0] === '\\') {
            input.cmd(value).focus();
        } else {
            input.write(value).focus();
        }
        input.focus();
    }

    mathField(options) {
        // MathQuill.MathField takes a DOM node, MathQuill-ifies it if it's
        // seeing that node for the first time, then returns the associated
        // MathQuill object for that node. It is stable - will always return
        // the same object when called on the same DOM node.
        return MathQuill.MathField(ReactDOM.findDOMNode(this.refs.mathinput), options);
    }

    componentDidMount() {

        // These options can currently only be set globally. (Hopefully this
        // will change at some point.) They appear safe to set multiple times.

        // LaTeX commands that, when typed, are immediately replaced by the
        // appropriate symbol. This does not include ln, log, or any of the
        // trig functions; those are always interpreted as commands.
        MathQuill.addAutoCommands("pi theta phi sqrt nthroot");

        // Pop the cursor out of super/subscripts on arithmetic operators or
        // (in)equalities.
        MathQuill.addCharsThatBreakOutOfSupSub("+-*/=<>≠≤≥");

        // Prevent excessive super/subscripts or fractions from being created
        // without operands, e.g. when somebody holds down a key
        MathQuill.disableCharsWithoutOperand("^_/");

        var initialized = false;

        // Initialize MathQuill.MathField instance
        this.mathField({
            // The name of this option is somewhat misleading, as tabbing in
            // MathQuill breaks you out of a nested context (fraction/script)
            // if you're in one, but moves focus to the next input if you're
            // not. Spaces (with this option enabled) are just ignored in the
            // latter case.
            //
            // TODO(alex): In order to allow inputting mixed numbers, we will
            // have to accept spaces in certain cases. The desired behavior is
            // still to escape nested contexts if currently in one, but to
            // insert a space if not (we don't expect mixed numbers in nested
            // contexts). We should also limit to one consecutive space.
            spaceBehavesLikeTab: true,

            handlers: {
                edited: (mathField) => {
                    // This handler is guaranteed to be called on change, but
                    // unlike React it sometimes generates false positives.
                    // One of these is on initialization (with an empty string
                    // value), so we have to guard against that below.
                    var value = mathField.latex();

                    // Provide a MathQuill-compatible way to generate the
                    // not-equals sign without pasting unicode or typing TeX
                    value = value.replace(/<>/g, "\\ne");

                    // Use the specified symbol to represent multiplication
                    // TODO(alex): Add an option to disallow variables, in
                    // which case 'x' should get converted to '\\times'
                    if (this.props.convertDotToTimes) {
                        value = value.replace(/\\cdot/g, "\\times");

                        // Preserve cursor position in the common case:
                        // typing '*' to insert a multiplication sign.
                        // We do this by modifying internal MathQuill state
                        // directly, instead of waiting for `.latex()` to be
                        // called in `componentDidUpdate()`.
                        var left = mathField.controller.cursor[MathQuill.L];
                        if (left && left.ctrlSeq === '\\cdot ') {
                            mathField.controller.backspace();
                            mathField.cmd('\\times');
                        }
                    } else {
                        value = value.replace(/\\times/g, "\\cdot");
                    }

                    if (initialized && this.props.value !== value) {
                        this.props.onChange(value);
                    }
                },
                enter: () => {
                    // This handler is called when the user presses the enter
                    // key. Since this isn't an actual <input> element, we have
                    // to manually trigger the usually automatic form submit.
                    $(ReactDOM.findDOMNode(this.refs.mathinput)).submit();
                },
                upOutOf: (mathField) => {
                    // This handler is called when the user presses the up
                    // arrow key, but there is nowhere in the expression to go
                    // up to (no numerator or exponent). For ease of use,
                    // interpret this as an attempt to create an exponent.
                    mathField.typedText("^");
                }
            }
        });

        // Ideally, we would be able to pass an initial value directly into
        // the constructor above
        this.mathField().latex(this.props.value);

        initialized = true;
    }

    componentDidUpdate() {
        if (!_.isEqual(this.mathField().latex(), this.props.value)) {
            this.mathField().latex(this.props.value);
        }
    }

};

MathInput.propTypes = {
    value: React.PropTypes.string,
    convertDotToTimes: React.PropTypes.bool,
    labelText: React.PropTypes.string,
    onChange: React.PropTypes.func
};

MathInput.defaultProps = {
    value: "",
    convertDotToTimes: false
};

window.MathInput = MathInput;
