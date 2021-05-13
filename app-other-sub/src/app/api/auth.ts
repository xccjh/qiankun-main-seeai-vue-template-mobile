import { service } from './requestInstant'

export const auth = {
  login (params) {
    return service.post('sys/user/login', null, { params })
  }
}
