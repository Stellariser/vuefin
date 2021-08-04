export default {
  telphone: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/g.test(
      value
    )
    if (!pass) {
      callback(new Error(rule.message || '正确格式: 区号-电话号码 或 电话号码'))
    }
    callback()
  },
  phone: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^(\\+86)?0?[1][34578][0-9]{9}$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '请输入正确的电话号码'))
    }
    callback()
  },
  email: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[a-zA-Z0-9_.-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/g.test(
      value
    )
    if (!pass) {
      callback(new Error(rule.message || '请输入正确的邮箱'))
    }
    callback()
  },
  postcode: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^\d{6}$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '必须是6位数字'))
    }
    callback()
  },
  notValidInputText: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[^'/\\"()@$%^*<>&?]*$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '不能包含特殊字符^\'\\"()@$%^*<>&?*'))
    }
    callback()
  },
  isNumber: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[0-9]*$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '只能为数字'))
    }
    callback()
  },
  ip: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g.test(
      value
    )
    if (!pass) {
      callback(new Error(rule.message || '请输入正确的ip地址'))
    }
    callback()
  },
  letterOrNumber: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[0-9a-zA-Z]+$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '只能是数字和字母'))
    }
    callback()
  },
  id: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[a-zA-Z0-9-]{3,20}$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '只能为 3-20 位字符串'))
    }
    callback()
  },
  number: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[0-9]{1,10}$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '必须是数字'))
    }
    callback()
  },
  positiveNumber: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[0-9]\d*$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '必须是正整数'))
    }
    callback()
  },
  posiNactiveNumber: (rule, value, callback) => {
    if (value === '') {
      callback()
      return
    }
    const pass = /^[+-]?\d+(\.\d+)?$/g.test(value)
    if (!pass) {
      callback(new Error(rule.message || '可输入正数负数和小数'))
    }
    callback()
  }
}
