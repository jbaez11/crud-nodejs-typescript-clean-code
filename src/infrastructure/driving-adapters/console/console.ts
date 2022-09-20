import path from 'path'
import * as dotenv from 'dotenv'
import { User } from '../../../domain/entities/User'
import { UserCreatorUseCase } from '../../../application/usecases/userCreator'
import { DynamoDBUserRepository } from '../../implemenstation/aws/dynamo-db.ts/DynamoDBUserRepository'
import { UserGetterUseCase } from '../../../application/usecases/userGetter'
import { UserUpdaterUseCase } from '../../../application/usecases/userUpdte'
import { UserDeleterUseCase } from '../../../application/usecases/UserDeleter'
(async () => {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../.env')
  })
  const dynamoDBUserRepo = new DynamoDBUserRepository()

  // Creando usuarios
  const userCreatorUseCase = new UserCreatorUseCase(dynamoDBUserRepo)
  const userToCreate: User = {
    name: 'Jonathan',
    username: 'Jonathan10',
    email:'jbaez9910@gmail.com',
    address:{
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874",
    },
    geo:{
        "lat": "-37.3159",
        "lng": "81.1496"
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    },
    id: '1'
  }

  await userCreatorUseCase.run(userToCreate)

  // Obteniendo usuarios
  const userGetterUseCase = new UserGetterUseCase(dynamoDBUserRepo)
  const usersReturned = await userGetterUseCase.run()
  console.log(usersReturned)

  // Actualizar usuarios
  const userUpdaterUseCase = new UserUpdaterUseCase(dynamoDBUserRepo)

  await userUpdaterUseCase.run({
    id: '1',
    username: 'jonathan stiven'
  })

  const usersReturned2 = await userGetterUseCase.run()
  console.log(usersReturned2)

  // Eliminar un usuario
  const userDeleterUseCase = new UserDeleterUseCase(dynamoDBUserRepo)
  await userDeleterUseCase.run('1')

  const usersReturned3 = await userGetterUseCase.run()
  console.log(usersReturned3)
})()