export default class TreeCountStatistic {

    constructor() {
        this.kind2count = {};
    }

    increment(kind) {
        if (!this.kind2count.hasOwnProperty(kind))
            this.kind2count[kind] = 0;
        this.kind2count[kind]++;
    }


    total() {
        let rv = 0;
        for (var kind in this.kind2count) {
            if (Object.prototype.hasOwnProperty.call(this.kind2count, kind)) {
                rv += this.kind2count[kind];
            }
        }
        return rv;
    }

    toDetailBreakdownString() {
        const rv = [];
        for (var kind in this.kind2count) {
            if (Object.prototype.hasOwnProperty.call(this.kind2count, kind)) {
                rv.push(`${this.kind2count[kind]} ${kind}`);
            }
        }
        return rv.join(', ');
    }

}
