//SAVE API LINK
const APIweather = 'https://api.openweathermap.org/data/2.5/weather?'
const APIgeo = 'http://api.openweathermap.org/geo/1.0/direct?'
const APIalpha = 'https://world-countries.p.rapidapi.com/all'
const APIS = {APIalpha, APIgeo, APIweather}
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3e00039235msh040b859b12ea92bp1475c7jsnfc19a52d032d',
		'X-RapidAPI-Host': 'world-countries.p.rapidapi.com'
	}
};
//GET HTML ITEMS
const btn = document.querySelector('.searchbtn')
const input = document.querySelector('.search')
const mainBox = document.querySelector('main')
const errorText = document.querySelector('.search__error')
//CALL

//REQUEST STRUCTURE
async function fetchData(urlApi){
    let response
    if(urlApi=="https://world-countries.p.rapidapi.com/all"){
         response = await fetch(urlApi, options)
    }
    else{
        response = await fetch(urlApi)
    }
    const data = await response.json()
    return data
}
//CALLS
async function call(allAPIS, userInput){
    //VALIDATE THE INPUT
    let userInputArray 
    if (userInput.includes(',')){
        let indexOfComma=userInput.indexOf(',')
        //IF THERE IS NOT A BLANK SPACE NEX TO THE COMMA, ADD IT
        if(userInput[indexOfComma+1]!=' '){
            userInput=userInput.replace(',',', ')
        }
        userInputArray= userInput.split(', ')
    }
    //IF THERE IS NO COMMA, JUST PUT THE TEXT IN AN ARRAY
    else{
        userInputArray=[userInput]
    }
    //REMOVE SPACES AND COMMAS
    for(let i=0; i<userInputArray.length; i++){
        if(userInputArray[i].includes(',')){
            userInputArray[i]=userInputArray[i].replace(',','')
        }
        userInputArray[i]=userInputArray[i].trimEnd()
        userInputArray[i]=userInputArray[i].trimStart()
    }

    //USING THE INPUT
    let geoResponse
    let country = userInputArray[1]
    let city = userInputArray[0]
    //CALL THE API USING ALPHACODE OR NOT
    //IF USER TYPES CITY AND COUNTRY
    if(userInputArray.length==2){
        const alphaResponse = await fetchData(allAPIS.APIalpha)
        let alphaCode = getAlphaCode(alphaResponse, country)
        geoResponse = await fetchData(`${allAPIS.APIgeo}q=${city},${alphaCode}&appid=38dc05b1ec28448bbd96deb0298270be`)
    }
    // IF USER ONLY TYPES THE CITY
    else{
        geoResponse = await fetchData(`${allAPIS.APIgeo}q=${city}&appid=38dc05b1ec28448bbd96deb0298270be`)
    }
    // CHECK IF LOCATION FOUNDED OR NOT
    if(geoResponse.length==0){
        errorText.classList.remove('inactive')
    }
    else{
        errorText.classList.add('inactive')
        let geoData = geoResponse[0]
        lat = geoData.lat
        lon = geoData.lon
        const weatherResponse = await fetchData(`${allAPIS.APIweather}lat=${lat}&lon=${lon}&units=metric&appid=38dc05b1ec28448bbd96deb0298270be`)
        
        //SAVE STRUCTURE AND NECESSARY MODIFIED 
        let cardTemp = weatherResponse.main.temp.toString().substring(0, 2)
        let cardImageLink = `https://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}@2x.png`
        let structure = `<figure class="closeBox closeAction"><img class="card__close closeAction" src="./assets/cerrar.png" alt="close"></figure>
        <h2 class="city">${geoData.name}</h2>
        <h3 class="country">${geoData.country}</h3>
        <p class="temp">${cardTemp}</p>
        <div class="imageBox">
            <img src="${cardImageLink}" alt="weather state image" class="card__stateImg">
        </div>
        <p class="card__main">${weatherResponse.weather[0].main}s</p>
        <p class="card__description">${weatherResponse.weather[0].description}</p>`
    
        //CREATE PARENT, ADD STRUCTURE, ADD PARENT TO HTML
        let cardNode = document.createElement('div')
        cardNode.innerHTML=structure
        cardNode.classList.add('card')
        mainBox.append(cardNode)

        //ADD THE CLOSE FEATURE
        
        

    }
}
//GET SPECIFIC ALPHA CODE
function getAlphaCode(allCountries, input){
    let alphaCode
    allCountries.filter(index=>{if(index.en.toLowerCase()==input.toLowerCase()){
        alphaCode = index.alpha2
    }})
    return alphaCode
}
//ASSIGN EVENT TO ELEMENTS

btn.addEventListener('click', (event)=>{
    let userInput = event.target.parentElement.children[0].value
    call(APIS, userInput)
})
input.addEventListener('keyup', (event)=>{
    if(event.keyCode===13){
        let userInput = event.target.parentElement.children[0].value
        call(APIS, userInput)
    }
})
mainBox.addEventListener('click', (event)=>{
    if(event.target.classList.contains('closeAction')){
        let currentNode = event.target
        while(currentNode.parentElement.className!='target'){
            currentNode=currentNode.parentElement
        }
        let parent = currentNode.parentElement
        let node = currentNode
        parent.removeChild(node)
    }
})
