/*console.clear();*/

new Vue ({
	el: '#app',
	data: {
		valueFullPrice: 1000000,
		valueTermOfDelay: 1,
		valuePrepaidExpense: 10,
		valueFundingRate: 0.1327,

		valueMonthlyRate: 0,

		post: [],
		dollarExchangeRate: 1,
		selected: 1,
		options: [
			{text: 'Рубль', value: 1},
			{text: 'Доллар', value: 2}
		]
	},
	methods: {
	    noNumber() {
	   	
	   		
	        	console.log('11');
	      
	    }
  	},
	computed: {
	    total () {
	    return this.valueFullPrice * 10
	},
	//Берём курс валют (доллар)
	dollarRate () {
		axios.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fwww.cbr.ru%2Fscripts%2FXML_daily.asp%3F'&format=json&diagnostics=true&callback=").then(response => {
            this.posts = response.data;
            dollarExchangeRate = this.posts.query.results.ValCurs.Valute[10].Value;

            this.dollarExchangeRate = dollarExchangeRate.trim().replace(/,/,'.');
            //console.log(dollarExchangeRate);
        });
	},
	//Преобразуем курс доллара
	selectRate () {
		valueFullPrice = this.valueFullPrice;
		//Значение в select
		this.options[1].value = this.dollarExchangeRate;
	},
	//Валидаторы
	valueFullPriceValidator() {
		if(this.valueFullPrice && this.valueFullPrice > 4000000){
			this.valueFullPrice = 4000000;
		}
		if(this.valueFullPrice && this.valueFullPrice < 1000000){
			this.valueFullPrice = 1000000;
		}
	},

	valueTermOfDelayValidator() {
		if(this.valueTermOfDelay && this.valueTermOfDelay > 60){
			this.valueTermOfDelay = 60;
		}
		if(this.valueTermOfDelay && this.valueTermOfDelay < 0){
			this.valueTermOfDelay = 0;
		}
	},

	valuePrepaidExpenseValidator() {
		if(this.valuePrepaidExpense && this.valuePrepaidExpense > 50){
			this.valuePrepaidExpense = 50;
		}
		if(this.valuePrepaidExpense && this.valuePrepaidExpense < 10){
			this.valuePrepaidExpense = 10;
		}
	},

    // Расчитываем S
	PrepaidExpenseValueFullPrice(){
		BValueFullPrice = this.valueFullPrice * this.valuePrepaidExpense / 100;
		return this.valueFullPrice - BValueFullPrice;
	},

	//Месячный платёж
	MonthlyRate() {
		this.valueMonthlyRate = this.valueFundingRate / 12;
		return this.valueMonthlyRate;
	},	
	//Ежемесячный платеж без НДС
	MonthlyPaymentWithoutVAT(){
		this.valueTermOfDelay = Number(this.valueTermOfDelay);
		if(this.options.value === 1){ alert(1); }
			return (this.MonthlyRate * (1 + this.MonthlyRate) ** this.valueTermOfDelay / ((1 + this.MonthlyRate) ** this.valueTermOfDelay - 1) * this.PrepaidExpenseValueFullPrice).toFixed(2);
		
	},
	//Сумма ежемесячного платежа
	SummMonthlyPaymentWithoutVAT(){
		return (this.MonthlyPaymentWithoutVAT * this.valueTermOfDelay).toFixed(2);
	},

	//Ежемесячный платёж с НДС не пока долг с НДС
	MonthlyPaymentWithVAT(){
		this.valueTermOfDelay = Number(this.valueTermOfDelay);
		DebtWithVAT = this.PrepaidExpenseValueFullPrice * 1.18;
		return (this.MonthlyRate * (1 + this.MonthlyRate) ** this.valueTermOfDelay / ((1 + this.MonthlyRate) ** this.valueTermOfDelay - 1) * (DebtWithVAT * (this.valuePrepaidExpense / 100 * 10))).toFixed(2);
	},
	//Сумма ежемесячного платежа с НДС
	SummMonthlyPaymentWithVAT(){
		return (this.MonthlyPaymentWithVAT * this.valueTermOfDelay).toFixed(2);
	},

    //Сумма с ндс
	VAT(){
		return (this.MonthlyPaymentWithVAT - this.MonthlyPaymentWithoutVAT).toFixed(2);
	},
	SummVAT(){
		return (this.VAT * this.valueTermOfDelay).toFixed(2);
	}

  }
});