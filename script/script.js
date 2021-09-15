const root = document.documentElement;
const calcCtn = document.getElementById('calc-ctn');
const opr = document.getElementById('opr');
const log = document.getElementById('log');
const btns = document.querySelectorAll('.btn');
const numBtns = document.querySelectorAll('.num-btn');
const oprtBtns = document.querySelectorAll('.oprt-btn');
const delBtn = document.getElementById('btn-del');
const clrBtn = document.getElementById('btn-clr');
const eqlBtn = document.getElementById('btn-eql');
const dotBtn = document.getElementById('btn-dot');
const negBtn = document.getElementById('btn-neg');
const funBtn = document.getElementById('btn-fun');
const game = document.getElementById('game');
const score = document.getElementById('score');
const step = document.getElementById('step');
const target = document.getElementById('target');

var oprNum1 = 0;
var oprNum2 = 0;
var currOprt = {};
var oprResult = 0;
var onRewrite = false;
var onClear = false;
const oprMaxLength = 8;
var reg = new RegExp("^-[0-9]$");

//bad code fixing, pretty funny, will improve on next project
var addObj = {id: 'add', textContent: '+'};
var minusObj = {id: 'minus', textContent: '-'};
var mulObj = {id: 'mul', textContent: '*'};
var divObj = {id: 'div', textContent: '/'};
//---------------

//game var
var fun = false;
var numOfCals = 4;
var numsUsed = [];
var digUsed;
var oprtUsed = [];
var endResult = 0;
var splitStr = '';
var steps = 0;
var scores = 0;
//--------

add = (a,b) => a + b;
minus = (a,b) => a - b;
mul = (a,b) => a * b;
function div (a,b) {
    if (b !== 0) return a / b;
        else {
            btns.forEach((button) => {button.disabled = true;});
            calcCtn.classList.add('fadeOut');
            setTimeout(() => {calcCtn.remove()}, 3000);
            return 'dead';
        }
}

function getNumLength(num) {
    return Math.ceil(Math.log10(num + 1));
}

function roundNum(num) {
    if (getNumLength(num) >= 17) {setTimeout(clear, 500); return 'error';}
        else if (num.toString().includes('.') && num.toString().length > oprMaxLength) {
            let roundedNum = num.toFixed(oprMaxLength - getNumLength(Math.abs(num)));
            if (Math.abs(roundedNum - Math.round(roundedNum)) < 0.000001) {
                roundedNum = Math.round(roundedNum);
            }  
            return roundedNum;
        }
            else if (num.toString().length > 8) return num.toExponential(oprMaxLength - 5);
                else return oprResult;
    } // so essentially, these codes just work, i will not elaborate

function isNotEmpty(object) { for(let i in object) { return false; } return true; }

function getOprNum1() {
    oprNum1 = Number(opr.textContent);
}

function getOprNum2() {
    oprNum2 = Number(opr.textContent);
}

function addNumToOpr(e) {
    addNum(e.target.textContent);
}

function addNum(num) {
    if (onClear === true) {clear(); onClear = false;}
    if (opr.textContent === '0' || opr.textContent === '-0' || onRewrite === true) {
        if (opr.textContent.includes('-')) opr.textContent = '-' + num; 
            else opr.textContent = num; 
        if (onRewrite === true && !isNotEmpty(currOprt)) opr.textContent = opr.textContent.replace('-', '');
        onRewrite = false;
    }
        else if (opr.textContent.length < oprMaxLength) opr.textContent += num;
            else return;
        
}

function addDotToOpr() {
    if (!opr.textContent.includes('.')){
    if (onClear === true) {clear(); onClear = false;}
    if (onRewrite === true) {
        if (opr.textContent.includes('-')) opr.textContent = '-0.'; 
            else opr.textContent = '0.';
        onRewrite = false;
    }
        else opr.textContent += '.';
} else return;
}

function addOprt(oprt) {
    currOprt = oprt;
}

function resetCurrOprt() {
    currOprt = {};
}

function clearOprDisplay() {
    opr.textContent = 0;
}

function updateLog(e) {
    log.textContent = oprNum1 + ' ' + currOprt.textContent;
}

function resetResult() {
    oprResult = 0;
}

function displayResult() {
    log.textContent = oprNum1 + ' ' + currOprt.textContent + ' ' + oprNum2;
    opr.textContent = oprResult;
}

function calc() {
    oprResult = window[currOprt.id](oprNum1, oprNum2);
}

function clear() {
    opr.textContent = '0';
    log.textContent = '';
    oprNum1 = 0;
    oprNum2 = 0;
    currOprt = {};
    oprResult = 0;
    if (fun) {steps = 0; step.textContent = 'Steps: 0';}
}

function del() {
    if (opr.textContent === '-0') opr.textContent = '0';
        else if (reg.test(opr.textContent)) opr.textContent = '-0';
            else if (opr.textContent.length === 1) opr.textContent = '0';
                else opr.textContent = opr.textContent.substr(0, opr.textContent.length - 1);    
}

function oprBtnClick(e) {
    oprBtnFnc(e.target);
}

function oprBtnFnc (oprt) {
    if (onClear === true) onClear = false;
    if (oprt !== currOprt && !isNotEmpty(currOprt) && onRewrite === true) {
        addOprt(oprt);
        updateLog();
    } else {
    if (isNotEmpty(currOprt)) {
        getOprNum1();
        addOprt(oprt);
        updateLog();
        onRewrite = true;
    }   else {
            getOprNum2();
            calc();
            oprResult = roundNum(oprResult);
            displayResult(); 
            if (oprResult !== 'dead'){
                getOprNum1();
                addOprt(oprt);
                updateLog();
                onRewrite = true;
            }
    }
}
if (fun) {
    if (opr.textContent == endResult) {
        if (steps < 4) scores += 3;
            else if (steps < 7) scores += 2;
                else scores += 1;
        score.textContent = 'Score: ' + scores;
        initGame();
    } else { steps++; step.textContent = 'Steps: ' + steps;}
}       
}

function eqlBtnClick () {
    if (!isNotEmpty(currOprt)) {
        getOprNum2();
        calc();
        oprResult = roundNum(oprResult);
        displayResult();    
        resetCurrOprt();
        onClear = true;
    }   else return;
}

function togNegToOpr() {
    if (onRewrite === true) {opr.textContent = '-' + 0; onRewrite = false;}
        else if (!opr.textContent.includes('-'))  opr.textContent = '-' + opr.textContent;
            else opr.textContent = opr.textContent.replace('-', '');
}

function mouseOver(e) {
    root.style.setProperty('--neon-random', `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%`);
    e.target.classList.add('hover')
}

function mouseLeave(e) {
    e.target.classList.remove('hover');
}

function keyDown(e) {
    if (e.key >= 0 && e.key <= 9) addNum(e.key);
    if (e.key == '+') oprBtnFnc(addObj);
    if (e.key == '-') oprBtnFnc(minusObj);
    if (e.key == '*') oprBtnFnc(mulObj);
    if (e.key == '/') oprBtnFnc(divObj);
    if (e.key == '=' || e.key == 'Enter') eqlBtnClick();
    if (e.key == '.') addDotToOpr();
    if (e.key == 'Backspace') del();
    if (e.key == 'Escape' || e.key == 'Delete') clear();
    if (e.key == '`') togNegToOpr();
}


function getKeyDown(e) {
    console.log(e.key);
}

btns.forEach((button) => {    
    button.addEventListener('mouseover', mouseOver);
    button.addEventListener('mouseleave', mouseLeave);
});

window.addEventListener('keydown', keyDown)
numBtns.forEach((button) => {button.addEventListener('click', addNumToOpr);});
oprtBtns.forEach((button) => {button.addEventListener('click', oprBtnClick);})
clrBtn.addEventListener('click', clear);
delBtn.addEventListener('click', del);
eqlBtn.addEventListener('click', eqlBtnClick);
dotBtn.addEventListener('click', addDotToOpr);
negBtn.addEventListener('click', togNegToOpr);
funBtn.addEventListener('click', () => {
    if (scores > 0) {scores--; score.textContent = 'Score: ' + scores}; 
    initGame();
});

root.style.setProperty('--neon-random0', `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%`);

function enableBtn(btn) {
    if (btn.disabled) {
        btn.disabled = false; 
        btn.classList.remove('disabled'); 
        btn.addEventListener('mouseover', mouseOver);
        btn.addEventListener('mouseleave', mouseLeave);
    }
}

function disableBtn(btn) {
    if (!btn.disabled) {
        btn.disabled = true; 
        btn.classList.add('disabled');
        btn.classList.remove('hover');  
        btn.removeEventListener('mouseover', mouseOver);
        btn.removeEventListener('mouseleave', mouseLeave);}
}

function initGame() {
    if (!fun) {fun = true; game.style = 'display: flex'};
    clear();
    for (let i = 0; i < numOfCals; i++) {
        numsUsed[i] = Math.floor(Math.random() * 99 + 1);
        splitStr = splitStr.concat(numsUsed[i].toString());
        if (i === 0) endResult = numsUsed[i];
        if (i !== 0) {
            switch (Math.floor(Math.random() * 4)) {
                case 0: {oprtUsed[i] = 'add'; break;}
                case 1: {oprtUsed[i] = 'minus'; break;}
                case 2: {oprtUsed[i] = 'mul'; break;}
                case 3: {
                    if (endResult % numsUsed === 0) {oprtUsed[i] = 'div'; break;}
                        else switch (Math.floor(Math.random() * 3)) {
                            case 0: {oprtUsed[i] = 'add'; break;}
                            case 1: {oprtUsed[i] = 'minus'; break;}
                            case 2: {oprtUsed[i] = 'mul'; break;}
                        }
                }
            }
        }
        if (i!==0) endResult = window[oprtUsed[i]](endResult, numsUsed[i]);
    }
    target.textContent = 'Target: ' + endResult;
    digUsed = [...new Set(splitStr)];
    splitStr = '';
    btns.forEach((btn) => disableBtn(btn));
    for (let i = 0; i < digUsed.length; i++) {
        btns.forEach((btn) => {if (btn.textContent === digUsed[i]) {enableBtn(btn)}});
    }
    for (let i = 1; i < oprtUsed.length; i++) {
        btns.forEach((btn) => {if (btn.id === oprtUsed[i]) {enableBtn(btn)}});
    }
    enableBtn(clrBtn);
    enableBtn(funBtn);
}