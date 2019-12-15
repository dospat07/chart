
class Chart {

    constructor(canvas, labelX, labelY) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgba(17,125,187,0.1)';
        this.context.strokeStyle = 'rgba(17,125,187,1.0';
        this.labelX = labelX;
        this.labelY = labelY;
        this.offsetX = 20;
        this.offsetY = 20;
        this.points = [];
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add("circle");
        this.tooltip.style.height = '5px';
        this.tooltip.style.width= '5px';
        document.getElementsByTagName("body")[0].appendChild(this.tooltip);
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        // context.shadowColor = 'rgba(50,50,50,1.0)';
        // context.shadowOffsetX = 2;
        // context.shadowOffsetY = 2;
        // context.shadowBlur = 4;

        this.context.lineCap = 'round';


    }
    
       
    calcDemesnion(stepX, stepY) {
        this.X = 0.5 + this.offsetX;
        this.Y = 0.5 + this.offsetY;
        this.width = Math.floor((this.context.canvas.width - this.offsetX) / stepX) * stepX;
        this.height = Math.floor((this.context.canvas.height - this.offsetY) / stepY) * stepY;
        this.factorY = this.height / 100;
        console.log(this.height, this.width);
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
        this.points.push(point);

    }
    onMouseMove(e) {
        let rect = canvas.getBoundingClientRect();
        let index = Math.floor((e.pageX - rect.x - this.offsetX) / this.factorX + 0.5);
        if (index>=0){
             
            let y = this.height - this.points[index] * this.factorY+rect.x+this.offsetX-1;
            let x = this.factorX*index+rect.y+this.offsetY-1;
            this.tooltip.style.left = x+"px";
            this.tooltip.style.top = y+"px";
            this.tooltip.style.display = "block";
            // this.context.save();
            // this.context.translate(this.X, this.Y);
            // this.context.beginPath();
            // this.context.arc(x,y,1,0,2*Math.PI);
            // this.context.stroke();
            // this.context.restore();
            console.log(this.points[index],index);
        }
        else
        {
            this.tooltip.style.display = "none";
        }
    }
    
    drawChart() {
        this.factorX = this.width / (this.points.length - 1);
        this.context.save();
        this.context.translate(this.X, this.Y);
        this.context.beginPath();
        let i = 0;
        for (let x = 0; x <= this.points.length * this.factorX; x += this.factorX) {
            let y = this.height - this.points[i] * this.factorY
            console.log(x, y);
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