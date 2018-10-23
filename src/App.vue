<template>
  <div id="app">
    <div v-if='$store.state.inited' id="nav">
      <router-link to="/">Tabs Home</router-link> |
      <router-link to="/todo">Todo</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
  padding: 30px;
}
#nav {
    margin-bottom: 20px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #409eff;
    }
  }
}
</style>
