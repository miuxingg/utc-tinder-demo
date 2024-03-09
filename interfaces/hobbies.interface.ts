export interface IHobbies{
    sport: ISport,
    music: string[],
    pet: IPet,
    drink: IDrink,
    education: IEducation,
    career: string,
    zodiac: IZodiac,
    communication: ICommunication,
    things: IThings
}

export enum ISport{
    basketball = "Basketball",
    football = "Football",
    volleyball = "Volleyball",
    tennis = "Tennis",
    running = "Running",
    swimming = "Swimming",
    badminton = "Badminton",
    baseball = "Baseball",
    golf = "Golf",
    other = "Other",
    nope = "Nope"
}
export enum IPet{
    cat = "Cat",
    dog = "Dog",
    mouse = "Mouse",
    rabbit = "Rabbit", 
    hamster = "Hamster",
    bird = "Bird",
    aquarium = "Aquarium",
    turtle = "Turtle",
    reptiles = "Reptiles"   //bò sát
}
export enum IDrink{
    beer = "Beer",
    wine = "Wine",
    softdrink = "Soft drink",
    cocktail = "Cocktail",
    coffee = "Coffee",
    tea = "Tea",
    fruitjuice = "Fruit juice",
    smoothies = "Smoothies"
}
export enum IEducation{
    bachelor = "Cử nhân",
    atUniversity = "Đang học đại học",
    highSchool = "Trung học phổ thông",
    professor = "Tiến sĩ",
    afterSchool = "Đang học sau đại học",
    skillSchool = "Trường dạy nghề",
    master = "Thạc sĩ"
}
export enum IZodiac{
    aries = "Bạch Dương",
    taurus = "Kim Ngưu",
    gemini = "Song Tử",
    cancer = "Cự Giải",
    leo = "Sư Tử",
    virgo = "Xử Nữ",
    libra = "Thiên Bình",
    scorpio = "Thiên Yết",
    sagittarius = "Nhân Mã",
    capricorn = "Ma Kết",
    aquarius = "Bảo Bình",
    pisces = "Song Ngư",
}
export enum ICommunication{
    likeText = "Thích nhắn tin",
    lessText = "Ít nhắn tin",
    likeCall = "Thích gọi điện",
    lessCall = "Ít gọi điện",
    likeVideoCall = "Thích gọi video",
    lessVideoCall = "Ít gọi video",
    faceToFace = "Thích gặp mặt trực tiếp"
}
export enum IThings{
    action= "Hành động tinh tế",
    gesture = "Cử chỉ âu yếm",
    compliments = "Những lời khen",
    gift = "Những món quà",
    time = "Thời gian ở bên nhau"
}