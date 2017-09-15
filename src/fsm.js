class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.config = config;
        if (!config) throw new Error("Error");
        //this.state = config.initial;
        this.state = config["initial"];
        // if (config === underfined) throw new RangeError("Error");
        this.history = [this.state];
        this.historyIndex = 0;
        this.reduOff = 3;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var states = this.config.states;
        if(state in states) {
            this.state = state;
            this.history.push(state);
            this.historyIndex++;
            this.reduOff = 4;
        } else throw new Error("Error");
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        for(let a in this.config.states) {
            if (event in this.config.states[a].transitions && this.config.states[this.state].transitions[event]) {
                this.state = this.config.states[a].transitions[event];
                this.history.push(this.state);
                this.historyIndex++;
                this.reduOff = 4;
                return;
            }
        }
        throw new Error("Error");
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config["initial"];
        this.reduOff = 3;
        this.history.length = 1;
        this.historyIndex = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var c = [];

        if(!event) {
            for (let b in this.config.states) {
                c.push(b);
            }
        } else {
            for (let d in this.config.states) {
                if (this.config.states[d].transitions[event])
                c.push(d);
            }
        }
        return c;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.length === 1 || (this.history.length > 1 && this.historyIndex === 0)) return false;
        this.state = this.history[--this.historyIndex];
        this.reduOff = 3;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.length === 1 || (this.history.length-1 == this.historyIndex) || this.reduOff === 4 ) return false;
        this.state = this.history[++this.historyIndex];
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.length = 1;
        this.historyIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
