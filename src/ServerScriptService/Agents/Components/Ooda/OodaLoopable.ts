export interface IOodaLoopable {
    OodaComponent : IOodaLoopComponent
}

export interface IOodaLoopComponent {
    Observe() : void
    Orient() : void
    Decide() : void
    Act() : void
}

export class OodaLoopComponent implements IOodaLoopComponent {
    // gather percepts
    /* Examples: 
     * - Outside information
     * - Unfolding circumstances
     * - Unfolding interaction w/ environment
     * - Implicit guidance and control (?)
     * - Feedback from previous ACT phase
     * 
     * Ex: Ground is ABOVE me
     */
    Observe(): void {
        throw "Method not implemented.";
    }    
    /* determine their (percepts/observations) meaning and assess their relation to previous decision(s)
     * Example heuristics: 
     * Genetic heritage
     * Cultural traditions
     * Analysis & synthesis of data
     * Previous/past experiences
     * New information
     * 
     * Ex: I am upside down
     *  - Upside down is good/bad/whatever
     */
    Orient(): void {
        throw "Method not implemented.";
    }
    // select from a list of behaviors
    /*
     * === Making a hypothesis about world
     * Ex: 
     * I need to be rightside up, I am going to make myself rightside up and see if that is better?
     */
    Decide(): void {
        throw "Method not implemented.";
    }
    // initiate action which was determined previously
    /* Test the hypothesis from previous Decide phase
    * Ex: Move stick to roll the aircraft
    */
    Act(): void {
        throw "Method not implemented.";
    }
}