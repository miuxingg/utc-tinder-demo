export interface IHobbies{
    sport: ISportType,
    music: string[],
    pet: IPetType,
    drink: string,
    education: string,
    career: string,
}

export enum ISportType{
    basketball = "Basketball",
    football = "Football",
    volleyball = "Volleyball",
}
export enum IPetType{
    cat = "Cat",
    dog = "Dog",
    mouse = "Mouse",
}
export enum IDrinkType{
    beer = "Beer",
    wine = "Wine",
    softdrink = "Soft drink",
}