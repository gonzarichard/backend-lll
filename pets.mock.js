import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

const generateMockPets = (count = 50)=>{
    const pets =[];

    const species =["perro", "gato", "conejo", "hamster", "loro"];

    for (let i=0; i<count;i++){
        pets.push({
            _id: new mongoose.Types.ObjectId(),
            name: faker.animal.petName(),
            specie: species[Math.floor(Math.random()*species.length)],
            birthDate: faker.date.past({years:5}),
            adopted: false,
            owner:null,
        });
    }

    return pets;

}

export default generateMockPets;