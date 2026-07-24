import { faker, ro } from "@faker-js/faker";
import mongoose from "mongoose";
import { createHash } from "../utils/index.js";

const generateMockUsers = async(count =50) =>{
    const users = [];
    for(let i=0; i <count; i++){
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();



        //email es el unico con true unique:true
        const email = faker.internet.email({firstName:first_name, lastName:last_name}).toLocaleLowerCase();

        const password = await createHash("coder123");
        const role = Math.random() <0.5? "user" : "admin";

        users.push({
            _id:new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            email,
            password,
            role,
            pets:[],
            __v:0
        });

    }

    return users;
}

export default generateMockUsers;