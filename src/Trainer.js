class Trainer {
    /**
     * Trainer class.
     * 
     * @author Zion Reynolds, Francis
     * @version 23APR25
     */

    constructor() {
        this.currIndex = 0;
        this.curr = trainerImages[this.currIndex];
        this.maxSize = 25;
        this.playerTrainer;
        this.AITrainer;
    }

    next() {
        this.currIndex = this.currIndex + 1;
        if(this.currIndex > 25) {
            this.currIndex = 0;
        }
        this.curr = trainerImages[this.currIndex];
    }

    prev() {
        this.currIndex = this.currIndex - 1;
        if(this.currIndex < 0) {
            this.currIndex = 25;
        }
        this.curr = trainerImages[this.currIndex];
    }

    setPlayer() {
        this.playerTrainer = this.curr;
    }

    setAI() {
        let randInt = (Math.floor(26 * Math.random()));
        while(randInt == this.currIndex) {
            randInt = (Math.floor(26 * Math.random()));
        }
        this.AITrainer = trainerImages[randInt];
    }
}