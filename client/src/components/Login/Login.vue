<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title">用户资金管理系统</span>
                <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="60px" class="loginForm">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="loginUser.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="loginUser.password" placeholder="请输入密码" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                        <el-button @click="resetForm('loginForm')">重置</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p>还没有账号？现在<router-link :to="{name: 'register'}">注册</router-link></p>
                    </div>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'

export default {
  data() {
    return {
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 30,
            message: "密码长度6~30之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/users/login", this.loginUser)
            .then(res => {

              const { token } = res.data;

              localStorage.setItem("eleToken", token);

              const decoded = jwt_decode(token);

              this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded));
              this.$store.dispatch('setUser', decoded);

              this.$message({
                showClose: true,
                message: "登录成功！",
                type: "success"
              });
              this.$router.push("/index");
            })
            .catch(err => {
              if (err.response.data.email) {
                return this.$message({
                  showClose: true,
                  message: err.response.data.email,
                  type: "error"
                });
              }
              this.$message({
                showClose: true,
                message: "提交失败！",
                type: "error"
              });
            });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }
  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>
