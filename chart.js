
class Chart {

    constructor(canvas, labelX, labelY) {
        this.maxPoints = 40;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
       
        this.labelX = labelX;
        this.labelY = labelY;
        this.offsetX = 20;
        this.offsetY = 20;
        this.points = [];
        this.point = document.createElement("div");
        this.point.classList.add("circle");
        this.point.style.height = '5px';
        this.point.style.width= '5px';
        this.elementLabelY = document.createElement("div");
        this.elementLabelY.classList.add("labelY");
        this.windowWidht = window.innerWidth;
        document.getElementsByTagName("body")[0].appendChild(this.point);
        document.getElementsByTagName("body")[0].appendChild(this.elementLabelY );
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('resize', this.onResize.bind(this));
        // context.shadowColor = 'rgba(50,50,50,1.0)';
        // context.shadowOffsetX = 2;
        // context.shadowOffsetY = 2;
        // context.shadowBlur = 4;

        this.context.lineCap = 'round';
        this.backupCanvas = document.createElement("canvas");
        this.backupContext = this.backupCanvas.getContext('2d');

    }
    
    onResize(e){
        let widthdiv = this.windowWidht-window.innerWidth;
        this.windowWidht = window.innerWidth;
        console.log("resize",widthdiv);
        if ((this.canvas.width-widthdiv)>200){
           
            this.canvas.width = this.canvas.width-widthdiv;
            this.draw(this.labelsColor,this.gridColor,this.labelfont);
            this.drawChart();
        }
    }
    calcDemesnion(stepX, stepY) {
        this.X = 0.5 + this.offsetX;
        this.Y = 0.5 + this.offsetY;
        this.width = Math.floor((this.context.canvas.width - 2*this.offsetX) / stepX) * stepX;
        this.height = Math.floor((this.context.canvas.height - this.offsetY) / stepY) * stepY;
        this.factorY = this.height / 100;
        console.log(this.height, this.width);
    }
    
 
    draw(labelsColor,gridColor,labelfont){
        this.context.fillStyle = 'rgba(17,125,187,0.1)';
        this.context.strokeStyle = 'rgba(17,125,187,1.0';
        this.labelsColor = labelsColor;
        this.gridColor = gridColor;
        this.labelfont = labelfont;

       let stepY = Math.ceil((this.context.canvas.height -2* this.offsetY)/10);
        
       this.drawGrid(50,stepY,gridColor);
       this.drawLabels(labelsColor,labelfont);
      
       this.backupCanvas.width = this.canvas.width;
       this.backupCanvas.height= this.canvas.height;
      
       this.backupContext.drawImage(this.canvas,0,0);
    }
    drawLabels(color, font) {
        this.context.save();
        this.context.font = font;
        let metrics = this.context.measureText(this.labelX);
        let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        this.context.strokeStyle = color;

        this.context.translate(actualHeight, 100 + 15 + 30);
        this.context.rotate(- Math.PI / 2)
        this.context.textAlign = "center";
        this.context.strokeText(this.labelX, 0, 0);
        this.context.restore();
    }
    drawGrid(stepX, stepY, color) {
        this.calcDemesnion(stepX, stepY);
        this.context.save();
        this.context.translate(this.X, this.Y);
        this.context.lineWidth = 1;
        this.context.strokeStyle = color;
        for (var x = 0; x <= this.width; x += stepX) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
            this.context.stroke();
        }
        for (var y = 0; y <= this.height; y += stepY) {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
            this.context.stroke();
        }

        this.context.restore();
    }
    addPoint(point) {
        if (this.points.length>this.maxPoints){
            this.points.shift();
        }
        this.points.push(point);
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.drawImage(this.backupCanvas,0,0);
        this.drawChart();
        this.point.style.display = "none";

    }
    onMouseMove(e) {
        let rect = canvas.getBoundingClientRect();
       
        let index = Math.floor((e.pageX - rect.x - this.offsetX) / this.factorX + 0.5);
        if (index>=0 && e.pageX<( rect.right - this.offsetX)){
             
            let y = this.height - this.points[index] * this.factorY+rect.y+this.offsetX-1;
            let x = this.factorX*index+rect.x+this.offsetY-1;
            this.point.style.left = x+"px";
            this.point.style.top = y+"px";
            this.point.style.display = "block";

            this.elementLabelY.style.left = rect.x+this.width+this.offsetX+5+"px";
            this.elementLabelY.style.top = y+"px";
            this.elementLabelY.innerText = this.points[index];
            this.elementLabelY.style.display = "block";
          
            // this.context.save();
            // this.context.translate(this.X, this.Y);
            // this.context.beginPath();
            // this.context.arc(x,y,1,0,2*Math.PI);
            // this.context.stroke();
            // this.context.restore();
            //console.log(this.points[index],index);
        }
        else
        {
            this.point.style.display = "none";
        }
    }
    
    drawChart() {
        if (this.points.length>1){
           // console.log(this.points.length);
            this.factorX = this.width / (this.points.length - 1);
            this.context.save();
            this.context.translate(this.X, this.Y);
            this.context.beginPath();
            let i = 0;
            for (let x = 0; x <= this.points.length * this.factorX; x += this.factorX) {
                let y = this.height - this.points[i] * this.factorY;
               // console.log(x, y);
                this.context.lineTo(x, y);
                i++;
            }
            this.context.lineTo(this.width, this.height);
            this.context.lineTo(0, this.height);
    
            this.context.stroke();
            this.context.fill();
            this.context.restore();
        }
      
    }

}