import { User } from '../../../domain/entities/User'
import { UserRepository } from '../../../domain/repositories/UserRepository'
import { UserGetterById } from '../../../domain/services/UserGetterById'

export class UserUpdaterUseCase {
  private readonly _userResposiory: UserRepository
  private readonly _userGetterById: UserGetterById

  constructor (userRepository: UserRepository) {
    this._userResposiory = userRepository
    this._userGetterById = new UserGetterById(userRepository)
  }

  async run (data: User): Promise<User> {
    const user = await this._userGetterById.run(data.id)

    const dataToUpdate: User = {
        id: data.id,
        name: data.name ?? user.name,
        username: data.username ?? user.username,
        email:data.email ?? user.email,
        address:data.address ?? user.address,
        geo:data.geo ?? user.geo,
        phone:data.phone ?? user.phone,
        website:data.website ?? user.website,
        company:data.company ?? user.company
    }

    const userUpdated: User = await this._userResposiory.update(dataToUpdate)
    return userUpdated
  }
}