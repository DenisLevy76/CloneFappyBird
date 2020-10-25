function createElement(tagName, className){
    const element = document.createElement(tagName)
    element.classList.add(className)

    return element
}

function CreatePipe(reverse = false) {
    this.pipe = createElement('div', 'pipe')

    const body = createElement('div', 'body')
    const border = createElement('div', 'border')

    this.pipe.appendChild(reverse ? border : body)
    this.pipe.appendChild(reverse ? body : border)

    this.setHeight = (height) => body.style.height = `${height}px`
}

function CreatePairOfPipes(height, chink, x) {
    this.pairOfPipes = createElement('div', 'pair-of-pipes')

    this.upperPipe = new CreatePipe(false)
    this.reversePipe = new CreatePipe(true)

    this.pairOfPipes.appendChild(this.upperPipe.pipe)
    this.pairOfPipes.appendChild(this.reversePipe.pipe)

    this.drawOppening = () => { 
        const alturaSuperior = Math.random() * (height - chink)
        const alturaInferior = height - chink - alturaSuperior
        this.upperPipe.setHeight(alturaSuperior)
        this.reversePipe.setHeight(alturaInferior)
    }

    this.getAxisX = () => parseInt(this.pairOfPipes.style.left.split('px')[0])
    this.setAxisX = x => this.pairOfPipes.style.left = `${x}px`

    this.getWidth = () => this.pairOfPipes.clientWidth

    this.drawOppening()
    this.setAxisX(x)
}

function pipeGenerator(height, width, oppening, spaceBetween, scoringEvent){
    this.pairs = [
        new CreatePairOfPipes(height, oppening, width),
        new CreatePairOfPipes(height, oppening, width + spaceBetween),
        new CreatePairOfPipes(height, oppening, width + spaceBetween * 2),
        new CreatePairOfPipes(height, oppening, width + spaceBetween * 3),
        new CreatePairOfPipes(height, oppening, width + spaceBetween * 4),
        new CreatePairOfPipes(height, oppening, width + spaceBetween * 5),
    ]

    const speed = 3

    this.animate = () => {
        this.pairs.forEach(par => {
            par.setAxisX(par.getAxisX() - speed)

            if(par.getAxisX() < -par.getWidth()){
                par.setAxisX(par.getAxisX() + spaceBetween * this.pairs.length)
                par.drawOppening()
            }

            const middle = width / 2
            const hasCrossedTheMiddle = par.getAxisX() + speed >= middle && par.getAxisX() < middle

            hasCrossedTheMiddle && scoringEvent()
        })
    }
}

function Bird(heightOfGame){
    let flying = false

    window.onkeydown = (e) => flying = true
    window.onkeyup = (e) => flying = false

    this.bird = createElement('img', 'bird')
    this.bird.src = './images/bird.png'

    this.getFlying = () => flying
    this.getAxisY = () => parseInt(this.bird.style.bottom.split('px')[0])
    this.setAxisY = y => this.bird.style.bottom = `${y}px`
    this.onFlying = () => flying = true
    this.noFlying = () => flying = false

    const jumpForce = 5

    this.animate = () => {
        const maxHeight = heightOfGame - this.bird.clientHeight

        if (this.getAxisY() <= 0){
            flying? this.setAxisY(this.getAxisY() + jumpForce) : this.setAxisY(0)
        }
        else if (this.getAxisY() >= maxHeight){
            flying? this.setAxisY(maxHeight) : this.setAxisY(this.getAxisY() + -jumpForce)

        }
        else{
            this.setAxisY(this.getAxisY() + (flying? jumpForce : -jumpForce))
        }
    }

    this.setAxisY(heightOfGame / 2)
}

function Score() {
    this.score = createElement('div', 'score')
    this.score.innerText = 0

    this.uptadeScore = (newScore) => {
        this.score.innerText = newScore
    }
}

function Game(){
    let scorePoints = 0

    const gameScreen = document.querySelector('.game-screen')
    const height = document.querySelector('.game-screen').clientHeight
    const width = document.querySelector('.game-screen').clientWidth
    

    const bird = new Bird(height)
    const score = new Score(scorePoints)
    const pairs = new pipeGenerator(height, width, 155, 350, () => score.uptadeScore(scorePoints += 1))

    gameScreen.appendChild(bird.bird)
    pairs.pairs.forEach(pipe => gameScreen.appendChild(pipe.pairOfPipes))
    gameScreen.appendChild(score.score)

    this.start = () => {
        const temporizador = setInterval(() => {
                pairs.animate()
                bird.animate()
            
        }, 20)
    }
}

new Game().start()