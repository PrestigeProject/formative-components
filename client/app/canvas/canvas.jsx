class Canvas extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isErasing: false,
      color: '#008080'
    };
    this.isDrawing = false;
    this.toErase = [];
    this.canvasId;
  }

  render() {
    return (
      <div>
        <canvas 
          onMouseDown={this.startDrawing.bind(this)}
          onMouseMove={this.whileDrawing.bind(this)} 
          onDrag={this.whileDrawing.bind(this)}
          onMouseOut={this.endDrawing.bind(this)}
          onMouseUp={this.endDrawing.bind(this)}
          ref="canvasElem">
        </canvas>
        <CanvasTools
          isErasing={this.state.isErasing}
          currentColor={this.color}
          handleShareCanvas={this.handleShareCanvas.bind(this)}
          handleEraserChange={this.handleEraserChange.bind(this)} 
          handleColorChange={this.handleColorChange.bind(this)} />
      </div>
    );
  }

  handleShareCanvas() {
    window.location.assign('http://localhost:3000/canvas/' + this.canvasId);
  }

  handleEraserChange() {
    console.log('isErasing');
    this.setState({
      isErasing: !this.state.isErasing
    })
  }

  handleColorChange(color) {
    console.log('handleColorChange',color);
    this.setState({
      color: color
    });
  }

  componentDidMount() {
    window.addEventListener("resize",this.init.bind(this), false);
    this.init();
  }

  init() {

    this.refs.canvasElem.width = this.props.width || window.innerWidth;
    this.refs.canvasElem.height = this.props.height || window.innerHeight;

    this.canvasCtx = this.refs.canvasElem.getContext ? this.refs.canvasElem.getContext('2d') : null;
    if (this.canvasCtx == null) {
      alert("You must use a browser that supports HTML5 Canvas to run this demo.");
      return;
    }

    // if not passed canvasId, create new canvas
    if (!this.props.canvasId)
      this.setObservables(this.createNewCanvas());
    else
      this.setObservables(this.props.canvasId);
  }

  setObservables(canvasId) {
    this.canvasId = canvasId;

    let self = this;
    LinesDB.find({canvasId: canvasId}).observe({
      added(doc) {
        self.drawSpline(self.canvasCtx, doc.coords, 0.2, self.state.color);
        // will fire when we first load doc
        // if using old canvas, we will want to render lines
      },
      changed(doc) {
        self.drawSpline(self.canvasCtx, doc.coords, 0.2, self.state.color);
      }
    });

    LinesToGreyDB.find({canvasId: canvasId}).observe({
      added(doc) {
        self.drawSpline(self.canvasCtx, doc.coords, 0.2, '#D3D3D3');
        self.toErase.push(doc);
      }
    });

    LinesToEraseDB.find({canvasId: canvasId}).observe({
      added(doc) {
        self.drawSpline(self.canvasCtx, doc.coords, 0.2, '#F6F7F7', 4);
        setTimeout( () => self.drawSpline(self.canvasCtx, doc.coords, 0.2, '#F6F7F7', 4));
        LinesToEraseDB.remove(doc._id);
      }
    });
  }

  startDrawing(event) {
    console.log("startDrawing");
    this.isDrawing = true;
    this.lastX = event.pageX - event.target.offsetLeft;
    this.lastY = event.pageY - event.target.offsetTop;
    if(!this.state.isErasing) this.addLine(this.lastX, this.lastY);
  }  

  whileDrawing(event) {
    if(this.isDrawing){
      var cx = event.pageX - event.target.offsetLeft;
      var cy = event.pageY - event.target.offsetTop;
      if(this.shouldAdd(this.lastX,this.lastY,cx,cy)){
        if(this.state.isErasing){
          // collision detection
          this.collisionDetection(cx, cy);
        }else{
          this.addNewCoord(cx);
          this.addNewCoord(cy);
        }
        this.lastX = cx;
        this.lastY = cy;
      }
    }
  }

  shouldAdd(lastX, lastY, curX, curY) {
    return Math.sqrt(Math.pow(lastX-curX,2) + Math.pow(lastY-curY,2)) > 15;
  }

  collisionDetection(cx, cy) {
    LinesDB.find({canvasId: this.canvasId}).forEach((line)=>{
      console.log('line:',line);
      for(var i = 0; i < line.coords.length - 1; i += 2){
        if(Math.abs(line.coords[i]-cx)<15 && Math.abs(line.coords[i+1]-cy)<15){
          LinesToGreyDB.insert({
            canvasId: this.canvasId,
            coords: line.coords
          }, () => {
            LinesDB.remove(line._id);
          });
          break;
        }
      }
    });
  }

  // TODO: make sure grey lines are being erased 
  endDrawing() {
    this.isDrawing = false;
    while(this.toErase.length){
      var doc = this.toErase.pop();
      console.log("endDrawing", doc);
      LinesToEraseDB.insert({
        canvasId: this.canvasId,
        coords: doc.coords
      }, () => {
        LinesToGreyDB.remove(doc._id);
      });

    }
  }  

  createNewCanvas() {
    return CanvasesDB.insert({name:'jeff'});
  }

  addLine(cx, cy) {
    this.currentLineId = LinesDB.insert({
      canvasId: this.canvasId,
      coords: [cx, cy]
    });
  }

  addNewCoord(coord) {
    LinesDB.update(this.currentLineId, { 
      $push: { coords: coord }
    });
  }

  hexToCanvasColor(hexColor,opacity){
      // Convert #AA77CC to rbga() format for Firefox
      opacity=opacity || "1.0";
      hexColor=hexColor.replace("#","");
      var r=parseInt(hexColor.substring(0,2),16);
      var g=parseInt(hexColor.substring(2,4),16);
      var b=parseInt(hexColor.substring(4,6),16);
      return "rgba("+r+","+g+","+b+","+opacity+")";
  }

  getControlPoints(x0,y0,x1,y1,x2,y2,t){
      //  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
      //  x2,y2 is the next knot -- not connected here but needed to calculate p2
      //  p1 is the control point calculated here, from x1 back toward x0.
      //  p2 is the next control point, calculated here and returned to become the 
      //  next segment's p1.
      //  t is the 'tension' which controls how far the control points spread.
      
      //  Scaling factors: distances from this knot to the previous and following knots.
      var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
      var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
     
      var fa=t*d01/(d01+d12);
      var fb=t-fa;
    
      var p1x=x1+fa*(x0-x2);
      var p1y=y1+fa*(y0-y2);

      var p2x=x1-fb*(x0-x2);
      var p2y=y1-fb*(y0-y2);  
      
      return [p1x,p1y,p2x,p2y]
  }

  drawSpline(ctx,pts,t,color,width){
      ctx.lineWidth = width || 2;
      ctx.save();
      var cp = [];   // array of control points, as x0,y0,x1,y1,...
      var n = pts.length;
      var color = this.hexToCanvasColor(color||'#94C47E',0.75);

      // Draw an open curve, not connected at the ends
      for(var i=0;i<n-4;i+=2){
          cp=cp.concat(this.getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
      }    
      for(var i=2;i<pts.length-5;i+=2){
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(pts[i],pts[i+1]);
          ctx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
          ctx.stroke();
          ctx.closePath();
      }
      //  For open curves the first and last arcs are simple quadratics.
      ctx.strokeStyle= color;
      ctx.beginPath();
      ctx.moveTo(pts[0],pts[1]);
      ctx.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
      ctx.stroke();
      ctx.closePath();
      
      ctx.strokeStyle=color;
      ctx.beginPath();
      ctx.moveTo(pts[n-2],pts[n-1]);
      ctx.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);
      ctx.stroke();
      ctx.closePath();

      ctx.restore();
  }

}

Canvas.propTypes = { 
  isErasing: React.PropTypes.bool,
  canvasId: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number
};

if (Meteor.isClient) {
  window.Canvas = Canvas;
}