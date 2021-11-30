//import * as calc from './Calculator.mjs'
const calc =require("./Calculator")

 class Questionare_First{
	#Travel_Object=0;
	#Food_Object=0;
	#Electricity_Object=0;

	constructor(){
		this.#Travel_Object= new calc.Travel(0);
		this.#Food_Object = new calc.Food(0);
		this.#Electricity_Object = new calc.Electricity(0);
	}

	create_travel_object(t){

		var datetime = new Date();
		var today = datetime.getFullYear() + '-' + datetime.getMonth() + '-' + datetime.getDate();

		var travel_data={
			'bus'  		: t.bus,
			'taxi' 		: t.taxi,
			'train'		: t.train,
			'car'  		: t.car,
			'motorbike' : t.bike,
			'fly'  		: 138.45*2*t.flights,
			'cycling'	: 0,
			'walking'	: 0,
			'dates'		: today
		};

		var time = {
			'hour'	: t.hour,
			'minutes': t.minute,
		}

		
		this.#Travel_Object.calculate_travel_data(travel_data, time);

		return this.#Travel_Object;
	}


	create_food_object(f){

		var food_type = f.food;

		
		this.#Food_Object.calculate_food_data(food_type);

		return this.#Food_Object;

	}

	create_electricity_object(e){

		var bill = e.elec_bill;
		var member = e.no_of_member;

		
		this.#Electricity_Object.calculate_electricity_data(bill,member);

		return this.#Electricity_Object;
	}

	calculate_inputs(t){
		var emission_data = {
			'Travel'		:this.#Travel_Object,
			'Food'			:this.#Food_Object,
			'Electricity'	:this.#Electricity_Object,
		};

		var Calculation_Object = new calc.Calculation();

		Calculation_Object.initial_set_up(t.flights, emission_data);

		console.log("Inside Q");

		console.log(Calculation_Object.get_global_monthly);

		return Calculation_Object;
	}
}
 class Questionare_Second{
	#Travel_Object=0;
	#Food_Object=0;
	#Electricity_Object=0;

	constructor(user_input){
		this.#Travel_Object= new calc.Travel(0);
		this.#Food_Object = new calc.Food(0);
		this.#Electricity_Object = new calc.Electricity(user_input.electricity);
	}

	create_travel_object(t){

		var datetime = new Date();
		var today = datetime.getFullYear() + '-' + datetime.getMonth() + '-' + datetime.getDate();

		var time = {
			'hour'	: t.hour,
			'minutes': t.minute,
		}

		var travel_data={
			'bus'  		: t.bus,
			'taxi' 		: t.taxi,
			'train'		: t.train,
			'car'  		: t.car,
			'motorbike' : t.bike,
			'fly'  		: 138.45*(this.#Travel_Object.time(t.flying , time)),
			'cycling'	: 0,
			'walking'	: 0,
			'dates'		: today
		};

		this.#Travel_Object.calculate_travel_data(travel_data, time);

		return this.#Travel_Object;
	}


	create_food_object(f){

		var food_type = f.food;

		
		this.#Food_Object.calculate_food_data(food_type);

		return this.#Food_Object;

	}

	create_electricity_object(e){

		// var bill = e.elec_bill;
		// var member = e.no_of_member;

		
		// this.#Electricity_Object.calculate_electricity_data(bill,member);
		console.log("Get elec ="+this.#Electricity_Object.get_electricity_data);

		return this.#Electricity_Object;
	}

	calculate_inputs(user_input){
		var emission_data = {
			'Travel'		:this.#Travel_Object,
			'Food'			:this.#Food_Object,
			'Electricity'	:this.#Electricity_Object,
		};

		var datetime = new Date();
		var today = datetime.getFullYear() + '-' + (datetime.getMonth()+1) + '-' + datetime.getDate();


		var Calculation_Object = new calc.Calculation();

		Calculation_Object.set_so_far_this_month=user_input.so_far_this_month;



		if(user_input.dates ==  today){

			console.log("I am deleting baby");
			console.log(user_input.dates+" "+today);


			var Travel_Reduce 		= new calc.Travel(user_input.travel);
			var Food_Reduce 		= new calc.Food(user_input.food);
			var Electricity_Reduce 	= new calc.Electricity(user_input.electricity);

			var reduce_data = {
				'Travel'		:Travel_Reduce,
				'Food'			:Food_Reduce,
				'Electricity'	:Electricity_Reduce,
			}

			Calculation_Object.delete_data(reduce_data);
		}

		Calculation_Object.entry_every_day(emission_data);

		
		return Calculation_Object;
	}
}


//Unit Testing starts from here --->

//Questionare_First
// var lists = {
// 	'bus'  		: 3,
// 	'taxi' 		: 6,
// 	'train'		: 2,
// 	'car'  		: 7,
// 	'bike' 		: 7,
// 	'fly'  		: 2,
// 	'bicycle'	: 0,
// 	'walking'	: 0,
// 	'flights'	: 2,
// 	'hour'		: 3,
// 	'minute'	: 20,
// 	'food'		: "Vegan",
// 	'elec_bill' : 4000,
// 	'no_of_member': 4,
// }

// var obj = new Questionare_First();

// var t=obj.create_travel_object(lists);
// var f=obj.create_food_object(lists);
// var e=obj.create_electricity_object(lists);

// console.log("Unit test");
// console.log("Travel");
// console.log(t.get_travel_data);
// console.log(t.get_travel_details);
// console.log("Elec");
// console.log(e.get_electricity_data)
// console.log("Food");
// console.log(f.get_food_data);


// var c=obj.calculate_inputs(lists);

// console.log(c.get_so_far_this_month);
// console.log("kk");
// console.log(c.get_monthly_average);
// console.log(c.get_global_monthly);
// console.log(c.get_goal_to_reach);
// console.log(c.get_amount_to_be_reduced);


//Questionare_Second
/*var lists_forms = {
	'bus'  		: 3,
	'taxi' 		: 6,
	'train'		: 2,
	'car'  		: 7,
	'bike' 		: 7,
	'fly'  		: 2,
	'bicycle'	: 0,
	'walking'	: 0,
	'flying'	: 2,
	'hour'		: 3,
	'minute'	: 20,
	'food'		: "Vegan",
};

var lists_input = {
	'uuid' : '45a66b846c22',
	'travel': 600,
	'food': 900,
	'electricity': 10,
	'so_far_this_month': 600,
	'dates': '2021-10-12'
}

var ob = new Questionare_Second(lists_input);

var tt=ob.create_travel_object(lists_forms);
var ff=ob.create_food_object(lists_forms);
var ee=ob.create_electricity_object(lists_forms);

console.log("Travel:"+tt.get_travel_data);
console.log("Food:"+ff.get_food_data);
console.log("elec:"+ee.get_electricity_data);

var cc = ob.calculate_inputs(lists_input);

console.log("so far = " + cc.get_so_far_this_month);*/

module.exports={Questionare_First,Questionare_Second}
