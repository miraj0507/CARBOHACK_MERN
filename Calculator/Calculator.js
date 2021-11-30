 class Travel{
    #travel=0;
    #t_d={};
    constructor(t){
        this.#travel=t;
    }
    
    //Getter
    get get_travel_data(){
        return this.#travel;
    }

    get get_travel_details(){
        return this.#t_d;
    }

    //To calculate time for each medium as per percentage given
    //variable 't' is dictionary of 'hour' and 'minutes' to represent total time 
    time(percent, t){
        return ((percent/10)*((t.hour*60 + t.minutes )/60))
    }


    //to calculate the total travel emission
    //here travel_data is dictionary contain emission from various mode of transport
    //variable 't' is dictionary of 'hour' and 'minutes' to represent total time 
    calculate_travel_data(travel_data, t){
        
        var fly= travel_data.fly //This formula is hard-coded in Questionare_Second : 138.45*(this. time(travel_data.fly , t));

        var car = 0.23*35*(this. time(travel_data.car ,t));

        var train = 0.035*80*(this. time(travel_data.train ,t));

        var bus = 0.5*35*(this. time(travel_data.bus, t))/20;

        var motorbike = 0.23*40*(this. time(travel_data.motorbike, t));

        var bicycle=0;
        var walking=0;

        var taxi = 0.23*30*(this. time(travel_data.taxi ,t));
        travel_data.car = car;
        travel_data.train=train;
        travel_data.bus=bus;
        travel_data.motorbike=motorbike;
        travel_data.taxi=taxi;
        this.#travel = car+train+bus+motorbike+taxi+fly;
        this.#t_d = travel_data;
    }
}


 class Food{
    #food=0;

    constructor(f){
        this.#food=f;
    }

    //Getter
    get get_food_data(){
        return this.#food;
    }

    //to calculate food data as per food choice
    calculate_food_data(food_choice){

        if (food_choice == "Vegan")
            this.#food=2.89;
        else if(food_choice=="Vegetarian")
            this.#food=3.81;
        else if(food_choice=="Pescatarian")
            this.#food=3.91;
        else if(food_choice=="low meat")
            this.#food=4.67;
        else if (food_choice=="lots of meat")
            this.#food=7.19;
            
    }
}

 class Electricity{
    #elec=0;
    constructor(e){
        this.#elec=e;
    }

    //Getter
    get get_electricity_data(){
        return this.#elec;
    }

    //To calculate electricity data from given data
    calculate_electricity_data(spend, no_of_people){
        spend = spend/no_of_people;
        this.#elec=spend*0.42/(30*6);
    }
}


 class Calculation{
    #x=0; // CO2 so far this month
    #avg=0;//Monthly average
    #g=200; //Global ;optimal ; monthly; individual
    #goal=0; // Goal to reach
    #r=0; // Amount to be reduced
    #summ=0//sum of CO2 emission since the month user opened the acc.
    
    constructor(){
        this.#x=0;
        this.#summ=0;
    }

    //Setters
    set set_so_far_this_month(val)
    {
        this.#x=val;
    }
    
    set set_emission_till_now(val)
    {
        this.#summ=val;
    }



    //Getters
    get get_so_far_this_month(){
        return this.#x;
    }

    get get_monthly_average(){
        return this.#avg;
    }

    get get_global_monthly(){
        return this.#g;
    }

    get get_goal_to_reach(){
        return this.#goal;
    }

    get get_amount_to_be_reduced(){
        return this.#r;
    }

    get get_total_co2(){
        return this.#summ;
    }


    //Business Logic

    //To calculate the goal
    #goal_selector(){
        if (this.#avg > this.#g){
            this.#goal=this.#g;
            this.#r=this.#avg - this.#g;
        }
        else
        {
            this.#goal=this.#avg;
            this.#r=0;
        }
        
    }


    //To calculate all values at initial set up
    //emission_data is dictionary of objects of Travel, Food and Electricity class
    initial_set_up(flight, emission_data)
    {
        var fly= 138.45*2*flight; // this formula is also hard-coded in the Questionare_First.create_travel_object
        this.#avg=(emission_data.Travel.get_travel_data + emission_data.Food.get_food_data + emission_data.Electricity.get_electricity_data)*30 + fly/12;
        
        this.#summ = this.#avg

        var datetime = new Date();
        var date= datetime.getDate() - 1;

        this.#x=(this.#avg/30)*date;


        this.#goal_selector();
    }


    //To store revised every_data, we must delete previous data
    delete_data(emission_data){
        this.#x=this.#x - ((emission_data.Travel.get_travel_data + emission_data.Food.get_food_data + emission_data.Electricity.get_electricity_data))
    }

    //To store every_day_data MANUAL
    entry_every_day(emission_data){

	   this.#x = this.#x + ((emission_data.Travel.get_travel_data + emission_data.Food.get_food_data + emission_data.Electricity.get_electricity_data))
    }

    //To store every_day_data AUTOMATED
    automated_every_day(){
        this.#x=2*this.#x;
    }
    
    /*
	only called on the first month
	*/
    first_month()
    {
        this.#summ = this.#summ + this.#x
        this.#avg = this.#summ/2;
        this.#x=0;

        this.#goal_selector();
    }


    /*
    To calculate number of month spend on the app
    */
    #calculate_month_spend(){
        //TODO: Get creation data from database
        var creation_month=0;
        var creation_year=0;

        var datetime = new Date();
        var current_month = datetime.getMonth();
        var current_year = datetime.getFullYear();
        
        var month_spend=0;

        if(current_year==creation_year)
            month_spend= current_month - creation_month;
        else
            month_spend=(12-creation_month) + (current_year - creation_year - 1)*12 + current_month;

        return month_spend;
    }

    /*
        This function will be called 1st of every month
        to calculate global values
    */
    first_of_every_month(){
        //must take the creation date as parameter
        month=this. #calculate_month_spend(); // from calculate_month()

        this.#summ = this.#summ+this.#x;

        this.#avg = this.#summ/(month+1);

        this.#x=0;

        this.#goal_selector();
    }

}

module.exports = {Travel,
    Food,
    Electricity,
    Calculation}

//Unit Testing Starts from here ---->
// const a = new Calculation(5,10);
// a.first_month();
// console.log(a.so_far_this_month);
// console.log(a.monthly_average);

// console.log(a.global_monthly);
// console.log(a.goal_to_reach);
// console.log(a.amount_to_be_reduced);
