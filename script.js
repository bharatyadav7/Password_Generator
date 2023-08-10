const inputSlider = document.querySelector("[dataLengthSlider]");
const lengthDisplay = document.querySelector("[dataLengthNo]");
const passDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector(".circle");
const generateBtn = document.querySelector(".generate-btn");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+=-\|{}[]:";<>?,./';

let password = "";
let passLength = 10;
let checkCount= 0;
handleSlider();
setIndicator("#ccc");

//set password length or print the password
function handleSlider(){
    inputSlider.value=passLength;
    lengthDisplay.innerText=passLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passLength - min) * 100 / (max - min)) + "% 100%";
    
}
//tells about the password strength
function setIndicator(color){
     indicator.style.backgroundColor = color;
     indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}
//provide random numbers betwwen 0-1
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min))+min;
}
//generate number b/w 0-9
function generateRndNumber(){
    return getRndInteger(0,9);
}
//generate small alphabet a-z and string.fromcharcode turns int to string 
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
}
//generate small alphabet A-Z
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
//generate small alphabet `@#$%^&* etc
function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
//Calulate the strength of password and putting color to the strength circle
function calcStrength(){
    let hasUpper =false;
    let hasLower =false;
    let hasNum =false;
    let hasSym =false;

    if(uppercase.checked) hasUpper=true;
    if(lowercase.checked) hasLower=true;
    if(numbers.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if (hasUpper && hasLower && (hasNum||hasSym) && passLength>=8){
        setIndicator("#0f0");
    }else if(
        (hasUpper||hasLower)&&
        (hasNum||hasSym)&&
        passLength>=6)
        {
            setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}
//After copy passwaord copied font active and visible on UI
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}
//Password suffle
function shufflePassword(array){
    //By Fisher Yates Method
    for (let i =array.length -1; i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp =array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;
}
//how many checkbox is checked and and if checked checkbox is less then passlenth equal to box
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
          checkCount++;
    });

    //special Condition
    if(passLength<checkCount){
        passLength=checkCount;
        handleSlider();
    }
}
//event listener on checkbox
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passDisplay.value);
    copyContent();
});

generateBtn.addEventListener('click',()=>{
//none of the checkboxx are selected
    if(checkCount == 0) 
    return;

    if(passLength<checkCount){
        passLength=checkCount;
        handleSlider();
    };
//lets find new passward

 //remove old pass
    password="";

//lets put the stuff mentioned in the checkbox

    let funarr=[];

    if(uppercase.checked)
       funarr.push(generateUpperCase);
    if(lowercase.checked)
       funarr.push(generateLowerCase);
    if(numbers.checked)
       funarr.push(generateRndNumber);
    if(symbolsCheck.checked)
       funarr.push(generateSymbol); 

//compulsory Addition
    
    for(let i=0;i<funarr.length;i++){
        password += funarr[i]();
    }
    
//remaining Addition

    for(let i=0;i<passLength-funarr.length;i++){
        let randIndex = getRndInteger(0,funarr.length);
        password += funarr[randIndex]();
    }
   
//shuffle password

    password= shufflePassword(Array.from(password));

//show in UI

    passDisplay.value=password;

//calculate strength

    calcStrength();
});