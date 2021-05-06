<template>
  <CmslogFrom ref="CmslogFrom" />
</template>

<script>
//日志新增界面调用表单
import CmslogFrom from "./CmslogFrom.vue";
export default {
  data() {
    return {};
  },
  components: {
    CmslogFrom
  },
  mounted() {
    this.changeifadd();
  },
  methods: {
    changeifadd() {
      this.$refs.CmslogFrom.ifadd = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>