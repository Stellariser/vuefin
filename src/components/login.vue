<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/img.png" alt="">
      </div>
      <!--登陆表单区-->
      <div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
          <!--用户名-->
          <el-form-item prop="username">
            <el-input v-model="loginForm.name" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
          </el-form-item>
          <!--按钮-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登陆表单的数据绑定对象
      loginForm: {
        name: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 将登陆成功后的token保存到客户端的sessionStorage中，项目中除了登陆之外的api接口只能在登陆之后访问，token只能在当前网页打开期间生效，所以将token保存在sessionStorage中
        console.log(res)
        window.sessionStorage.setItem('token', res.meta.token)
        // 发生页面跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #00428f;
  height: 100%;
}

.login_box{
  width:450px;
  height:300px;
  background-color: #fff;
  border-radius:3px;
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);

.avatar_box{
    height:180px;
    width:180px;
    border: 1px solid #ffffff;
    padding:10px;
    border-radius: 80%;
    background-color: #ffffff;
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  img{
    height:70%;
    width:70%;
    border-radius: 80%;
  }

  }
.btns{
  display: flex;
  justify-content: flex-end;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding:0 20px ;
    box-sizing: border-box;
  }
}
</style>
