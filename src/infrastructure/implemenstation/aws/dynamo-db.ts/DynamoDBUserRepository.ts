import { User } from 'domain/entities/User'
import { UserRepository } from 'domain/repositories/UserRepository'
import { DynamoDB } from '../../../driven-adapters/aws/aws'

export class DynamoDBUserRepository implements UserRepository {
  private readonly _db = DynamoDB.getInstance()

  async getAll (): Promise<User[]> {
    const response = await this._db.scan({
      TableName: DynamoDB.TABLE_NAME,
      FilterExpression: 'ENTITY_TYPE = :entity',
      ExpressionAttributeValues: {
        ':entity': {
          S: 'USER'
        }
      }
    }).promise()

    const items = (response.Items != null) ? response.Items : []

    const users = items.map((item: any) => {
    
      const id: string = item['USER-KEY_PK'].S ?? ''
      const name: string = item.name.S ?? ''
      const username: string = item.username.S ?? ''
      const email: string = item.email.S ?? ''
      const address: object = item.address.S ?? {}
      const geo: object = item.geo.S ?? {}
      const phone: string = item.phone.S ?? ''
      const website: string = item.website.S ?? ''
      const company: object = item.company.S ?? {}

      return {
        id: id.split('_')[1],
        name,
        username,
        email,
        address,
        geo,
        phone,
        website,
        company

      }
    })

    return users
  }

  async save (user: User): Promise<User> {
    await this._db.putItem({
      TableName: DynamoDB.TABLE_NAME,
      Item: {
        'USER-KEY_PK': {
          S: `USER_${user.id}`
        },
        'USER-KEY_SK': {
          S: `USER_${user.id}`
        },
        ENTITY_TYPE: {
          S: 'USER'
        },
        name: {
            S: user.name
        },
        username: {
          S: user.username
        },
        
        email: {
          S: user.email
        },
        address: {
          S: user.address
        },
        geo: {
          S: user.geo
        },
        phone: {
          S: user.phone
        },
        website: {
          S: user.website
        },
        company: {
          S: user.company
        }
        
      }
    }).promise()

    return user
  }

  async getByUserName (username: string): Promise<User | null> {
    const response = await this._db.scan({
      TableName: DynamoDB.TABLE_NAME,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': {
          S: username
        }
      }
    }).promise()

    const item = (response.Items !== undefined) ? response.Items[0] : undefined

    if (item === undefined) return null

      const id: string = item['USER-KEY_PK'].S ?? ''
      const name: string = item.name.S ?? ''
      const usernameItem: string = item.username.S ?? ''
      const email: string = item.email.S ?? ''
      const address: object = item.address.S ?? {}
      const geo: object = item.geo.S ?? {}
      const phone: string = item.phone.S ?? ''
      const website: string = item.website.S ?? ''
      const company: object = item.company.S ?? {}

    const user: User = {
      
      id: id.split('_')[1],
      name,
      username: usernameItem,
      email,
      address,
      geo,
      phone,
      website,
      company
    }

    return user
  }

  async update (user: User): Promise<User> {
    await this._db.updateItem({
      TableName: DynamoDB.TABLE_NAME,
      Key: {
        'USER-KEY_PK': {
          S: `USER_${user.id}`
        },
        'USER-KEY_SK': {
          S: `USER_${user.id}`
        }
      },
      UpdateExpression: 'set #username = :username, #name = :name, #email = :email, #address = :address, #geo = :geo, #phone = :phone, #website = :website, #company = :company',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#username': 'username',
        '#email' :'email', 
        '#address' :'address', 
        '#geo' :'geo', 
        '#phone' :'phone', 
        '#website'  :'website',
        '#company' :'company',
        
      },
      ExpressionAttributeValues: {
        ':name': {
            S: user.name
        },
        ':username': {
          S: user.username
        },
        ':email': {
          S: user.email
        },
        ':address': {
          S: user.address
        },
        ':geo': {
          S: user.geo
        },
        ':phone': {
          S: user.phone
        },
        ':website': {
          S: user.website
        },
          ':company': {
          S: user.company
        }
        
      }
    }).promise()

    return user
  }

  async delete (user: User): Promise<void> {
    await this._db.deleteItem({
      TableName: DynamoDB.TABLE_NAME,
      Key: {
        'USER-KEY_PK': {
          S: `USER_${user.id}`
        },
        'USER-KEY_SK': {
          S: `USER_${user.id}`
        }
      }
    }).promise()
  }

  async getById (id: string): Promise<User | null> {
    const response = await this._db.scan({
      TableName: DynamoDB.TABLE_NAME,
      FilterExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'USER-KEY_PK'
      },
      ExpressionAttributeValues: {
        ':pk': {
          S: `USER_${id}`
        }
      }
    }).promise()

    const item = (response.Items !== undefined) ? response.Items[0] : undefined

    if (item === undefined) return null

    const idItem: string = item['USER-KEY_PK'].S ?? ''
    const name: string = item.name.S ?? ''
    const usernameItem: string = item.username.S ?? ''
    const email: string = item.email.S ?? ''
    const address: object = item.address.S ?? {}
    const geo: object = item.geo.S ?? {}
    const phone: string = item.phone.S ?? ''
    const website: string = item.website.S ?? ''
    const company: object = item.company.S ?? {}


    const user: User = {
      
      id: idItem.split('_')[1],
      name,
      username: usernameItem,
      email,
      address,
      geo,
      phone,
      website,
      company
    }

    return user
  }
}