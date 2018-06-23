//
// ------------ Array Utility -------------------------------------
//
/**
 * Returns random integer from 0 up to (but not including) the max number.
 */
function randomInt(maxInt) {
    return Math.floor(Math.random() * maxInt);
}
function getRandom(array) {
    return array[randomInt(array.length)];
}
function popRandom(array) {
    return array.splice(randomInt(array.length))[0];
}
function roundRobin(array, callback) {
    const arrayLength = array.length;
    for (let i = 0, len = arrayLength - 1; i < len; i += 1) {
        for (let k = i + 1, kLen = arrayLength; k < kLen; k += 1) {
            callback(array[i], array[k]);
        }
    }
}
function loopArray(array, callback) {
    for (let i = array.length - 1; i >= 0; i -= 1) {
        callback(array[i], i, array);
    }
}
//
// ------------ Array wrapper -----------------------------
//
/// <reference path="ArrayUtility.ts" />
class ArrayWrapper {
    constructor() {
        this.array = [];
    }
    get length() {
        return this.array.length;
    }
    get(index) {
        return this.array[index];
    }
    push(element) {
        this.array.push(element);
    }
    pop() {
        return this.array.pop();
    }
    loop(callback) {
        loopArray(this.array, callback);
    }
}
//
// ------------ Steppable -----------------------------
//
/// <reference path="ArrayWrapper.ts" />
class SteppableArray extends ArrayWrapper {
    static stepFunction(value) {
        value.step();
    }
    step() {
        this.loop(SteppableArray.stepFunction);
    }
}
//
// ------------ Drawable -----------------------------
//
/// <reference path="ArrayWrapper.ts" />
class DrawableArray extends ArrayWrapper {
    static drawFunction(value) {
        value.draw();
    }
    draw() {
        this.loop(DrawableArray.drawFunction);
    }
}
//
// ------------ Sprite -------------------------------------
//
/// <reference path="ArrayWrapper.ts" />
/// <reference path="Steppable.ts" />
/// <reference path="Drawable.ts" />
class SpriteArray extends ArrayWrapper {
    constructor() {
        super(...arguments);
        this.draw = DrawableArray.prototype.draw;
        this.step = SteppableArray.prototype.step;
    }
}
//
// --------- ShapeColor (Composite of fill & stroke) -------------
//
class AbstractShapeColor {
    static createAlphaColorArray(c) {
        const array = [];
        for (let alphaValue = 0; alphaValue <= 255; alphaValue += 1) {
            array.push(color(red(c), green(c), blue(c), alpha(c) * alphaValue / 255));
        }
        return array;
    }
}
class ShapeColor extends AbstractShapeColor {
    constructor(strokeColor, fillColor) {
        super();
        this.strokeColorArray = AbstractShapeColor.createAlphaColorArray(strokeColor);
        this.fillColorArray = AbstractShapeColor.createAlphaColorArray(fillColor);
    }
    apply(alphaValue = 255) {
        const index = Math.floor(constrain(alphaValue, 0, 255));
        stroke(this.strokeColorArray[index]);
        fill(this.fillColorArray[index]);
    }
}
class NoStrokeShapeColor extends AbstractShapeColor {
    constructor(fillColor) {
        super();
        this.fillColorArray = AbstractShapeColor.createAlphaColorArray(fillColor);
    }
    apply(alphaValue = 255) {
        noStroke();
        const index = Math.floor(constrain(alphaValue, 0, 255));
        fill(this.fillColorArray[index]);
    }
}
class NoFillShapeColor extends AbstractShapeColor {
    constructor(strokeColor) {
        super();
        this.strokeColorArray = AbstractShapeColor.createAlphaColorArray(strokeColor);
    }
    apply(alphaValue = 255) {
        const index = Math.floor(constrain(alphaValue, 0, 255));
        stroke(this.strokeColorArray[index]);
        noFill();
    }
}
class NullShapeColor extends AbstractShapeColor {
    apply() { }
}
//
// ------------ Frame counter -----------------------------
//
class FrameCounter {
    constructor() {
        this.count = 0;
    }
    static initializeStatic(frameRate) {
        this.frameRate = frameRate;
    }
    reset() {
        this.count = 0;
    }
    increment() {
        this.count += 1;
    }
    mod(divisor) {
        return this.count % divisor;
    }
    /**
     * Returns ratio from 0 to 1 according to current frame count and given frequency per second.
     * @param frequency {number} - frequency per second
     */
    getCycleProgressRatio(frequency) {
        return ((frequency * this.count) % FrameCounter.frameRate) / FrameCounter.frameRate;
    }
    /**
     * Returns sine value (from 0 to 1)according to
     * current frame count and given frequency per second.
     * @param frequency {number} - frequency per second
     */
    sin(frequency = 1) {
        return Math.sin(this.getCycleProgressRatio(frequency) * TWO_PI);
    }
}


class TimedFrameCounter extends FrameCounter {
    constructor(on, duration = 0, completeBehavior = () => { }) {
        super();
        this.isOn = on;
        this.isCompleted = false;
        this.completeBehavior = completeBehavior;
        this.durationFrameCount = duration;
    }
    on(duration) {
        this.isOn = true;
        if (duration)
            this.durationFrameCount = duration;
    }
    off() {
        this.isOn = false;
    }
    step() {
        if (!this.isOn)
            return;
        this.count += 1;
        if (this.count > this.durationFrameCount) {
            this.isCompleted = true;
            this.isOn = false;
            this.completeBehavior();
        }
    }
    getProgressRatio() {
        if (this.durationFrameCount)
            return constrain(this.count / this.durationFrameCount, 0, 1);
        else
            return 0;
    }
}
