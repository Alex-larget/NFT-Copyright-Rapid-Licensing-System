import Mock from 'mockjs'

// 模拟用户列表数据
Mock.mock('/api/users', 'get', {
  'list|10': [{
    'id|+1': 1,
    'name': '@cname',
    'age|18-60': 1,
    'email': '@email'
  }]
})

// 模拟登录接口
Mock.mock('/api/login', 'post', {
  'code': 200,
  'message': '登录成功',
  'token': '@guid'
})

export default Mock 