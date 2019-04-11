<template>
  <div class="manage-system">
    <div class="login" v-if="!getLoginState">
      <div class="title">定制版对账系统</div>
      <Form label-position="left" :label-width="100">
        <FormItem label="账号">
          <Input v-model="userName"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="password" type="password"></Input>
        </FormItem>
        <Button type="primary" @click="handleSubmit">登录</Button>
      </Form>
    </div>
    <div class="router" v-else>
      <div class="title">请选择想要使用的功能</div>
      <div
        class="route-item"
        @click="jumpTo(item.name)"
        :key="index"
        v-for="(item, index) in modules">{{item.desc}}</div>
    </div>
  </div>
</template>
<script>
const userConfig = require('../../config.json')
export default {
  data () {
    return {
      userName: '',
      password: '',
      modules: userConfig.modules
    }
  },
  computed: {
    getLoginState () {
      return this.$store.getters.getLoginState
    }
  },
  methods: {
    handleSubmit () {
      if (this.userName === userConfig.userName && this.password === userConfig.password) {
        this.$store.dispatch('setLoginState', true)
      } else {
        this.$Message.error({
          content: '系统不想理你，并向你抛出一个异常',
          duration: 3
        })
      }
    },
    jumpTo (name) {
      this.$router.push({
        name
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.manage-system {
  position: relative;
  width: 100%;
  height: 100%;
  .login {
    position: absolute;
    width: 40%;
    height: 50%;
    left: 30%;
    top: 25%;
    text-align: center;
    .title {
      font-size: 24px;
      top: -60px;
      position: relative;
    }
  }
  .router {
    position: absolute;
    width: 40%;
    height: 100%;
    left: 30%;
    top: 0;
    text-align: center;
    .title {
      font-size: 24px;
    }
    .route-item {
      cursor: pointer;
      margin: 10px 0;
      &:hover {
        color: skyblue;
      }
    }
  }
}
</style>
