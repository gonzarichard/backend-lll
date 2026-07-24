import { Router } from "express";
import generateMockPets from "../mocks/pets.mock.js";
import generateMockUsers from "../mocks/users.mock.js";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";

const router = Router();

router.get('/mockingpets',(req, res)=>{
    const pets = generateMockPets(100);
    res.send({status: "success", payload:pets})
} ); //(migrado / creado)


/**
 * GET /api/mocks/mockingusers
 * Debe generar 50 usuarios con formato tipo Mongo
 */
router.get('/mockingusers', async(req, res)=>{
 const users = await generateMockUsers(50);
 res.send({status:"success", payload: users})
}); //(genera 50 usuarios)


/**
 * POST /api/mocks/generateData
 * body: { "users": 10, "pets": 20 }
 * Genera e INSERTA en Mongo la cantidad indicada
 */
router.post('/generateData', async(req, res)=>{
    try {
        const {users=0, pets = 0} = req.body;
        const usersQty = Number(users);
        const petsQty = Number(pets);

        if(Number.isNaN(usersQty)|| Number.isNaN(petsQty)){
            return res.status(400).send({status: "error", error: "users y pets deben ser numeros"})
        }

        const mockUsers = usersQty > 0 ? await generateMockUsers(usersQty):[];
        const mockPets = petsQty > 0 ? generateMockPets(petsQty):[];

        const insertedUsers = mockUsers.length ? await userModel.insertMany(mockUsers):[];

        const insertedPets = mockPets.length ? await petModel.insertMany(mockPets) :[];

        res.send({
            status:"success",
            message:"Datos generados e insertados",
            inserted:{
                users: insertedUsers.length,
                pets: insertedPets.length,
            },
        });
    } catch (error) {
        res.status(500).send({status:"error", error: error.message})
    }
}) //(inserta users y pets en Mongo)

export default router;