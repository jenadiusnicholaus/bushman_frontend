import { sleep } from '../../services/utils'
import { User, ClientObserver } from './../../pages/users/types'
// import usersDb from './users-db.json'
// import projectsDb from './projects-db.json'
// import { Project } from '../../pages/projects/types'
import axios from 'axios'

// export const users = usersDb as User[]

// const getUserProjects = (userId: number | string) => {
//   return projectsDb
//     .filter((project) => project.team.includes(Number(userId)))
//     .map((project) => ({
//       ...project,
//       project_owner: users.find((user) => user.id === project.project_owner)!,
//       team: project.team.map((userId) => users.find((user) => user.id === userId)!),
//       status: project.status as Project['status'],
//     }))
// }

// Simulate API calls

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof User | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean
  search: string
}

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'projects') {
    return obj.projects.map((project: any) => project.project_name).join(', ')
  }

  return obj[sortBy]
}

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const { isActive, sortBy, sortingOrder } = filters
  // let filteredUsers: any[] = []

  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_OBSERVER_VSET_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await axios.request(config)
  if (response.status === 200) {
    const data = response.data

    console.log(data)
    // let observers = data.map((user) => ({ ...user, projects: getUserProjects(user.id) }))
    // console.log(filteredUsers)

    let observers = data.filter((cobserver: ClientObserver) => cobserver.user.is_active === isActive)
    console.log(observers)
    // if (search) {
    //   // observers = filteredUsers.filter((user) => user.fullname.toLowerCase().includes(search.toLowerCase()))
    // }

    // filteredUsers = filteredUsers.map((user) => ({ ...user, projects: getUserProjects(user.id) }))

    if (sortBy && sortingOrder) {
      observers = observers.sort((a: any, b) => {
        const first = getSortItem(a, sortBy)
        const second = getSortItem(b, sortBy)
        if (first > second) {
          return sortingOrder === 'asc' ? 1 : -1
        }
        if (first < second) {
          return sortingOrder === 'asc' ? -1 : 1
        }
        return 0
      })
    }

    const { page = 1, perPage = 10 } = filters || {}
    return {
      data: observers.slice((page - 1) * perPage, page * perPage),
      pagination: {
        page,
        perPage,
        total: observers.length,
      },
    }
  }
  return {
    data: [],
    pagination: {
      page: 1,
      perPage: 10,
      total: 0,
    },
  }
}

export const addUser = async (user: User) => {
  await sleep(1000)
  users.unshift(user)
}

export const updateUser = async (user: User) => {
  await sleep(1000)
  const index = users.findIndex((u) => u.id === user.id)
  users[index] = user
}

export const removeUser = async (user: User) => {
  await sleep(1000)
  users.splice(
    users.findIndex((u) => u.id === user.id),
    1,
  )
}
